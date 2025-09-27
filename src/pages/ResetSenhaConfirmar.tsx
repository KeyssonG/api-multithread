import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import styles from '../styles/Login.module.css';

const ResetSenhaConfirmar: React.FC = () => {
  const location = useLocation();
  const [showInfo, setShowInfo] = useState(true);
  const infoMsg = location.state?.info || '';
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');
    setErro('');
    setCarregando(true);
    try {
      await authService.confirmarResetSenha(token, newPassword);
      setMensagem('Senha redefinida com sucesso! Você já pode fazer login.');
      setShowInfo(false);
      setToken('');
      setNewPassword('');
    } catch (err: any) {
      setErro('Erro ao redefinir senha. Verifique o token e tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.loginBox} style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <div className={styles.loginHeader}>
        <header>Redefinir Senha</header>
      </div>
      {showInfo && infoMsg && (
        <div style={{ marginBottom: 12, color: '#555' }}>{infoMsg}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputBox}>
          <label htmlFor="token">Token:</label>
          <input
            id="token"
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            required
            className={styles.inputField}
            style={{ marginBottom: 12 }}
          />
        </div>
        <div className={styles.inputBox}>
          <label htmlFor="newPassword">Nova Senha:</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        {erro && <div style={{ color: 'red', marginBottom: 8 }}>{erro}</div>}
        {mensagem && <div style={{ color: 'green', marginBottom: 8 }}>{mensagem}</div>}
        <button className={styles.submitBtn} type="submit" disabled={carregando}>
          {carregando ? 'Processando...' : 'Alterar Senha'}
        </button>
      </form>
      {mensagem && (
        <div style={{ marginTop: 16 }}>
          <button
            className={styles.submitBtn}
            onClick={() => window.location.href = '/login'}
            style={{ backgroundColor: '#007bff', color: '#fff' }}
          >
            Voltar para Login
          </button>
        </div>
      )}
    </div>
  );
};

export default ResetSenhaConfirmar;
