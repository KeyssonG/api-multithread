export interface Produto {
  id_produto: number;
  nome: string;
  descricao?: string;
  id_categoria: number;
  categoria_nome?: string;
  id_fornecedor?: number;
  id_centro_padrao: number;
  centro_padrao_nome?: string;
  unidade_medida: 'UN' | 'KG' | 'LT' | 'M2' | 'CX';
  preco_custo: number;
  preco_venda?: number;
  qtd_estoque_atual: number;
  qtd_estoque_minimo: number;
  qtd_estoque_maximo: number;
  status: 'ATIVO' | 'INATIVO';
  criado_em?: string;
  atualizado_em?: string;
}

export interface ProdutoFormData {
  nome: string;
  descricao?: string;
  id_categoria: number;
  id_fornecedor?: number | null;
  id_centro_padrao: number;
  unidade_medida: string;
  preco_custo: number;
  preco_venda?: number | null;
  qtd_estoque_minimo: number;
  qtd_estoque_maximo: number;
  status?: string;
}

export interface Categoria {
  id_categoria: number;
  nome: string;
  descricao?: string;
  criado_em?: string;
}

export const UNIDADE_MEDIDA = [
  { value: 'UN', label: 'Unidade (UN)' },
  { value: 'KG', label: 'Quilograma (KG)' },
  { value: 'LT', label: 'Litro (LT)' },
  { value: 'M2', label: 'Metro Quadrado (M2)' },
  { value: 'CX', label: 'Caixa (CX)' },
] as const;
