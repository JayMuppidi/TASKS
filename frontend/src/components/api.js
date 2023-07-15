import axios from 'axios';
const api = axios.create({baseURL: 'https://tasks-backend-wkzh.onrender.com/api'});
api.defaults.headers.common['x-auth-token'] = localStorage.getItem('authToken');

export default api;