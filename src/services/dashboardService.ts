import api from './apiService';
import { API_CONFIG } from '../constants/config';
import type { Dashboard, RelatorioValor, RelatorioGiro } from '../types/dashboard';

const dashboardService = {
  async buscarDashboard(): Promise<Dashboard> {
    const response = await api.get<Dashboard>(API_CONFIG.ENDPOINTS.ESTOQUE_DASHBOARD);
    return response.data;
  },

  async relatorioValor(): Promise<RelatorioValor[]> {
    const response = await api.get<RelatorioValor[]>(API_CONFIG.ENDPOINTS.ESTOQUE_RELATORIO_VALOR);
    return response.data;
  },

  async relatorioGiro(): Promise<RelatorioGiro[]> {
    const response = await api.get<RelatorioGiro[]>(API_CONFIG.ENDPOINTS.ESTOQUE_RELATORIO_GIRO);
    return response.data;
  },
};

export default dashboardService;
