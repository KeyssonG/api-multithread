export interface CentroArmazenamento {
  id_centro: number;
  nome: string;
  descricao?: string;
  tipo: 'DEPOSITO' | 'FILIAL' | 'CD';
  cep: string;
  endereco: string;
  cidade: string;
  uf: string;
  id_responsavel?: number;
  nome_responsavel?: string;
  status: 'ATIVO' | 'INATIVO';
  criado_em?: string;
  atualizado_em?: string;
}

export interface CentroArmazenamentoFormData {
  nome: string;
  descricao?: string;
  tipo: string;
  cep: string;
  endereco: string;
  cidade: string;
  uf: string;
  id_responsavel?: number | null;
  status: string;
}

export const UF_LIST = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO'
] as const;

export const TIPO_CENTRO = [
  { value: 'DEPOSITO', label: 'Depósito' },
  { value: 'FILIAL', label: 'Filial' },
  { value: 'CD', label: 'Centro de Distribuição' },
] as const;
