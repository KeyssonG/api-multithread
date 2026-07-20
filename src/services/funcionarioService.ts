import api from './apiService';
import { API_CONFIG } from '../constants/config';
import type { FuncionarioData, FuncionarioResponse } from '../types/funcionario';

export const funcionarioService = {
  async cadastrarFuncionario(data: FuncionarioData): Promise<FuncionarioResponse> {
    try {
      const response = await api.post(
        API_CONFIG.ENDPOINTS.CADASTRAR_FUNCIONARIO,
        data,
      );
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          message: 'Funcionário cadastrado com sucesso!',
          data: response.data || null,
        };
      } else {
        return {
          success: false,
          message: 'Erro ao cadastrar funcionário',
        };
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           'Erro ao cadastrar funcionário';
        return {
          success: false,
          message: errorMessage,
        };
      } else if (error.request) {
        return {
          success: false,
          message: 'Erro de conexão. Verifique sua internet.',
        };
      } else {
        return {
          success: false,
          message: 'Erro inesperado ao cadastrar funcionário',
        };
      }
    }
  },

  async buscarFuncionariosPorDepartamento(departamento: string, dataInicio?: string, dataFim?: string): Promise<any> {
    try {
      const params = {
        dataInicio: dataInicio || new Date().toISOString().split('T')[0],
        dataFim: dataFim || new Date().toISOString().split('T')[0],
      };
      const response = await api.get(`${API_CONFIG.ENDPOINTS.EMPLOYEES_DEPARTAMENTO_DATE}/${departamento}/date`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar funcionários por departamento:', error);
      throw error;
    }
  },

  async buscarFuncionariosTodosDepartamentos(dataInicio?: string, dataFim?: string): Promise<any> {
    try {
      const params = {
        dataInicio: dataInicio || new Date().toISOString().split('T')[0],
        dataFim: dataFim || new Date().toISOString().split('T')[0],
      };
      const response = await api.get(API_CONFIG.ENDPOINTS.EMPLOYEES_DATE, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar funcionários de todos os departamentos:', error);
      throw error;
    }
  },

  async atualizarFuncionario(data: any): Promise<any> {
    try {
      const response = await api.put(
        API_CONFIG.ENDPOINTS.EMPLOYEE_UPDATE,
        data,
      );
      
      if (response.status >= 200 && response.status < 300) {
        return {
          success: true,
          message: 'Funcionário atualizado com sucesso!',
          data: response.data || null,
        };
      } else {
        return {
          success: false,
          message: 'Erro ao atualizar funcionário',
        };
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           'Erro ao atualizar funcionário';
        return {
          success: false,
          message: errorMessage,
        };
      } else if (error.request) {
        return {
          success: false,
          message: 'Erro de conexão. Verifique sua internet.',
        };
      } else {
        return {
          success: false,
          message: 'Erro inesperado ao atualizar funcionário',
        };
      }
    }
  },

  async deletarFuncionario(companyId: number, userId: number): Promise<any> {
    try {
      await api.delete(
        `/employees/${companyId}/${userId}`,
      );
      
      return {
        success: true,
        message: 'Funcionário excluído com sucesso!',
      };
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           'Erro ao excluir funcionário';
        return {
          success: false,
          message: errorMessage,
        };
      } else if (error.request) {
        return {
          success: false,
          message: 'Erro de conexão. Verifique sua internet.',
        };
      } else {
        return {
          success: false,
          message: 'Erro inesperado ao excluir funcionário',
        };
      }
    }
  },
};
