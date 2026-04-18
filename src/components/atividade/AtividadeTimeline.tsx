"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  UserPlus,
  Calendar,
  Package,
  CreditCard,
  CheckCircle2,
  FileText,
  type LucideIcon,
} from "lucide-react";
import UserMenu from "@/components/UserMenu";

type AtividadeTipo =
  | "criação"
  | "agenda"
  | "estoque"
  | "financeiro"
  | "procedimento"
  | "sistema";

interface Atividade {
  hora: string;
  usuario: string;
  acao: string;
  detalhe: string;
  tipo: AtividadeTipo;
}

const atividades: Atividade[] = [
  {
    hora: "09:45",
    usuario: "Dr. Ricardo",
    acao: "Cadastrou novo paciente",
    detalhe: "Maria Silva — Rinoplastia",
    tipo: "criação",
  },
  {
    hora: "09:30",
    usuario: "Dra. Patricia",
    acao: "Confirmou agendamento",
    detalhe: "Ana Paula — 12/01 14:00",
    tipo: "agenda",
  },
  {
    hora: "09:15",
    usuario: "Enf. João",
    acao: "Entrada de estoque",
    detalhe: "Dipirona 500mg — 240 unidades",
    tipo: "estoque",
  },
  {
    hora: "08:50",
    usuario: "Adm. Lucas",
    acao: "Registrou pagamento",
    detalhe: "R$ 18.500,00 — Rinoplastia Estética",
    tipo: "financeiro",
  },
  {
    hora: "08:30",
    usuario: "Dr. Ricardo",
    acao: "Finalizou procedimento",
    detalhe: "Juliana Costa — Rinoplastia",
    tipo: "procedimento",
  },
  {
    hora: "08:00",
    usuario: "Sistema",
    acao: "Relatório gerado",
    detalhe: "Fechamento diário — 11/01",
    tipo: "sistema",
  },
];

const tipoConfig: Record<
  AtividadeTipo,
  {
    bg: string;
    cor: string;
    icon: LucideIcon;
    label: string;
  }
> = {
  criação: { bg: "#f4f8ee", cor: "#a5c16e", icon: UserPlus, label: "Cadastro" },
  agenda: { bg: "#fdf7ea", cor: "#c1b26e", icon: Calendar, label: "Agenda" },
  estoque: { bg: "#eef2f8", cor: "#6e8bc1", icon: Package, label: "Estoque" },
  financeiro: {
    bg: "#fbeeeb",
    cor: "#c1846e",
    icon: CreditCard,
    label: "Financeiro",
  },
  procedimento: {
    bg: "#f3eef8",
    cor: "#8f6ec1",
    icon: CheckCircle2,
    label: "Procedimento",
  },
  sistema: { bg: "#f4f4f4", cor: "#9f9f9f", icon: FileText, label: "Sistema" },
};

type FilterTab = "hoje" | "semana" | "mes";

// Column geometry (inside the 1920×1080 canvas)
const COL_LEFT = 604;
const CONTENT_LEFT = 628;
const ROW_TOP = 260;
const ROW_HEIGHT = 100;
const ROW_GAP = 16;

export default function AtividadeTimeline() {
  const [filter, setFilter] = useState<FilterTab>("hoje");

  return (
    <>
      {/* Column background (white content area) — stretches to canvas right edge */}
      <div
        className="absolute bg-white"
        style={{ left: COL_LEFT, top: 0, right: 0, height: 1080 }}
      />

      {/* Top-right cluster — minimal: date + bell + avatar + menu */}
      <div
        className="absolute flex items-center gap-[14px]"
        style={{ right: 21, top: 45 }}
      >
        <span className="text-[12px] font-medium text-[#9f9f9f] font-[var(--font-zalando-stack)] whitespace-nowrap">
          Seg, 12 jan
        </span>
        <button
          type="button"
          aria-label="Notificações"
          className="relative w-[36px] h-[36px] rounded-full hover:bg-[#f7f7f5] flex items-center justify-center transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#47535f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
          <span className="absolute top-[6px] right-[6px] w-[8px] h-[8px] rounded-full bg-[#ff9898] ring-2 ring-white" />
        </button>
        <UserMenu />
        <button
          type="button"
          aria-label="Menu"
          className="w-[36px] h-[36px] rounded-full hover:bg-[#f7f7f5] flex items-center justify-center transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#47535f" strokeWidth="1.6" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Breadcrumb */}
      <div
        className="absolute font-[var(--font-zalando-stack)]"
        style={{ left: CONTENT_LEFT, top: 46 }}
      >
        <p className="text-[12px] font-medium text-[#1e1e1e]">
          Atividade Recente
        </p>
        <p className="text-[12px] text-[#9f9f9f] leading-[20px]">
          <Link href="/" className="hover:text-[#1e1e1e] transition-colors">
            Início
          </Link>
          / Atividade
        </p>
      </div>

      {/* Linha do Tempo header */}
      <div className="absolute" style={{ left: CONTENT_LEFT, top: 160 }}>
        <p className="text-[14px] font-medium text-[#1e1e1e] font-[var(--font-zalando-stack)]">
          Linha do Tempo
        </p>
        <p className="text-[12px] text-[#9f9f9f] font-[var(--font-zalando-stack)]">
          Todas as atividades do dia
        </p>
      </div>

      {/* Filter pills — right-anchored */}
      <div
        className="absolute flex items-center gap-[6px]"
        style={{ right: 21, top: 160 }}
      >
        <FilterPill active={filter === "hoje"} onClick={() => setFilter("hoje")}>
          Hoje
        </FilterPill>
        <FilterPill
          active={filter === "semana"}
          onClick={() => setFilter("semana")}
        >
          Semana
        </FilterPill>
        <FilterPill active={filter === "mes"} onClick={() => setFilter("mes")}>
          Mês
        </FilterPill>
      </div>

      {/* Vertical timeline rail */}
      <div
        aria-hidden
        className="absolute"
        style={{
          left: CONTENT_LEFT + 28,
          top: ROW_TOP + 20,
          width: 2,
          height: (ROW_HEIGHT + ROW_GAP) * (atividades.length - 1) + 40,
          background:
            "linear-gradient(to bottom, rgba(71,83,95,0.18), rgba(71,83,95,0.04))",
        }}
      />

      {/* Activity rows */}
      {atividades.map((a, idx) => {
        const cfg = tipoConfig[a.tipo];
        const Icon = cfg.icon;
        const top = ROW_TOP + idx * (ROW_HEIGHT + ROW_GAP);
        return (
          <div
            key={idx}
            className="absolute"
            style={{ left: CONTENT_LEFT, top, right: 66, height: ROW_HEIGHT }}
          >
            {/* Timeline dot */}
            <div
              aria-hidden
              className="absolute rounded-full border-[3px] border-white shadow-[0_0_0_1px_rgba(71,83,95,0.12)]"
              style={{
                left: 22,
                top: 28,
                width: 16,
                height: 16,
                backgroundColor: cfg.cor,
              }}
            />

            {/* Card — stretches to row right edge */}
            <div
              className="absolute flex items-center gap-[18px] rounded-[19px] border border-[#f0f0f0] bg-white px-[22px] h-full hover:bg-[#fafafa] transition-colors"
              style={{ left: 72, right: 0 }}
            >
              {/* Icon bubble */}
              <span
                className="shrink-0 w-[56px] h-[56px] rounded-full flex items-center justify-center"
                style={{ backgroundColor: cfg.bg }}
              >
                <Icon size={22} color={cfg.cor} />
              </span>

              {/* Title + detail */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-[10px] mb-[4px]">
                  <span
                    className="text-[11px] font-medium font-[var(--font-zalando-stack)] rounded-[14px] px-[10px] py-[4px] whitespace-nowrap"
                    style={{ backgroundColor: cfg.bg, color: cfg.cor }}
                  >
                    {cfg.label}
                  </span>
                  <span className="text-[12px] text-[#9f9f9f] font-[var(--font-zalando-stack)]">
                    {a.hora}
                  </span>
                  <span className="w-[3px] h-[3px] rounded-full bg-[#d9d9d9]" />
                  <span className="text-[12px] text-[#9f9f9f] font-[var(--font-zalando-stack)]">
                    por {a.usuario}
                  </span>
                </div>
                <p className="text-[14px] font-medium text-[#1e1e1e] font-[var(--font-zalando-stack)] truncate">
                  {a.acao}
                </p>
                <p className="text-[12px] text-[#9f9f9f] font-[var(--font-zalando-stack)] truncate mt-[2px]">
                  {a.detalhe}
                </p>
              </div>

              {/* Open arrow button */}
              <button
                type="button"
                aria-label="Abrir detalhes"
                className="shrink-0 border border-[#e9e9e9] rounded-full w-[40px] h-[40px] flex items-center justify-center hover:bg-white transition-colors"
              >
                <Image
                  src="/icons/solar_arrow-right-up-linear.svg"
                  alt=""
                  width={16}
                  height={16}
                />
              </button>
            </div>
          </div>
        );
      })}

      {/* Footer caption */}
      <p
        className="absolute text-[12px] text-[#9f9f9f] font-[var(--font-zalando-stack)]"
        style={{ left: CONTENT_LEFT, top: 1020 }}
      >
        Exibindo {atividades.length} de {atividades.length} registros do dia ·
        atualizado há poucos segundos
      </p>
    </>
  );
}

function FilterPill({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-[36px] px-[14px] text-[13px] font-[var(--font-zalando-stack)] transition-colors whitespace-nowrap ${
        active
          ? "text-[#1e1e1e] font-semibold"
          : "text-[#9f9f9f] font-medium hover:text-[#47535f]"
      }`}
    >
      {children}
      {active && (
        <span
          aria-hidden
          className="absolute left-1/2 bottom-[2px] -translate-x-1/2 h-[2px] w-[20px] rounded-full bg-[#47535f]"
        />
      )}
    </button>
  );
}
