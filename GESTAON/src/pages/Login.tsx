import React, { useState } from "react";
import "../styles/Login.css"; 
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
    try{
        const  response = await fetch('http://localhost:8087/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosLogin),
        });
        if (!response.ok) {
            throw new Error('Erro ao realizar o login');
        }

        const data = await response.json();
        console.log('Resposta da API: ', data);

        const token = data.token;

        if (token) {
          login(token);
          navigate('/dashboard')
        } else {
          alert('Token não encontrado na resposta da API.')
        }
    } catch (error) {
        console.error('Falha na autenticação:', error);
        alert('Não foi possível fazer o login. Verifique os seus dados.')
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>GESTAON</h1>
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
        <p>O Sistema de Gestão ideal para o seu négocio.</p>
        <p className="reserved">Todos os direitos reservados © 2025</p>
        <p>Desenvolvimento por keysson</p>
      </footer>
    </div>
  );
};

export default Login;
