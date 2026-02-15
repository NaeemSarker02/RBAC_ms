import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`📤 ${config.method.toUpperCase()} ${config.url}`, {
        headers: config.headers,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`📥 ${response.config.method.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // Log error
    console.error('❌ Response Error:', error);

    if (error.response) {
      const { status, data } = error.response;
      
      // Handle 401 Unauthorized
      if (status === 401) {
        console.warn('🔒 Unauthorized - Logging out');
        
        // Clear auth store
        const { logout } = useAuthStore.getState();
        logout();
        
        // Redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject({
          message: data?.message || 'Session expired. Please login again.',
          status: 401,
        });
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.warn('🚫 Forbidden - Insufficient permissions');
        
        return Promise.reject({
          message: data?.message || 'You do not have permission to perform this action.',
          status: 403,
          requiredPermissions: data?.required_permissions || [],
        });
      }

      // Handle 422 Validation Error
      if (status === 422) {
        return Promise.reject({
          message: data?.message || 'Validation failed',
          status: 422,
          errors: data?.errors || {},
        });
      }

      // Handle 404 Not Found
      if (status === 404) {
        return Promise.reject({
          message: data?.message || 'Resource not found',
          status: 404,
        });
      }

      // Handle 500 Internal Server Error
      if (status === 500) {
        return Promise.reject({
          message: data?.message || 'Internal server error. Please try again later.',
          status: 500,
        });
      }

      // Handle other errors
      return Promise.reject({
        message: data?.message || 'An error occurred',
        status: status,
        errors: data?.errors || {},
      });
    }

    // Network error
    if (error.request) {
      console.error('🌐 Network Error - No response received');
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        status: 0,
      });
    }

    // Something else happened
    return Promise.reject({
      message: error.message || 'An unexpected error occurred',
      status: 0,
    });
  }
);

export default axiosInstance;