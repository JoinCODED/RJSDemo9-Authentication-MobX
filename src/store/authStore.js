import { decorate, observable } from "mobx";
import axios from "axios";
import jwt_decode from "jwt-decode";

class AuthStore {
  constructor() {
    this.user = null;
  }

  setAuthToken(token) {
    if (token) {
      axios.defaults.headers.common.Authorization = `JWT ${token}`;
      localStorage.setItem("treasureToken", token);
    } else {
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem("treasureToken");
    }
  }

  setCurrentUser(token) {
    const user = jwt_decode(token);
    this.user = user;
  }

  checkForToken() {
    const token = localStorage.getItem("treasureToken");

    if (token) {
      const currentTime = Date.now() / 1000;
      const user = jwt_decode(token);

      if (user.exp > currentTime) {
        this.setCurrentUser(token);
        this.setAuthToken(token);
      } else {
        this.logout();
      }
    }
  }

  login(userData) {
    axios
      .post("https://precious-things.herokuapp.com/login/", userData)
      .then(res => res.data)
      .then(tokenObj => {
        this.setCurrentUser(tokenObj.token);
        this.setAuthToken(tokenObj.token);
      })
      .catch(err => console.error(err.response));
  }

  signup(userData, history) {
    axios
      .post("https://precious-things.herokuapp.com/signup/", userData)
      .then(res => res.data)
      .then(tokenObj => {
        this.setCurrentUser(tokenObj.token);
        this.setAuthToken(tokenObj.token);
        history.push("/");
      })
      .catch(err => console.error(err.response));
  }

  logout() {
    this.user = null;
    this.setAuthToken();
  }
}

decorate(AuthStore, {
  user: observable
});

const authStore = new AuthStore();
authStore.checkForToken();

export default authStore;
