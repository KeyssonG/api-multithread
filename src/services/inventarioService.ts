import api from './apiService';
import { API_CONFIG } from '../constants/config';
import type { Inventario } from '../types/inventario';
import { ensureArray } from '../utils/arrayUtils';

const ENDPOINT = API_CONFIG.ENDPOINTS.ESTOQUE_INVENTARIO;

const inventarioService = {
  async iniciar(idProduto: number): Promise<number> {
    const response = await api.post<number>(ENDPOINT, null, { params: { idProduto } });
    return response.data;
  },

  async registrarContagem(id: number, qtdFisica: number, observacao?: string): Promise<void> {
    await api.post(`${ENDPOINT}/${id}/contagem`, { qtd_fisica: qtdFisica, observacao });
  },

  async listarDivergencias(): Promise<Inventario[]> {
    const response = await api.get(`${ENDPOINT}/divergencias`);
    return ensureArray<Inventario>(response.data);
  },

  async ajustar(id: number): Promise<void> {
    await api.put(`${ENDPOINT}/${id}/ajustar`);
  },
};

export default inventarioService;
