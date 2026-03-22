import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FuncionarioForm from "../components/FuncionarioForm";
import DepartamentoForm from "../components/DepartamentoForm";
import DepartmentService from "../services/DepartmentService";
import { useAuth } from "../contexts/AuthContext";
import type { DepartmentData } from "../types/Types";
import styles from "../styles/Gestao.module.css";

const Gestao = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [subSection, setSubSection] = useState<string | null>(null);
  const [departamentos, setDepartamentos] = useState<DepartmentData[]>([]);
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(false);
  const [errorDepartamentos, setErrorDepartamentos] = useState<string | null>(null);

  // Carregar departamentos quando a seção de consultar for ativada
  useEffect(() => {
    if (activeSection === 'departamentos' && subSection === 'consultar') {
      carregarDepartamentos();
    }
  }, [activeSection, subSection, token]);

  const carregarDepartamentos = async () => {
    setLoadingDepartamentos(true);
    setErrorDepartamentos(null);
    try {
      if (token) {
        const departamentosList = await DepartmentService.listarDepartamentos(token);
        setDepartamentos(departamentosList);
      }
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error);
      setErrorDepartamentos('Erro ao carregar departamentos. Tente novamente.');
    } finally {
      setLoadingDepartamentos(false);
    }
  };

  const handleVoltar = () => {
    navigate('/dashboard');
  };

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
  };

  const handleBackToMain = () => {
    setActiveSection(null);
    setSubSection(null);
  };

  const handleBackToDepartamentos = () => {
    setSubSection(null);
  };

  const handleFormSuccess = () => {
    console.log('Operação realizada com sucesso!');
    // Se estivermos na seção de departamentos, recarregar a lista
    if (activeSection === 'departamentos') {
      carregarDepartamentos();
    }
  };

  const handleFormError = (message: string) => {
    console.error('Erro no formulário:', message);
  };

  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [deletando, setDeletando] = useState<number | null>(null);

  const deletarDepartamento = async (id: number) => {
    setDeletando(id);
    try {
      await DepartmentService.deletarDepartamento({idDepartamento: id}, token!);
      carregarDepartamentos();
    } catch (error) {
      alert('Erro ao deletar departamento');
    } finally {
      setDeletando(null);
      setMenuAberto(null);
    }
  }

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
                  <h3>Funcionários</h3>
                  <p>Gerencie o cadastro de funcionários da empresa</p>
                </div>

                <div className={styles.featureCard} onClick={() => handleSectionClick('departamentos')}>
                  <div className={styles.featureIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M3 9h18" stroke="currentColor" strokeWidth="2"/>
                      <path d="M9 3v18" stroke="currentColor" strokeWidth="2"/>
                      <path d="M15 3v18" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h3>Departamentos</h3>
                  <p>Gestão de Departamentos</p>
                </div>
              </div>
            </>
          ) : activeSection === 'funcionarios' ? (
            <>
              {!subSection ? (
                <>
                  <div className={styles.sectionHeader}>
                    <button className={styles.backToMainButton} onClick={handleBackToMain}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Voltar
                    </button>
                    <h2 className={styles.sectionTitle}>Gestão de Funcionários</h2>
                  </div>

                  <div className={styles.subMenuGrid}>
                    <div className={styles.subMenuCard} onClick={() => setSubSection('cadastrar')}>
                      <div className={styles.subMenuIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3>Cadastrar Funcionário</h3>
                      <p>Adicionar novo funcionário ao sistema</p>
                    </div>
                    <div className={styles.subMenuCard} onClick={() => setSubSection('consultar')}>
                      <div className={styles.subMenuIcon}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 21L16.514 16.506" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="10.5" cy="10.5" r="7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3>Consultar Funcionários</h3>
                      <p>Visualizar funcionários cadastrados</p>
                    </div>
                  </div>
                </>
              ) : subSection === 'cadastrar' ? (
                <>
                  <div className={styles.sectionHeader}>
                    <button className={styles.backToMainButton} onClick={handleBackToDepartamentos}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Voltar
                    </button>
                  </div>
                  <div className={styles.formContainer}>
                    <FuncionarioForm 
                      onSuccess={handleFormSuccess}
                      onError={handleFormError}
                    />
                  </div>
                </>
              ) : subSection === 'consultar' ? (
                <>
                  <div className={styles.sectionHeader}>
                    <button className={styles.backToMainButton} onClick={handleBackToDepartamentos}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Voltar
                    </button>
                  </div>
                  <FuncionarioForm modoConsulta={true} />
                </>
              ) : null}
            </>
          ) : activeSection === 'departamentos' ? (
            !subSection ? (
              // Submenu com as duas opções
              <div className={styles.sectionContent}>
                <div className={styles.sectionHeader}>
                  <button className={styles.backToMainButton} onClick={handleBackToMain}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Voltar
                  </button>
                  <h2 className={styles.sectionTitle}>Gestão de Departamentos</h2>
                </div>
                
                <div className={styles.subMenuGrid}>
                  <div className={styles.subMenuCard} onClick={() => setSubSection('cadastrar')}>
                    <div className={styles.subMenuIcon}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3>Cadastrar Departamento</h3>
                    <p>Adicionar novo departamento ao sistema</p>
                  </div>
                  <div className={styles.subMenuCard} onClick={() => setSubSection('consultar')}>
                    <div className={styles.subMenuIcon}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L16.514 16.506" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="10.5" cy="10.5" r="7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3>Consultar Departamentos</h3>
                    <p>Ver todos os departamentos cadastrados</p>
                  </div>
                </div>
              </div>
            ) : subSection === 'cadastrar' ? (
              // Formulário de cadastro existente
              <div className={styles.sectionContent}>
                <div className={styles.sectionHeader}>
                  <button className={styles.backToMainButton} onClick={handleBackToDepartamentos}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Voltar
                  </button>
                  <h2 className={styles.sectionTitle}>Cadastro de Departamento</h2>
                </div>
                
                <div className={styles.formContainer}>
                  <p className={styles.formDescription}>
                    Preencha os dados do departamento para realizar o cadastro.
                  </p>
                  
                  <DepartamentoForm 
                    onSuccess={handleFormSuccess}
                    onError={handleFormError}
                  />
                </div>
              </div>
            ) : subSection === 'consultar' ? (
              // Lista de departamentos sem container/fundo branco e sem envoltório extra
              <>
                <button style={{ marginBottom: 24 }} className={styles.backToMainButton} onClick={handleBackToDepartamentos}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Voltar
                </button>
                <h2 className={styles.sectionTitle} style={{ marginBottom: 16 }}>Departamentos Cadastrados</h2>
                {loadingDepartamentos ? (
                  <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Carregando departamentos...</p>
                  </div>
                ) : errorDepartamentos ? (
                  <div className={styles.errorContainer}>
                    <p className={styles.errorMessage}>{errorDepartamentos}</p>
                    <button className={styles.retryButton} onClick={carregarDepartamentos}>
                      Tentar Novamente
                    </button>
                  </div>
                ) : departamentos.length === 0 ? (
                  <div className={styles.emptyContainer}>
                    <div className={styles.emptyIcon}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2"/>
                        <path d="M3 9h18" stroke="currentColor" strokeWidth="2"/>
                        <path d="M9 3v18" stroke="currentColor" strokeWidth="2"/>
                        <path d="M15 3v18" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                    </div>
                    <h3>Nenhum departamento encontrado</h3>
                    <p>Ainda não há departamentos cadastrados no sistema.</p>
                    <button 
                      className={styles.addButton}
                      onClick={() => setSubSection('cadastrar')}
                    >
                      Cadastrar Primeiro Departamento
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={styles.listHeader}>
                      <h3>Total: {departamentos.length} departamento(s)</h3>
                      <button 
                        className={styles.addNewButton}
                        onClick={() => setSubSection('cadastrar')}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Novo Departamento
                      </button>
                    </div>
                    <div className={styles.departamentosGrid}>
                      {departamentos.map((departamento, index) => (
                        <div key={index} className={styles.departamentoCard}>
                          <div className={styles.departamentoIcon}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                              <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2"/>
                              <path d="M3 9h18" stroke="currentColor" strokeWidth="2"/>
                              <path d="M9 3v18" stroke="currentColor" strokeWidth="2"/>
                              <path d="M15 3v18" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                          </div>
                          <div className={styles.departamentoInfo}>
                            <h4 className={styles.departamentoNome}>{departamento.nomeDepartamento}</h4>
                            <span className={styles.departamentoId}>ID: {departamento.idDepartamento}</span>
                          </div>
                          <div className={styles.menuContainer}>
                            <button
                              className={styles.menuButton}
                              onClick={() =>
                                setMenuAberto(
                                  menuAberto === departamento.idDepartamento
                                    ? null
                                    : departamento.idDepartamento ?? null
                                )
                              }
                            >
                              &#x22EE;
                            </button>
                            {menuAberto === departamento.idDepartamento && (
                              <div className={styles.menuDropdown}>
                                <button
                                  className={styles.deleteButton}
                                  onClick={() => {
                                    if (typeof departamento.idDepartamento === 'number') {
                                      deletarDepartamento(departamento.idDepartamento);
                                    }
                                  }}
                                  disabled={deletando === departamento.idDepartamento}
                                >
                                  {deletando === departamento.idDepartamento ? 'Deletando...' : 'Deletar'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : null
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Gestao;