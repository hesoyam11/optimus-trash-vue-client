import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.VUE_APP_BACKEND_ADDRESS,
    timeout: 5000
});

export default axiosInstance;
