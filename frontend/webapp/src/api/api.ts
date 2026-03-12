import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api", // change to your backend URL
  withCredentials: true, // if you use cookies / auth
});
