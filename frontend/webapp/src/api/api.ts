import axios from "axios";

console.log("VITE_API_URL", import.meta.env.VITE_API_URL);

export const api = axios.create({
  baseURL:
    import.meta.env.ENV === "production"
      ? "http://api.files.params.online/api"
      : `http://localhost:5000/api`,

  withCredentials: true,
});

// TODO: Temporary, will remove after https
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
