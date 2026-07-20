import React, { useState, useEffect } from "react";
import centroArmazenamentoService from "../services/centroArmazenamentoService";
import { UF_LIST, TIPO_CENTRO } from "../types/centroArmazenamento";
import type { CentroArmazenamentoFormData } from "../types/centroArmazenamento";
import styles from "../styles/CentroArmazenamento.module.css";

interface Props {
  onSuccess: () => void;
  onError: (msg: string) => void;
  dadosIniciais?: CentroArmazenamentoFormData;
  idEdicao?: number;
  modoEdicao?: boolean;
}

const CentroArmazenamentoForm: React.FC<Props> = ({
  onSuccess,
  onError,
  dadosIniciais,
  idEdicao,
  modoEdicao = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CentroArmazenamentoFormData>({
    nome: '',
    descricao: '',
    tipo: '',
    cep: '',
    endereco: '',
    cidade: '',
    uf: '',
    id_responsavel: null,
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

  const handleChangeCep = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length > 5) {
      value = value.slice(0, 5) + '-' + value.slice(5);
    }
    setFormData(prev => ({ ...prev, cep: value }));
    if (errors.cep) {
      setErrors(prev => ({ ...prev, cep: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome do centro é obrigatório';
    } else if (formData.nome.trim().length > 120) {
      newErrors.nome = 'Nome deve ter no máximo 120 caracteres';
    }

    if (!formData.tipo) {
      newErrors.tipo = 'Tipo é obrigatório';
    }

    const cepLimpo = formData.cep.replace(/\D/g, '');
    if (!cepLimpo) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (cepLimpo.length !== 8) {
      newErrors.cep = 'CEP deve ter 8 dígitos';
    }

    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    }

    if (!formData.cidade.trim()) {
      newErrors.cidade = 'Cidade é obrigatória';
    } else if (formData.cidade.trim().length > 100) {
      newErrors.cidade = 'Cidade deve ter no máximo 100 caracteres';
    }

    if (!formData.uf) {
      newErrors.uf = 'UF é obrigatória';
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
        await centroArmazenamentoService.atualizar(idEdicao, formData);
      } else {
        await centroArmazenamentoService.cadastrar(formData);
      }
      setFormData({
        nome: '',
        descricao: '',
        tipo: '',
        cep: '',
        endereco: '',
        cidade: '',
        uf: '',
        id_responsavel: null,
        status: 'ATIVO',
      });
      setErrors({});
      onSuccess();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Erro ao salvar centro de armazenamento';
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="nome">Nome do Centro *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            className={errors.nome ? styles.inputError : styles.input}
            placeholder="Ex: Depósito Central, Filial SP"
            maxLength={120}
          />
          {errors.nome && <span className={styles.errorMessage}>{errors.nome}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="tipo" className={styles.labelWithHelp}>
            Tipo *
            <span className={styles.helpTooltip} tabIndex={0}>
              <span className={styles.helpIcon}>?</span>
              <span className={styles.helpContent}>
                <strong>Depósito</strong> — Armazenamento interno da empresa para guarda de mercadorias.<br/>
                <strong>Filial</strong> — Unidade operacional em outra cidade/estado que mantém seu próprio estoque.<br/>
                <strong>CD</strong> — Centro de Distribuição: ponto central que recebe e redistribui produtos para filiais e clientes.
              </span>
            </span>
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className={errors.tipo ? styles.inputError : styles.input}
          >
            <option value="">Selecione o tipo</option>
            {TIPO_CENTRO.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          {errors.tipo && <span className={styles.errorMessage}>{errors.tipo}</span>}
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao || ''}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Descrição do centro de armazenamento (opcional)"
            rows={3}
          />
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
          <label htmlFor="endereco">Endereço *</label>
          <input
            type="text"
            id="endereco"
            name="endereco"
            value={formData.endereco}
            onChange={handleChange}
            className={errors.endereco ? styles.inputError : styles.input}
            placeholder="Endereço completo do centro"
          />
          {errors.endereco && <span className={styles.errorMessage}>{errors.endereco}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cep">CEP *</label>
          <input
            type="text"
            id="cep"
            name="cep"
            value={formData.cep}
            onChange={handleChangeCep}
            className={errors.cep ? styles.inputError : styles.input}
            placeholder="00000-000"
            maxLength={9}
          />
          {errors.cep && <span className={styles.errorMessage}>{errors.cep}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="cidade">Cidade *</label>
          <input
            type="text"
            id="cidade"
            name="cidade"
            value={formData.cidade}
            onChange={handleChange}
            className={errors.cidade ? styles.inputError : styles.input}
            placeholder="Nome da cidade"
            maxLength={100}
          />
          {errors.cidade && <span className={styles.errorMessage}>{errors.cidade}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="uf">UF *</label>
          <select
            id="uf"
            name="uf"
            value={formData.uf}
            onChange={handleChange}
            className={errors.uf ? styles.inputError : styles.input}
          >
            <option value="">Selecione a UF</option>
            {UF_LIST.map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
          {errors.uf && <span className={styles.errorMessage}>{errors.uf}</span>}
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
              ? 'Atualizar Centro'
              : 'Cadastrar Centro'}
        </button>
      </div>
    </form>
  );
};

export default CentroArmazenamentoForm;
