import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import PropTypes from 'prop-types';

/**
 * RoleGuard Component
 * Checks if user has required role(s)
 */
const RoleGuard = ({
  children,
  requiredRole,
  requireAll = false,
  fallback = null,
  redirectTo = '/403',
}) => {
  const { hasRole, hasAnyRole, hasAllRoles } = useAuthStore();

  // Check roles
  let hasRequiredRole = false;

  if (typeof requiredRole === 'string') {
    // Single role check
    hasRequiredRole = hasRole(requiredRole);
  } else if (Array.isArray(requiredRole)) {
    // Multiple roles check
    if (requireAll) {
      // User must have ALL roles
      hasRequiredRole = hasAllRoles(requiredRole);
    } else {
      // User must have ANY role
      hasRequiredRole = hasAnyRole(requiredRole);
    }
  }

  // If user doesn't have role
  if (!hasRequiredRole) {
    // Return fallback component if provided
    if (fallback) {
      return fallback;
    }
    
    // Otherwise redirect to access denied page
    return <Navigate to={redirectTo} replace />;
  }

  // User has role, render children
  return children;
};

RoleGuard.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  requireAll: PropTypes.bool,
  fallback: PropTypes.node,
  redirectTo: PropTypes.string,
};

export default RoleGuard;