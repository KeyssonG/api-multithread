import { useState, useEffect } from 'react';
import movimentacaoService from '../services/movimentacaoService';
import produtoService from '../services/produtoService';
import type { Produto } from '../types/produto';
import { ORIGEM_ENTRADA, ORIGEM_SAIDA } from '../types/movimentacao';
import styles from '../styles/Estoque.module.css';

interface Props {
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}

type TabType = 'entrada' | 'saida';

interface EntradaForm {
  id_produto: string;
  quantidade: string;
  origem: string;
  numero_nf: string;
  lote: string;
  validade: string;
  observacao: string;
}

interface SaidaForm {
  id_produto: string;
  quantidade: string;
  origem: string;
  numero_nf: string;
  observacao: string;
}

const initialEntrada: EntradaForm = {
  id_produto: '',
  quantidade: '',
  origem: '',
  numero_nf: '',
  lote: '',
  validade: '',
  observacao: '',
};

const initialSaida: SaidaForm = {
  id_produto: '',
  quantidade: '',
  origem: '',
  numero_nf: '',
  observacao: '',
};

const MovimentacaoForm: React.FC<Props> = ({ onError, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<TabType>('entrada');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [formDataEntrada, setFormDataEntrada] = useState<EntradaForm>(initialEntrada);
  const [formDataSaida, setFormDataSaida] = useState<SaidaForm>(initialSaida);

  useEffect(() => {
    const loadProdutos = async () => {
      try {
        const data = await produtoService.listar();
        setProdutos(data);
      } catch (err: any) {
        onError(err.response?.data?.message || 'Erro ao carregar produtos');
      }
    };
    loadProdutos();
  }, [onError]);

  const handleChangeEntrada = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormDataEntrada(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleChangeSaida = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormDataSaida(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateEntrada = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formDataEntrada.id_produto) {
      newErrors.id_produto = 'Produto é obrigatório';
    }

    if (!formDataEntrada.quantidade) {
      newErrors.quantidade = 'Quantidade é obrigatória';
    } else if (Number(formDataEntrada.quantidade) <= 0) {
      newErrors.quantidade = 'Quantidade deve ser maior que 0';
    }

    if (!formDataEntrada.origem) {
      newErrors.origem = 'Origem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSaida = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formDataSaida.id_produto) {
      newErrors.id_produto = 'Produto é obrigatório';
    }

    if (!formDataSaida.quantidade) {
      newErrors.quantidade = 'Quantidade é obrigatória';
    } else if (Number(formDataSaida.quantidade) <= 0) {
      newErrors.quantidade = 'Quantidade deve ser maior que 0';
    }

    if (!formDataSaida.origem) {
      newErrors.origem = 'Origem é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setErrors({});
  };

  const handleSubmitEntrada = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEntrada()) return;

    setLoading(true);
    try {
      const payload: Record<string, any> = {
        id_produto: Number(formDataEntrada.id_produto),
        quantidade: Number(formDataEntrada.quantidade),
        origem: formDataEntrada.origem,
      };
      if (formDataEntrada.numero_nf) payload.numero_nf = formDataEntrada.numero_nf;
      if (formDataEntrada.lote) payload.lote = formDataEntrada.lote;
      if (formDataEntrada.validade) payload.validade = formDataEntrada.validade;
      if (formDataEntrada.observacao) payload.observacao = formDataEntrada.observacao;

      await movimentacaoService.registrarEntrada(payload);
      setFormDataEntrada(initialEntrada);
      setErrors({});
      onSuccess('Entrada registrada com sucesso!');
    } catch (err: any) {
      onError(err.response?.data?.message || 'Erro ao registrar entrada');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSaida = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSaida()) return;

    setLoading(true);
    try {
      const payload: Record<string, any> = {
        id_produto: Number(formDataSaida.id_produto),
        quantidade: Number(formDataSaida.quantidade),
        origem: formDataSaida.origem,
      };
      if (formDataSaida.numero_nf) payload.numero_nf = formDataSaida.numero_nf;
      if (formDataSaida.observacao) payload.observacao = formDataSaida.observacao;

      await movimentacaoService.registrarSaida(payload);
      setFormDataSaida(initialSaida);
      setErrors({});
      onSuccess('Saída registrada com sucesso!');
    } catch (err: any) {
      onError(err.response?.data?.message || 'Erro ao registrar saída');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.tabsContainer}>
        <button
          type="button"
          className={activeTab === 'entrada' ? styles.tabButtonActive : styles.tabButton}
          onClick={() => handleTabChange('entrada')}
        >
          Entrada
        </button>
        <button
          type="button"
          className={activeTab === 'saida' ? styles.tabButtonActive : styles.tabButton}
          onClick={() => handleTabChange('saida')}
        >
          Saída
        </button>
      </div>

      {activeTab === 'entrada' && (
        <form onSubmit={handleSubmitEntrada} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="ent_id_produto">Produto *</label>
              <select
                id="ent_id_produto"
                name="id_produto"
                value={formDataEntrada.id_produto}
                onChange={handleChangeEntrada}
                className={errors.id_produto ? styles.inputError : styles.input}
              >
                <option value="">Selecione o produto</option>
                {produtos
                  .filter(p => p.status === 'ATIVO')
                  .map(p => (
                    <option key={p.id_produto} value={p.id_produto}>
                      {p.nome} (Estoque: {p.qtd_estoque_atual})
                    </option>
                  ))}
              </select>
              {errors.id_produto && <span className={styles.errorMessage}>{errors.id_produto}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ent_quantidade">Quantidade *</label>
              <input
                type="number"
                id="ent_quantidade"
                name="quantidade"
                value={formDataEntrada.quantidade}
                onChange={handleChangeEntrada}
                className={errors.quantidade ? styles.inputError : styles.input}
                placeholder="0"
                min="1"
                step="any"
              />
              {errors.quantidade && <span className={styles.errorMessage}>{errors.quantidade}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ent_origem">Origem *</label>
              <select
                id="ent_origem"
                name="origem"
                value={formDataEntrada.origem}
                onChange={handleChangeEntrada}
                className={errors.origem ? styles.inputError : styles.input}
              >
                <option value="">Selecione a origem</option>
                {ORIGEM_ENTRADA.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {errors.origem && <span className={styles.errorMessage}>{errors.origem}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ent_numero_nf">Nº Nota Fiscal</label>
              <input
                type="text"
                id="ent_numero_nf"
                name="numero_nf"
                value={formDataEntrada.numero_nf}
                onChange={handleChangeEntrada}
                className={styles.input}
                placeholder="Número da NF (opcional)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ent_lote">Lote</label>
              <input
                type="text"
                id="ent_lote"
                name="lote"
                value={formDataEntrada.lote}
                onChange={handleChangeEntrada}
                className={styles.input}
                placeholder="Número do lote (opcional)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ent_validade">Validade</label>
              <input
                type="date"
                id="ent_validade"
                name="validade"
                value={formDataEntrada.validade}
                onChange={handleChangeEntrada}
                className={styles.input}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="ent_observacao">Observação</label>
              <textarea
                id="ent_observacao"
                name="observacao"
                value={formDataEntrada.observacao}
                onChange={handleChangeEntrada}
                className={styles.textarea}
                placeholder="Observações sobre a entrada (opcional)"
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Entrada'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'saida' && (
        <form onSubmit={handleSubmitSaida} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="said_id_produto">Produto *</label>
              <select
                id="said_id_produto"
                name="id_produto"
                value={formDataSaida.id_produto}
                onChange={handleChangeSaida}
                className={errors.id_produto ? styles.inputError : styles.input}
              >
                <option value="">Selecione o produto</option>
                {produtos
                  .filter(p => p.status === 'ATIVO')
                  .map(p => (
                    <option key={p.id_produto} value={p.id_produto}>
                      {p.nome} (Estoque: {p.qtd_estoque_atual})
                    </option>
                  ))}
              </select>
              {errors.id_produto && <span className={styles.errorMessage}>{errors.id_produto}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="said_quantidade">Quantidade *</label>
              <input
                type="number"
                id="said_quantidade"
                name="quantidade"
                value={formDataSaida.quantidade}
                onChange={handleChangeSaida}
                className={errors.quantidade ? styles.inputError : styles.input}
                placeholder="0"
                min="1"
                step="any"
              />
              {errors.quantidade && <span className={styles.errorMessage}>{errors.quantidade}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="said_origem">Origem *</label>
              <select
                id="said_origem"
                name="origem"
                value={formDataSaida.origem}
                onChange={handleChangeSaida}
                className={errors.origem ? styles.inputError : styles.input}
              >
                <option value="">Selecione a origem</option>
                {ORIGEM_SAIDA.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              {errors.origem && <span className={styles.errorMessage}>{errors.origem}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="said_numero_nf">Nº Nota Fiscal</label>
              <input
                type="text"
                id="said_numero_nf"
                name="numero_nf"
                value={formDataSaida.numero_nf}
                onChange={handleChangeSaida}
                className={styles.input}
                placeholder="Número da NF (opcional)"
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="said_observacao">Observação</label>
              <textarea
                id="said_observacao"
                name="observacao"
                value={formDataSaida.observacao}
                onChange={handleChangeSaida}
                className={styles.textarea}
                placeholder="Observações sobre a saída (opcional)"
                rows={3}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Saída'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MovimentacaoForm;
