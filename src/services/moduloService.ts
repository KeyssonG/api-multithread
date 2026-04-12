import axios from 'axios';
import type { CompanyModuloDTO, LinkUserModuloRequest } from '../types/modulo';

const BASE_URL_MODULOS = 'http://localhost:8086/administracao/empresa/modulos';
const BASE_URL_VINCULO = 'http://localhost:8086/administracao/usuario/modulo';

export const moduloService = {
  async getModulosByCompany(token: string): Promise<CompanyModuloDTO[]> {
    try {
      const response = await axios.get(BASE_URL_MODULOS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar módulos da empresa:', error);
      throw error;
    }
  },

  async vincularUsuarioModulo(data: LinkUserModuloRequest, token: string): Promise<void> {
    try {
      await axios.post(BASE_URL_VINCULO, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Erro ao vincular usuário ao módulo:', error);
      throw error;
    }
  }
};

export default moduloService;
