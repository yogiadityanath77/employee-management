import axios from "axios";

// ✅ Use deployed backend
axios.defaults.baseURL = "https://employee-management-uh8e.onrender.com";

// ✅ Attach token to every request
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
