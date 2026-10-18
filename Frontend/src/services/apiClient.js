import axios from 'axios';

// Base Axios client configured for Node.js Express backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s to accommodate Render cloud instance wakeups
});

// Attach JWT Bearer token if user is authenticated
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('paprism_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response error handler: handle 401 and normalize error message
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid (except during login check), clear local session
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('paprism_token');
        localStorage.removeItem('paprism_user');
      }
    }

    let message = error.response?.data?.message;

    if (!message) {
      if (error.message === 'Network Error') {
        message = 'Unable to connect to the server. The free cloud backend may be waking up from sleep (takes ~30s)—please try again in a few moments.';
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        message = 'Request timed out while waiting for server. Please try again.';
      } else {
        message = error.message || 'An unexpected error occurred';
      }
    }

    error.userMessage = message;
    return Promise.reject(error);
  }
);

export default apiClient;
