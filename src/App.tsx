
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import './styles/global.module.css';
import CadastroEmpresa from './pages/cadastroEmpresa';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <div className="app-container" style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <main style={{ padding: '20px' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastrar" element={<CadastroEmpresa/>} />
            <Route path='/dashboard' element={<Dashboard />}></Route>
            <Route path='/' element={<Login />}></Route>
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
