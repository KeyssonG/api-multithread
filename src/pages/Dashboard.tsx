import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/dashboard.module.css";
import { useAuth } from "../contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { modules } = useAuth();

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.content}>
        <div className={styles.modulesSection}>
          <h1 className={styles.modulesTitle}>Módulos Autorizados</h1>
          
          <div className={styles.modulesGrid}>
            {modules.length > 0 ? (
              modules.map((modulo) => (
                <div 
                  key={modulo.chave} 
                  className={styles.moduleCard} 
                  onClick={() => navigate(modulo.rota)}
                >
                  <div className={styles.moduleIcon}>
                    {/* Renderiza o ícone dinâmico (assumindo que seja um nome de ícone ou SVG em string) */}
                    <i className={modulo.icone}></i> 
                    {/* Caso use SVGs internos, podemos mapear aqui, mas o ideal é que o 'icone' seja uma classe de fonte de ícones ou URL */}
                    {!modulo.icone && (
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )}
                  </div>
                  <span className={styles.moduleText}>{modulo.nome}</span>
                </div>
              ))
            ) : (
              <p className={styles.noModulesText}>Nenhum módulo autorizado para o seu departamento.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
