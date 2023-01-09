import axios from 'axios';

// import { router } from "../App";

const axiosInstance = axios.create({
    baseURL: '/api',
});

axiosInstance.interceptors.request.use(function (config) {
    return { ...config, withCredentials: true };
});

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       router.navigate("/auth");
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
