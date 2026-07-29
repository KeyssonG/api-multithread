import api from './apiService';
import { API_CONFIG } from '../constants/config';
import type { Produto, ProdutoFormData, Categoria } from '../types/produto';
import { ensureArray } from '../utils/arrayUtils';

const ENDPOINT = API_CONFIG.ENDPOINTS.ESTOQUE_PRODUTOS;
const CATEGORIA_ENDPOINT = API_CONFIG.ENDPOINTS.ESTOQUE_CATEGORIAS;

const normalizarNumero = (valor: any): number => {
  if (valor == null) return 0;
  const num = Number(valor);
  return isNaN(num) ? 0 : num;
};

const normalizeProduto = (p: any): Produto => ({
  id_produto: p.idProduto ?? p.id_produto ?? 0,
  nome: p.nome ?? '',
  descricao: p.descricao ?? '',
  id_categoria: p.idCategoria ?? p.id_categoria ?? 0,
  categoria_nome: p.categoriaNome ?? p.categoria_nome ?? '',
  id_fornecedor: p.idFornecedor ?? p.id_fornecedor ?? undefined,
  id_centro_padrao: p.idCentroPadrao ?? p.id_centro_padrao ?? 0,
  centro_padrao_nome: p.centroPadraoNome ?? p.centro_padrao_nome ?? '',
  unidade_medida: (p.unidadeMedida || p.unidade_medida || '') as Produto['unidade_medida'],
  preco_custo: normalizarNumero(p.precoCusto ?? p.preco_custo),
  preco_venda: p.precoVenda != null || p.preco_venda != null
    ? normalizarNumero(p.precoVenda ?? p.preco_venda)
    : undefined,
  qtd_estoque_atual: normalizarNumero(p.qtdEstoqueAtual ?? p.qtd_estoque_atual),
  qtd_estoque_minimo: normalizarNumero(p.qtdEstoqueMinimo ?? p.qtd_estoque_minimo),
  qtd_estoque_maximo: normalizarNumero(p.qtdEstoqueMaximo ?? p.qtd_estoque_maximo),
  status: (p.status ?? 'ATIVO') as Produto['status'],
  criado_em: p.criadoEm ?? p.criado_em ?? undefined,
  atualizado_em: p.atualizadoEm ?? p.atualizado_em ?? undefined,
});

const normalizarCategoria = (p: any): Categoria => ({
  id_categoria: p.idCategoria ?? p.id_categoria ?? 0,
  nome: p.nome ?? '',
  descricao: p.descricao ?? '',
  status: (p.status ?? 'ATIVO') as Categoria['status'],
  criado_em: p.criadoEm ?? p.criado_em ?? undefined,
  atualizado_em: p.atualizadoEm ?? p.atualizado_em ?? undefined,
});

const produtoService = {
  async listar(): Promise<Produto[]> {
    const response = await api.get(ENDPOINT);
    return ensureArray<any>(response.data).map(normalizeProduto);
  },

  async buscarPorId(id: number): Promise<Produto> {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return normalizeProduto(response.data);
  },

  async cadastrar(data: ProdutoFormData): Promise<number> {
    const response = await api.post<number>(ENDPOINT, data);
    return response.data;
  },

  async atualizar(id: number, data: ProdutoFormData): Promise<void> {
    await api.put(`${ENDPOINT}/${id}`, data);
  },

  async desativar(id: number): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },

  async listarCategorias(): Promise<Categoria[]> {
    const response = await api.get(CATEGORIA_ENDPOINT);
    return ensureArray<any>(response.data).map(normalizarCategoria);
  },
};

export default produtoService;
