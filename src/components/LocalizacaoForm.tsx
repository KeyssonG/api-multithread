import React, { useState, useEffect } from "react";
import centroArmazenamentoService from "../services/centroArmazenamentoService";
import localizacaoService from "../services/localizacaoService";
import produtoService from "../services/produtoService";
import type { LocalizacaoFormData } from "../types/localizacao";
import type { CentroArmazenamento } from "../types/centroArmazenamento";
import type { Produto } from "../types/produto";
import styles from "../styles/CentroArmazenamento.module.css";

interface Props {
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const LocalizacaoForm: React.FC<Props> = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [centros, setCentros] = useState<CentroArmazenamento[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);

  const [formData, setFormData] = useState<LocalizacaoFormData>({
    codigo: '',
    descricao: '',
    corredor: '',
    prateleira: '',
    nivel: '',
    capacidade_max: null,
    status: 'ATIVO',
  });
  const [idCentro, setIdCentro] = useState<number>(0);
  const [idProduto, setIdProduto] = useState<number>(0);
  const [quantidade, setQuantidade] = useState<number | null>(null);

  const produtoSelecionado = produtos.find(p => p.id_produto === idProduto);

  useEffect(() => {
    centroArmazenamentoService
      .listar()
      .then(setCentros)
      .catch(() => {});

    produtoService
      .listar()
      .then(setProdutos)
      .catch(() => {});
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'id_centro') {
      setIdCentro(Number(value));
    } else if (name === 'id_produto') {
      setIdProduto(Number(value));
    } else if (name === 'quantidade') {
      setQuantidade(value === '' ? null : Number(value));
    } else if (name === 'capacidade_max') {
      setFormData(prev => ({
        ...prev,
        capacidade_max: value === '' ? null : Number(value),
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!idCentro) {
      newErrors.id_centro = 'Centro de armazenamento é obrigatório';
    }

    if (!idProduto) {
      newErrors.id_produto = 'Selecione o produto para esta localização';
    }

    if (quantidade != null && quantidade < 1) {
      newErrors.quantidade = 'Quantidade deve ser no mínimo 1';
    }

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'Código da localização é obrigatório';
    } else if (formData.codigo.trim().length > 50) {
      newErrors.codigo = 'Código deve ter no máximo 50 caracteres';
    }

    if (formData.capacidade_max != null && formData.capacidade_max < 0) {
      newErrors.capacidade_max = 'Capacidade máxima não pode ser negativa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const idLocalizacao = await localizacaoService.cadastrar(idCentro, formData);
      if (idProduto) {
        await localizacaoService.vincularProduto({
          id_produto: idProduto,
          id_localizacao: idLocalizacao,
          quantidade: quantidade != null && quantidade > 0 ? quantidade : null,
        });
      }
      setFormData({
        codigo: '',
        descricao: '',
        corredor: '',
        prateleira: '',
        nivel: '',
        capacidade_max: null,
        status: 'ATIVO',
      });
      setIdCentro(0);
      setIdProduto(0);
      setQuantidade(null);
      setErrors({});
      onSuccess();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Erro ao salvar localização';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="id_centro">Centro de Armazenamento *</label>
          <select
            id="id_centro"
            name="id_centro"
            value={idCentro}
            onChange={handleChange}
            className={errors.id_centro ? styles.inputError : styles.input}
          >
            <option value={0}>Selecione o centro</option>
            {(Array.isArray(centros) ? centros : []).map(c => (
              <option key={c.id_centro} value={c.id_centro}>{c.nome}</option>
            ))}
          </select>
          {errors.id_centro && <span className={styles.errorMessage}>{errors.id_centro}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="id_produto" className={styles.labelWithHelp}>
            Produto *
            <span className={styles.helpTooltip} tabIndex={0}>
              <span className={styles.helpIcon}>?</span>
              <span className={styles.helpContent}>
                <strong>Produto</strong> que será armazenado nesta localização. O vínculo fica
                registrado com o id da empresa, garantindo isolamento por empresa.
              </span>
            </span>
          </label>
          <select
            id="id_produto"
            name="id_produto"
            value={idProduto}
            onChange={handleChange}
            className={errors.id_produto ? styles.inputError : styles.input}
          >
            <option value={0}>Selecione o produto</option>
            {(Array.isArray(produtos) ? produtos : []).map(p => (
              <option key={p.id_produto} value={p.id_produto}>{p.nome}</option>
            ))}
          </select>
          {errors.id_produto && <span className={styles.errorMessage}>{errors.id_produto}</span>}
          {produtoSelecionado && (
            <span className={styles.estoqueInfo}>
              Estoque disponível: <strong>{produtoSelecionado.qtd_estoque_atual}</strong>{' '}
              {produtoSelecionado.unidade_medida}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="quantidade">Quantidade</label>
          <input
            type="number"
            id="quantidade"
            name="quantidade"
            value={quantidade ?? ''}
            onChange={handleChange}
            className={errors.quantidade ? styles.inputError : styles.input}
            placeholder="Opcional"
            min="1"
          />
          {errors.quantidade && <span className={styles.errorMessage}>{errors.quantidade}</span>}
          {produtoSelecionado && produtoSelecionado.qtd_estoque_atual > 0 && (
            <button
              type="button"
              className={styles.selectAllButton}
              onClick={() => setQuantidade(produtoSelecionado.qtd_estoque_atual)}
            >
              Selecionar tudo ({produtoSelecionado.qtd_estoque_atual})
            </button>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="codigo" className={styles.labelWithHelp}>
            Código *
            <span className={styles.helpTooltip} tabIndex={0}>
              <span className={styles.helpIcon}>?</span>
              <span className={styles.helpContent}>
                <strong>Código único</strong> da localização dentro da empresa.
                Ex.: <strong>A-01-03</strong> (corredor-prateleira-nível). O código não pode se repetir
                em outra localização da mesma empresa.
              </span>
            </span>
          </label>
          <input
            type="text"
            id="codigo"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            className={errors.codigo ? styles.inputError : styles.input}
            placeholder="Ex: A-01-03"
            maxLength={50}
          />
          {errors.codigo && <span className={styles.errorMessage}>{errors.codigo}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="corredor">Corredor</label>
          <input
            type="text"
            id="corredor"
            name="corredor"
            value={formData.corredor || ''}
            onChange={handleChange}
            className={styles.input}
            placeholder="Ex: A, B, C"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="prateleira">Prateleira</label>
          <input
            type="text"
            id="prateleira"
            name="prateleira"
            value={formData.prateleira || ''}
            onChange={handleChange}
            className={styles.input}
            placeholder="Ex: 01, 02"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="nivel">Nível</label>
          <input
            type="text"
            id="nivel"
            name="nivel"
            value={formData.nivel || ''}
            onChange={handleChange}
            className={styles.input}
            placeholder="Ex: 1, 2, 3"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="capacidade_max">Capacidade Máxima</label>
          <input
            type="number"
            id="capacidade_max"
            name="capacidade_max"
            value={formData.capacidade_max ?? ''}
            onChange={handleChange}
            className={errors.capacidade_max ? styles.inputError : styles.input}
            placeholder="Opcional"
            min="0"
          />
          {errors.capacidade_max && (
            <span className={styles.errorMessage}>{errors.capacidade_max}</span>
          )}
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao || ''}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Descrição da localização (opcional)"
            rows={3}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={styles.input}
          >
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>
        </div>
      </div>

      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Cadastrar Localização'}
        </button>
      </div>
    </form>
  );
};

export default LocalizacaoForm;
