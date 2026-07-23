import api from './apiService';
import { API_CONFIG } from '../constants/config';
import type { Movimentacao, EstoqueDisponivel } from '../types/movimentacao';
import { ensureArray } from '../utils/arrayUtils';

const ENDPOINT = API_CONFIG.ENDPOINTS.ESTOQUE_MOVIMENTACOES;

interface RegistrarEntradaPayload {
  id_produto: number;
  quantidade: number;
  origem: string;
  numero_nf?: string;
  lote?: string;
  validade?: string;
  observacao?: string;
}

interface RegistrarSaidaPayload {
  id_produto: number;
  quantidade: number;
  origem: string;
  numero_nf?: string;
  observacao?: string;
}

const movimentacaoService = {
  async registrarEntrada(data: RegistrarEntradaPayload): Promise<number> {
    const response = await api.post<number>(`${ENDPOINT}/entrada`, data);
    return response.data;
  },

  async registrarSaida(data: RegistrarSaidaPayload): Promise<void> {
    await api.post(`${ENDPOINT}/saida`, data);
  },

  async listar(tipo?: string, dataInicio?: string, dataFim?: string): Promise<Movimentacao[]> {
    const params: Record<string, string> = {};
    if (tipo) params.tipo = tipo;
    if (dataInicio) params.dataInicio = dataInicio;
    if (dataFim) params.dataFim = dataFim;
    const response = await api.get(ENDPOINT, { params });
    return ensureArray<Movimentacao>(response.data);
  },

  async historicoProduto(idProduto: number): Promise<Movimentacao[]> {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.ESTOQUE_PRODUTOS}/${idProduto}/movimentacoes`);
    return ensureArray<Movimentacao>(response.data);
  },

  async estoqueDisponivel(idProduto: number): Promise<EstoqueDisponivel> {
    const response = await api.get<EstoqueDisponivel>(`${API_CONFIG.ENDPOINTS.ESTOQUE_PRODUTOS}/${idProduto}/disponivel`);
    return response.data;
  },
};

export default movimentacaoService;
