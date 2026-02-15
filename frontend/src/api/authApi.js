import axiosInstance from './axios';

/**
 * Auth API endpoints
 */
const authApi = {
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise}
   */
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - Email and password
   * @returns {Promise}
   */
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout current session
   * @returns {Promise}
   */
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  /**
   * Logout from all devices
   * @returns {Promise}
   */
  logoutAll: async () => {
    const response = await axiosInstance.post('/auth/logout-all');
    return response.data;
  },

  /**
   * Get authenticated user profile
   * @returns {Promise}
   */
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },

  /**
   * Get user permissions
   * @returns {Promise}
   */
  getPermissions: async () => {
    const response = await axiosInstance.get('/auth/permissions');
    return response.data;
  },

  /**
   * Refresh access token
   * @param {string} deviceName - Device name
   * @returns {Promise}
   */
  refreshToken: async (deviceName = 'web') => {
    const response = await axiosInstance.post('/auth/refresh-token', { device_name: deviceName });
    return response.data;
  },
};

export default authApi;