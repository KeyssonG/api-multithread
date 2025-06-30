import React, { useState } from "react";
import styles from "../styles/Login.module.css";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../services/authService";
import type { LoginData } from "../types/login";

const Login = () => {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [empresaId, setEmpresaId] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    const dadosLogin: LoginData = {
      username,
      password: senha,
      idEmpresa: Number(empresaId),
    };

    try {
      const data = await loginRequest(dadosLogin);
      const token = data.token;
      if (token) {
        login(token);
        navigate("/dashboard");
      } else {
        alert("Token não encontrado na resposta da API.");
      }
    } catch (error) {
      console.error("Falha na autenticação:", error);
      alert("Não foi possível fazer o login. Verifique os seus dados.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>MultiThread</h1>
      </header>

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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className={styles.inputBox}>
            <input
              className={styles.inputField}
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className={styles.inputBox}>
            <input
              className={styles.inputField}
              type="number"
              placeholder="ID da Empresa"
              value={empresaId}
              onChange={(e) => setEmpresaId(e.target.value)}
            />
          </div>

          <div className={styles.inputSubmit}>
            <button className={styles.submitBtn} type="submit" disabled={carregando}>
              <label>{carregando ? "Carregando..." : "Entrar"}</label>
            </button>
          </div>

          <div className={styles.signUpLink}>
            <p>
              Não tem uma conta? <a href="/cadastrar">Cadastre-se</a>
            </p>
          </div>
        </form>
      </div>

      <footer className={styles.footer}>
        <p>O Sistema de Gestão ideal para o seu négocio.</p>
        <p className={styles.reserved}>Todos os direitos reservados © 2025</p>
        <p>Desenvolvimento por keysson</p>
      </footer>
    </div>
  );
};

export default Login;
