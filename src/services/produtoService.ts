import api from './apiService';
import { API_CONFIG } from '../constants/config';
import type { Produto, ProdutoFormData, Categoria } from '../types/produto';
import { ensureArray } from '../utils/arrayUtils';

const ENDPOINT = API_CONFIG.ENDPOINTS.ESTOQUE_PRODUTOS;
const CATEGORIA_ENDPOINT = API_CONFIG.ENDPOINTS.ESTOQUE_CATEGORIAS;

const produtoService = {
  async listar(): Promise<Produto[]> {
    const response = await api.get(ENDPOINT);
    return ensureArray<Produto>(response.data);
  },

  async buscarPorId(id: number): Promise<Produto> {
    const response = await api.get<Produto>(`${ENDPOINT}/${id}`);
    return response.data;
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
    return ensureArray<Categoria>(response.data);
  },
};

export default produtoService;
