// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { isTokenValid, getRoleFromToken } from '../utils/tokenUtils';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
    // Check if token is valid
    if (!isTokenValid()) {
        return <Navigate to="/" replace />;
    }

    // If requiredRoles is specified, check if user's role is allowed
    if (requiredRoles.length > 0) {
        const userRole = getRoleFromToken()?.toLowerCase();
        const isRoleAllowed = requiredRoles.some(role => role.toLowerCase() === userRole);

        if (!isRoleAllowed) {
            // User doesn't have access to this route, redirect to login
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
