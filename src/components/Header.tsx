import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  
  let authContext;
  try {
    authContext = useAuth();
  } catch (error) {
    authContext = {
      name: null,
      logout: () => navigate('/login'),
      isAuthenticated: false
    };
  }

  const { name, logout, isAuthenticated } = authContext;
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <h1 className={styles.headerTitle} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        MultiThread
      </h1>
      {isAuthenticated ? (
        <div className={styles.userActions}>
          <span className={styles.userName}>
            Olá, <strong>{name || 'Usuário'}</strong>
          </span>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Sair
          </button>
        </div>
      ) : (
        <div className={styles.userActions}>
          <button 
            className={styles.logoutButton} 
            onClick={() => navigate('/login')}
          >
            Entrar
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;