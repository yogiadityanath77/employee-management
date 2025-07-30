// src/api.js
import axios from "axios";

axios.defaults.baseURL = "https://employee-management-uh8e.onrender.com";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
