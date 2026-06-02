// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { isTokenValid } from '../utils/tokenUtils';

const ProtectedRoute = ({ children }) => {
    if (!isTokenValid()) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
