import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FuncionarioForm from "../components/FuncionarioForm";
import styles from "../styles/Gestao.module.css";

const Gestao = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleVoltar = () => {
    navigate('/dashboard');
  };

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };

  const handleBackToMain = () => {
    setActiveSection(null);
  };

  const handleFormSuccess = () => {
    // Pode adicionar lógica adicional aqui se necessário
    console.log('Funcionário cadastrado com sucesso!');
  };

  const handleFormError = (message: string) => {
    console.error('Erro no formulário:', message);
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.content}>
        <div className={styles.headerSection}>
          <button className={styles.backButton} onClick={handleVoltar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Voltar
          </button>
          
          <h1 className={styles.pageTitle}>Gestão</h1>
        </div>

        <div className={styles.mainContent}>
          {!activeSection ? (
            <>
              <p className={styles.welcomeText}>
                Bem-vindo ao módulo de Gestão!
              </p>
              <p className={styles.descriptionText}>
                Aqui você poderá gerenciar todos os aspectos do seu negócio.
              </p>
              
              <div className={styles.featuresGrid}>
                <div className={styles.featureCard} onClick={() => handleSectionClick('funcionarios')}>
                  <div className={styles.featureIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45768C17.623 10.1593 16.8604 10.6597 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Cadastro de Funcionários</h3>
                  <p>Gerencie o cadastro de funcionários da empresa</p>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Funcionalidade 2</h3>
                  <p>Descrição da funcionalidade</p>
                </div>

                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Funcionalidade 3</h3>
                  <p>Descrição da funcionalidade</p>
                </div>
              </div>
            </>
          ) : activeSection === 'funcionarios' ? (
            <div className={styles.sectionContent}>
              <div className={styles.sectionHeader}>
                <button className={styles.backToMainButton} onClick={handleBackToMain}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Voltar
                </button>
                <h2 className={styles.sectionTitle}>Cadastro de Funcionários</h2>
              </div>
              
              <div className={styles.formContainer}>
                <p className={styles.formDescription}>
                  Preencha os dados do funcionário para realizar o cadastro.
                </p>
                
                <FuncionarioForm 
                  onSuccess={handleFormSuccess}
                  onError={handleFormError}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Gestao; 