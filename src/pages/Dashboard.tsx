import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CustomPopup from "../components/CustomPopup";
import styles from "../styles/dashboard.module.css";
import { ROUTES } from "../constants/config";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { hasAccess } = useAuth();

  const [popupConfig, setPopupConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'error' | 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });

  const gestaoPessoasAccess = hasAccess('Gestão de Pessoas');
  const gestaoAcessoAccess = hasAccess('Gestão de Acesso de Módulos');
  const gestaoEstoqueAccess = true; // Liberado para visualização conforme solicitado

  const handleGestaoClick = () => {
    if (gestaoPessoasAccess) {
      navigate(ROUTES.GESTAO);
    } else {
      setPopupConfig({
        isOpen: true,
        title: 'Acesso restrito',
        message: 'Você não possui permissão para acessar o módulo Gestão de Pessoas.',
        type: 'error'
      });
    }
  };

  const handleGestaoAcessoClick = () => {
    if (gestaoAcessoAccess) {
      navigate(ROUTES.GESTAO_ACESSO);
    } else {
      setPopupConfig({
        isOpen: true,
        title: 'Acesso restrito',
        message: 'Você não possui permissão para acessar o módulo Gestão de Acesso de Módulos.',
        type: 'error'
      });
    }
  };

  const handleGestaoEstoqueClick = () => {
    navigate(ROUTES.GESTAO_ESTOQUE);
  };

  const closePopup = () => {
    setPopupConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.content}>
        <div className={styles.modulesSection}>
          <h1 className={styles.modulesTitle}>Módulos</h1>
          
          <div className={styles.modulesGrid}>
            <div 
              className={styles.moduleCard} 
              onClick={handleGestaoClick}
              style={{ filter: gestaoPessoasAccess ? 'none' : 'grayscale(100%)', opacity: gestaoPessoasAccess ? 1 : 0.6, cursor: gestaoPessoasAccess ? 'pointer' : 'not-allowed' }}
            >
              <div className={styles.moduleIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={styles.moduleText}>Gestão de Pessoas</span>
            </div>

            <div 
              className={styles.moduleCard} 
              onClick={handleGestaoAcessoClick}
              style={{ filter: gestaoAcessoAccess ? 'none' : 'grayscale(100%)', opacity: gestaoAcessoAccess ? 1 : 0.6, cursor: gestaoAcessoAccess ? 'pointer' : 'not-allowed' }}
            >
              <div className={styles.moduleIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="11" width="14" height="10" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={styles.moduleText}>Gestão de Acesso de Módulos</span>
            </div>

            <div 
              className={styles.moduleCard} 
              onClick={handleGestaoEstoqueClick}
              style={{ filter: gestaoEstoqueAccess ? 'none' : 'grayscale(100%)', opacity: gestaoEstoqueAccess ? 1 : 0.6, cursor: gestaoEstoqueAccess ? 'pointer' : 'not-allowed' }}
            >
              <div className={styles.moduleIcon}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className={styles.moduleText}>Gestão de Estoque</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Custom Popup */}
      <CustomPopup
        isOpen={popupConfig.isOpen}
        onClose={closePopup}
        title={popupConfig.title}
        message={popupConfig.message}
        type={popupConfig.type}
      />
    </div>
  );
};

export default Dashboard;