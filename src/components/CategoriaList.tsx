import { useState, useEffect } from "react";
import categoriaService from "../services/categoriaService";
import type { Categoria } from "../types/produto";
import styles from "../styles/Estoque.module.css";

interface Props {
  onNovo: () => void;
  onEditar: (categoria: Categoria) => void;
  onError: (msg: string) => void;
}

const CategoriaList: React.FC<Props> = ({ onNovo, onEditar, onError }) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletando, setDeletando] = useState<number | null>(null);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    setLoading(true);
    try {
      const data = await categoriaService.listar();
      setCategorias(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao carregar categorias';
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDesativar = async (id: number) => {
    setDeletando(id);
    try {
      await categoriaService.desativar(id);
      await carregarCategorias();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao desativar categoria';
      onError(msg);
    } finally {
      setDeletando(null);
    }
  };

  const listaCategorias = Array.isArray(categorias) ? categorias : [];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando categorias...</p>
      </div>
    );
  }

  if (listaCategorias.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M4 9h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 21V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3>Nenhuma categoria cadastrada</h3>
        <p>Comece cadastrando a primeira categoria de produto.</p>
        <button className={styles.submitButton} onClick={onNovo}>
          Cadastrar Primeira Categoria
        </button>
      </div>
    );
  }

  return (
    <>
      <div className={styles.listHeader}>
        <h3>Categorias ({listaCategorias.length})</h3>
        <button className={styles.submitButton} onClick={onNovo}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Nova Categoria
        </button>
      </div>

      <div className={styles.productGrid}>
        {listaCategorias.map(categoria => (
          <div key={categoria.id_categoria} className={styles.productCard}>
            <div className={styles.productInfo}>
              <div className={styles.productHeader}>
                <h4 className={styles.productName}>{categoria.nome}</h4>
                <span className={`${styles.statusBadge} ${categoria.status === 'ATIVO' ? styles.statusAtivo : styles.statusInativo}`}>
                  {categoria.status}
                </span>
              </div>

              {categoria.descricao && (
                <p className={styles.productDescription}>{categoria.descricao}</p>
              )}

              {categoria.criado_em && (
                <span className={styles.productStock}>
                  Criado em: {new Date(categoria.criado_em).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>

            <div className={styles.productActions}>
              <button
                className={styles.editButton}
                onClick={() => onEditar(categoria)}
              >
                Editar
              </button>
              {categoria.status === 'ATIVO' && (
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDesativar(categoria.id_categoria)}
                  disabled={deletando === categoria.id_categoria}
                >
                  {deletando === categoria.id_categoria ? 'Aguarde...' : 'Desativar'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoriaList;
