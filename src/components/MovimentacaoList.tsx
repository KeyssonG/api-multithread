import { useState, useEffect } from 'react';
import movimentacaoService from '../services/movimentacaoService';
import type { Movimentacao } from '../types/movimentacao';
import styles from '../styles/Estoque.module.css';

interface Props {
  onError: (msg: string) => void;
}

const MovimentacaoList: React.FC<Props> = ({ onError }) => {
  const [loading, setLoading] = useState(true);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);
  const [tipo, setTipo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const carregar = async () => {
    setLoading(true);
    try {
      const data = await movimentacaoService.listar(
        tipo || undefined,
        dataInicio || undefined,
        dataFim || undefined
      );
      setMovimentacoes(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao listar movimentações';
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
  }, []);

  const formatarData = (value?: string) => {
    if (!value) return '-';
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleString('pt-BR');
  };

  const getTipoBadge = (tipoMov: string) => {
    if (tipoMov === 'ENTRADA') return styles.statusAtivo;
    if (tipoMov === 'SAIDA') return styles.statusInativo;
    return '';
  };

  const lista = Array.isArray(movimentacoes) ? movimentacoes : [];

  return (
    <div>
      <div className={styles.listHeader}>
        <h3>Histórico de Movimentações ({lista.length})</h3>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="mov_tipo">Tipo</label>
          <select
            id="mov_tipo"
            className={styles.input}
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
            <option value="AJUSTE">Ajuste</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="mov_data_inicio">Data Início</label>
          <input
            type="date"
            id="mov_data_inicio"
            className={styles.input}
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="mov_data_fim">Data Fim</label>
          <input
            type="date"
            id="mov_data_fim"
            className={styles.input}
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />
        </div>
        <div className={styles.formGroup} style={{ justifyContent: 'flex-end' }}>
          <button className={styles.addButton} onClick={carregar} disabled={loading}>
            {loading ? 'Buscando...' : 'Filtrar'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando movimentações...</p>
        </div>
      ) : lista.length === 0 ? (
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 1l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 23l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Nenhuma movimentação encontrada</h3>
          <p>Registre uma entrada ou saída para visualizar o histórico.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', background: 'white', borderRadius: '16px' }}>
          <table className={styles.reportTable}>
            <thead>
              <tr>
                <th>Data</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Origem</th>
                <th>Quantidade</th>
                <th>Nº NF</th>
                <th>Lote</th>
                <th>Validade</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((m) => (
                <tr key={m.id_movimentacao}>
                  <td>{formatarData(m.criado_em)}</td>
                  <td><strong>{m.produto_nome}</strong></td>
                  <td>
                    <span className={`${styles.statusBadge} ${getTipoBadge(m.tipo)}`}>
                      {m.tipo}
                    </span>
                  </td>
                  <td>{m.origem}</td>
                  <td>{m.quantidade}</td>
                  <td>{m.numero_nf || '-'}</td>
                  <td>{m.lote || '-'}</td>
                  <td>{m.validade || '-'}</td>
                  <td>{m.observacao || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MovimentacaoList;
