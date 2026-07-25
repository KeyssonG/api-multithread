import React, { useState, useEffect } from "react";
import categoriaService from "../services/categoriaService";
import type { CategoriaFormData } from "../types/produto";
import styles from "../styles/Estoque.module.css";

interface Props {
  onSuccess: () => void;
  onError: (msg: string) => void;
  dadosIniciais?: CategoriaFormData;
  idEdicao?: number;
  modoEdicao?: boolean;
}

const CategoriaForm: React.FC<Props> = ({
  onSuccess,
  onError,
  dadosIniciais,
  idEdicao,
  modoEdicao = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CategoriaFormData>({
    nome: '',
    descricao: '',
    status: 'ATIVO',
  });

  useEffect(() => {
    if (dadosIniciais && modoEdicao) {
      setFormData(dadosIniciais);
    }
  }, [dadosIniciais, modoEdicao]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da categoria é obrigatório';
    } else if (formData.nome.trim().length > 100) {
      newErrors.nome = 'Nome deve ter no máximo 100 caracteres';
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
        await categoriaService.atualizar(idEdicao, formData);
      } else {
        await categoriaService.cadastrar(formData);
      }
      setFormData({
        nome: '',
        descricao: '',
        status: 'ATIVO',
      });
      setErrors({});
      onSuccess();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Erro ao salvar categoria';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="nome">Nome da Categoria *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={errors.nome ? styles.inputError : styles.input}
            placeholder="Ex: Materiais Elétricos, Hidráulica"
            maxLength={100}
          />
          {errors.nome && <span className={styles.errorMessage}>{errors.nome}</span>}
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

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao || ''}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Descrição da categoria (opcional)"
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
          {loading
            ? 'Salvando...'
            : modoEdicao
              ? 'Atualizar Categoria'
              : 'Cadastrar Categoria'}
        </button>
      </div>
    </form>
  );
};

export default CategoriaForm;
