
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, role, modules } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Administrador tem acesso total (opcional: se quiser que admin também dependa da tabela, remova este IF)
  if (role === 'ADMIN') {
    return <>{children}</>;
  }

  // Verifica se a rota atual existe na lista de módulos autorizados vinda do banco
  const hasAccess = modules.some(m => m.rota === location.pathname);

  if (!hasAccess && location.pathname !== '/dashboard') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;