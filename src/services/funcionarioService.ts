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
}; 