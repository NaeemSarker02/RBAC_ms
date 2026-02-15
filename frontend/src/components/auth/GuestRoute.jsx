import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import PropTypes from 'prop-types';

/**
 * GuestRoute Component
 * Redirects to dashboard if user is already authenticated
 * Used for login/register pages
 */
const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    // Redirect to dashboard if already logged in
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

GuestRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GuestRoute;