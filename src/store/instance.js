import axios from "axios";

export const instance = axios.create({
  baseURL: "https://precious-things.herokuapp.com/api/"
});
