import api from './apiService';
import { API_CONFIG } from '../constants/config';
import type { CentroArmazenamento, CentroArmazenamentoFormData } from '../types/centroArmazenamento';

const ENDPOINT = API_CONFIG.ENDPOINTS.CENTROS_ARMazenAMENTO;

const centroArmazenamentoService = {
  async listar(): Promise<CentroArmazenamento[]> {
    const response = await api.get<CentroArmazenamento[]>(ENDPOINT);
    return response.data;
  },

  async buscarPorId(id: number): Promise<CentroArmazenamento> {
    const response = await api.get<CentroArmazenamento>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  async cadastrar(data: CentroArmazenamentoFormData): Promise<CentroArmazenamento> {
    const response = await api.post<CentroArmazenamento>(ENDPOINT, data);
    return response.data;
  },

  async atualizar(id: number, data: CentroArmazenamentoFormData): Promise<CentroArmazenamento> {
    const response = await api.put<CentroArmazenamento>(`${ENDPOINT}/${id}`, data);
    return response.data;
  },

  async desativar(id: number): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};

export default centroArmazenamentoService;
