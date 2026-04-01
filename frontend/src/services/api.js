import axios from 'axios';

// Dynamically determine API URL based on environment
const getApiUrl = () => {
  // Production (Render/Netlify/Vercel)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return 'https://smartrent-backend.onrender.com/api';
  }
  // Local development
  return 'http://localhost:5000/api';
};

const API = axios.create({
  baseURL: getApiUrl(),
});

// Automatically attach token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  return config;
});

export default API;
