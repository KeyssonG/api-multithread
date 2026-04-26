import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CustomPopup from '../components/CustomPopup';
import { moduloService } from '../services/moduloService';
import { useAuth } from '../contexts/AuthContext';
import type { UserModuloResponseDTO, CompanyModuloDTO } from '../types/modulo';
import styles from '../styles/ConsultarVinculos.module.css';

const ConsultarVinculos: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [vinculos, setVinculos] = useState<UserModuloResponseDTO[]>([]);
  const [filteredVinculos, setFilteredVinculos] = useState<UserModuloResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'consultar' | 'novo'>('consultar');

  // Novo Vinculo state
  const [modulos, setModulos] = useState<CompanyModuloDTO[]>([]);
  const [moduloSearchTerm, setModuloSearchTerm] = useState('');
  const [selectedModulo, setSelectedModulo] = useState<CompanyModuloDTO | null>(null);
  const [selectedFuncionario] = useState<any>(null);
  const [loadingModulos, setLoadingModulos] = useState(false);
  
  const [popupConfig, setPopupConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'error' | 'success' | 'warning' | 'info';
    showConfirmButton?: boolean;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });

  useEffect(() => {
    carregarVinculos();
    if (activeTab === 'novo') {
      carregarModulos();
    }
  }, [token, activeTab]);

  useEffect(() => {
    // Filter vinculos based on search term
    const filtered = vinculos.filter(vinculo => 
      vinculo.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vinculo.moduloName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVinculos(filtered);
  }, [searchTerm, vinculos]);

  const carregarVinculos = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const data = await moduloService.getUserModulos(token);
      setVinculos(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar vínculos:', error);
      setPopupConfig({
        isOpen: true,
        title: 'Erro ao Carregar',
        message: error.message || 'Não foi possível carregar os vínculos de usuários e módulos.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const carregarModulos = async () => {
    if (!token) return;
    
    setLoadingModulos(true);
    try {
      const data = await moduloService.getModulosByCompany(token);
      setModulos(data || []);
    } catch (error: any) {
      console.error('Erro ao carregar módulos:', error);
      setPopupConfig({
        isOpen: true,
        title: 'Erro ao Carregar',
        message: error.message || 'Não foi possível carregar os módulos da empresa.',
        type: 'error'
      });
    } finally {
      setLoadingModulos(false);
    }
  };

  const handleRemover = async (vinculo: UserModuloResponseDTO) => {
    if (!token) return;

    // Confirmar remoção
    setPopupConfig({
      isOpen: true,
      title: 'Confirmar Remoção',
      message: `Tem certeza que deseja remover o vínculo entre ${vinculo.userName} e ${vinculo.moduloName}?`,
      type: 'warning',
      showConfirmButton: true,
      onConfirm: async () => {
        try {
          await moduloService.removerVinculoUsuarioModulo(vinculo.userId, vinculo.moduloId, token);
          
          // Recarregar a lista de vínculos
          await carregarVinculos();
          
          setPopupConfig({
            isOpen: true,
            title: 'Sucesso',
            message: `Vínculo removido com sucesso!`,
            type: 'success'
          });
        } catch (error: any) {
          console.error('Erro ao remover vínculo:', error);
          setPopupConfig({
            isOpen: true,
            title: 'Erro ao Remover',
            message: error.response?.data?.message || 'Não foi possível remover o vínculo.',
            type: 'error'
          });
        }
      }
    });
  };

  const closePopup = () => {
    setPopupConfig(prev => ({ ...prev, isOpen: false }));
  };

  const handleTabChange = (tab: 'consultar' | 'novo') => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      <Header />
      
      <div className={styles.content}>
        {/* Tabs Navigation */}
        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tab} ${activeTab === 'consultar' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('consultar')}
          >
            Consultar Vínculos
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'novo' ? styles.tabActive : ''}`}
            onClick={() => handleTabChange('novo')}
          >
            Novo Vínculo
          </button>
        </div>

        {/* Main Content */}
        <div className={styles.mainContainer}>
                    
          {activeTab === 'consultar' && (
            // CONSULTAR VÍNCULOS SCREEN
            <div className={styles.vinculosContainer}>
              {/* Left Section */}
              <div className={styles.leftSection}>
                <h1 className={styles.title}>Vínculos de Usuários</h1>
                <p className={styles.description}>
                  Pesquise abaixo para encontrar os módulos vinculados a determinados funcionários de forma rápida e eficiente.
                </p>
                
                <div className={styles.searchSection}>
                  <label className={styles.searchLabel}>FILTRO DE BUSCA</label>
                  <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Por nome ou módulo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className={styles.rightSection}>
                <div className={styles.listContainer}>
                  {loading ? (
                    <div className={styles.loadingContainer}>
                      <div className={styles.spinner}></div>
                      <p>Carregando vínculos...</p>
                    </div>
                  ) : filteredVinculos.length === 0 ? (
                    <div className={styles.emptyContainer}>
                      <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <h3 className={styles.emptyTitle}>
                        {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum vínculo encontrado'}
                      </h3>
                      <p className={styles.emptyMessage}>
                        {searchTerm 
                          ? 'Tente ajustar sua busca para encontrar resultados.'
                          : 'Não há vínculos de usuários e módulos cadastrados.'
                        }
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className={styles.listHeader}>
                        <div>USUÁRIO</div>
                        <div>MÓDULO</div>
                        <div>AÇÕES</div>
                      </div>
                      
                      {filteredVinculos.map((vinculo) => (
                        <div key={`${vinculo.userId}-${vinculo.moduloId}`} className={styles.vinculoItem}>
                          <div className={styles.userInfo}>
                            <div className={styles.userName}>{vinculo.userName}</div>
                            <div className={styles.userId}>ID: {vinculo.userId}</div>
                          </div>
                          
                          <div className={styles.moduleTag}>
                            {vinculo.moduloName}
                          </div>
                          
                          <button
                            className={styles.actionButton}
                            onClick={() => handleRemover(vinculo)}
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'novo' && (
            // NOVO VÍNCULO SCREEN
            <div className={styles.novoVinculoContainer}>
              {/* Company Selected Section */}
              <div className={styles.companySection}>
                <span className={styles.companyLabel}>EMPRESA SELECIONADA</span>
                <div className={styles.companyInfo}>
                  <span className={styles.companyName}>lumina (ID: 1)</span>
                  <button className={styles.changeCompanyButton}>Trocar Empresa</button>
                </div>
              </div>

              {/* Two Columns Layout */}
              <div className={styles.novoVinculoColumns}>
                {/* Left Column - Company Modules */}
                <div className={styles.leftColumn}>
                  <h3 className={styles.columnTitle}>Módulos da Empresa</h3>
                  
                  <div className={styles.searchBar}>
                    <input
                      type="text"
                      className={styles.moduleSearchInput}
                      placeholder="Pesquisar módulo..."
                      value={moduloSearchTerm}
                      onChange={(e) => setModuloSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className={styles.modulesList}>
                    {loadingModulos ? (
                      <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Carregando módulos...</p>
                      </div>
                    ) : (
                      modulos
                        .filter(modulo => 
                          modulo.moduloName.toLowerCase().includes(moduloSearchTerm.toLowerCase())
                        )
                        .map((modulo) => (
                          <div 
                            key={modulo.moduloId} 
                            className={`${styles.moduleCard} ${selectedModulo?.moduloId === modulo.moduloId ? styles.moduleCardSelected : ''}`}
                            onClick={() => setSelectedModulo(modulo)}
                          >
                            <div className={styles.moduleName}>{modulo.moduloName}</div>
                            <div className={styles.moduleId}>ID: {modulo.moduloId}</div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Right Column - Configure Management */}
                <div className={styles.rightColumn}>
                  <h3 className={styles.columnTitle}>Configurar Gestão</h3>
                  
                  <div className={styles.configSection}>
                    <div className={styles.configStep}>
                      <span className={styles.stepNumber}>1.</span>
                      <span className={styles.stepLabel}>MÓDULO</span>
                    </div>
                    <input
                      type="text"
                      className={styles.configInput}
                      placeholder="Selecione um módulo"
                      value={selectedModulo ? selectedModulo.moduloName : ''}
                      readOnly
                    />
                  </div>

                  <div className={styles.configSection}>
                    <div className={styles.configStep}>
                      <span className={styles.stepNumber}>2.</span>
                      <span className={styles.stepLabel}>FUNCIONÁRIO</span>
                    </div>
                    <button className={styles.selectEmployeeButton}>
                      Selecionar Funcionário
                    </button>
                  </div>

                  <button 
                    className={styles.confirmButton}
                    disabled={!selectedModulo || !selectedFuncionario}
                  >
                    Confirmar Vinculação
                  </button>
                </div>
              </div>
            </div>
          )}
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

export default ConsultarVinculos;
