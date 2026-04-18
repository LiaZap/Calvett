import type { User } from "@/types";

export const seedUsers: User[] = [
  {
    id: "u_001",
    nome: "Dr. Ricardo Calvett",
    email: "ricardo@hdp.com",
    senha: "demo",
    role: "Admin",
    especialidade: "Cirurgião Plástico",
    avatarColor: "#5b7c99",
  },
  {
    id: "u_002",
    nome: "Dra. Patricia Oliveira",
    email: "patricia@hdp.com",
    senha: "demo",
    role: "Médico",
    especialidade: "Anestesiologista",
    avatarColor: "#8a6ec1",
  },
  {
    id: "u_003",
    nome: "Enf. João Santos",
    email: "joao@hdp.com",
    senha: "demo",
    role: "Enfermagem",
    especialidade: "Centro Cirúrgico",
    avatarColor: "#6aa380",
  },
  {
    id: "u_004",
    nome: "Adm. Lucas Almeida",
    email: "lucas@hdp.com",
    senha: "demo",
    role: "Administrativo",
    especialidade: "Financeiro",
    avatarColor: "#c1846e",
  },
  {
    id: "u_005",
    nome: "Mariana Silva",
    email: "mariana@hdp.com",
    senha: "demo",
    role: "Recepção",
    especialidade: "Atendimento",
    avatarColor: "#b3a256",
  },
];

export function getInitials(nome: string): string {
  const parts = nome.replace(/^(Dr\.|Dra\.|Enf\.|Adm\.)\s*/i, "").trim().split(/\s+/);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
