import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DepartamentoForm from '../components/DepartamentoForm';
import styles from '../styles/Gestao.module.css';
import { ROUTES } from '../constants/config';

const CadastroDepartamento: React.FC = () => {
  const navigate = useNavigate();
  const handleVoltar = () => navigate(ROUTES.GESTAO);
  const handleSuccess = () => alert('Departamento cadastrado com sucesso!');
  const handleError = (msg: string) => alert(`Erro: ${msg}`);

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        <div className={styles.sectionHeader}>
          <button className={styles.backButton} onClick={handleVoltar}>
            ← Voltar
          </button>
          <h2 className={styles.sectionTitle}>Cadastro de Departamentos</h2>
        </div>
        <div className={styles.formContainer}>
          <DepartamentoForm onSuccess={handleSuccess} onError={handleError} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CadastroDepartamento;
