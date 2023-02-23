import axios from "axios";
import { store } from "@/store";

const axiosInstance = axios.create({
  baseURL: "https://chat-on-dayy.fly.dev/api/",
  // baseURL: "http://localhost:3000/api/",
});
// axiosInstance.defaults.withCredentials = true;
axiosInstance.interceptors.request.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (config: any) => {
    const token = store.state.jwt;
    if (token) {
      config.headers = {
        authorization: token,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url == "refresh" && err.response) {
      if (err.response.status === 401 && originalConfig._retry) {
        originalConfig._retry = false;
        try {
          store.dispatch("clearUserInfo");
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    if (
      originalConfig.url !== "login" &&
      originalConfig.url !== "refresh" &&
      err.response
    ) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        const refresh_token = localStorage.getItem("refresh_token");
        try {
          const rs = await axiosInstance.post("refresh", {
            refreshToken: refresh_token,
          });
          const { token } = rs.data;
          store.commit("setJWTToken", token);
          return axiosInstance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
