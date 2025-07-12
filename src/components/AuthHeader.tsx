import { useNavigate } from 'react-router-dom';
import styles from '../styles/Header.module.css';

const AuthHeader = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/login');
  };

  return (
    <header className={styles.authHeader}>
      <h1 className={styles.headerTitle} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        MultiThread
      </h1>
    </header>
  );
};

export default AuthHeader; 