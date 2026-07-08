import { Navigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/useAuth';
import Spinner from '../ui/StateComponents';

export default function ProtectedRoute({ children, requiredRole = null }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <Spinner />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" />;
    }

    return children;
}
