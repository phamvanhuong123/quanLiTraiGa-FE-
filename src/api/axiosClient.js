import axios from 'axios';

const BASE_API_URL = "http://localhost:8080/api";
const axiosClient = axios.create({
  baseURL: BASE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  }, function onRejected(error) {
    const status = error.response?.status
    if (status === 401){
      localStorage.removeItem("token");
      window.location.href = "/login";

    }
    return Promise.reject(error);
  });
export default axiosClient;
