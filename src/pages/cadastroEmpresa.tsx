import React, { useState } from "react";
import styles from "../styles/CadastroEmpresa.module.css";
import { useNavigate } from "react-router-dom";
import { IMaskInput } from "react-imask";
import AuthHeader from "../components/AuthHeader";
import Footer from "../components/Footer";
import CustomPopup from "../components/CustomPopup";
import { API_CONFIG, ROUTES } from "../constants/config";
import type { FormData } from "../types/common";

const CadastroEmpresa: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    cnpj: "",
    username: "",
    password: "",
  });

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

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = "Erro ao cadastrar empresa";
        
        try {
          const json = JSON.parse(text);
          errorMessage = json.message || errorMessage;
        } catch {
          // Se não conseguir fazer parse do JSON, usa a mensagem padrão
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Cadastro realizado:", data);
      setPopupConfig({
        isOpen: true,
        title: 'Sucesso',
        message: 'Empresa cadastrada com sucesso!',
        type: 'success'
      });
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (error) {
      console.error("Falha no cadastro:", error);
      setPopupConfig({
        isOpen: true,
        title: 'Erro no Cadastro',
        message: error instanceof Error ? error.message : "Não foi possível realizar o cadastro.",
        type: 'error'
      });
    }
  };

  const closePopup = () => {
    setPopupConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className={styles.container}>
      <AuthHeader />

      <div className={styles["register-box"]}>
        <div className={styles["login-header"]}>
          <header>Cadastrar Empresa</header>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles["input-box"]}>
            <input
              className={styles["input-field"]}
              type="text"
              placeholder="Nome da Empresa"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles["input-box"]}>
            <input
              className={styles["input-field"]}
              type="email"
              placeholder="E-mail Corporativo"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles["input-box"]}>
            <IMaskInput
              mask="00.000.000/0000-00"
              name="cnpj"
              value={formData.cnpj}
              onAccept={(value: string) =>
                setFormData((prev) => ({ ...prev, cnpj: value.replace(/[^\d]/g, "") }))
              }
              className={styles["input-field"]}
              placeholder="CNPJ"
              required
            />
          </div>

          <div className={styles["input-box"]}>
            <input
              className={styles["input-field"]}
              type="text"
              placeholder="Usuário"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles["input-box"]}>
            <input
              className={styles["input-field"]}
              type="password"
              placeholder="Senha"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles["input-submit"]}>
            <button className={styles["submit-btn"]} type="submit">
              <label className={styles["submit-label"]}>Cadastrar</label>
            </button>
          </div>

          <div className={styles["sign-up-link"]}>
            <p>
              Já tem uma conta? <a href={ROUTES.LOGIN}>Entrar</a>
            </p>
          </div>
        </form>
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

export default CadastroEmpresa;
