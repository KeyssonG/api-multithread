import api from './apiService';
import { API_CONFIG } from '../constants/config';
import type { Dashboard, RelatorioValor, RelatorioGiro } from '../types/dashboard';
import { ensureArray } from '../utils/arrayUtils';

const dashboardService = {
  async buscarDashboard(): Promise<Dashboard> {
    const response = await api.get<Dashboard>(API_CONFIG.ENDPOINTS.ESTOQUE_DASHBOARD);
    return response.data;
  },

  async relatorioValor(): Promise<RelatorioValor[]> {
    const response = await api.get(API_CONFIG.ENDPOINTS.ESTOQUE_RELATORIO_VALOR);
    return ensureArray<RelatorioValor>(response.data);
  },

  async relatorioGiro(): Promise<RelatorioGiro[]> {
    const response = await api.get(API_CONFIG.ENDPOINTS.ESTOQUE_RELATORIO_GIRO);
    return ensureArray<RelatorioGiro>(response.data);
  },
};

export default dashboardService;
