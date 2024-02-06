import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'https://proyecto-chat-backend-zkbiwn4p4q-no.a.run.app',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('userToken');
    config.headers['Authorization'] = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
