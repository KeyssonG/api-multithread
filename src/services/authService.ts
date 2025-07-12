import axios from 'axios';
import type { LoginResponse } from '../types/common';

export const authService = {
  async login(username: string, password: string, empresaId: string): Promise<{ data: LoginResponse }> {
    const response = await axios.post<LoginResponse>('http://localhost:8087/login', {
      username,
      password,
      idEmpresa: empresaId, // Corrigido para idEmpresa
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { data: response.data };
  },
};
