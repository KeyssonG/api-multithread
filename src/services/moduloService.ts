import api from './apiService';
import { API_CONFIG } from '../constants/config';
import type { CompanyModuloDTO, LinkUserModuloRequest, UserModuloResponse } from '../types/modulo';
import { ensureArray } from '../utils/arrayUtils';

const BASE_URL_MODULOS = API_CONFIG.ENDPOINTS.ADMIN_EMPRESA_MODULOS;
const BASE_URL_VINCULO = API_CONFIG.ENDPOINTS.ADMIN_USUARIO_MODULO;

export const moduloService = {
  async getModulosByCompany(): Promise<CompanyModuloDTO[]> {
    try {
      const response = await api.get(BASE_URL_MODULOS);
      return ensureArray<CompanyModuloDTO>(response.data);
    } catch (error) {
      console.error('Erro ao buscar módulos da empresa:', error);
      throw error;
    }
  },

  async vincularUsuarioModulo(data: LinkUserModuloRequest): Promise<void> {
    try {
      await api.post(BASE_URL_VINCULO, data);
    } catch (error) {
      console.error('Erro ao vincular usuário ao módulo:', error);
      throw error;
    }
  },

  async getUserModulos(): Promise<UserModuloResponse[]> {
    try {
      const response = await api.get(BASE_URL_VINCULO);
      return ensureArray<UserModuloResponse>(response.data);
    } catch (error) {
      console.error('Erro ao buscar vínculos de usuários:', error);
      throw error;
    }
  },

  async removerVinculoUsuarioModulo(userId: number, moduloId: number): Promise<void> {
    try {
      await api.delete(BASE_URL_VINCULO, {
        data: {
          userId,
          moduloId
        }
      });
    } catch (error) {
      console.error('Erro ao remover vínculo:', error);
      throw error;
    }
  }
};

export default moduloService;
