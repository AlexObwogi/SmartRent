import axios from 'axios';

// Get API URL from environment or use production URL
const getApiUrl = () => {
  // For production (Render)
  if (window.location.hostname !== 'localhost') {
    return 'https://smartrent-backend.onrender.com/api';
  }
  // For local development
  return 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getApiUrl(),
});

// This automatically attaches the login token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

export default API;
