import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://proyecto-chat-backend-zkbiwn4p4q-no.a.run.app',
});

export default axiosInstance;
