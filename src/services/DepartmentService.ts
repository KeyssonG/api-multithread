import axios from "axios";
import type { DepartmentData } from "../types/Types";

const BASE_URL = "http://localhost:8086/administracao/departamento";

export const DepartmentService = {
  async cadastrarDepartamento(
    data: DepartmentData,
    token: string
  ): Promise<void> {
    await axios.post(BASE_URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async listarDepartamentos(token: string): Promise<DepartmentData[]> {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default DepartmentService;