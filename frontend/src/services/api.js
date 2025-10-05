import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Set default content type for non-FormData requests
api.interceptors.request.use((config) => {
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Clean the token of any HTML entities or extra characters
    let cleanToken = token.replace(/&quot;/g, '').replace(/"/g, '').trim();
    
    // Validate token format (JWT should have 3 parts separated by dots)
    if (!cleanToken.includes('.') || cleanToken.split('.').length !== 3) {
      console.error('Invalid token format detected, clearing token');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return config;
    }
    
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  forgotPassword: (email) => api.post('/auth/forgot-password', email),
  resetPassword: (data) => api.post('/auth/reset-password', data)
};

// Items API
export const itemsAPI = {
  submitFoundItem: (itemData) => api.post('/found-items', itemData),
  submitLostItem: (itemData) => api.post('/lost-items', itemData),
  getFoundItems: () => api.get('/found-items'),
  getLostItems: () => api.get('/lost-items'),
  getFormOptions: () => api.get('/form-options'),
  uploadImages: (formData) => api.post('/upload-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Verification API
export const verificationAPI = {
  getMatches: (userId) => api.get(`/matches/${userId}`),
  generateQuestions: (matchId) => api.post(`/verification/questions/${matchId}`, {}),
  submitAnswers: (attemptId, answers) => api.post(`/verification/submit/${attemptId}`, { answers }),
};

// Debug API
export const debugAPI = {
  getDatabaseInfo: () => api.get('/debug/database'),
};

export default api;