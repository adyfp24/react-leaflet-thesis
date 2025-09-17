import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.example.com',
  headers: { 'Content-Type': 'application/json' }
});

axiosInstance.interceptors.request.use(config => {
  // add auth header
  return config;
});

export default axiosInstance;
