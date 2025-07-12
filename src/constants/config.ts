// Configurações da API
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8085',
  ENDPOINTS: {
    LOGIN: '/login',
    REGISTER: '/register',
  },
} as const;

// Configurações de cores
export const COLORS = {
  PRIMARY: '#000',
  SECONDARY: '#222',
  BACKGROUND: '#dfdfdf',
  TEXT: {
    PRIMARY: '#333',
    SECONDARY: '#555',
    LIGHT: '#bbb',
    WHITE: '#fff',
  },
} as const;

// Configurações de rotas
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  REGISTER: '/cadastrar',
  GESTAO: '/gestao',
} as const;

// Configurações de validação
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
} as const; 