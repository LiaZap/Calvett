// Shared domain types for the financial system (hospital).

export type FornecedorCategoria =
  | "Medicações"
  | "Materiais"
  | "Campos e Aventais"
  | "Fios"
  | "Curativos"
  | "Assepsia"
  | "Soluções"
  | "CME"
  | "Gases Medicinais";

export interface Paciente {
  id: string;
  nome: string;
  cpf: string;
  telefone?: string;
  email?: string;
  dataCadastro: string;
}

export interface Fornecedor {
  id: string;
  nome: string;
  cnpj?: string;
  categoria: FornecedorCategoria;
  contato?: string;
  dataCadastro: string;
}

export type AgendamentoTipo =
  | "Consulta Pré-Operatória"
  | "Operação"
  | "Pós-Operatória";

export interface Agendamento {
  id: string;
  tipo: AgendamentoTipo;
  data: string;
  dia: string;
}

export type CirurgiaStatus =
  | "Agendada"
  | "Realizada"
  | "Finalizada"
  | "Cancelada";

export interface Cirurgia {
  id: string;
  pacienteId: string;
  cirurgiao: string;
  procedimentos: string[];
  data: string;
  valor: number;
  status: CirurgiaStatus;
  agendamentos: Agendamento[];
}

export type LancamentoTipo = "Receita" | "Despesa";

export type LancamentoStatus =
  | "Pago"
  | "Pendente"
  | "Parcela"
  | "Agendado"
  | "Atrasado";

export type Banco = "C6 Bank" | "Stone PF" | string;

export interface Comentario {
  id: string;
  autorNome: string;
  autorAvatar?: string;
  texto: string;
  data: string;
}

export interface Parcelamento {
  total: number;
  atual: number;
}

export interface Lancamento {
  id: string;
  tipo: LancamentoTipo;
  nome: string;
  descricao: string;
  categoria: string;
  banco: Banco;
  data: string;
  valor: number;
  status: LancamentoStatus;
  statusDetalhe?: string;
  pacienteId?: string;
  fornecedorId?: string;
  cirurgiaId?: string;
  referencia?: string;
  notaFiscalId?: string;
  vencimento?: string;
  competencia?: string;
  comentarios?: Comentario[];
  parcelamento?: Parcelamento;
}

export type MedicacaoStatus =
  | "Disponível"
  | "Baixa"
  | "Esgotado"
  | "Vencido";

export interface MedicacaoFornecedor {
  fornecedorId: string;
  marca: string;
  minimo: number;
  preco: number;
  minimoPreco: number;
}

export interface MedicacaoCompra {
  id: string;
  fornecedorId: string;
  unidades: number;
  marca: string;
  validade: string;
  preco: number;
  data: string;
}

export type MedicacaoForma =
  | "Comprimido"
  | "Cápsula"
  | "Ampola"
  | "Frasco"
  | "Pomada"
  | "Solução"
  | "Pó";

export interface Medicacao {
  id: string;
  nome: string;
  dosagem: string;
  status: MedicacaoStatus;
  fornecedores: MedicacaoFornecedor[];
  compras: MedicacaoCompra[];
  lote?: string;
  validade?: string;
  quantidade?: number;
  estoqueMinimo?: number;
  categoria?: FornecedorCategoria;
  principio?: string;
  forma?: MedicacaoForma;
  fornecedorPrincipal?: string;
  observacoes?: string;
}

export type UserRole =
  | "Admin"
  | "Médico"
  | "Enfermagem"
  | "Administrativo"
  | "Recepção";

export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
  especialidade?: string;
  avatarColor: string;
}

export interface NotaFiscal {
  id: string;
  fornecedorNome: string;
  cnpj: string;
  dataPagamento: string;
  vencimento: string;
  numeroDocumento: string;
  valor: number;
  arquivo?: string;
  lancamentoId?: string;
}
