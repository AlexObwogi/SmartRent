const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

console.log('API URL:', API_URL); // This will help debug

export const register = async (userData) => {
  try {
    // Map frontend fields to backend expected fields
    const backendData = {
      name: userData.fullName,     // Convert fullName to name
      email: userData.email,
      password: userData.password,
      role: userData.role || 'tenant'
    };
    
    console.log('Sending to backend:', backendData); // Debug log
    
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData)  // Send mapped data
    });
    
    const data = await response.json();

    if (!response.ok) {
      // Show the actual error message from backend
      throw new Error(data.message || data.error || 'Registration failed');
    }

    // Save token if received
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Login failed');     
    }

    // Save token and user data
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userRole', data.user.role);  
    }

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};