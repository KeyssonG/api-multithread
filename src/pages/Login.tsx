import React, { useState } from "react";
import styles from "../styles/Login.module.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import AuthHeader from "../components/AuthHeader";
import Footer from "../components/Footer";
import { ROUTES } from "../constants/config";
import type { LoginFormData } from "../types/common";

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
    empresaId: "",
  });
  const [carregando, setCarregando] = useState(false);

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
        formData.password
      );
      const token = data.data.token;
      if (token) {
        login(token, formData.username);
        navigate(ROUTES.DASHBOARD);
      } else {
        alert("Token não encontrado na resposta da API.");
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
      
      alert(errorMessage);
    } finally {
      setCarregando(false);
    }
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
          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <a href="/reset-senha/solicitar" style={{ fontSize: '0.95em', color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}>
              Esqueceu a senha?
            </a>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
