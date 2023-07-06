import axios from 'axios';
const api = axios.create({baseURL: 'http://localhost:8000/api'});
api.defaults.headers.common['x-auth-token'] = localStorage.getItem('authToken');

export default api;