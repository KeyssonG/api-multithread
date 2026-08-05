import { useState, useEffect } from "react";
import centroArmazenamentoService from "../services/centroArmazenamentoService";
import localizacaoService from "../services/localizacaoService";
import produtoService from "../services/produtoService";
import type { Localizacao } from "../types/localizacao";
import type { CentroArmazenamento } from "../types/centroArmazenamento";
import type { Produto } from "../types/produto";
import styles from "../styles/Estoque.module.css";

interface Props {
  onNovo: () => void;
  onError: (msg: string) => void;
  onSuccess?: (msg: string) => void;
}

const LocalizacaoList: React.FC<Props> = ({ onNovo, onError, onSuccess }) => {
  const [centros, setCentros] = useState<CentroArmazenamento[]>([]);
  const [idCentroSelecionado, setIdCentroSelecionado] = useState<number>(0);
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [vinculandoId, setVinculandoId] = useState<number | null>(null);
  const [idProduto, setIdProduto] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number | null>(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    centroArmazenamentoService
      .listar()
      .then(setCentros)
      .catch(() => {});

    produtoService
      .listar()
      .then(setProdutos)
      .catch(() => {});

    setLoading(false);
  }, []);

  const carregarLocalizacoes = async (idCentro: number) => {
    if (!idCentro) {
      setLocalizacoes([]);
      return;
    }
    setLoading(true);
    try {
      const data = await localizacaoService.listarPorCentro(idCentro);
      setLocalizacoes(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao carregar localizações';
      onError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelecionarCentro = (id: number) => {
    setIdCentroSelecionado(id);
    setMenuAberto(null);
    setVinculandoId(null);
    carregarLocalizacoes(id);
  };

  const handleVincularProduto = async (idLocalizacao: number) => {
    if (!idProduto) {
      onError('Selecione um produto para vincular');
      return;
    }
    setSalvando(true);
    try {
      await localizacaoService.vincularProduto({
        id_produto: idProduto,
        id_localizacao: idLocalizacao,
        quantidade: quantidade != null && quantidade > 0 ? quantidade : null,
      });
      setIdProduto(0);
      setQuantidade(null);
      setVinculandoId(null);
      setMenuAberto(null);
      if (onSuccess) {
        onSuccess('Produto vinculado à localização com sucesso!');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao vincular produto';
      onError(msg);
    } finally {
      setSalvando(false);
    }
  };

  const listaLocalizacoes = Array.isArray(localizacoes) ? localizacoes : [];

  return (
    <>
      <div className={styles.listHeader}>
        <h3>Localizações ({listaLocalizacoes.length})</h3>
        <button className={styles.addNewButton} onClick={onNovo}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Nova Localização
        </button>
      </div>

      <div className={styles.inlineForm}>
        <div className={styles.inlineFormGroup}>
          <label htmlFor="centro-selecao">Centro de Armazenamento</label>
          <select
            id="centro-selecao"
            value={idCentroSelecionado}
            onChange={e => handleSelecionarCentro(Number(e.target.value))}
            className={styles.input}
          >
            <option value={0}>Selecione o centro para listar</option>
            {(Array.isArray(centros) ? centros : []).map(c => (
              <option key={c.id_centro} value={c.id_centro}>{c.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Carregando localizações...</p>
        </div>
      ) : !idCentroSelecionado ? (
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Selecione um centro</h3>
          <p>Escolha um centro de armazenamento acima para ver suas localizações.</p>
          <button className={styles.addButton} onClick={onNovo}>
            Cadastrar Primeira Localização
          </button>
        </div>
      ) : listaLocalizacoes.length === 0 ? (
        <div className={styles.emptyContainer}>
          <div className={styles.emptyIcon}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3>Nenhuma localização cadastrada</h3>
          <p>Este centro ainda não possui localizações cadastradas.</p>
          <button className={styles.addButton} onClick={onNovo}>
            Cadastrar Primeira Localização
          </button>
        </div>
      ) : (
        <div className={styles.gridCardContainer}>
          {listaLocalizacoes.map(loc => (
            <div key={loc.id_localizacao} className={styles.gridCard}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="22.08" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className={styles.cardInfo}>
                <div className={styles.cardHeader}>
                  <h4 className={styles.cardName}>{loc.codigo}</h4>
                  <span className={`${styles.statusBadge} ${loc.status === 'ATIVO' ? styles.statusAtivo : styles.statusInativo}`}>
                    {loc.status}
                  </span>
                </div>

                {loc.descricao && (
                  <p className={styles.cardSubtitle}>{loc.descricao}</p>
                )}

                <div className={styles.cardDetails}>
                  {loc.corredor && <span>Corredor: {loc.corredor}</span>}
                  {loc.prateleira && <span>Prateleira: {loc.prateleira}</span>}
                  {loc.nivel && <span>Nível: {loc.nivel}</span>}
                  <span>Capacidade: {loc.capacidade_max != null ? loc.capacidade_max : 'N/I'}</span>
                </div>
              </div>

              <div className={styles.menuContainer}>
                <button
                  className={styles.menuButton}
                  onClick={() =>
                    setMenuAberto(menuAberto === loc.id_localizacao ? null : loc.id_localizacao)
                  }
                >
                  &#x22EE;
                </button>
                {menuAberto === loc.id_localizacao && (
                  <div className={styles.menuDropdown}>
                    <button
                      className={styles.editButton}
                      onClick={() => {
                        setVinculandoId(vinculandoId === loc.id_localizacao ? null : loc.id_localizacao);
                        setMenuAberto(null);
                      }}
                    >
                      Vincular Produto
                    </button>
                  </div>
                )}
              </div>

              {vinculandoId === loc.id_localizacao && (
                <div className={styles.inlineForm}>
                  <div className={styles.inlineFormGroup}>
                    <label htmlFor={`produto-${loc.id_localizacao}`}>
                      Produto
                    </label>
                    <select
                      id={`produto-${loc.id_localizacao}`}
                      value={idProduto}
                      onChange={e => setIdProduto(Number(e.target.value))}
                      className={styles.input}
                    >
                      <option value={0}>Selecione o produto</option>
                      {(Array.isArray(produtos) ? produtos : []).map(p => (
                        <option key={p.id_produto} value={p.id_produto}>{p.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.inlineFormGroup}>
                    <label htmlFor={`quantidade-${loc.id_localizacao}`}>
                      Quantidade
                    </label>
                    <input
                      type="number"
                      id={`quantidade-${loc.id_localizacao}`}
                      value={quantidade ?? ''}
                      onChange={e =>
                        setQuantidade(e.target.value === '' ? null : Number(e.target.value))
                      }
                      className={styles.input}
                      placeholder="Opcional"
                      min="1"
                    />
                  </div>
                  <button
                    className={styles.addButton}
                    onClick={() => handleVincularProduto(loc.id_localizacao)}
                    disabled={salvando}
                  >
                    {salvando ? 'Vinculando...' : 'Vincular'}
                  </button>
                  <button
                    className={styles.deleteButton}
                    onClick={() => {
                      setVinculandoId(null);
                      setIdProduto(0);
                      setQuantidade(null);
                    }}
                    disabled={salvando}
                  >
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default LocalizacaoList;
