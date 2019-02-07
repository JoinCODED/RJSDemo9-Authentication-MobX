import { decorate, observable } from "mobx";
import axios from "axios";
import jwt_decode from "jwt-decode";

const instance = axios.create({
  baseURL: "https://the-index-api.herokuapp.com"
});

function errToArray(err) {
  return Object.keys(err).map(key => `${key}: ${err[key]}`);
}

class AuthStore {
  user = null;

  errors = null;

  checkForToken = () => this.setUser(localStorage.getItem("token"));

  setUser = token => {
    if (token) {
      this.user = jwt_decode(token);
      axios.defaults.headers.common.Authorization = `jwt ${token}`;
      localStorage.setItem("token", token);
    } else {
      this.user = null;
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem("token");
    }
  };

  authenticate = async (newUser, type) => {
    try {
      const res = await instance.post(`/${type}/`, newUser);
      const user = res.data;
      this.setUser(user.token);
      this.errors = null;
    } catch (err) {
      this.errors = errToArray(err.response.data);
    }
  };

  signup = async newUser => {
    this.authenticate(newUser, "signup");
  };

  login(newUser) {
    this.authenticate(newUser, "login");
  }

  logout() {
    this.setUser();
  }
}

decorate(AuthStore, {
  user: observable,
  errors: observable
});

const authStore = new AuthStore();
authStore.checkForToken();

export default authStore;
