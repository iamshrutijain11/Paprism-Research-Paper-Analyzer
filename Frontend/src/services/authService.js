import apiClient from './apiClient';

export const authService = {
  /**
   * Log in user with credentials
   */
  async login(email, password) {
    const res = await apiClient.post('/auth/login', { email, password });
    if (res.data?.token) {
      localStorage.setItem('paprism_token', res.data.token);
    }
    if (res.data?.user) {
      localStorage.setItem('paprism_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  /**
   * Register a new user
   */
  async register(name, email, password, role = 'Student') {
    const res = await apiClient.post('/auth/register', { name, email, password, role });
    if (res.data?.token) {
      localStorage.setItem('paprism_token', res.data.token);
    }
    if (res.data?.user) {
      localStorage.setItem('paprism_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  /**
   * Fetch currently authenticated user profile
   */
  async getProfile() {
    const res = await apiClient.get('/auth/profile');
    if (res.data) {
      localStorage.setItem('paprism_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  /**
   * Update user profile information
   */
  async updateProfile(profileData) {
    const res = await apiClient.put('/auth/profile', profileData);
    if (res.data) {
      localStorage.setItem('paprism_user', JSON.stringify(res.data));
    }
    return res.data;
  },

  /**
   * Log out user and purge stored tokens
   */
  logout() {
    localStorage.removeItem('paprism_token');
    localStorage.removeItem('paprism_user');
  },

  /**
   * Get stored JWT token
   */
  getToken() {
    return localStorage.getItem('paprism_token');
  },

  /**
   * Check if token is present
   */
  isAuthenticated() {
    return Boolean(localStorage.getItem('paprism_token'));
  },
};

export default authService;
