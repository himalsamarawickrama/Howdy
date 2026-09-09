import axios from "axios";

// Explicitly disabled so requests always go to Spring Boot
export const USE_MOCK = false;

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT from storage to every outgoing request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("howdy_token") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. Unwrap response.data automatically
// 2. Clear token & redirect on 401 Unauthorized
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("howdy_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;