// Tipos de formulário
export interface FormData {
  name: string;
  email: string;
  cnpj: string;
  username: string;
  password: string;
}

export interface LoginFormData {
  username: string;
  password: string;
  empresaId: string; // Mantemos empresaId no frontend para clareza
}

// Tipos de resposta da API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface LoginResponse {
  token: string;
  user: {
    username: string;
    name: string;
  };
}

export interface RegisterResponse {
  message: string;
  success: boolean;
}

// Tipos de contexto
export interface AuthContextType {
  token: string | null;
  name: string | null;
  login: (token: string, name: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
} 