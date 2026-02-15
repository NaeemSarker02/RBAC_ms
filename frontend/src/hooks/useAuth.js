import { useAuthStore } from '../store/useAuthStore';
import authApi from '../api/authApi';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for authentication operations
 */
export const useAuth = () => {
  const {
    user,
    token,
    permissions,
    roles,
    isAuthenticated,
    isLoading,
    setAuth,
    setUser,
    setPermissions,
    updateUser,
    logout: logoutStore,
    setLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isSuperAdmin,
    getRoleNames,
    getPermissionSlugs,
  } = useAuthStore();

  /**
   * Login user
   */
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);
      
      if (response.success) {
        setAuth(response.data);
        toast.success(response.message || 'Login successful');
        return { success: true, data: response.data };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      const message = error.message || 'Login failed';
      toast.error(message);
      return { success: false, message, errors: error.errors };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register user
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authApi.register(userData);
      
      if (response.success) {
        setAuth(response.data);
        toast.success(response.message || 'Registration successful');
        return { success: true, data: response.data };
      }
      
      return { success: false, message: response.message };
    } catch (error) {
      const message = error.message || 'Registration failed';
      toast.error(message);
      return { success: false, message, errors: error.errors };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      await authApi.logout();
      logoutStore();
      toast.success('Logged out successfully');
      return { success: true };
    } catch (error) {
      // Still logout on client side even if API call fails
      logoutStore();
      console.error('Logout error:', error);
      return { success: true };
    }
  };

  /**
   * Fetch user profile
   */
  const fetchProfile = async () => {
    try {
      const response = await authApi.getProfile();
      
      if (response.success) {
        setUser(response.data.user);
        setPermissions(response.data.permissions);
        return { success: true, data: response.data };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Fetch profile error:', error);
      return { success: false, error };
    }
  };

  /**
   * Refresh user permissions
   */
  const refreshPermissions = async () => {
    try {
      const response = await authApi.getPermissions();
      
      if (response.success) {
        setPermissions(response.data.permissions);
        return { success: true, permissions: response.data.permissions };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Refresh permissions error:', error);
      return { success: false, error };
    }
  };

  return {
    // State
    user,
    token,
    permissions,
    roles,
    isAuthenticated,
    isLoading,

    // Actions
    login,
    register,
    logout,
    fetchProfile,
    refreshPermissions,
    updateUser,

    // Permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,

    // Role checks
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isSuperAdmin,

    // Getters
    getRoleNames,
    getPermissionSlugs,
  };
};