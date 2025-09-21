import axios from 'axios';
import type { FuncionarioData, FuncionarioResponse } from '../types/funcionario';

export const funcionarioService = {
  async cadastrarFuncionario(data: FuncionarioData, token: string): Promise<FuncionarioResponse> {
    try {
      const response = await axios.post(
        'http://localhost:8087/cadastrar/funcionario-cliente',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      // Se o backend retorna void (sem resposta), consideramos sucesso
      // Se retorna uma resposta, processamos normalmente
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
        // Erro da API
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           'Erro ao cadastrar funcionário';
        return {
          success: false,
          message: errorMessage,
        };
      } else if (error.request) {
        // Erro de rede
        return {
          success: false,
          message: 'Erro de conexão. Verifique sua internet.',
        };
      } else {
        // Outro erro
        return {
          success: false,
          message: 'Erro inesperado ao cadastrar funcionário',
        };
      }
    }
  },

  async buscarFuncionariosPorDepartamento(departamento: string, dataInicio?: string, dataFim?: string, token?: string): Promise<any> {
    try {
      const params = {
        dataInicio: dataInicio || new Date().toISOString().split('T')[0],
        dataFim: dataFim || new Date().toISOString().split('T')[0],
      };
      const response = await axios.get(`http://localhost:8085/employees/${departamento}/date`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar funcionários por departamento:', error);
      throw error;
    }
  },

  async buscarFuncionariosTodosDepartamentos(dataInicio?: string, dataFim?: string, token?: string): Promise<any> {
    try {
      const params = {
        dataInicio: dataInicio || new Date().toISOString().split('T')[0],
        dataFim: dataFim || new Date().toISOString().split('T')[0],
      };
      const response = await axios.get('http://localhost:8085/employees/date', {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar funcionários de todos os departamentos:', error);
      throw error;
    }
  },
};