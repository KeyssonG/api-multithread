import { useState, useEffect } from 'react';
import inventarioService from '../services/inventarioService';
import type { Inventario } from '../types/inventario';
import styles from '../styles/Estoque.module.css';

interface Props {
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}

const InventarioList: React.FC<Props> = ({ onError, onSuccess }) => {
  const [loading, setLoading] = useState(true);
  const [divergencias, setDivergencias] = useState<Inventario[]>([]);
  const [contagemForm, setContagemForm] = useState<{
    [id: number]: { qtd_fisica: string; observacao: string };
  }>({});
  const [ajustandoId, setAjustandoId] = useState<number | null>(null);

  useEffect(() => {
    carregarDivergencias();
  }, []);

  const carregarDivergencias = async () => {
    setLoading(true);
    try {
      const data = await inventarioService.listarDivergencias();
      setDivergencias(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao carregar divergências';
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarContagem = async (id: number) => {
    const form = contagemForm[id];
    if (!form || !form.qtd_fisica) return;
    try {
      await inventarioService.registrarContagem(id, Number(form.qtd_fisica), form.observacao || undefined);
      onSuccess('Contagem registrada com sucesso');
      setContagemForm((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      await carregarDivergencias();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao registrar contagem';
      onError(msg);
    }
  };

  const handleAjustar = async (id: number) => {
    setAjustandoId(id);
    try {
      await inventarioService.ajustar(id);
      onSuccess('Ajuste aplicado com sucesso');
      await carregarDivergencias();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao aplicar ajuste';
      onError(msg);
    } finally {
      setAjustandoId(null);
    }
  };

  const updateForm = (id: number, field: 'qtd_fisica' | 'observacao', value: string) => {
    setContagemForm((prev) => ({
      ...prev,
      [id]: { ...prev[id], qtd_fisica: '', observacao: '', [field]: value },
    }));
  };

  const getDivergenciaColor = (divergencia: number | null) => {
    if (divergencia === null) return styles.statusInativo;
    if (divergencia < 0) return styles.statusRejeitado;
    if (divergencia > 0) return styles.statusAtivo;
    return styles.statusInativo;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return styles.statusPendente;
      case 'AJUSTADO':
        return styles.statusAtivo;
      case 'REJEITADO':
        return styles.statusRejeitado;
      default:
        return '';
    }
  };

  const listaDivergencias = Array.isArray(divergencias) ? divergencias : [];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando inventário...</p>
      </div>
    );
  }

  if (listaDivergencias.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="9" y="3" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 14l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Nenhuma divergência pendente</h3>
        <p>Todas as contagens foram realizadas ou não há inventário em andamento.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.listHeader}>
        <h3>Divergências ({listaDivergencias.length})</h3>
      </div>

      <div className={styles.gridCard}>
        {listaDivergencias.map((item) => (
          <div key={item.id_inventario} className={styles.cardInfo}>
            <div className={styles.cardHeader}>
              <h4 className={styles.cardName}>{item.produto_nome}</h4>
              <span className={`${styles.statusBadge} ${getStatusBadgeClass(item.status)}`}>
                {item.status}
              </span>
            </div>

            <div className={styles.cardDetails}>
              <div>
                <span>Sistema: </span>
                <strong>{item.qtd_sistema}</strong>
              </div>
              {item.qtd_fisica !== null && (
                <div>
                  <span>Física: </span>
                  <strong>{item.qtd_fisica}</strong>
                </div>
              )}
              {item.divergencia !== null && (
                <div>
                  <span>Divergência: </span>
                  <strong className={getDivergenciaColor(item.divergencia)}>
                    {item.divergencia > 0 ? '+' : ''}{item.divergencia}
                  </strong>
                </div>
              )}
              {item.observacao && (
                <div>
                  <span>Obs: </span>
                  <span>{item.observacao}</span>
                </div>
              )}
            </div>

            {item.status === 'PENDENTE' && (
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label>Qtd. Física</label>
                  <input
                    type="number"
                    className={styles.input}
                    placeholder="Quantidade contada"
                    value={contagemForm[item.id_inventario]?.qtd_fisica || ''}
                    onChange={(e) => updateForm(item.id_inventario, 'qtd_fisica', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Observação</label>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Observação (opcional)"
                    value={contagemForm[item.id_inventario]?.observacao || ''}
                    onChange={(e) => updateForm(item.id_inventario, 'observacao', e.target.value)}
                  />
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className={styles.submitButton}
                    onClick={() => handleRegistrarContagem(item.id_inventario)}
                    disabled={!contagemForm[item.id_inventario]?.qtd_fisica}
                  >
                    Registrar Contagem
                  </button>
                  {contagemForm[item.id_inventario]?.qtd_fisica && (
                    <button
                      className={styles.editButton}
                      onClick={() => handleAjustar(item.id_inventario)}
                      disabled={ajustandoId === item.id_inventario}
                    >
                      {ajustandoId === item.id_inventario ? 'Ajustando...' : 'Aplicar Ajuste'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default InventarioList;
