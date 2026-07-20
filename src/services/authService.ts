
import api from './apiService';
import { API_CONFIG } from '../constants/config';

type LoginResponse = {
  token: string;
  [key: string]: any;
};

export const authService = {
  async login(username: string, password: string, empresaId: string): Promise<{ data: LoginResponse }> {
    const response = await api.post<LoginResponse>(API_CONFIG.ENDPOINTS.LOGIN, {
      username,
      password,
      idEmpresa: empresaId,
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return { data: response.data };
  },

  async changePassword(token: string, newPassword: string) {
    const response = await api.put(API_CONFIG.ENDPOINTS.ALTERAR_SENHA, { newPassword }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async solicitarResetSenha(email: string) {
    return api.post(API_CONFIG.ENDPOINTS.RESET_SENHA_SOLICITAR, { email });
  },

  async confirmarResetSenha(token: string, newPassword: string) {
    return api.post(API_CONFIG.ENDPOINTS.RESET_SENHA_CONFIRMAR, { token, newPassword });
  }
};
