import { useState, useEffect } from "react";
import centroArmazenamentoService from "../services/centroArmazenamentoService";
import localizacaoService from "../services/localizacaoService";
import produtoService from "../services/produtoService";
import type { Localizacao, LocalizacaoFormData } from "../types/localizacao";
import type { CentroArmazenamento } from "../types/centroArmazenamento";
import type { Produto } from "../types/produto";
import styles from "../styles/Estoque.module.css";

interface Props {
  onNovo: () => void;
  onError: (msg: string) => void;
  onSuccess?: (msg: string) => void;
}

const FORM_VAZIO: LocalizacaoFormData = {
  codigo: '',
  descricao: '',
  corredor: '',
  prateleira: '',
  nivel: '',
  capacidade_max: null,
  status: 'ATIVO',
};

const LocalizacaoList: React.FC<Props> = ({ onNovo, onError, onSuccess }) => {
  const [centros, setCentros] = useState<CentroArmazenamento[]>([]);
  const [idCentroSelecionado, setIdCentroSelecionado] = useState<number>(0);
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formEdicao, setFormEdicao] = useState<LocalizacaoFormData>(FORM_VAZIO);
  const [idProdutoEdicao, setIdProdutoEdicao] = useState<number>(0);
  const [quantidadeEdicao, setQuantidadeEdicao] = useState<number | null>(null);
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
    fecharEdicao();
    carregarLocalizacoes(id);
  };

  const abrirEdicao = (loc: Localizacao) => {
    setEditandoId(loc.id_localizacao);
    setFormEdicao({
      codigo: loc.codigo,
      descricao: loc.descricao || '',
      corredor: loc.corredor || '',
      prateleira: loc.prateleira || '',
      nivel: loc.nivel || '',
      capacidade_max: loc.capacidade_max ?? null,
      status: loc.status,
    });
    setIdProdutoEdicao(loc.id_produto ?? 0);
    setQuantidadeEdicao(loc.quantidade ?? null);
    setMenuAberto(null);
  };

  const fecharEdicao = () => {
    setEditandoId(null);
    setFormEdicao(FORM_VAZIO);
    setIdProdutoEdicao(0);
    setQuantidadeEdicao(null);
  };

  const handleChangeEdicao = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormEdicao(prev => ({
      ...prev,
      [name]: name === 'capacidade_max' ? (value === '' ? null : Number(value)) : value,
    }));
  };

  const salvarEdicao = async (loc: Localizacao) => {
    if (!formEdicao.codigo.trim()) {
      onError('Código da localização é obrigatório');
      return;
    }
    if (formEdicao.capacidade_max != null && formEdicao.capacidade_max < 0) {
      onError('Capacidade máxima não pode ser negativa');
      return;
    }
    setSalvando(true);
    try {
      await localizacaoService.atualizar(idCentroSelecionado, loc.id_localizacao, formEdicao);
      if (idProdutoEdicao) {
        await localizacaoService.atualizarVinculoProduto({
          id_produto: idProdutoEdicao,
          id_localizacao: loc.id_localizacao,
          quantidade: quantidadeEdicao != null && quantidadeEdicao > 0 ? quantidadeEdicao : null,
        });
      }
      fecharEdicao();
      if (onSuccess) {
        onSuccess('Localização atualizada com sucesso!');
      }
      await carregarLocalizacoes(idCentroSelecionado);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Erro ao atualizar localização';
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

                {loc.produto_nome && (
                  <div className={styles.cardDetails}>
                    <span className={`${styles.cardBadge} ${styles.produtoBadge}`}>
                      Produto: {loc.produto_nome}
                      {loc.quantidade != null ? ` · ${loc.quantidade} un` : ''}
                    </span>
                  </div>
                )}

                {editandoId === loc.id_localizacao && (
                  <div className={styles.editPanel}>
                    <div className={styles.formGrid}>
                      <div className={styles.formGroup}>
                        <label htmlFor={`codigo-${loc.id_localizacao}`}>Código *</label>
                        <input
                          type="text"
                          id={`codigo-${loc.id_localizacao}`}
                          name="codigo"
                          value={formEdicao.codigo}
                          onChange={handleChangeEdicao}
                          className={styles.input}
                          maxLength={50}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor={`corredor-${loc.id_localizacao}`}>Corredor</label>
                        <input
                          type="text"
                          id={`corredor-${loc.id_localizacao}`}
                          name="corredor"
                          value={formEdicao.corredor || ''}
                          onChange={handleChangeEdicao}
                          className={styles.input}
                          placeholder="Ex: A, B, C"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor={`prateleira-${loc.id_localizacao}`}>Prateleira</label>
                        <input
                          type="text"
                          id={`prateleira-${loc.id_localizacao}`}
                          name="prateleira"
                          value={formEdicao.prateleira || ''}
                          onChange={handleChangeEdicao}
                          className={styles.input}
                          placeholder="Ex: 01, 02"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor={`nivel-${loc.id_localizacao}`}>Nível</label>
                        <input
                          type="text"
                          id={`nivel-${loc.id_localizacao}`}
                          name="nivel"
                          value={formEdicao.nivel || ''}
                          onChange={handleChangeEdicao}
                          className={styles.input}
                          placeholder="Ex: 1, 2, 3"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor={`capacidade-${loc.id_localizacao}`}>Capacidade Máxima</label>
                        <input
                          type="number"
                          id={`capacidade-${loc.id_localizacao}`}
                          name="capacidade_max"
                          value={formEdicao.capacidade_max ?? ''}
                          onChange={handleChangeEdicao}
                          className={styles.input}
                          placeholder="Opcional"
                          min="0"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor={`status-${loc.id_localizacao}`}>Status</label>
                        <select
                          id={`status-${loc.id_localizacao}`}
                          name="status"
                          value={formEdicao.status}
                          onChange={handleChangeEdicao}
                          className={styles.input}
                        >
                          <option value="ATIVO">Ativo</option>
                          <option value="INATIVO">Inativo</option>
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor={`produto-${loc.id_localizacao}`}>Produto</label>
                        <select
                          id={`produto-${loc.id_localizacao}`}
                          value={idProdutoEdicao}
                          onChange={e => setIdProdutoEdicao(Number(e.target.value))}
                          className={styles.input}
                        >
                          <option value={0}>Selecione o produto</option>
                          {(Array.isArray(produtos) ? produtos : []).map(p => (
                            <option key={p.id_produto} value={p.id_produto}>{p.nome}</option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor={`quantidade-${loc.id_localizacao}`}>Quantidade</label>
                        <input
                          type="number"
                          id={`quantidade-${loc.id_localizacao}`}
                          value={quantidadeEdicao ?? ''}
                          onChange={e =>
                            setQuantidadeEdicao(e.target.value === '' ? null : Number(e.target.value))
                          }
                          className={styles.input}
                          placeholder="Opcional"
                          min="1"
                        />
                      </div>

                      <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label htmlFor={`descricao-${loc.id_localizacao}`}>Descrição</label>
                        <textarea
                          id={`descricao-${loc.id_localizacao}`}
                          name="descricao"
                          value={formEdicao.descricao || ''}
                          onChange={handleChangeEdicao}
                          className={styles.textarea}
                          placeholder="Descrição da localização (opcional)"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className={styles.formActions}>
                      <button
                        className={styles.submitButton}
                        onClick={() => salvarEdicao(loc)}
                        disabled={salvando}
                      >
                        {salvando ? 'Salvando...' : 'Salvar'}
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={fecharEdicao}
                        disabled={salvando}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
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
                      onClick={() => abrirEdicao(loc)}
                    >
                      Editar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default LocalizacaoList;
