import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DepartamentoForm from '../components/DepartamentoForm';
import CustomPopup from '../components/CustomPopup';
import styles from '../styles/Gestao.module.css';
import { ROUTES } from '../constants/config';

const CadastroDepartamento: React.FC = () => {
  const navigate = useNavigate();
  const handleVoltar = () => navigate(ROUTES.GESTAO);

  const [popupConfig, setPopupConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type?: 'error' | 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'error'
  });

  const handleSuccess = () => {
    setPopupConfig({
      isOpen: true,
      title: 'Sucesso',
      message: 'Departamento cadastrado com sucesso!',
      type: 'success'
    });
  };

  const handleError = (msg: string) => {
    setPopupConfig({
      isOpen: true,
      title: 'Erro',
      message: `Erro: ${msg}`,
      type: 'error'
    });
  };

  const closePopup = () => {
    setPopupConfig(prev => ({ ...prev, isOpen: false }));
  };

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
      
      {/* Custom Popup */}
      <CustomPopup
        isOpen={popupConfig.isOpen}
        onClose={closePopup}
        title={popupConfig.title}
        message={popupConfig.message}
        type={popupConfig.type}
      />
    </div>
  );
};

export default CadastroDepartamento;
