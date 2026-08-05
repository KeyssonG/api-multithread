
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './styles/global.css';
import CadastroEmpresa from './pages/cadastroEmpresa';
import Dashboard from './pages/Dashboard';
import Gestao from './pages/Gestao';
import PrivateRoute from './components/PrivateRoute';
import { MODULES, ROUTES } from './constants/config';
import ResetSenhaSolicitar from './pages/ResetSenhaSolicitar';
import ResetSenhaConfirmar from './pages/ResetSenhaConfirmar';
import GestaoAcesso from './pages/GestaoAcesso';
import GestaoEstoque from './pages/GestaoEstoque';
// Force TS reload

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
            <PrivateRoute requiredModule={MODULES.GESTAO_PESSOAS}>
              <Gestao />
            </PrivateRoute>
          } 
        />
        <Route 
          path={ROUTES.GESTAO_ACESSO} 
          element={
            <PrivateRoute requiredModule={MODULES.GESTAO_ACESSO_MODULOS}>
              <GestaoAcesso />
            </PrivateRoute>
          } 
        />
        <Route 
          path={ROUTES.GESTAO_ESTOQUE} 
          element={
            <PrivateRoute requiredModule={MODULES.GESTAO_ACESSO_ESTOQUE}>
              <GestaoEstoque />
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
