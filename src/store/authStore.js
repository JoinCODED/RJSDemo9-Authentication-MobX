import { decorate, observable, computed, action } from "mobx";
import axios from "axios";

import jwt_decode from "jwt-decode";

class AuthStore {
  constructor() {
    this.user = null;
  }

  setAuthToken(token) {
    if (token) {
      localStorage.setItem("treasureToken", token);
      axios.defaults.headers.common.Authorization = `jwt ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }

  checkForExpiredToken() {
    // Check for token expiration
    const token = localStorage.treasureToken;

    if (token) {
      const currentTime = Date.now() / 1000;

      // Decode token and get user info
      const user = jwt_decode(token);

      // Check token expiration
      if (user.exp >= currentTime) {
        // Set auth token header
        this.setAuthToken(token);
        // Set user
        this.user = user;
      } else {
        this.logoutUser();
      }
    }
  }

  loginUser(userData) {
    axios
      .post("https://precious-things.herokuapp.com/login/", userData)
      .then(res => res.data)
      // For now just log user
      .then(user => {
        const decodedUser = jwt_decode(user.token);
        this.setAuthToken(user.token);
        this.user = decodedUser;
      })
      .catch(err => console.error(err.response));
  }

  signupUser(userData, history) {
    axios
      .post("https://precious-things.herokuapp.com/signup/", userData)
      .then(res => res.data)
      .then(user => {
        const decodedUser = jwt_decode(user.token);
        this.setAuthToken(user.token);
        this.user = decodedUser;
        history.push("/");
      })
      .catch(err => console.error(err.response));
  }

  logoutUser() {
    this.user = null;
    this.setAuthToken();
  }
}

decorate(AuthStore, {
  user: observable,
  signupUser: action
});

const authStore = new AuthStore();

authStore.checkForExpiredToken();

export default authStore;
