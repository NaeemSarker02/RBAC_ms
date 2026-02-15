import axiosInstance from './axios';

/**
 * User API endpoints
 */
const userApi = {
  /**
   * Get all users (paginated)
   * @param {Object} params - Query parameters
   * @returns {Promise}
   */
  getUsers: async (params = {}) => {
    const response = await axiosInstance.get('/users', { params });
    return response.data;
  },

  /**
   * Get single user by ID
   * @param {number} id - User ID
   * @returns {Promise}
   */
  getUser: async (id) => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Promise}
   */
  createUser: async (userData) => {
    const response = await axiosInstance.post('/users', userData);
    return response.data;
  },

  /**
   * Update user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise}
   */
  updateUser: async (id, userData) => {
    const response = await axiosInstance.put(`/users/${id}`, userData);
    return response.data;
  },

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise}
   */
  deleteUser: async (id) => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },

  /**
   * Activate user
   * @param {number} id - User ID
   * @returns {Promise}
   */
  activateUser: async (id) => {
    const response = await axiosInstance.post(`/users/${id}/activate`);
    return response.data;
  },

  /**
   * Deactivate user
   * @param {number} id - User ID
   * @returns {Promise}
   */
  deactivateUser: async (id) => {
    const response = await axiosInstance.post(`/users/${id}/deactivate`);
    return response.data;
  },

  /**
   * Search users
   * @param {string} search - Search query
   * @param {Object} params - Additional parameters
   * @returns {Promise}
   */
  searchUsers: async (search, params = {}) => {
    const response = await axiosInstance.get('/users', {
      params: { search, ...params }
    });
    return response.data;
  },
};

export default userApi;