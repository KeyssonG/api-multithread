import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../styles/GestaoEstoque.module.css";
import { ROUTES } from "../constants/config";

const GestaoEstoque = () => {
  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate(ROUTES.DASHBOARD);
  };

  // Dados mockados para demonstração visual
  const inventoryData = [
    { id: 1, nome: "Papel A4 (Resma)", categoria: "Escritório", quantidade: 45, status: "OK" },
    { id: 2, nome: "Cartucho de Tinta Preto", categoria: "Informática", quantidade: 5, status: "BAIXO" },
    { id: 3, nome: "Cadeira Ergonômica", categoria: "Mobiliário", quantidade: 12, status: "OK" },
    { id: 4, nome: "Notebook Dell Latitude", categoria: "Hardware", quantidade: 2, status: "CRÍTICO" },
    { id: 5, nome: "Teclado USB", categoria: "Periféricos", quantidade: 15, status: "OK" },
    { id: 6, nome: "Monitor 24'", categoria: "Hardware", quantidade: 0, status: "CRÍTICO" },
  ];

  const getStatusClass = (status: string) => {
    switch (status) {
      case "OK": return styles.statusOk;
      case "BAIXO": return styles.statusLow;
      case "CRÍTICO": return styles.statusCritical;
      default: return "";
    }
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
          
          <h1 className={styles.pageTitle}>Gestão de Estoque</h1>
        </div>

        <div className={styles.summaryCards}>
          <div className={styles.card}>
            <span className={styles.cardTitle}>Total de Itens</span>
            <span className={styles.cardValue}>1.240</span>
          </div>
          <div className={styles.card}>
            <span className={styles.cardTitle}>Estoque Baixo</span>
            <span className={styles.cardValue} style={{ color: '#ef6c00' }}>14</span>
          </div>
          <div className={styles.card}>
            <span className={styles.cardTitle}>Alertas Críticos</span>
            <span className={styles.cardValue} style={{ color: '#c62828' }}>3</span>
          </div>
          <div className={styles.card}>
            <span className={styles.cardTitle}>Valor Total</span>
            <span className={styles.cardValue}>R$ 45.200</span>
          </div>
        </div>

        <div className={styles.actionsSection}>
          <button className={`${styles.actionButton} ${styles.primaryButton}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Novo Produto
          </button>
          <button className={`${styles.actionButton} ${styles.secondaryButton}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 11L12 6L17 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Entrada
          </button>
          <button className={`${styles.actionButton} ${styles.outlineButton}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 13L12 18L17 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Saída
          </button>
        </div>

        <div className={styles.tableContainer}>
          <h2 className={styles.tableTitle}>Inventário de Produtos</h2>
          <table className={styles.inventoryTable}>
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Qtd.</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map(item => (
                <tr key={item.id}>
                  <td>{item.nome}</td>
                  <td>{item.categoria}</td>
                  <td>{item.quantidade}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1976d2' }}>Editar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default GestaoEstoque;
