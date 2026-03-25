export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: Role;
}

export interface Candidate {
  id: string;
  inscricao: string;
  nome: string;
  nota_final: number;
  posicao_lista_vaga: string;
  tipo?: string; // PCD, sub judice, etc.
  posicao_atual: number;
}