import { VALIDATION } from '../constants/config';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
};

export const validateUsername = (username: string): boolean => {
  return username.length >= VALIDATION.USERNAME_MIN_LENGTH;
};

export const validateCNPJ = (cnpj: string): boolean => {
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/[^\d]/g, '');
  
  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) return false;
  
  // Verifica se não são todos os mesmos números
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;
  
  // Validação dos dígitos verificadores
  let sum = 0;
  let weight = 2;
  
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  const digit1 = ((sum % 11) < 2) ? 0 : 11 - (sum % 11);
  
  sum = 0;
  weight = 2;
  
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cleanCNPJ.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  
  const digit2 = ((sum % 11) < 2) ? 0 : 11 - (sum % 11);
  
  return (
    parseInt(cleanCNPJ.charAt(12)) === digit1 &&
    parseInt(cleanCNPJ.charAt(13)) === digit2
  );
};

export const getValidationMessage = (field: string, value: string): string | null => {
  switch (field) {
    case 'email':
      return !validateEmail(value) ? 'E-mail inválido' : null;
    case 'password':
      return !validatePassword(value) ? `Senha deve ter pelo menos ${VALIDATION.PASSWORD_MIN_LENGTH} caracteres` : null;
    case 'username':
      return !validateUsername(value) ? `Usuário deve ter pelo menos ${VALIDATION.USERNAME_MIN_LENGTH} caracteres` : null;
    case 'cnpj':
      return !validateCNPJ(value) ? 'CNPJ inválido' : null;
    default:
      return null;
  }
}; 