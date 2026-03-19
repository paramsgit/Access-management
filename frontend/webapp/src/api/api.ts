import axios from "axios";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // change to your backend URL
  withCredentials: true, // if you use cookies / auth
});
