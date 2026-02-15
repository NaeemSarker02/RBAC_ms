import { useAuthStore } from '../store/useAuthStore';

/**
 * Custom hook for role checking
 * @param {string|string[]} role - Role slug(s)
 * @returns {boolean}
 */
export const useRole = (role) => {
  const { hasRole, hasAnyRole } = useAuthStore();

  // Check single role
  if (typeof role === 'string') {
    return hasRole(role);
  }

  // Check multiple roles (any)
  if (Array.isArray(role)) {
    return hasAnyRole(role);
  }

  return false;
};

/**
 * Hook to check if user has all specified roles
 * @param {string[]} roles - Array of role slugs
 * @returns {boolean}
 */
export const useHasAllRoles = (roles) => {
  const { hasAllRoles } = useAuthStore();
  return hasAllRoles(roles);
};