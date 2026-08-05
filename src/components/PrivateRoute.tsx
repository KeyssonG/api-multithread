
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/config';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredModule?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredModule }) => {
  const { isAuthenticated, isLoading, hasAccess } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (requiredModule && !hasAccess(requiredModule)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
