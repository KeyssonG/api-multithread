import React, { useState } from "react";
import styles from "../styles/Login.module.css"; // Import com 'styles'
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [empresaId, setEmpresaId] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dadosLogin = {
      username,
      password: senha,
      idEmpresa: Number(empresaId),
    };

    console.log("Dados de login:", dadosLogin);
    try {
      const response = await fetch("http://localhost:8087/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosLogin),
      });

      if (!response.ok) {
        throw new Error("Erro ao realizar o login");
      }

      const data = await response.json();
      console.log("Resposta da API: ", data);

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
            <button className={styles.submitBtn} type="submit">
              <label>Entrar</label>
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
