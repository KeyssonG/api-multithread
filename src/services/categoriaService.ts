import api from './apiService';
import { API_CONFIG } from '../constants/config';
import type { Categoria, CategoriaFormData } from '../types/produto';
import { ensureArray } from '../utils/arrayUtils';

const ENDPOINT = API_CONFIG.ENDPOINTS.ESTOQUE_CATEGORIAS;

const categoriaService = {
  async listar(): Promise<Categoria[]> {
    const response = await api.get(ENDPOINT);
    return ensureArray<Categoria>(response.data);
  },

  async buscarPorId(id: number): Promise<Categoria> {
    const response = await api.get<Categoria>(`${ENDPOINT}/${id}`);
    return response.data;
  },

  async cadastrar(data: CategoriaFormData): Promise<number> {
    const response = await api.post<number>(ENDPOINT, data);
    return response.data;
  },

  async atualizar(id: number, data: CategoriaFormData): Promise<void> {
    await api.put(`${ENDPOINT}/${id}`, data);
  },

  async desativar(id: number): Promise<void> {
    await api.delete(`${ENDPOINT}/${id}`);
  },
};

export default categoriaService;
