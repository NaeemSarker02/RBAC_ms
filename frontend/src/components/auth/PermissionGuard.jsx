import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import PropTypes from 'prop-types';

/**
 * PermissionGuard Component
 * Checks if user has required permission(s)
 * Supports:
 * - Single permission: requiredPermission="user_view"
 * - Multiple permissions (any): requiredPermission={['user_view', 'user_edit']}
 * - Multiple permissions (all): requireAll={true}
 */
const PermissionGuard = ({
  children,
  requiredPermission,
  requireAll = false,
  fallback = null,
  redirectTo = '/403',
}) => {
  const { 
    hasPermission, 
    hasAnyPermission, 
    hasAllPermissions, 
    isSuperAdmin 
  } = useAuthStore();

  // Super Admin bypass - has all permissions
  if (isSuperAdmin()) {
    return children;
  }

  // Check permissions
  let hasRequiredPermission = false;

  if (typeof requiredPermission === 'string') {
    // Single permission check
    hasRequiredPermission = hasPermission(requiredPermission);
  } else if (Array.isArray(requiredPermission)) {
    // Multiple permissions check
    if (requireAll) {
      // User must have ALL permissions
      hasRequiredPermission = hasAllPermissions(requiredPermission);
    } else {
      // User must have ANY permission
      hasRequiredPermission = hasAnyPermission(requiredPermission);
    }
  }

  // If user doesn't have permission
  if (!hasRequiredPermission) {
    // Return fallback component if provided
    if (fallback) {
      return fallback;
    }
    
    // Otherwise redirect to access denied page
    return <Navigate to={redirectTo} replace />;
  }

  // User has permission, render children
  return children;
};

PermissionGuard.propTypes = {
  children: PropTypes.node.isRequired,
  requiredPermission: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  requireAll: PropTypes.bool,
  fallback: PropTypes.node,
  redirectTo: PropTypes.string,
};

export default PermissionGuard;