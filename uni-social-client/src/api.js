import axios from 'axios';

// Backend base URL
const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT token from AuthContext/localStorage
api.interceptors.request.use((config) => {
  // Get the user object from localStorage
  const storedUser = localStorage.getItem('echohive_user');
  if (storedUser) {
    const user = JSON.parse(storedUser);
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

