import axios from "axios";

console.log("VITE_API_URL", import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL: `http://api.files.params.online/api`, // change to your backend URL
  withCredentials: true, // if you use cookies / auth
});
