import React, { useState, useEffect } from "react";
import produtoService from "../services/produtoService";
import centroArmazenamentoService from "../services/centroArmazenamentoService";
import { UNIDADE_MEDIDA } from "../types/produto";
import type { ProdutoFormData, Categoria } from "../types/produto";
import type { CentroArmazenamento } from "../types/centroArmazenamento";
import styles from "../styles/Estoque.module.css";

interface Props {
  onSuccess: () => void;
  onError: (msg: string) => void;
  dadosIniciais?: ProdutoFormData;
  idEdicao?: number;
  modoEdicao?: boolean;
}

const ProdutoForm: React.FC<Props> = ({
  onSuccess,
  onError,
  dadosIniciais,
  idEdicao,
  modoEdicao = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [centros, setCentros] = useState<CentroArmazenamento[]>([]);

  const [formData, setFormData] = useState<ProdutoFormData>({
    nome: '',
    descricao: '',
    id_categoria: 0,
    id_fornecedor: null,
    id_centro_padrao: 0,
    unidade_medida: '',
    preco_custo: 0,
    preco_venda: null,
    qtd_estoque_minimo: 0,
    qtd_estoque_maximo: 0,
    status: 'ATIVO',
  });

  useEffect(() => {
    produtoService.listarCategorias().then(setCategories).catch(() => {});
    centroArmazenamentoService.listar().then(setCentros).catch(() => {});

    function setCategories(data: Categoria[]) {
      setCategorias(data);
    }
  }, []);

  useEffect(() => {
    if (dadosIniciais && modoEdicao) {
      setFormData(dadosIniciais);
    }
  }, [dadosIniciais, modoEdicao]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'id_categoria' || name === 'id_centro_padrao') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else if (name === 'preco_custo' || name === 'preco_venda' || name === 'qtd_estoque_minimo' || name === 'qtd_estoque_maximo') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? (name === 'preco_venda' ? null : 0) : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do produto é obrigatório';
    } else if (formData.nome.trim().length > 150) {
      newErrors.nome = 'Nome deve ter no máximo 150 caracteres';
    }

    if (!formData.id_categoria) {
      newErrors.id_categoria = 'Categoria é obrigatória';
    }

    if (!formData.id_centro_padrao) {
      newErrors.id_centro_padrao = 'Centro padrão é obrigatório';
    }

    if (!formData.unidade_medida) {
      newErrors.unidade_medida = 'Unidade de medida é obrigatória';
    }

    if (!formData.preco_custo || formData.preco_custo <= 0) {
      newErrors.preco_custo = 'Preço de custo deve ser maior que zero';
    }

    if (formData.qtd_estoque_minimo === undefined || formData.qtd_estoque_minimo === null) {
      newErrors.qtd_estoque_minimo = 'Estoque mínimo é obrigatório';
    }

    if (formData.qtd_estoque_maximo === undefined || formData.qtd_estoque_maximo === null) {
      newErrors.qtd_estoque_maximo = 'Estoque máximo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (modoEdicao && idEdicao) {
        await produtoService.atualizar(idEdicao, formData);
      } else {
        await produtoService.cadastrar(formData);
      }
      setFormData({
        nome: '',
        descricao: '',
        id_categoria: 0,
        id_fornecedor: null,
        id_centro_padrao: 0,
        unidade_medida: '',
        preco_custo: 0,
        preco_venda: null,
        qtd_estoque_minimo: 0,
        qtd_estoque_maximo: 0,
        status: 'ATIVO',
      });
      setErrors({});
      onSuccess();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Erro ao salvar produto';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="nome">Nome do Produto *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={errors.nome ? styles.inputError : styles.input}
            placeholder="Ex: Parafuso Allen, Tinta Acrílica"
            maxLength={150}
          />
          {errors.nome && <span className={styles.errorMessage}>{errors.nome}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="id_categoria">Categoria *</label>
          <select
            id="id_categoria"
            name="id_categoria"
            value={formData.id_categoria}
            onChange={handleChange}
            className={errors.id_categoria ? styles.inputError : styles.input}
          >
            <option value={0}>Selecione a categoria</option>
            {categorias.map(cat => (
              <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nome}</option>
            ))}
          </select>
          {errors.id_categoria && <span className={styles.errorMessage}>{errors.id_categoria}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="id_centro_padrao">Centro Padrão *</label>
          <select
            id="id_centro_padrao"
            name="id_centro_padrao"
            value={formData.id_centro_padrao}
            onChange={handleChange}
            className={errors.id_centro_padrao ? styles.inputError : styles.input}
          >
            <option value={0}>Selecione o centro</option>
            {centros.map(c => (
              <option key={c.id_centro} value={c.id_centro}>{c.nome}</option>
            ))}
          </select>
          {errors.id_centro_padrao && <span className={styles.errorMessage}>{errors.id_centro_padrao}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="unidade_medida">Unidade de Medida *</label>
          <select
            id="unidade_medida"
            name="unidade_medida"
            value={formData.unidade_medida}
            onChange={handleChange}
            className={errors.unidade_medida ? styles.inputError : styles.input}
          >
            <option value="">Selecione a unidade</option>
            {UNIDADE_MEDIDA.map(u => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
          {errors.unidade_medida && <span className={styles.errorMessage}>{errors.unidade_medida}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="preco_custo">Preço de Custo (R$) *</label>
          <input
            type="number"
            id="preco_custo"
            name="preco_custo"
            value={formData.preco_custo || ''}
            onChange={handleChange}
            className={errors.preco_custo ? styles.inputError : styles.input}
            placeholder="0.00"
            min="0.01"
            step="0.01"
          />
          {errors.preco_custo && <span className={styles.errorMessage}>{errors.preco_custo}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="preco_venda">Preço de Venda (R$)</label>
          <input
            type="number"
            id="preco_venda"
            name="preco_venda"
            value={formData.preco_venda ?? ''}
            onChange={handleChange}
            className={styles.input}
            placeholder="0.00 (opcional)"
            min="0"
            step="0.01"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="qtd_estoque_minimo">Estoque Mínimo *</label>
          <input
            type="number"
            id="qtd_estoque_minimo"
            name="qtd_estoque_minimo"
            value={formData.qtd_estoque_minimo ?? ''}
            onChange={handleChange}
            className={errors.qtd_estoque_minimo ? styles.inputError : styles.input}
            placeholder="0"
            min="0"
          />
          {errors.qtd_estoque_minimo && <span className={styles.errorMessage}>{errors.qtd_estoque_minimo}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="qtd_estoque_maximo">Estoque Máximo *</label>
          <input
            type="number"
            id="qtd_estoque_maximo"
            name="qtd_estoque_maximo"
            value={formData.qtd_estoque_maximo ?? ''}
            onChange={handleChange}
            className={errors.qtd_estoque_maximo ? styles.inputError : styles.input}
            placeholder="0"
            min="0"
          />
          {errors.qtd_estoque_maximo && <span className={styles.errorMessage}>{errors.qtd_estoque_maximo}</span>}
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao || ''}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Descrição do produto (opcional)"
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
          {loading
            ? 'Salvando...'
            : modoEdicao
              ? 'Atualizar Produto'
              : 'Cadastrar Produto'}
        </button>
      </div>
    </form>
  );
};

export default ProdutoForm;
