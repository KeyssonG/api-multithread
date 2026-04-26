import React, { useState } from "react";
import styles from "../styles/Login.module.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import AuthHeader from "../components/AuthHeader";
import Footer from "../components/Footer";
import CustomPopup from "../components/CustomPopup";
import { ROUTES } from "../constants/config";
import type { LoginFormData } from "../types/common";

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    empresaId: "",
  });
  const [carregando, setCarregando] = useState(false);

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

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    try {
      const data = await authService.login(
        formData.username,
        formData.password,
        formData.empresaId
      );
      const token = data.data.token;
      if (token) {
        login(token, formData.username);
        navigate(ROUTES.DASHBOARD);
      } else {
        setPopupConfig({
          isOpen: true,
          title: 'Erro de Autenticação',
          message: 'Token não encontrado na resposta da API.',
          type: 'error'
        });
      }
    } catch (error: any) {
      console.error("Falha na autenticação:", error);
      
      // Melhor tratamento de erro
      let errorMessage = "Não foi possível fazer o login. Verifique os seus dados.";
      
      if (error.response) {
        // Erro da API
        errorMessage = error.response.data?.message || errorMessage;
      } else if (error.request) {
        // Erro de rede
        errorMessage = "Erro de conexão. Verifique sua internet.";
      }
      
      setPopupConfig({
        isOpen: true,
        title: 'Erro de Login',
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setCarregando(false);
    }
  };

  const closePopup = () => {
    setPopupConfig(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className={styles.container}>
      <AuthHeader />

      <div className={styles.loginBox}>
        <div className={styles.loginHeader}>
          <header>Login</header>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputBox}>
            <input
              className={styles.inputField}
              type="text"
              placeholder="Usuário"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputBox}>
            <input
              className={styles.inputField}
              type="password"
              placeholder="Senha"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputBox}>
            <input
              className={styles.inputField}
              type="number"
              placeholder="ID da Empresa"
              name="empresaId"
              value={formData.empresaId}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.inputSubmit}>
            <button className={styles.submitBtn} type="submit" disabled={carregando}>
              <label>{carregando ? "Carregando..." : "Entrar"}</label>
            </button>
          </div>

          <div className={styles.signUpLink}>
            <p>
              Não tem uma conta? <a href={ROUTES.REGISTER}>Cadastre-se</a>
            </p>
          </div>
          <div className={styles.forgotPassword}>
            <a href="/reset-senha/solicitar">
              Esqueceu a senha?
            </a>
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

export default Login;
