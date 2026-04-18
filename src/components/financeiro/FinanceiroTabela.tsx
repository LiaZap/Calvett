"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderMinus,
  Inbox,
  MoreVertical,
  Search,
  User,
} from "lucide-react";
import { useLancamentosStore } from "@/stores/useLancamentosStore";
import { useFornecedoresStore } from "@/stores/useFornecedoresStore";
import { useHydrate } from "@/stores/useHydrate";
import { formatBRLTight } from "@/stores/format";
import type { Lancamento, LancamentoStatus } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";
import UserMenu from "@/components/UserMenu";

type FilterTab = "todos" | "receitas" | "despesas";

const ALL_STATUSES: LancamentoStatus[] = [
  "Pago",
  "Pendente",
  "Parcela",
  "Agendado",
  "Atrasado",
];

const monthsPt = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function formatGroupDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, "0")} de ${monthsPt[m - 1]}`;
}

function parseISODate(iso: string): { y: number; m: number; d: number } | null {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return { y, m, d };
}

function isNotaFiscalLink(l: Lancamento): boolean {
  return (
    l.tipo === "Despesa" &&
    (l.descricao === "Acessar Nota-Fiscal" ||
      l.descricao === "Solicitar Nota-Fiscal")
  );
}

function statusStyle(status: LancamentoStatus): { color: string; bg: string } {
  if (status === "Pago" || status === "Parcela") {
    return { color: "#a5c16e", bg: "#fafbf6" };
  }
  if (status === "Pendente" || status === "Agendado") {
    return { color: "#c1846e", bg: "rgba(193,132,110,0.1)" };
  }
  return { color: "#c1846e", bg: "rgba(193,132,110,0.1)" };
}

export default function FinanceiroTabela() {
  const hydrated = useHydrate();
  const lancamentos = useLancamentosStore((s) => s.items);
  const updateLancamento = useLancamentosStore((s) => s.update);
  const removeLancamento = useLancamentosStore((s) => s.remove);
  const fornecedoresList = useFornecedoresStore((s) => s.items);

  // Date navigator — default to January 2026 per Figma
  const [view, setView] = useState<{ year: number; month: number }>({
    year: 2026,
    month: 0,
  });
  const [filter, setFilter] = useState<FilterTab>("todos");
  const [query, setQuery] = useState("");

  const goPrevMonth = () =>
    setView((v) =>
      v.month === 0
        ? { year: v.year - 1, month: 11 }
        : { year: v.year, month: v.month - 1 }
    );
  const goNextMonth = () =>
    setView((v) =>
      v.month === 11
        ? { year: v.year + 1, month: 0 }
        : { year: v.year, month: v.month + 1 }
    );

  const { dateGroups } = useMemo(() => {
    const fornMap = new Map(fornecedoresList.map((f) => [f.id, f]));

    const filteredByMonth = lancamentos.filter((l) => {
      const p = parseISODate(l.data);
      if (!p) return false;
      return p.y === view.year && p.m === view.month + 1;
    });

    const filteredByTab = filteredByMonth.filter((l) => {
      if (filter === "todos") return true;
      if (filter === "receitas") return l.tipo === "Receita";
      if (filter === "despesas") return l.tipo === "Despesa";
      return true;
    });

    const q = query.trim().toLowerCase();
    const filteredByQuery = q
      ? filteredByTab.filter((l) => {
          const hay = [l.nome, l.descricao, l.categoria]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return hay.includes(q);
        })
      : filteredByTab;

    const byDate = new Map<string, Lancamento[]>();
    for (const l of filteredByQuery) {
      const bucket = byDate.get(l.data);
      if (bucket) bucket.push(l);
      else byDate.set(l.data, [l]);
    }

    const sortedKeys = Array.from(byDate.keys()).sort();
    const groups = sortedKeys.map((k) => ({
      iso: k,
      label: formatGroupDate(k),
      rows: byDate.get(k) ?? [],
      fornMap,
    }));

    return { dateGroups: groups };
  }, [lancamentos, fornecedoresList, view, filter, query]);

  const hasResults = dateGroups.length > 0;

  return (
    <>
      {/* Top bar header (Lançamentos / Lista de Lançamentos) */}
      <div
        className="absolute font-[var(--font-zalando-stack)]"
        style={{ left: 700, top: 38, width: 462 }}
      >
        <p className="text-[13px] font-medium text-[#1e1e1e]">Lançamentos</p>
        <p className="text-[12px] text-[#9f9f9f] leading-[20px]">
          Lista de Lançamentos
        </p>
      </div>

      {/* Top-right cluster — minimal: date + bell + avatar + menu */}
      <div
        className="absolute flex items-center gap-[14px]"
        style={{ right: 56, top: 45 }}
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

      {/* Horizontal divider under top bar — stretches to canvas right edge */}
      <div
        className="absolute"
        style={{ left: 652, right: 0, top: 108, height: 1, background: "#f0f0f0" }}
      />

      {/* Title (Lançamentos / Acompanhe e organize) */}
      <div
        className="absolute font-[var(--font-zalando-stack)]"
        style={{ left: 701, top: 146 }}
      >
        <p className="text-[22px] font-light text-[#1e1e1e] leading-[1.2]">
          Lançamentos
        </p>
        <p className="text-[12px] font-medium text-[#b0aea4] mt-[6px]">
          Acompanhe e organize as movimentações
        </p>
      </div>

      {/* Month navigator (center-right) — right-anchored so it tracks the filter pills */}
      <div
        className="absolute flex items-center gap-[10px]"
        style={{ right: 554, top: 160, height: 24 }}
      >
        <button
          onClick={goPrevMonth}
          aria-label="Mês anterior"
          className="p-[2px] rounded-md hover:bg-[#f2f2f2] transition-colors"
        >
          <ChevronLeft size={18} className="text-[#6e6e6e]" />
        </button>
        <span className="text-[14px] font-medium font-[var(--font-jakarta)] text-[#6e6e6e] whitespace-nowrap min-w-[100px] text-center">
          {monthsPt[view.month]} {view.year}
        </span>
        <button
          onClick={goNextMonth}
          aria-label="Próximo mês"
          className="p-[2px] rounded-md hover:bg-[#f2f2f2] transition-colors"
        >
          <ChevronRight size={18} className="text-[#6e6e6e]" />
        </button>
      </div>

      {/* Filter pills (top-right) — right-anchored */}
      <div
        className="absolute flex items-center gap-[4px] font-[var(--font-zalando-stack)]"
        style={{ right: 56, top: 153 }}
      >
        <FilterPill active={filter === "todos"} onClick={() => setFilter("todos")}>
          Todos
        </FilterPill>
        <FilterPill
          active={filter === "receitas"}
          onClick={() => setFilter("receitas")}
        >
          Recebimentos
        </FilterPill>
        <FilterPill
          active={filter === "despesas"}
          onClick={() => setFilter("despesas")}
        >
          Despesas
        </FilterPill>
      </div>

      {/* Standalone search (right-anchored, above table header) */}
      <div
        className="absolute flex items-center gap-[8px] bg-[#fafafa] rounded-[10px] border border-[#e9e9e9] pl-[12px] pr-[12px] h-[40px] font-[var(--font-jakarta)]"
        style={{ right: 56, top: 198, width: 260 }}
      >
        <Search size={16} className="text-[#9f9f9f] shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar Lançamentos"
          className="text-[12px] text-[#1e1e1e] placeholder:text-[#9f9f9f] bg-transparent outline-none border-0 w-full min-w-0"
        />
      </div>

      {/* Table header row — stretches to canvas right edge */}
      <div
        className="absolute rounded-[12px] bg-white border border-[#f0f0f0] grid items-center font-[var(--font-jakarta)]"
        style={{
          left: 700,
          right: 56,
          top: 250,
          height: 44,
          gridTemplateColumns:
            "minmax(210px, 1.4fr) minmax(170px, 1fr) 115px 95px 95px 115px 130px 150px",
          paddingLeft: 20,
          paddingRight: 16,
          columnGap: 8,
        }}
      >
        <HeaderCell>Identificação</HeaderCell>
        <HeaderCell>Categoria</HeaderCell>
        <HeaderCell>Banco</HeaderCell>
        <HeaderCell>Status</HeaderCell>
        <HeaderCell>Referência</HeaderCell>
        <HeaderCell>Valor</HeaderCell>
        <HeaderCell>Status</HeaderCell>
        <HeaderCell>Ações</HeaderCell>
      </div>

      {/* Table body — scrollable list of date groups; stretches to canvas right edge */}
      <div
        className="absolute overflow-y-auto pr-[6px]"
        style={{ left: 700, right: 20, top: 310, height: 735 }}
      >
        {hydrated && hasResults ? (
          dateGroups.map((g) => (
            <div key={g.iso} className="mb-[24px]">
              <p className="text-[11px] font-medium text-[#9f9f9f] uppercase tracking-wide mb-[12px] mt-[4px] font-[var(--font-jakarta)]">
                {g.label}
              </p>
              <div className="flex flex-col">
                {g.rows.map((l) => (
                  <TableRow
                    key={l.id}
                    lancamento={l}
                    fornecedorNome={
                      l.fornecedorId
                        ? g.fornMap.get(l.fornecedorId)?.nome
                        : undefined
                    }
                    onStatusChange={(id, status) =>
                      updateLancamento(id, { status })
                    }
                    onRemove={(id) => removeLancamento(id)}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <EmptyState hydrated={hydrated} />
        )}
      </div>
    </>
  );
}

function HeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] text-[#9f9f9f] font-medium font-[var(--font-jakarta)]">
      {children}
    </p>
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

function EmptyState({ hydrated }: { hydrated: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center py-[72px] text-center">
      <div className="bg-[#fafafa] rounded-full w-[56px] h-[56px] flex items-center justify-center mb-[12px]">
        <Inbox size={24} className="text-[#b0aea4]" />
      </div>
      <p className="text-[13px] font-medium text-[#6e6e6e] font-[var(--font-jakarta)]">
        {hydrated ? "Nenhum lançamento encontrado" : "Carregando..."}
      </p>
      {hydrated && (
        <p className="text-[11px] text-[#9f9f9f] mt-[4px] font-[var(--font-jakarta)]">
          Ajuste os filtros ou o período selecionado
        </p>
      )}
    </div>
  );
}

function TableRow({
  lancamento,
  fornecedorNome,
  onStatusChange,
  onRemove,
}: {
  lancamento: Lancamento;
  fornecedorNome?: string;
  onStatusChange: (id: string, status: LancamentoStatus) => void;
  onRemove: (id: string) => void;
}) {
  const subIsLink = isNotaFiscalLink(lancamento);
  const tipo: "Entrada" | "Despesas" =
    lancamento.tipo === "Receita" ? "Entrada" : "Despesas";
  const tipoColor = tipo === "Entrada" ? "#a5c16e" : "#c1846e";
  const tipoBg = tipo === "Entrada" ? "#fafbf6" : "rgba(193,132,110,0.1)";
  const bancoColor = lancamento.banco === "C6 Bank" ? "#101820" : "#00D775";
  const { color: statusColor, bg: statusBg } = statusStyle(lancamento.status);

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  const handleNotaFiscal = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(
      fornecedorNome
        ? `Nota Fiscal: ${lancamento.nome} — ${fornecedorNome}`
        : `Nota Fiscal: ${lancamento.nome}`
    );
  };
  const handleFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info("Visualizar documento");
  };
  const handleArrow = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.info(`Abrir ${lancamento.nome}`);
  };
  const handleFolder = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Arquivar "${lancamento.nome}"?`)) {
      toast.success("Lançamento arquivado");
      onRemove(lancamento.id);
    }
  };
  const handleEdit = () => toast.info(`Editar ${lancamento.nome}`);
  const handleDelete = () => {
    if (
      window.confirm(`Excluir "${lancamento.nome}"? Esta ação não pode ser desfeita.`)
    ) {
      onRemove(lancamento.id);
      toast.success("Lançamento excluído");
    }
  };

  return (
    <div
      className="grid items-center rounded-[10px] hover:bg-[#fafafa] transition-colors font-[var(--font-jakarta)]"
      style={{
        gridTemplateColumns:
          "minmax(210px, 1.4fr) minmax(170px, 1fr) 115px 95px 95px 115px 130px 150px",
        paddingLeft: 20,
        paddingRight: 16,
        paddingTop: 10,
        paddingBottom: 10,
        columnGap: 8,
      }}
    >
      {/* Identificação */}
      <div className="flex items-center gap-[10px] min-w-0">
        <div className="w-[37px] h-[37px] rounded-full bg-[#f0f0f0] shrink-0 flex items-center justify-center">
          <User size={18} className="text-[#b0b0b0]" />
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-[#1e1e1e] truncate">
            {lancamento.nome}
          </p>
          {subIsLink ? (
            <button
              type="button"
              onClick={handleNotaFiscal}
              className="text-[10px] text-[#6e6e6e] flex items-center gap-[3px] hover:text-[#1e1e1e] transition-colors truncate max-w-full"
            >
              <span className="truncate underline underline-offset-2 decoration-[#d9d9d9]">
                {lancamento.descricao}
              </span>
              <ArrowUpRight size={10} className="shrink-0" />
            </button>
          ) : (
            <p className="text-[10px] text-[#9f9f9f] truncate">
              {lancamento.descricao}
            </p>
          )}
        </div>
      </div>

      {/* Categoria */}
      <div className="min-w-0">
        <div className="bg-[#f4f4f4] rounded-[8px] px-[10px] py-[6px] w-fit max-w-full">
          <span className="text-[10px] text-[#646464] truncate block">
            {lancamento.categoria}
          </span>
        </div>
      </div>

      {/* Banco */}
      <div className="flex items-center gap-[6px] min-w-0">
        <div
          className="w-[20px] h-[20px] rounded-full shrink-0"
          style={{ backgroundColor: bancoColor }}
        />
        <span className="text-[12px] text-[#1e1e1e] truncate">
          {lancamento.banco}
        </span>
      </div>

      {/* Tipo Status (Entrada / Despesas) */}
      <div className="min-w-0">
        <div
          className="rounded-[18px] px-[14px] py-[6px] w-fit"
          style={{ backgroundColor: tipoBg }}
        >
          <span
            className="text-[11px] font-medium whitespace-nowrap"
            style={{ color: tipoColor }}
          >
            {tipo}
          </span>
        </div>
      </div>

      {/* Referência */}
      <div className="min-w-0">
        {lancamento.referencia ? (
          <div className="bg-[#f4f4f4] rounded-[8px] px-[10px] py-[4px] w-fit">
            <span className="text-[10px] text-[#646464] whitespace-nowrap">
              {lancamento.referencia}
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-[#c2c2c2]">—</span>
        )}
      </div>

      {/* Valor */}
      <div className="min-w-0">
        <p className="text-[12px] font-semibold text-[#1e1e1e] whitespace-nowrap truncate">
          {formatBRLTight(lancamento.valor)}
        </p>
        <p className="text-[10px] text-[#9f9f9f] whitespace-nowrap truncate">
          {lancamento.statusDetalhe ?? "Pago em 01 Jan 2026"}
        </p>
      </div>

      {/* Status dropdown */}
      <div className="min-w-0" onClick={stop}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-[4px] rounded-[18px] px-[10px] py-[4px] w-fit hover:brightness-95 transition"
              style={{ backgroundColor: statusBg }}
            >
              <span
                className="text-[11px] font-medium whitespace-nowrap"
                style={{ color: statusColor }}
              >
                {lancamento.status}
              </span>
              <ChevronDown size={10} style={{ color: statusColor }} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-[120px]">
            {ALL_STATUSES.map((s) => {
              const stl = statusStyle(s);
              return (
                <DropdownMenuItem
                  key={s}
                  onSelect={() => onStatusChange(lancamento.id, s)}
                  className="py-[6px]"
                >
                  <span
                    className="rounded-[18px] px-[10px] py-[2px] inline-flex"
                    style={{ backgroundColor: stl.bg }}
                  >
                    <span
                      className="text-[10px] font-medium whitespace-nowrap"
                      style={{ color: stl.color }}
                    >
                      {s}
                    </span>
                  </span>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Action icons */}
      <div className="flex gap-[8px] ml-auto shrink-0" onClick={stop}>
        <button
          type="button"
          onClick={handleFile}
          title="Visualizar documento"
          className="border border-[#e9e9e9] rounded-[9px] w-[30px] h-[30px] flex items-center justify-center hover:bg-[#fafafa] transition-colors"
        >
          <FileText size={14} className="text-[#9f9f9f]" />
        </button>
        <button
          type="button"
          onClick={handleArrow}
          title="Abrir detalhes"
          className="border border-[#e9e9e9] rounded-[9px] w-[30px] h-[30px] flex items-center justify-center hover:bg-[#fafafa] transition-colors"
        >
          <Image
            src="/icons/solar_arrow-right-up-linear.svg"
            alt=""
            width={14}
            height={14}
          />
        </button>
        <button
          type="button"
          onClick={handleFolder}
          title="Arquivar"
          className="border border-[#e9e9e9] rounded-[9px] w-[30px] h-[30px] flex items-center justify-center hover:bg-[#fafafa] transition-colors"
        >
          <FolderMinus size={14} className="text-[#9f9f9f]" />
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              title="Mais"
              onClick={stop}
              className="border border-[#e9e9e9] rounded-[9px] w-[30px] h-[30px] flex items-center justify-center hover:bg-[#fafafa] transition-colors"
            >
              <MoreVertical size={14} className="text-[#9f9f9f]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[120px]">
            <DropdownMenuItem onSelect={handleEdit}>Editar</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={handleDelete}
              className="text-[#c1846e] focus:text-[#c1846e]"
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
