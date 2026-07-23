import { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import type { RelatorioValor, RelatorioGiro } from '../types/dashboard';
import styles from '../styles/Estoque.module.css';

interface Props {
  onError: (msg: string) => void;
}

export default function RelatoriosEstoque({ onError }: Props) {
  const [activeTab, setActiveTab] = useState<'valor' | 'giro'>('valor');
  const [loading, setLoading] = useState(true);
  const [relatorioValor, setRelatorioValor] = useState<RelatorioValor[]>([]);
  const [relatorioGiro, setRelatorioGiro] = useState<RelatorioGiro[]>([]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dashboardService.relatorioValor(),
      dashboardService.relatorioGiro(),
    ])
      .then(([valor, giro]) => {
        setRelatorioValor(valor);
        setRelatorioGiro(giro);
      })
      .catch((err) => onError(err?.message || 'Erro ao carregar relatórios'))
      .finally(() => setLoading(false));
  }, [onError]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
      </div>
    );
  }

  const totalProdutos = relatorioValor.reduce((sum, r) => sum + r.total_produtos, 0);
  const totalQuantidade = relatorioValor.reduce((sum, r) => sum + r.quantidade_total, 0);
  const totalValor = relatorioValor.reduce((sum, r) => sum + r.valor_total, 0);

  return (
    <div>
      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === 'valor' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('valor')}
        >
          Valor por Categoria
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'giro' ? styles.tabButtonActive : ''}`}
          onClick={() => setActiveTab('giro')}
        >
          Giro de Estoque
        </button>
      </div>

      {activeTab === 'valor' && (
        <>
          {relatorioValor.length === 0 ? (
            <div className={styles.emptyContainer}>
              <div className={styles.emptyIcon} />
              <p>Nenhum dado de valor por categoria disponível.</p>
            </div>
          ) : (
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th className={styles.reportTableHeader}>Categoria</th>
                  <th className={styles.reportTableHeader}>Total Produtos</th>
                  <th className={styles.reportTableHeader}>Quantidade Total</th>
                  <th className={styles.reportTableHeader}>Valor Total</th>
                </tr>
              </thead>
              <tbody>
                {relatorioValor.map((item) => (
                  <tr key={item.id_categoria}>
                    <td className={styles.reportTableCell}>{item.categoria_nome}</td>
                    <td className={styles.reportTableCell}>{item.total_produtos}</td>
                    <td className={styles.reportTableCell}>{item.quantidade_total}</td>
                    <td className={styles.reportTableCell}>{formatCurrency(item.valor_total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className={styles.reportTableCell}><strong>Total</strong></td>
                  <td className={styles.reportTableCell}><strong>{totalProdutos}</strong></td>
                  <td className={styles.reportTableCell}><strong>{totalQuantidade}</strong></td>
                  <td className={styles.reportTableCell}><strong>{formatCurrency(totalValor)}</strong></td>
                </tr>
              </tfoot>
            </table>
          )}
        </>
      )}

      {activeTab === 'giro' && (
        <>
          {relatorioGiro.length === 0 ? (
            <div className={styles.emptyContainer}>
              <div className={styles.emptyIcon} />
              <p>Nenhum dado de giro de estoque disponível.</p>
            </div>
          ) : (
            <table className={styles.reportTable}>
              <thead>
                <tr>
                  <th className={styles.reportTableHeader}>Produto</th>
                  <th className={styles.reportTableHeader}>Categoria</th>
                  <th className={styles.reportTableHeader}>Estoque Atual</th>
                  <th className={styles.reportTableHeader}>Entradas</th>
                  <th className={styles.reportTableHeader}>Saídas</th>
                  <th className={styles.reportTableHeader}>Giro</th>
                </tr>
              </thead>
              <tbody>
                {relatorioGiro.map((item) => (
                  <tr key={item.id_produto}>
                    <td className={styles.reportTableCell}>{item.produto_nome}</td>
                    <td className={styles.reportTableCell}>{item.categoria_nome}</td>
                    <td className={styles.reportTableCell}>{item.qtd_estoque_atual}</td>
                    <td className={styles.reportTableCell}>{item.total_entradas}</td>
                    <td className={styles.reportTableCell}>{item.total_saidas}</td>
                    <td className={styles.reportTableCell}>{item.giro_estoque.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
