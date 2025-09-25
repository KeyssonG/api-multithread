
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './styles/global.css';
import CadastroEmpresa from './pages/cadastroEmpresa';
import Dashboard from './pages/Dashboard';
import Gestao from './pages/Gestao';
import PrivateRoute from './components/PrivateRoute';
import { ROUTES } from './constants/config';
import ResetSenhaSolicitar from './pages/ResetSenhaSolicitar';
import ResetSenhaConfirmar from './pages/ResetSenhaConfirmar';

const App = () => {
  return (
    <div className="app-container">
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<CadastroEmpresa/>} />
        <Route 
          path={ROUTES.DASHBOARD} 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path={ROUTES.GESTAO} 
          element={
            <PrivateRoute>
              <Gestao />
            </PrivateRoute>
          } 
        />
        <Route path={ROUTES.RESET_SENHA_SOLICITAR} element={<ResetSenhaSolicitar />} />
        <Route path={ROUTES.RESET_SENHA_CONFIRMAR} element={<ResetSenhaConfirmar />} />
        <Route path={ROUTES.HOME} element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
