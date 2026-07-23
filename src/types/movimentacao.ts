export interface Movimentacao {
  id_movimentacao: number;
  id_produto: number;
  produto_nome: string;
  tipo: 'ENTRADA' | 'SAIDA' | 'AJUSTE';
  origem: string;
  quantidade: number;
  numero_nf?: string;
  lote?: string;
  validade?: string;
  observacao?: string;
  id_usuario: number;
  criado_em?: string;
}

export interface EstoqueDisponivel {
  id_produto: number;
  produto_nome: string;
  qtd_estoque_atual: number;
  qtd_estoque_minimo: number;
  qtd_estoque_maximo: number;
  status_estoque: 'OK' | 'BAIXO' | 'CRITICO';
  valor_total: number;
}

export const ORIGEM_ENTRADA = [
  { value: 'COMPRA', label: 'Compra' },
  { value: 'TRANSFERENCIA', label: 'Transferência' },
  { value: 'DEVOLUCAO', label: 'Devolução' },
] as const;

export const ORIGEM_SAIDA = [
  { value: 'VENDA', label: 'Venda' },
  { value: 'CONSUMO_INTERNO', label: 'Consumo Interno' },
  { value: 'TRANSFERENCIA', label: 'Transferência' },
  { value: 'PERDA', label: 'Perda / Avaria' },
] as const;
