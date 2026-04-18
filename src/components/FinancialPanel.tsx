"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useLancamentosStore } from "@/stores/useLancamentosStore";
import { useHydrate } from "@/stores/useHydrate";
import { formatBRL } from "@/stores/format";
import type { Lancamento, LancamentoStatus } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LancamentoDetalhesPanel from "@/components/LancamentoDetalhesPanel";
import UserMenu from "@/components/UserMenu";

type FilterTab = "hoje" | "semana" | "mes";

const statusStyles: Record<LancamentoStatus, { bg: string; text: string }> = {
  Pago: { bg: "#fafbf6", text: "#a5c16e" },
  Parcela: { bg: "#fafbf6", text: "#bac16e" },
  Agendado: { bg: "#fafbf6", text: "#c1b26e" },
  Pendente: { bg: "#fafbf6", text: "#c1b26e" },
  Atrasado: { bg: "rgba(193,132,110,0.1)", text: "#c1846e" },
};

const statusOptions: LancamentoStatus[] = [
  "Pago",
  "Pendente",
  "Parcela",
  "Agendado",
  "Atrasado",
];

const monthsPt = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function formatDataCompleta(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  const dia = String(d.getDate()).padStart(2, "0");
  return `${dia} de ${monthsPt[d.getMonth()]} de ${d.getFullYear()}`;
}

export default function FinancialPanel() {
  const hydrated = useHydrate();
  const lancamentos = useLancamentosStore((s) => s.items);
  const update = useLancamentosStore((s) => s.update);
  const [filter, setFilter] = useState<FilterTab>("hoje");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedLanc = useMemo(
    () => lancamentos.find((l) => l.id === selectedId) ?? null,
    [lancamentos, selectedId],
  );
  const detailsOpen = selectedId !== null && selectedLanc !== null;

  const { receitas, despesas } = useMemo(() => {
    const rec: Lancamento[] = [];
    const desp: Lancamento[] = [];
    for (const l of lancamentos) {
      if (l.tipo === "Receita") rec.push(l);
      else desp.push(l);
    }
    return { receitas: rec, despesas: desp };
  }, [lancamentos]);

  const receitasToShow = receitas.slice(0, 4);
  const despesasToShow = despesas.slice(0, 3);

  return (
    <>
      {/* Top-right cluster — minimal: date + bell + UserMenu + menu */}
      <div
        className="absolute flex items-center gap-[14px]"
        style={{ right: 0, top: 45 }}
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

      {/* Operacional Financeiro breadcrumb */}
      <div className="absolute font-[var(--font-zalando-stack)]" style={{ left: 1146, top: 46 }}>
        <p className="text-[12px] font-medium text-[#1e1e1e]">Operacional Financeiro</p>
        <p className="text-[12px] text-[#9f9f9f] leading-[20px]">
          <Link href="/" className="hover:text-[#1e1e1e] transition-colors">
            Início
          </Link>
          / Financeiro
        </p>
      </div>

      {/* Receitas header */}
      <div className="absolute" style={{ left: 1149, top: 146 }}>
        <p className="text-[14px] font-medium text-[#1e1e1e] font-[var(--font-zalando-stack)]">
          Receitas
        </p>
        <p className="text-[12px] text-[#9f9f9f] font-[var(--font-zalando-stack)]">
          Detalhamento do Mês
        </p>
      </div>

      {/* Filter pills — right-anchored */}
      <div
        className="absolute flex items-center gap-[6px]"
        style={{ right: 21, top: 146 }}
      >
        <FilterPill active={filter === "hoje"} onClick={() => setFilter("hoje")}>
          Hoje
        </FilterPill>
        <FilterPill active={filter === "semana"} onClick={() => setFilter("semana")}>
          Semana
        </FilterPill>
        <FilterPill active={filter === "mes"} onClick={() => setFilter("mes")}>
          Mês
        </FilterPill>
      </div>

      {/* Receitas list — contracts when details panel is open */}
      <div
        className="absolute flex flex-col gap-[8px]"
        style={{
          left: 1149,
          right: detailsOpen ? 520 : 51,
          top: 228,
          transition: "right 320ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {hydrated && receitasToShow.length === 0 ? (
          <EmptyRow label="Nenhuma receita" />
        ) : (
          receitasToShow.map((r) => (
            <TransactionRow
              key={r.id}
              lancamento={r}
              selected={selectedId === r.id}
              onSelect={() => setSelectedId(r.id)}
              onStatusChange={(id, status) => update(id, { status })}
            />
          ))
        )}
      </div>

      {/* Ver N Lançamentos link — right-anchored */}
      <Link
        href="/financeiro"
        className="absolute text-[12px] text-[#9f9f9f] font-medium font-[var(--font-zalando-stack)] hover:text-[#1e1e1e] transition-colors whitespace-nowrap"
        style={{ right: 20, top: 598 }}
      >
        Ver {hydrated ? despesas.length : "--"} Lançamentos
      </Link>

      {/* Despesas header */}
      <div className="absolute" style={{ left: 1149, top: 598 }}>
        <p className="text-[14px] font-medium text-[#1e1e1e] font-[var(--font-zalando-stack)]">
          Despesas
        </p>
        <p className="text-[12px] text-[#9f9f9f] font-[var(--font-zalando-stack)]">
          Detalhamento do Mês
        </p>
      </div>

      {/* Despesas list — contracts when details panel is open */}
      <div
        className="absolute flex flex-col gap-[8px]"
        style={{
          left: 1149,
          right: detailsOpen ? 520 : 51,
          top: 672,
          transition: "right 320ms cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {hydrated && despesasToShow.length === 0 ? (
          <EmptyRow label="Nenhuma despesa" />
        ) : (
          despesasToShow.map((r) => (
            <TransactionRow
              key={r.id}
              lancamento={r}
              selected={selectedId === r.id}
              onSelect={() => setSelectedId(r.id)}
              onStatusChange={(id, status) => update(id, { status })}
            />
          ))
        )}
      </div>

      {/* Slide-in details panel */}
      <LancamentoDetalhesPanel
        lancamento={selectedLanc}
        open={detailsOpen}
        onClose={() => setSelectedId(null)}
        width={500}
      />
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

const AVATAR_COLORS = [
  { bg: "#5b7c99", text: "#ffffff" },
  { bg: "#7ca598", text: "#ffffff" },
  { bg: "#c1846e", text: "#ffffff" },
  { bg: "#8a6ec1", text: "#ffffff" },
  { bg: "#c1a86e", text: "#ffffff" },
  { bg: "#6ec1a8", text: "#ffffff" },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function TransactionRow({
  lancamento,
  selected,
  onSelect,
  onStatusChange,
}: {
  lancamento: Lancamento;
  selected: boolean;
  onSelect: () => void;
  onStatusChange: (id: string, status: LancamentoStatus) => void;
}) {
  const isReceita = lancamento.tipo === "Receita";
  const badge = statusStyles[lancamento.status];
  const labelParcela =
    lancamento.status === "Parcela" && lancamento.statusDetalhe
      ? lancamento.statusDetalhe
      : lancamento.status;
  const avatar = colorFor(lancamento.nome);
  const initials = getInitials(lancamento.nome);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`flex items-center gap-[14px] py-[12px] px-[10px] rounded-[14px] transition-all text-left min-w-0 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47535f]/30 ${
        selected
          ? "bg-[#f4f6f8] ring-1 ring-[#47535f]/15 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "hover:bg-[#fafafa]"
      }`}
    >
      <div
        className="w-[48px] h-[48px] rounded-full shrink-0 flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
        style={{ background: avatar.bg, color: avatar.text }}
      >
        <span className="text-[14px] font-semibold font-[var(--font-dm)] leading-none">
          {initials}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium text-[#1e1e1e] font-[var(--font-zalando-stack)] truncate">
          {lancamento.nome}
        </p>
        <p className="text-[12px] text-[#9f9f9f] font-[var(--font-zalando-stack)] truncate">
          {isReceita
            ? lancamento.categoria || "Procedimento"
            : lancamento.descricao || "Detalhes da Transação"}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 rounded-full px-[12px] py-[5px] text-[11px] font-semibold font-[var(--font-zalando-stack)] whitespace-nowrap transition-opacity hover:opacity-80"
            style={{ backgroundColor: badge.bg, color: badge.text }}
          >
            {labelParcela}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {statusOptions.map((opt) => (
            <DropdownMenuItem
              key={opt}
              onSelect={() => onStatusChange(lancamento.id, opt)}
            >
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="text-right shrink-0" style={{ width: 130 }}>
        <p className="text-[14px] font-semibold text-[#1e1e1e] font-[var(--font-zalando-stack)] whitespace-nowrap">
          {formatBRL(lancamento.valor)}
        </p>
        <p className="text-[11px] text-[#9f9f9f] font-[var(--font-zalando-stack)] whitespace-nowrap">
          {formatDataCompleta(lancamento.data)}
        </p>
      </div>
      <ChevronRight
        size={16}
        className={`shrink-0 transition-colors ${
          selected ? "text-[#47535f]" : "text-[#c2c2c2] group-hover:text-[#47535f]"
        }`}
      />
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="py-[22px] text-center text-[12px] text-[#a2a2a2] font-[var(--font-zalando-stack)]">
      {label}
    </div>
  );
}
