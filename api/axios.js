import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.86.120:8080'  // Đặt trực tiếp URL của API server ở đây
});

export default api;
