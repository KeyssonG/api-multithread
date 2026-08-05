import api from './apiService';
import { API_CONFIG } from '../constants/config';
import type {
  Localizacao,
  LocalizacaoFormData,
  ProdutoLocalizacao,
  VincularProdutoLocalizacaoRequest,
} from '../types/localizacao';
import { ensureArray } from '../utils/arrayUtils';

const ENDPOINT = API_CONFIG.ENDPOINTS.ESTOQUE_CENTROS;
const PRODUTO_ENDPOINT = API_CONFIG.ENDPOINTS.ESTOQUE_PRODUTOS;

const normalizeLocalizacao = (p: any): Localizacao => ({
  id_localizacao: p.idLocalizacao ?? p.id_localizacao ?? 0,
  id_centro: p.idCentro ?? p.id_centro ?? 0,
  codigo: p.codigo ?? '',
  descricao: p.descricao ?? '',
  corredor: p.corredor ?? '',
  prateleira: p.prateleira ?? '',
  nivel: p.nivel ?? '',
  capacidade_max: p.capacidadeMax != null
    ? Number(p.capacidadeMax)
    : p.capacidade_max != null
      ? Number(p.capacidade_max)
      : undefined,
  status: (p.status ?? 'ATIVO') as Localizacao['status'],
  criado_em: p.criadoEm ?? p.criado_em ?? undefined,
});

const normalizeProdutoLocalizacao = (p: any): ProdutoLocalizacao => ({
  id_produto_localizacao: p.idProdutoLocalizacao ?? p.id_produto_localizacao ?? 0,
  id_produto: p.idProduto ?? p.id_produto ?? 0,
  id_localizacao: p.idLocalizacao ?? p.id_localizacao ?? 0,
  codigo_localizacao: p.codigoLocalizacao ?? p.codigo_localizacao ?? '',
  quantidade: p.quantidade != null ? Number(p.quantidade) : undefined,
  criado_em: p.criadoEm ?? p.criado_em ?? undefined,
});

const localizacaoService = {
  async listarPorCentro(idCentro: number): Promise<Localizacao[]> {
    const response = await api.get(`${ENDPOINT}/${idCentro}/localizacoes`);
    return ensureArray<any>(response.data).map(normalizeLocalizacao);
  },

  async cadastrar(idCentro: number, data: LocalizacaoFormData): Promise<number> {
    const response = await api.post<number>(`${ENDPOINT}/${idCentro}/localizacoes`, data);
    return response.data;
  },

  async vincularProduto(data: VincularProdutoLocalizacaoRequest): Promise<void> {
    await api.post(`${PRODUTO_ENDPOINT}/localizacoes`, data);
  },

  async listarLocalizacoesProduto(idProduto: number): Promise<ProdutoLocalizacao[]> {
    const response = await api.get(`${PRODUTO_ENDPOINT}/${idProduto}/localizacoes`);
    return ensureArray<any>(response.data).map(normalizeProdutoLocalizacao);
  },
};

export default localizacaoService;
