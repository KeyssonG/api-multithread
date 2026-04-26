export interface CompanyModuloDTO {
  moduloId: number;
  moduloName: string;
  status?: number;
  statusDescription?: string;
}

export interface LinkUserModuloRequest {
  userId: number;
  moduloId: number;
}

export interface UserModuloResponse {
  id: number;
  userId: number;
  userName: string;
  moduloId: number;
  moduloName: string;
}
