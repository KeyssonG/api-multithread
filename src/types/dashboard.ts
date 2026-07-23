export interface Dashboard {
  totalItens: number;
  estoqueBaixo: number;
  alertasCriticos: number;
  valorTotalEstoque: number;
}

export interface RelatorioValor {
  id_categoria: number;
  categoria_nome: string;
  total_produtos: number;
  quantidade_total: number;
  valor_total: number;
}

export interface RelatorioGiro {
  id_produto: number;
  produto_nome: string;
  categoria_nome: string;
  qtd_estoque_atual: number;
  total_entradas: number;
  total_saidas: number;
  giro_estoque: number;
}
