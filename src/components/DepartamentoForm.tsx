import React, { useState } from "react";
import departmentService from "../services/departmentService";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/FuncionarioForm.module.css";
import type { DepartmentData } from "../types/Types";

interface Props {
  onSuccess: () => void;
  onError: (msg: string) => void;
}

const DepartamentoForm: React.FC<Props> = ({ onSuccess, onError }) => {
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { token } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setNome(value);
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors.nome) {
      setErrors(prev => ({
        ...prev,
        nome: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome do departamento é obrigatório';
    } else if (nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const departamentoData: DepartmentData = { nomeDepartamento: nome.trim() };
    try {
      await departmentService.cadastrarDepartamento(departamentoData, token!);
      setNome('');
      setErrors({});
      onSuccess();
      alert('Departamento cadastrado com sucesso!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
                          err.message || 
                          "Erro ao cadastrar departamento";
      onError(errorMessage);
      alert(`Erro: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label htmlFor="nome">Nome do Departamento *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={nome}
            onChange={handleChange}
            className={errors.nome ? styles.inputError : styles.input}
            placeholder="Digite o nome do departamento"
          />
          {errors.nome && <span className={styles.errorMessage}>{errors.nome}</span>}
        </div>
      </div>

      <div className={styles.submitContainer}>
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar Departamento"}
        </button>
      </div>
    </form>
  );
};

export default DepartamentoForm;