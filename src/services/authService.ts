
import axios from 'axios';

const authApi = axios.create({
  baseURL: 'http://localhost:8087',
});

type LoginResponse = {
  token: string;
  [key: string]: any;
};

export const authService = {
  async login(username: string, password: string): Promise<{ data: LoginResponse }> {
    const response = await authApi.post<LoginResponse>('/login-multithread', { username, password });
    localStorage.setItem('token', response.data.token);
    return response;
  },

  async changePassword(token: string, newPassword: string) {
    const response = await authApi.put('/alterar/senha', { newPassword }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async solicitarResetSenha(email: string) {
    return authApi.post('/reset-senha/solicitar', { email });
  },

  async confirmarResetSenha(token: string, newPassword: string) {
    return authApi.post('/reset-senha/confirmar', { token, newPassword });
  }
};
