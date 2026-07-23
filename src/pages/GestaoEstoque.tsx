import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CentroArmazenamentoForm from "../components/CentroArmazenamentoForm";
import CentroArmazenamentoList from "../components/CentroArmazenamentoList";
import ProdutoForm from "../components/ProdutoForm";
import ProdutoList from "../components/ProdutoList";
import MovimentacaoForm from "../components/MovimentacaoForm";
import DashboardEstoque from "../components/DashboardEstoque";
import InventarioList from "../components/InventarioList";
import RelatoriosEstoque from "../components/RelatoriosEstoque";
import type { CentroArmazenamento, CentroArmazenamentoFormData } from "../types/centroArmazenamento";
import type { Produto } from "../types/produto";
import { ROUTES } from "../constants/config";
import styles from "../styles/GestaoEstoque.module.css";

type ActiveSection = 'centros' | 'produtos' | 'movimentacoes' | 'inventario' | 'relatorios' | 'dashboard' | null;

const GestaoEstoque = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [subSection, setSubSection] = useState<string | null>(null);
  const [centroEditando, setCentroEditando] = useState<CentroArmazenamento | null>(null);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');

  const handleVoltar = () => {
    navigate(ROUTES.DASHBOARD);
  };

  const handleBackToMain = () => {
    setActiveSection(null);
    setSubSection(null);
    setCentroEditando(null);
    setProdutoEditando(null);
  };

  const handleBackToSection = () => {
    setSubSection(null);
    setCentroEditando(null);
    setProdutoEditando(null);
  };

  const handleNovoCentro = () => {
    setCentroEditando(null);
    setSubSection('cadastrar');
  };

  const handleEditarCentro = (centro: CentroArmazenamento) => {
    setCentroEditando(centro);
    setSubSection('cadastrar');
  };

  const handleNovoProduto = () => {
    setProdutoEditando(null);
    setSubSection('cadastrar');
  };

  const handleEditarProduto = (produto: Produto) => {
    setProdutoEditando(produto);
    setSubSection('cadastrar');
  };

  const handleFormSuccess = (msg?: string) => {
    showPopup(msg || (centroEditando || produtoEditando ? 'Atualizado com sucesso!' : 'Cadastrado com sucesso!'), 'success');
    setSubSection('consultar');
    setCentroEditando(null);
    setProdutoEditando(null);
  };

  const handleFormError = (msg: string) => {
    showPopup(msg, 'error');
  };

  const showPopup = (msg: string, type: 'success' | 'error') => {
    setPopupMessage(msg);
    setPopupType(type);
    setTimeout(() => setPopupMessage(null), 4000);
  };

  const getFormDataFromCentro = (centro: CentroArmazenamento): CentroArmazenamentoFormData => ({
    nome: centro.nome,
    descricao: centro.descricao || '',
    tipo: centro.tipo,
    cep: centro.cep || '',
    endereco: centro.endereco,
    cidade: centro.cidade,
    uf: centro.uf,
    id_responsavel: centro.id_responsavel || null,
    status: centro.status,
  });

  const getSectionLabel = () => {
    switch (activeSection) {
      case 'centros': return 'Centro de Armazenamento';
      case 'produtos': return 'Produtos';
      case 'movimentacoes': return 'Movimentações';
      case 'inventario': return 'Inventário';
      case 'relatorios': return 'Relatórios';
      case 'dashboard': return 'Dashboard';
      default: return '';
    }
  };

  const getSubSectionLabel = () => {
    if (!subSection) return '';
    if (activeSection === 'centros') {
      return centroEditando ? 'Editar' : subSection === 'cadastrar' ? 'Cadastrar' : 'Consultar';
    }
    if (activeSection === 'produtos') {
      return produtoEditando ? 'Editar' : subSection === 'cadastrar' ? 'Cadastrar' : 'Consultar';
    }
    return '';
  };

  return (
    <div className={styles.container}>
      <Header />

      <div className={styles.content}>
        {/* Dynamic Header */}
        <div className={styles.dynamicHeader}>
          <button
            className={styles.backIconButton}
            onClick={
              subSection ? handleBackToSection : (activeSection ? handleBackToMain : handleVoltar)
            }
            title="Voltar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <span
            className={!activeSection ? styles.breadcrumbTextActive : styles.breadcrumbText}
            onClick={handleBackToMain}
          >
            Gestão de Estoque
          </span>

          {activeSection && (
            <>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span
                className={!subSection ? styles.breadcrumbTextActive : styles.breadcrumbText}
                onClick={handleBackToSection}
              >
                {getSectionLabel()}
              </span>
            </>
          )}

          {subSection && (
            <>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbTextActive}>
                {getSubSectionLabel()}
              </span>
            </>
          )}
        </div>

        <div className={styles.mainContent}>
          {!activeSection ? (
            <>
              <h2 className={styles.welcomeText}>Visão Geral</h2>
              <p className={styles.descriptionText}>
                Selecione o que você deseja gerenciar no módulo de estoque
              </p>

              <div className={styles.featuresGrid}>
                <div className={styles.featureCard} onClick={() => setActiveSection('centros')}>
                  <div className={styles.featureIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Centro de Armazenamento</h3>
                  <p>Gerencie depósitos, filiais e centros de distribuição.</p>
                </div>

                <div className={styles.featureCard} onClick={() => setActiveSection('produtos')}>
                  <div className={styles.featureIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Produtos</h3>
                  <p>Cadastro e gestão de produtos do catálogo.</p>
                </div>

                <div className={styles.featureCard} onClick={() => setActiveSection('movimentacoes')}>
                  <div className={styles.featureIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="19 12 12 19 5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Movimentações</h3>
                  <p>Registrar entradas e saídas de estoque.</p>
                </div>

                <div className={styles.featureCard} onClick={() => setActiveSection('dashboard')}>
                  <div className={styles.featureIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Dashboard</h3>
                  <p>Indicadores e monitoramento do estoque.</p>
                </div>

                <div className={styles.featureCard} onClick={() => setActiveSection('inventario')}>
                  <div className={styles.featureIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Inventário</h3>
                  <p>Contagem física e ajuste de divergências.</p>
                </div>

                <div className={styles.featureCard} onClick={() => setActiveSection('relatorios')}>
                  <div className={styles.featureIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3>Relatórios</h3>
                  <p>Valor do estoque e giro por produto.</p>
                </div>
              </div>
            </>
          ) : activeSection === 'centros' ? (
            !subSection ? (
              <div className={styles.sectionContent}>
                <div className={styles.subMenuGrid}>
                  <div className={styles.subMenuCard} onClick={handleNovoCentro}>
                    <div className={styles.subMenuIcon}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3>Cadastrar Centro</h3>
                    <p>Adicionar novo depósito, filial ou CD.</p>
                  </div>
                  <div className={styles.subMenuCard} onClick={() => setSubSection('consultar')}>
                    <div className={styles.subMenuIcon}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L16.514 16.506" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="10.5" cy="10.5" r="7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3>Consultar Centros</h3>
                    <p>Visualizar todos os centros cadastrados.</p>
                  </div>
                </div>
              </div>
            ) : subSection === 'cadastrar' ? (
              <div className={styles.sectionContent}>
                <div className={styles.formContainer}>
                  <p className={styles.formDescription}>
                    {centroEditando
                      ? `Editando: ${centroEditando.nome}`
                      : 'Preencha os dados do novo centro de armazenamento.'}
                  </p>
                  <CentroArmazenamentoForm
                    onSuccess={() => handleFormSuccess(centroEditando ? 'Centro atualizado com sucesso!' : 'Centro cadastrado com sucesso!')}
                    onError={handleFormError}
                    dadosIniciais={centroEditando ? getFormDataFromCentro(centroEditando) : undefined}
                    idEdicao={centroEditando?.id_centro}
                    modoEdicao={!!centroEditando}
                  />
                </div>
              </div>
            ) : subSection === 'consultar' ? (
              <div className={styles.sectionContent}>
                <CentroArmazenamentoList
                  onNovo={handleNovoCentro}
                  onEditar={handleEditarCentro}
                  onError={(msg) => showPopup(msg, 'error')}
                />
              </div>
            ) : null
          ) : activeSection === 'produtos' ? (
            !subSection ? (
              <div className={styles.sectionContent}>
                <div className={styles.subMenuGrid}>
                  <div className={styles.subMenuCard} onClick={handleNovoProduto}>
                    <div className={styles.subMenuIcon}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3>Cadastrar Produto</h3>
                    <p>Adicionar novo produto ao catálogo.</p>
                  </div>
                  <div className={styles.subMenuCard} onClick={() => setSubSection('consultar')}>
                    <div className={styles.subMenuIcon}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 21L16.514 16.506" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="10.5" cy="10.5" r="7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3>Consultar Produtos</h3>
                    <p>Visualizar todos os produtos cadastrados.</p>
                  </div>
                </div>
              </div>
            ) : subSection === 'cadastrar' ? (
              <div className={styles.sectionContent}>
                <div className={styles.formContainer}>
                  <p className={styles.formDescription}>
                    {produtoEditando
                      ? `Editando: ${produtoEditando.nome}`
                      : 'Preencha os dados do novo produto.'}
                  </p>
                  <ProdutoForm
                    onSuccess={() => handleFormSuccess(produtoEditando ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!')}
                    onError={handleFormError}
                    dadosIniciais={produtoEditando ? {
                      nome: produtoEditando.nome,
                      descricao: produtoEditando.descricao || '',
                      id_categoria: produtoEditando.id_categoria,
                      id_fornecedor: produtoEditando.id_fornecedor || null,
                      id_centro_padrao: produtoEditando.id_centro_padrao,
                      unidade_medida: produtoEditando.unidade_medida,
                      preco_custo: produtoEditando.preco_custo,
                      preco_venda: produtoEditando.preco_venda || null,
                      qtd_estoque_minimo: produtoEditando.qtd_estoque_minimo,
                      qtd_estoque_maximo: produtoEditando.qtd_estoque_maximo,
                      status: produtoEditando.status,
                    } : undefined}
                    idEdicao={produtoEditando?.id_produto}
                    modoEdicao={!!produtoEditando}
                  />
                </div>
              </div>
            ) : subSection === 'consultar' ? (
              <div className={styles.sectionContent}>
                <ProdutoList
                  onNovo={handleNovoProduto}
                  onEditar={handleEditarProduto}
                  onError={(msg) => showPopup(msg, 'error')}
                />
              </div>
            ) : null
          ) : activeSection === 'movimentacoes' ? (
            <div className={styles.sectionContent}>
              <div className={styles.formContainer}>
                <p className={styles.formDescription}>
                  Registre entradas e saídas de mercadoria no estoque.
                </p>
                <MovimentacaoForm
                  onError={(msg) => showPopup(msg, 'error')}
                  onSuccess={(msg) => showPopup(msg, 'success')}
                />
              </div>
            </div>
          ) : activeSection === 'dashboard' ? (
            <div className={styles.sectionContent}>
              <DashboardEstoque
                onError={(msg) => showPopup(msg, 'error')}
              />
            </div>
          ) : activeSection === 'inventario' ? (
            <div className={styles.sectionContent}>
              <InventarioList
                onError={(msg) => showPopup(msg, 'error')}
                onSuccess={(msg) => showPopup(msg, 'success')}
              />
            </div>
          ) : activeSection === 'relatorios' ? (
            <div className={styles.sectionContent}>
              <RelatoriosEstoque
                onError={(msg) => showPopup(msg, 'error')}
              />
            </div>
          ) : null}
        </div>
      </div>

      <Footer />

      {/* Toast Popup */}
      {popupMessage && (
        <div
          className={`${styles.toast} ${popupType === 'success' ? styles.toastSuccess : styles.toastError}`}
          onClick={() => setPopupMessage(null)}
        >
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default GestaoEstoque;
