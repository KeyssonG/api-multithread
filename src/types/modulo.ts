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
