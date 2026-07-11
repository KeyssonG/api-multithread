// Configurações da API
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:8085';
  }
  return 'http://localhost:31000';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    LOGIN: '/login',
    REGISTER: '/register',
    LOGIN_MULTITHREAD: '/login-multithread',
    ALTERAR_SENHA: '/alterar/senha',
    RESET_SENHA_SOLICITAR: '/reset-senha/solicitar',
    RESET_SENHA_CONFIRMAR: '/reset-senha/confirmar',
    CADASTRAR_FUNCIONARIO: '/cadastrar/funcionario-cliente',
    EMPLOYEE_UPDATE: '/employee/update',
    EMPLOYEES_DATE: '/employees/date',
    EMPLOYEES_DEPARTAMENTO_DATE: '/employees',
    ADMIN_DEPARTAMENTO: '/administracao/departamento',
    ADMIN_EMPRESA_MODULOS: '/administracao/empresa/modulos',
    ADMIN_USUARIO_MODULO: '/administracao/usuario/modulo',
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
  GESTAO_ACESSO: '/gestao-acesso',
  GESTAO_ESTOQUE: '/gestao-estoque',
  RESET_SENHA_SOLICITAR: '/reset-senha/solicitar',
  RESET_SENHA_CONFIRMAR: '/reset-senha/confirmar',
} as const;

// Configurações de validação
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
} as const; 