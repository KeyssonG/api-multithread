import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/dashboard.module.css";
import { ROUTES } from "../constants/config";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleGestaoClick = () => {
    navigate(ROUTES.GESTAO);
  };

  const handleGestaoAcessoClick = () => {
    navigate(ROUTES.GESTAO_ACESSO);
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.content}>
        <div className={styles.modulesSection}>
          <h1 className={styles.modulesTitle}>Módulos</h1>
          
          <div className={styles.modulesGrid}>
            <div className={styles.moduleCard} onClick={handleGestaoClick}>
              <div className={styles.moduleIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={styles.moduleText}>Gestão de Pessoas</span>
            </div>

            <div className={styles.moduleCard} onClick={handleGestaoAcessoClick}>
              <div className={styles.moduleIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="11" width="14" height="10" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={styles.moduleText}>Gestão de Acesso</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;