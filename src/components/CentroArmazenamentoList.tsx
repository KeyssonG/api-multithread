import { useState, useEffect } from "react";
import centroArmazenamentoService from "../services/centroArmazenamentoService";
import type { CentroArmazenamento } from "../types/centroArmazenamento";
import styles from "../styles/CentroArmazenamento.module.css";

interface Props {
  onNovo: () => void;
  onEditar: (centro: CentroArmazenamento) => void;
  onError: (msg: string) => void;
}

const CentroArmazenamentoList: React.FC<Props> = ({ onNovo, onEditar, onError }) => {
  const [centros, setCentros] = useState<CentroArmazenamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [deletando, setDeletando] = useState<number | null>(null);

  useEffect(() => {
    carregarCentros();
  }, []);

  const carregarCentros = async () => {
    setLoading(true);
    try {
      const data = await centroArmazenamentoService.listar();
      setCentros(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao carregar centros';
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDesativar = async (id: number) => {
    setDeletando(id);
    try {
      await centroArmazenamentoService.desativar(id);
      await carregarCentros();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao desativar centro';
      onError(msg);
    } finally {
      setDeletando(null);
      setMenuAberto(null);
    }
  };

  const getTipoBadgeClass = (tipo: string) => {
    switch (tipo) {
      case 'DEPOSITO': return styles.badgeDeposito;
      case 'FILIAL': return styles.badgeFilial;
      case 'CD': return styles.badgeCD;
      default: return '';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'DEPOSITO': return 'Depósito';
      case 'FILIAL': return 'Filial';
      case 'CD': return 'CD';
      default: return tipo;
    }
  };

  const listaCentros = Array.isArray(centros) ? centros : [];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando centros de armazenamento...</p>
      </div>
    );
  }

  if (listaCentros.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Nenhum centro cadastrado</h3>
        <p>Comece cadastrando o primeiro centro de armazenamento.</p>
        <button className={styles.addButton} onClick={onNovo}>
          Cadastrar Primeiro Centro
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.listHeader}>
        <h3>Centros de Armazenamento ({listaCentros.length})</h3>
        <button className={styles.addNewButton} onClick={onNovo}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Novo Centro
        </button>
      </div>

      <div className={styles.centrosGrid}>
        {listaCentros.map(centro => (
          <div key={centro.id_centro} className={styles.centroCard}>
            <div className={styles.centroIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <div className={styles.centroInfo}>
              <div className={styles.centroHeader}>
                <h4 className={styles.centroNome}>{centro.nome}</h4>
                <span className={`${styles.tipoBadge} ${getTipoBadgeClass(centro.tipo)}`}>
                  {getTipoLabel(centro.tipo)}
                </span>
              </div>

              <div className={styles.centroDetails}>
                <span className={styles.centroLocalizacao}>
                  {centro.cidade} - {centro.uf}
                </span>
                <span className={`${styles.statusBadge} ${centro.status === 'ATIVO' ? styles.statusAtivo : styles.statusInativo}`}>
                  {centro.status}
                </span>
              </div>

              {centro.endereco && (
                <p className={styles.centroEndereco}>{centro.endereco}</p>
              )}
            </div>

            <div className={styles.menuContainer}>
              <button
                className={styles.menuButton}
                onClick={() =>
                  setMenuAberto(menuAberto === centro.id_centro ? null : centro.id_centro)
                }
              >
                &#x22EE;
              </button>
              {menuAberto === centro.id_centro && (
                <div className={styles.menuDropdown}>
                  <button
                    className={styles.editButton}
                    onClick={() => {
                      onEditar(centro);
                      setMenuAberto(null);
                    }}
                  >
                    Editar
                  </button>
                  {centro.status === 'ATIVO' && (
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDesativar(centro.id_centro)}
                      disabled={deletando === centro.id_centro}
                    >
                      {deletando === centro.id_centro ? 'Aguarde...' : 'Desativar'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CentroArmazenamentoList;
