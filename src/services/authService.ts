import axios from 'axios';
import type { LoginData, LoginResponse } from '../types/login';

export async function loginRequest(dadosLogin: LoginData): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>('http://localhost:8087/login', dadosLogin, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
}
