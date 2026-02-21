import React, { useState, useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import { funcionarioService } from '../services/funcionarioService';
import DepartmentService from '../services/DepartmentService';
import { useAuth } from '../contexts/AuthContext';
import type { FuncionarioFormData, FuncionarioConsulta } from '../types/funcionario';
import type { DepartmentData } from '../types/Types';
import styles from '../styles/FuncionarioConsulta.module.css';

interface FuncionarioFormProps {
  onSuccess?: () => void;
  onError?: (message: string) => void;
  modoConsulta?: boolean; // Adicionada a propriedade para diferenciar os modos
}

const FuncionarioForm: React.FC<FuncionarioFormProps> = ({ onSuccess, onError, modoConsulta = false }) => {
  const { token } = useAuth();
  const [formData, setFormData] = useState<FuncionarioFormData>({
    nome: '',
    dataNascimento: '',
    telefone: '',
    email: '',
    cpf: '',
    endereco: '',
    sexo: '',
    username: '',
    departamento: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departamentos, setDepartamentos] = useState<DepartmentData[]>([]);
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(false);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [resultados, setResultados] = useState<FuncionarioConsulta[]>([]);
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState('');
  const [selectedFuncionario, setSelectedFuncionario] = useState<FuncionarioConsulta | null>(null);
  const [editingFuncionario, setEditingFuncionario] = useState<FuncionarioConsulta | null>(null);
  const [editFormData, setEditFormData] = useState<FuncionarioConsulta | null>(null);

  useEffect(() => {
    const carregarDepartamentos = async () => {
      setLoadingDepartamentos(true);
      try {
        if (token) {
          const departamentosList = await DepartmentService.listarDepartamentos(token);
          setDepartamentos(departamentosList);
        }
      } catch (error) {
        console.error('Erro ao carregar departamentos:', error);
      } finally {
        setLoadingDepartamentos(false);
      }
    };

    carregarDepartamentos();
  }, [token]);

  // Adicionar listener para tecla ESC
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedFuncionario) {
        setSelectedFuncionario(null);
      }
    };


    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedFuncionario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpar erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Data de nascimento é obrigatória';
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    }

    if (!formData.endereco.trim()) {
      newErrors.endereco = 'Endereço é obrigatório';
    }

    if (!formData.sexo) {
      newErrors.sexo = 'Sexo é obrigatório';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    }

    if (!formData.departamento.trim()) {
      newErrors.departamento = 'Departamento é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!token) {
      const errorMsg = 'Token de autenticação não encontrado. Faça login novamente.';
      onError?.(errorMsg);
      alert(errorMsg);
      return;
    }

    setLoading(true);

    try {
      const response = await funcionarioService.cadastrarFuncionario({
        ...formData,
        sexo: formData.sexo as 'M' | 'F' | 'I',
      }, token);

      if (response && response.success) {
        const successMsg = response.message || 'Funcionário cadastrado com sucesso!';
        alert(successMsg);
        setFormData({
          nome: '',
          dataNascimento: '',
          telefone: '',
          email: '',
          cpf: '',
          endereco: '',
          sexo: '',
          username: '',
          departamento: '',
        });
        onSuccess?.();
      } else {
        const errorMsg = response?.message || 'Erro desconhecido ao cadastrar funcionário';
        onError?.(errorMsg);
        alert(`Erro: ${errorMsg}`);
      }
    } catch (error: any) {
      console.error('Erro completo:', error);
      const errorMessage = error?.message || 'Erro inesperado ao cadastrar funcionário';
      onError?.(errorMessage);
      alert(`Erro: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (modoConsulta) {
    const buscarFuncionarios = async () => {
      try {
        if (!token) {
          throw new Error('Token de autenticação não encontrado. Faça login novamente.');
        }

        if (departamentoSelecionado === "") {
          const data = await funcionarioService.buscarFuncionariosTodosDepartamentos(dataInicio, dataFim, token);
          setResultados(data);
        } else {
          const data = await funcionarioService.buscarFuncionariosPorDepartamento(departamentoSelecionado, dataInicio, dataFim, token);
          setResultados(data);
        }
        // Limpar funcionário selecionado quando buscar novos resultados
        setSelectedFuncionario(null);
      } catch (error: any) {
        console.error('Erro ao buscar funcionários:', error);
        alert(error.message || 'Erro inesperado ao buscar funcionários.');
      }
    };

    const openModal = (funcionario: FuncionarioConsulta) => {
      setSelectedFuncionario(funcionario);
    };

    const closeModal = () => {
      setSelectedFuncionario(null);
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    };

    const formatDate = (dateString: string) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
      } catch {
        return dateString;
      }
    };

    const formatSexo = (sexo: string) => {
      switch (sexo) {
        case 'M': return 'Masculino';
        case 'F': return 'Feminino';
        case 'I': return 'Prefiro não informar';
        default: return sexo;
      }
    };

    const openEditModal = (funcionario: FuncionarioConsulta) => {
      setEditingFuncionario(funcionario);
      setEditFormData({
        id: funcionario.id,
        nome: funcionario.nome,
        departamento: funcionario.departamento,
        telefone: funcionario.telefone,
        email: funcionario.email,
        cpf: funcionario.cpf,
        endereco: funcionario.endereco,
        sexo: funcionario.sexo,
        dataNascimento: funcionario.dataNascimento,
        dataCriacao: funcionario.dataCriacao,
        companyId: funcionario.companyId
      });
    };

    const closeEditModal = () => {
      setEditingFuncionario(null);
      setEditFormData(null);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditFormData(prev => prev ? ({
        ...prev,
        [name]: value,
      }) : null);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!editFormData || !token) {
        return;
      }

      setLoading(true);
      try {
        const response = await funcionarioService.atualizarFuncionario(editFormData, token);
        
        if (response && response.success) {
          alert(response.message || 'Funcionário atualizado com sucesso!');
          closeEditModal();
          // Recarregar a lista de funcionários
          buscarFuncionarios();
        } else {
          alert(`Erro: ${response?.message || 'Erro ao atualizar funcionário'}`);
        }
      } catch (error: any) {
        console.error('Erro ao atualizar funcionário:', error);
        alert(`Erro: ${error?.message || 'Erro inesperado ao atualizar funcionário'}`);
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        <div className={styles.filters}>
          <label htmlFor="departamento">Departamento *</label>
          <select
            id="departamento"
            value={departamentoSelecionado}
            onChange={(e) => setDepartamentoSelecionado(e.target.value)}
            disabled={loadingDepartamentos}
            className={styles.input}
          >
            <option value="">Todos</option>
            {departamentos.map((dept, index) => (
              <option key={index} value={dept.nomeDepartamento}>
                {dept.nomeDepartamento}
              </option>
            ))}
          </select>

          <label>Data Início:</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
          />

          <label>Data Fim:</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
          />

          <button onClick={buscarFuncionarios} className={styles.submitButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Buscar Funcionários
          </button>
        </div>

        {resultados.length > 0 ? (
          <div className={styles.resultBlocks}>
            {resultados.map((funcionario) => (
              <div 
                key={funcionario.id} 
                className={styles.resultBlock}
              >
                <div onClick={() => openModal(funcionario)} className={styles.resultBlockMain}>
                  <div className={styles.funcionarioIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className={styles.funcionarioInfo}>
                    <h4 className={styles.funcionarioNome}>{funcionario.nome}</h4>
                    <div className={styles.funcionarioMeta}>
                      <div><strong>Departamento:</strong> {funcionario.departamento}</div>
                      <div><strong>Data do Registro:</strong> {formatDate(funcionario.dataCriacao)}</div>
                    </div>
                  </div>
                  <div className={styles.expandIcon}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <button 
                  className={styles.editButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(funcionario);
                  }}
                  title="Editar funcionário"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noResultsMessage}>Nenhum registro encontrado para os filtros aplicados.</p>
        )}

        {/* Modal flutuante */}
        {selectedFuncionario && (
          <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>
                  <div className={styles.modalTitleIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className={styles.modalTitleText}>{selectedFuncionario.nome}</h2>
                </div>
                <button className={styles.closeButton} onClick={closeModal}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <div className={styles.modalFields}>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>ID</span>
                  <span className={styles.modalFieldValue}>{selectedFuncionario.id}</span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Nome Completo</span>
                  <span className={styles.modalFieldValue}>{selectedFuncionario.nome}</span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Departamento</span>
                  <span className={styles.modalFieldValue}>{selectedFuncionario.departamento}</span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Telefone</span>
                  <span className={styles.modalFieldValue}>{selectedFuncionario.telefone}</span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Email</span>
                  <span className={styles.modalFieldValue}>{selectedFuncionario.email}</span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>CPF</span>
                  <span className={styles.modalFieldValue}>{selectedFuncionario.cpf}</span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Endereço</span>
                  <span className={styles.modalFieldValue}>{selectedFuncionario.endereco}</span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Sexo</span>
                  <span className={styles.modalFieldValue}>{formatSexo(selectedFuncionario.sexo)}</span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Data de Nascimento</span>
                  <span className={styles.modalFieldValue}>{formatDate(selectedFuncionario.dataNascimento)}</span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Data de Criação</span>
                  <span className={styles.modalFieldValue}>{formatDate(selectedFuncionario.dataCriacao)}</span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>ID da Empresa</span>
                  <span className={styles.modalFieldValue}>{selectedFuncionario.companyId}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingFuncionario && editFormData && (
          <div className={styles.modalOverlay} onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeEditModal();
            }
          }}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>
                  <div className={styles.modalTitleIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className={styles.modalTitleText}>Editar Funcionário</h2>
                </div>
                <button className={styles.closeButton} onClick={closeEditModal}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="edit-nome">Nome Completo *</label>
                    <input
                      type="text"
                      id="edit-nome"
                      name="nome"
                      value={editFormData.nome}
                      onChange={handleEditChange}
                      className={styles.input}
                      placeholder="Digite o nome completo"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="edit-dataNascimento">Data de Nascimento *</label>
                    <input
                      type="date"
                      id="edit-dataNascimento"
                      name="dataNascimento"
                      value={editFormData.dataNascimento}
                      onChange={handleEditChange}
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="edit-telefone">Telefone *</label>
                    <input
                      type="text"
                      id="edit-telefone"
                      name="telefone"
                      value={editFormData.telefone}
                      onChange={handleEditChange}
                      className={styles.input}
                      placeholder="(11) 98765-4321"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="edit-email">E-mail *</label>
                    <input
                      type="email"
                      id="edit-email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      className={styles.input}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="edit-cpf">CPF *</label>
                    <input
                      type="text"
                      id="edit-cpf"
                      name="cpf"
                      value={editFormData.cpf}
                      onChange={handleEditChange}
                      className={styles.input}
                      placeholder="123.456.789-00"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="edit-sexo">Sexo *</label>
                    <select
                      id="edit-sexo"
                      name="sexo"
                      value={editFormData.sexo}
                      onChange={handleEditChange}
                      className={styles.input}
                    >
                      <option value="">Selecione</option>
                      <option value="M">Masculino</option>
                      <option value="F">Feminino</option>
                      <option value="I">Prefiro não informar</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="edit-departamento">Departamento *</label>
                    <select
                      id="edit-departamento"
                      name="departamento"
                      value={editFormData.departamento}
                      onChange={handleEditChange}
                      className={styles.input}
                    >
                      {departamentos.map((dept, index) => (
                        <option key={index} value={dept.nomeDepartamento}>
                          {dept.nomeDepartamento}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                    <label htmlFor="edit-endereco">Endereço Completo *</label>
                    <textarea
                      id="edit-endereco"
                      name="endereco"
                      value={editFormData.endereco}
                      onChange={handleEditChange}
                      className={styles.textarea}
                      placeholder="Rua das Flores, 123, Bairro Jardim, São Paulo - SP"
                      rows={3}
                    />
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className={styles.cancelButton}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="nome">Nome Completo *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={errors.nome ? styles.inputError : styles.input}
              placeholder="Digite o nome completo"
            />
            {errors.nome && <span className={styles.errorMessage}>{errors.nome}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="dataNascimento">Data de Nascimento *</label>
            <input
              type="date"
              id="dataNascimento"
              name="dataNascimento"
              value={formData.dataNascimento}
              onChange={handleChange}
              className={errors.dataNascimento ? styles.inputError : styles.input}
            />
            {errors.dataNascimento && <span className={styles.errorMessage}>{errors.dataNascimento}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="telefone">Telefone *</label>
            <IMaskInput
              mask="(00) 00000-0000"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onAccept={(value: string) => setFormData(prev => ({ ...prev, telefone: value }))}
              className={errors.telefone ? styles.inputError : styles.input}
              placeholder="(11) 98765-4321"
            />
            {errors.telefone && <span className={styles.errorMessage}>{errors.telefone}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? styles.inputError : styles.input}
              placeholder="exemplo@empresa.com"
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="cpf">CPF *</label>
            <IMaskInput
              mask="000.000.000-00"
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onAccept={(value: string) => setFormData(prev => ({ ...prev, cpf: value }))}
              className={errors.cpf ? styles.inputError : styles.input}
              placeholder="123.456.789-00"
            />
            {errors.cpf && <span className={styles.errorMessage}>{errors.cpf}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="sexo">Sexo *</label>
            <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              className={errors.sexo ? styles.inputError : styles.input}
            >
              <option value="">Selecione...</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="I">Prefiro não informar</option>
            </select>
            {errors.sexo && <span className={styles.errorMessage}>{errors.sexo}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username">Nome de Usuário *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? styles.inputError : styles.input}
              placeholder="joaosilva"
            />
            {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="departamento">Departamento *</label>
            <select
              id="departamento"
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              className={errors.departamento ? styles.inputError : styles.input}
              disabled={loadingDepartamentos}
            >
              <option value="">
                {loadingDepartamentos ? 'Carregando departamentos...' : 'Selecione um departamento'}
              </option>
              {departamentos.map((dept, index) => (
                <option key={index} value={dept.nomeDepartamento}>
                  {dept.nomeDepartamento}
                </option>
              ))}
            </select>
            {errors.departamento && <span className={styles.errorMessage}>{errors.departamento}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endereco">Endereço Completo *</label>
            <textarea
              id="endereco"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className={errors.endereco ? styles.textareaError : styles.textarea}
              placeholder="Rua das Flores, 123, Bairro Jardim, São Paulo - SP"
              rows={3}
            />
            {errors.endereco && <span className={styles.errorMessage}>{errors.endereco}</span>}
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="20" y1="8" x2="20" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="23" y1="11" x2="17" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {loading ? 'Cadastrando...' : 'Cadastrar Funcionário'}
          </button>
        </div>
      </form>

      {/*
      <div className={styles.filters}>
        <label>Data Início:</label>
        <input
          type="date"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
        />

        <label>Data Fim:</label>
        <input
          type="date"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
        />

        <label>Departamento:</label>
        <select
          onChange={(e) => buscarPorDepartamento(e.target.value)}
          disabled={loadingDepartamentos}
        >
          <option value="">Selecione um departamento</option>
          {departamentos.map((dept, index) => (
            <option key={index} value={dept.nomeDepartamento}>
              {dept.nomeDepartamento}
            </option>
          ))}
        </select>

        <button onClick={buscarFuncionarios}>Buscar Todos os Departamentos</button>
      </div>
      */}

    </div>
  );
};

export default FuncionarioForm;