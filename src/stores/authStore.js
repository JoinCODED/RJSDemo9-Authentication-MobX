import { decorate, observable } from "mobx";
import axios from "axios";
import jwt_decode from "jwt-decode";

const instance = axios.create({
  baseURL: "https://the-index-api.herokuapp.com"
});

class AuthStore {
  constructor() {
    this.user = null;
  }

  checkForToken() {
    this.setUser(localStorage.getItem("token"));
  }

  setUser(token) {
    if (token) {
      this.user = jwt_decode(token);
      axios.defaults.headers.common.Authorization = `jwt ${token}`;
      localStorage.setItem("token", token);
    } else {
      this.user = null;
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem("token");
    }
  }

  signup(newUser) {
    instance
      .post("/signup/", newUser)
      .then(res => res.data)
      .then(user => this.setUser(user.token))
      .catch(err => console.error(err.response.data));
  }

  login(newUser) {
    instance
      .post("/login/", newUser)
      .then(res => res.data)
      .then(user => this.setUser(user.token))
      .catch(err => console.error(err.response.data));
  }

  logout() {
    this.setUser();
  }
}

decorate(AuthStore, {
  user: observable
});

const authStore = new AuthStore();
authStore.checkForToken();

export default authStore;
