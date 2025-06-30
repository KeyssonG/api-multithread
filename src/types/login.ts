export interface LoginData {
  username: string;
  password: string;
  idEmpresa: number;
}

export interface LoginResponse {
  token: string;
  // Adicione outros campos retornados pela API, se necessário
}
