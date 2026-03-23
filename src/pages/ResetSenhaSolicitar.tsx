import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import styles from '../styles/Login.module.css';

const ResetSenhaSolicitar: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await authService.solicitarResetSenha(email);
      navigate('/reset-senha/confirmar', {
        state: { info: 'Se o e-mail estiver cadastrado, você receberá um token para redefinir sua senha.' }
      });
    } catch (err: any) {
      setErro('Erro ao solicitar reset de senha.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.loginBox} style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <div className={styles.loginHeader}>
        <header>Esqueci minha senha</header>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputBox}>
          <label htmlFor="email">E-mail:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className={styles.inputField}
          />
        </div>
        {erro && <div style={{ color: 'red', marginBottom: 8 }}>{erro}</div>}
        <button className={styles.submitBtn} type="submit" disabled={carregando}>
          {carregando ? 'Enviando...' : 'Solicitar token'}
        </button>
      </form>
    </div>
  );
};

export default ResetSenhaSolicitar;
