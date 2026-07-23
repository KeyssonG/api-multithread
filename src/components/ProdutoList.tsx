import { useState, useEffect } from "react";
import produtoService from "../services/produtoService";
import type { Produto } from "../types/produto";
import styles from "../styles/Estoque.module.css";

interface Props {
  onNovo: () => void;
  onEditar: (produto: Produto) => void;
  onError: (msg: string) => void;
}

const ProdutoList: React.FC<Props> = ({ onNovo, onEditar, onError }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [deletando, setDeletando] = useState<number | null>(null);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    setLoading(true);
    try {
      const data = await produtoService.listar();
      setProdutos(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao carregar produtos';
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDesativar = async (id: number) => {
    setDeletando(id);
    try {
      await produtoService.desativar(id);
      await carregarProdutos();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao desativar produto';
      onError(msg);
    } finally {
      setDeletando(null);
      setMenuAberto(null);
    }
  };

  const formatarMoeda = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getEstoqueStatus = (produto: Produto) => {
    if (produto.qtd_estoque_atual <= 0) return { label: 'Sem Estoque', color: '#dc3545' };
    if (produto.qtd_estoque_atual < produto.qtd_estoque_minimo) return { label: 'Estoque Baixo', color: '#fd7e14' };
    if (produto.qtd_estoque_atual > produto.qtd_estoque_maximo) return { label: 'Estoque Alto', color: '#fd7e14' };
    return { label: 'Normal', color: '#28a745' };
  };

  const listaProdutos = Array.isArray(produtos) ? produtos : [];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (listaProdutos.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Nenhum produto cadastrado</h3>
        <p>Comece cadastrando o primeiro produto.</p>
        <button className={styles.addButton} onClick={onNovo}>
          Cadastrar Primeiro Produto
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.listHeader}>
        <h3>Produtos ({listaProdutos.length})</h3>
        <button className={styles.addNewButton} onClick={onNovo}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Novo Produto
        </button>
      </div>

      <div className={styles.gridCard}>
        {listaProdutos.map(produto => {
          const estoqueStatus = getEstoqueStatus(produto);
          return (
            <div key={produto.id_produto} className={styles.cardBadge}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className={styles.cardInfo}>
                <div className={styles.cardHeader}>
                  <h4 className={styles.cardName}>{produto.nome}</h4>
                  <span className={`${styles.statusBadge} ${produto.status === 'ATIVO' ? styles.statusAtivo : styles.statusInativo}`}>
                    {produto.status}
                  </span>
                </div>

                <div className={styles.cardDetails}>
                  {produto.categoria_nome && <span>Categoria: {produto.categoria_nome}</span>}
                  {produto.centro_padrao_nome && <span>Centro: {produto.centro_padrao_nome}</span>}
                  <span>Unidade: {produto.unidade_medida}</span>
                  <span>Custo: {formatarMoeda(produto.preco_custo)}</span>
                  <span>
                    Estoque: {produto.qtd_estoque_atual} (min: {produto.qtd_estoque_minimo} / max: {produto.qtd_estoque_maximo})
                  </span>
                  <span style={{ color: estoqueStatus.color }}>{estoqueStatus.label}</span>
                </div>
              </div>

              <div className={styles.menuContainer}>
                <button
                  className={styles.menuButton}
                  onClick={() =>
                    setMenuAberto(menuAberto === produto.id_produto ? null : produto.id_produto)
                  }
                >
                  &#x22EE;
                </button>
                {menuAberto === produto.id_produto && (
                  <div className={styles.menuDropdown}>
                    <button
                      className={styles.editButton}
                      onClick={() => {
                        onEditar(produto);
                        setMenuAberto(null);
                      }}
                    >
                      Editar
                    </button>
                    {produto.status === 'ATIVO' && (
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDesativar(produto.id_produto)}
                        disabled={deletando === produto.id_produto}
                      >
                        {deletando === produto.id_produto ? 'Aguarde...' : 'Desativar'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ProdutoList;
