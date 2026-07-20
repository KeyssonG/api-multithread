import api from "./apiService";
import { API_CONFIG } from "../constants/config";
import type { DepartmentData } from "../types/Types";


const BASE_URL = API_CONFIG.ENDPOINTS.ADMIN_DEPARTAMENTO;

export const DepartmentService = {
  async cadastrarDepartamento(
    data: DepartmentData,
  ): Promise<void> {
    await api.post(BASE_URL, data);
  },

  async listarDepartamentos(): Promise<DepartmentData[]> {
    const response = await api.get(BASE_URL);
    return response.data;
  },

  async deletarDepartamento(data: { idDepartamento: number }): Promise<void> {
    await api.delete(BASE_URL, {
      data,
    });
  }
};

export default DepartmentService;
