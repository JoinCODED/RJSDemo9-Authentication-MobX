import { decorate, observable } from "mobx";
import axios from "axios";
import jwt_decode from "jwt-decode";

class AuthStore {
  constructor() {
    this.user = null;
  }

  setUser(token) {
    if (token) {
      localStorage.setItem("myToken", token);
      axios.defaults.headers.common.Authorization = `jwt ${token}`;
      const decodedUser = jwt_decode(token);
      this.user = decodedUser;
    } else {
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem("myToken");
      this.user = null;
    }
  }

  checkForExpiredToken() {
    const token = localStorage.getItem("myToken");
    if (token) {
      const currentTime = Date.now() / 1000;
      const user = jwt_decode(token);

      if (user.exp >= currentTime) {
        this.setUser(token);
      } else {
        this.logoutUser();
      }
    }
  }

  signup(userData, history) {
    axios
      .post("https://precious-things.herokuapp.com/signup/", userData)
      .then(res => res.data)
      .then(user => {
        this.setUser(user.token);
        history.replace("/");
      })
      .catch(err => console.error(err.response.data));
  }

  login(userData) {
    axios
      .post("https://precious-things.herokuapp.com/login/", userData)
      .then(res => res.data)
      .then(user => {
        this.setUser(user.token);
      })
      .catch(err => console.error(err.response.data));
  }

  logout() {
    this.setUser();
  }
}

decorate(AuthStore, {
  user: observable,
  statusMessage: observable
});

const authStore = new AuthStore();
authStore.checkForExpiredToken();

export default authStore;
