import React, { useState } from "react";
import "../styles/Login.css"; // Caminho para o seu CSS

const Login = () => {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [empresaId, setEmpresaId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const dadosLogin = {
      username,
      senha,
      empresaId: Number(empresaId),
    };

    console.log("Dados de login:", dadosLogin);
    // Aqui virá a chamada para API futuramente
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Sistema de Gestão</h1>
      </header>

      <div className="login-box">
        <div className="login-header">
          <header>Login</header>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              className="input-field"
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-box">
            <input
              className="input-field"
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div className="input-box">
            <input
              className="input-field"
              type="number"
              placeholder="ID da Empresa"
              value={empresaId}
              onChange={(e) => setEmpresaId(e.target.value)}
            />
          </div>

          <div className="input-submit">
            <button className="submit-btn" type="submit">
              <label>Entrar</label>
            </button>
          </div>

          <div className="sign-up-link">
            <p>
              Não tem uma conta? <a href="#">Cadastre-se</a>
            </p>
          </div>
        </form>
      </div>

      <footer>
        <p>Sistema de Gestão - Desenvolvido por Keysson</p>
        <p className="reserved">Todos os direitos reservados © 2025</p>
      </footer>
    </div>
  );
};

export default Login;
