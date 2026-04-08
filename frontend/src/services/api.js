import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/users/register', userData),
  login: (credentials) => api.post('/users/login', credentials),
  getMe: () => api.get('/users/me'),
};

// Properties API
export const propertyAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getOne: (id) => api.get(`/properties/${id}`),
  create: (formData) => api.post('/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
  uploadVideo: (id, formData) => api.post(`/properties/${id}/videos`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteImage: (propertyId, imageId) => api.delete(`/properties/${propertyId}/images/${imageId}`),
};

// Saved properties API
export const savedAPI = {
  getSaved: () => api.get('/saved'),
  save: (propertyId) => api.post('/saved', { propertyId }),
  unsave: (propertyId) => api.delete(`/saved/${propertyId}`),
};

// Applications API
export const applicationAPI = {
  create: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my'),
  getAll: () => api.get('/applications'),
  updateStatus: (id, status) => api.put(`/applications/${id}/status`, { status }),
};

// Payment API
export const paymentAPI = {
  initialize: (data) => api.post('/payment/initialize', data),
  verify: (reference) => api.get(`/payment/verify/${reference}`),
  getHistory: () => api.get('/payment/history'),
};

// Admin API
export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getAllProperties: () => api.get('/admin/properties'),
  getAllPayments: () => api.get('/admin/payments'),
  getStats: () => api.get('/admin/stats'),
};

export default api;