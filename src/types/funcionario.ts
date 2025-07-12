export interface FuncionarioData {
  nome: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  cpf: string;
  endereco: string;
  sexo: 'M' | 'F' | 'I';
  username: string;
  departamento: string;
}

export interface FuncionarioFormData {
  nome: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  cpf: string;
  endereco: string;
  sexo: 'M' | 'F' | 'I' | '';
  username: string;
  departamento: string;
}

export interface FuncionarioResponse {
  success: boolean;
  message: string;
  data?: any;
} 