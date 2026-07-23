export interface Inventario {
  id_inventario: number;
  id_produto: number;
  produto_nome: string;
  qtd_sistema: number;
  qtd_fisica: number | null;
  divergencia: number | null;
  status: 'PENDENTE' | 'AJUSTADO' | 'REJEITADO';
  id_usuario: number;
  observacao?: string;
  criado_em?: string;
}
