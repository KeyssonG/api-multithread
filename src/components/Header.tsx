import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ROUTES } from '../constants/config';
import styles from '../styles/Header.module.css';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
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

  const getInitial = (name: string | null) => {
    if (!name) return 'K';
    return name.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logoArea} onClick={handleLogoClick}>
        <div className={styles.iconWrapper}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoFirst}>Multi</span>
          <span className={styles.logoSecond}>Thread</span>
        </div>
      </div>

      {isAuthenticated && (
        <nav className={styles.navMenu}>
          <Link 
            to="/dashboard" 
            className={`${styles.navLink} ${location.pathname === '/dashboard' || location.pathname === '/' ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link
            to={ROUTES.GESTAO_ACESSO}
            className={`${styles.navLink} ${location.pathname === ROUTES.GESTAO_ACESSO ? styles.active : ''}`}
          >
            Gestão de Módulos
          </Link>
        </nav>
      )}

      {isAuthenticated ? (
        <div className={styles.userContainer} ref={dropdownRef}>
          <div className={styles.userArea} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <div className={styles.avatar}>
              {getInitial(name)}
            </div>
            <span className={styles.greeting}>
              Olá, <strong>{name || 'keysson'}</strong>
            </span>
          </div>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button 
                className={styles.dropdownItem} 
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.userArea} onClick={() => navigate('/login')}>
          <span className={styles.greeting}>Entrar</span>
        </div>
      )}
    </header>
  );
};

export default Header;