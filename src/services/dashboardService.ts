import api from './apiService';
import { API_CONFIG } from '../constants/config';
import type { Dashboard, RelatorioValor, RelatorioGiro } from '../types/dashboard';
import { ensureArray } from '../utils/arrayUtils';

const dashboardService = {
  async buscarDashboard(): Promise<Dashboard> {
    const response = await api.get(API_CONFIG.ENDPOINTS.ESTOQUE_DASHBOARD);
    const raw = response.data?.data || response.data || {};
    return {
      totalItens: raw.totalItens ?? raw.total_itens ?? raw.totalItensCount ?? 0,
      estoqueBaixo: raw.estoqueBaixo ?? raw.estoque_baixo ?? 0,
      alertasCriticos: raw.alertasCriticos ?? raw.alertas_criticos ?? 0,
      valorTotalEstoque: raw.valorTotalEstoque ?? raw.valor_total_estoque ?? 0,
    };
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
