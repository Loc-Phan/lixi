import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // const navigate = useNavigate();
    // const location = useLocation();
    if (error?.response?.data?.statusCode === 401) {
      localStorage.removeItem("token");
      // if (location.pathname.includes("admin")) {
      //   navigate("/admin/sign-in");
      //   return;
      // }
      // navigate("/sign-in");
    }
    return Promise.reject(error);
  }
);
