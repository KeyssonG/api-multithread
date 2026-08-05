export interface Localizacao {
  id_localizacao: number;
  id_centro: number;
  codigo: string;
  descricao?: string;
  corredor?: string;
  prateleira?: string;
  nivel?: string;
  capacidade_max?: number;
  status: 'ATIVO' | 'INATIVO';
  criado_em?: string;
}

export interface LocalizacaoFormData {
  codigo: string;
  descricao?: string;
  corredor?: string;
  prateleira?: string;
  nivel?: string;
  capacidade_max?: number | null;
  status?: string;
}

export interface ProdutoLocalizacao {
  id_produto_localizacao: number;
  id_produto: number;
  id_localizacao: number;
  codigo_localizacao?: string;
  quantidade?: number;
  criado_em?: string;
}

export interface VincularProdutoLocalizacaoRequest {
  id_produto: number;
  id_localizacao: number;
  quantidade?: number | null;
}
