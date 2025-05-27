import React, { useState } from "react";
import styles from "../styles/CadastroEmpresa.module.css"; // Correção da importação
import { useNavigate } from "react-router-dom";

interface FormData {
  name: string;
  email: string;
  cnpj: string;
  username: string;
  password: string;
}

const CadastroEmpresa: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    cnpj: "",
    username: "",
    password: "",
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
      const response = await fetch("http://localhost:8085/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cadastrar empresa");
      }

      const data = await response.json();
      console.log("Cadastro realizado:", data);
      alert("Empresa cadastrada com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error("Falha no cadastro:", error);
      alert(error instanceof Error ? error.message : "Não foi possível realizar o cadastro.");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>MultiThread</h1>
      </header>

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
            <input
              className={styles["input-field"]}
              type="text"
              placeholder="CNPJ"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
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
              Já tem uma conta? <a href="/login">Entrar</a>
            </p>
          </div>
        </form>
      </div>

      <footer className={styles.footer}>
        <p>O Sistema de Gestão ideal para o seu negócio.</p>
        <p className={styles.reserved}>Todos os direitos reservados © 2025</p>
        <p>Desenvolvimento por keysson</p>
      </footer>
    </div>
  );
};

export default CadastroEmpresa;
