import { useAuthStore } from '../store/useAuthStore';

/**
 * Custom hook for permission checking
 * @param {string|string[]} permission - Permission slug(s)
 * @returns {boolean}
 */
export const usePermission = (permission) => {
  const { hasPermission, hasAnyPermission, isSuperAdmin } = useAuthStore();

  // Super Admin bypass
  if (isSuperAdmin()) {
    return true;
  }

  // Check single permission
  if (typeof permission === 'string') {
    return hasPermission(permission);
  }

  // Check multiple permissions (any)
  if (Array.isArray(permission)) {
    return hasAnyPermission(permission);
  }

  return false;
};

/**
 * Hook to check if user has all specified permissions
 * @param {string[]} permissions - Array of permission slugs
 * @returns {boolean}
 */
export const useHasAllPermissions = (permissions) => {
  const { hasAllPermissions, isSuperAdmin } = useAuthStore();

  if (isSuperAdmin()) {
    return true;
  }

  return hasAllPermissions(permissions);
};