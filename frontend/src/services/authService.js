import API from './api';

// Register a new user
export const registerUser = async (userData) => {
    const response = await API.post('/users/register', userData);
    return response.data;
};

// Login user
export const loginUser = async (credentials) => {
    const response = await API.post('/users/login', credentials);
    return response.data;
};

// Logout user
export const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Get current user
export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};