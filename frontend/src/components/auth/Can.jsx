import { useAuthStore } from '../../store/useAuthStore';
import PropTypes from 'prop-types';

/**
 * Can Component
 * Conditionally renders children based on permissions
 * Usage: <Can permission="user_create">...</Can>
 */
const Can = ({ 
  permission, 
  role, 
  requireAll = false, 
  children, 
  fallback = null 
}) => {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    hasAllRoles,
    isSuperAdmin 
  } = useAuthStore();

  // Super Admin bypass
  if (isSuperAdmin()) {
    return children;
  }

  // Check permissions
  if (permission) {
    let hasRequiredPermission = false;

    if (typeof permission === 'string') {
      hasRequiredPermission = hasPermission(permission);
    } else if (Array.isArray(permission)) {
      hasRequiredPermission = requireAll 
        ? hasAllPermissions(permission)
        : hasAnyPermission(permission);
    }

    if (!hasRequiredPermission) {
      return fallback;
    }
  }

  // Check roles
  if (role) {
    let hasRequiredRole = false;

    if (typeof role === 'string') {
      hasRequiredRole = hasRole(role);
    } else if (Array.isArray(role)) {
      hasRequiredRole = requireAll 
        ? hasAllRoles(role)
        : hasAnyRole(role);
    }

    if (!hasRequiredRole) {
      return fallback;
    }
  }

  return children;
};

Can.propTypes = {
  permission: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  role: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  requireAll: PropTypes.bool,
  children: PropTypes.node.isRequired,
  fallback: PropTypes.node,
};

export default Can;