"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  Check,
  ChevronDown,
  MoreVertical,
  Package,
  PackageCheck,
  Plus,
  Search,
  XCircle,
} from "lucide-react";
import { useMedicacoesStore } from "@/stores/useMedicacoesStore";
import { useHydrate } from "@/stores/useHydrate";
import { toast } from "@/components/ui/toast";
import NovaMedicacaoForm from "@/components/forms/NovaMedicacaoForm";
import UserMenu from "@/components/UserMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Medicacao, MedicacaoStatus } from "@/types";

const COL_LEFT = 504;
const DETAILS_WIDTH = 608;

type StatusFilter = "todos" | MedicacaoStatus;
type SortKey = "nome" | "quantidade" | "validade" | "recentes";

type Props = {
  selectedId: string | null;
  expandedId: string | null;
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  detailsOpen: boolean;
};

const statusTone: Record<
  MedicacaoStatus,
  { dot: string; text: string; bg: string }
> = {
  Disponível: { dot: "#6aa380", text: "#5e9a72", bg: "#ebf8ee" },
  Baixa: { dot: "#c1a36e", text: "#b3935e", bg: "#fef6e7" },
  Esgotado: { dot: "#c1846e", text: "#b77660", bg: "rgba(193,132,110,0.12)" },
  Vencido: { dot: "#4b5563", text: "#4b5563", bg: "#e5e7eb" },
};

function daysUntil(iso?: string) {
  if (!iso) return Infinity;
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return Infinity;
  return Math.round((d.getTime() - Date.now()) / 86_400_000);
}

function formatDateBR(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}

function derivedStatus(m: Medicacao): MedicacaoStatus {
  const qty = m.quantidade ?? 0;
  const min = m.estoqueMinimo ?? 0;
  const days = daysUntil(m.validade);
  if (days < 0) return "Vencido";
  if (qty === 0) return "Esgotado";
  if (qty < min) return "Baixa";
  return m.status;
}

export default function MedicacoesLista({
  selectedId,
  onSelect,
  detailsOpen,
}: Props) {
  const hydrated = useHydrate();
  const medicacoes = useMedicacoesStore((s) => s.items);
  const removeMed = useMedicacoesStore((s) => s.remove);
  const addMed = useMedicacoesStore((s) => s.add);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [novaOpen, setNovaOpen] = useState(false);

  // Summary counts
  const summary = useMemo(() => {
    const s = { total: 0, ok: 0, baixo: 0, vencendo: 0 };
    for (const m of medicacoes) {
      s.total++;
      const st = derivedStatus(m);
      if (st === "Disponível") s.ok++;
      if (st === "Baixa" || st === "Esgotado") s.baixo++;
      const days = daysUntil(m.validade);
      if (days >= 0 && days <= 30) s.vencendo++;
    }
    return s;
  }, [medicacoes]);

  // Filter + sort
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = medicacoes.filter((m) => {
      const st = derivedStatus(m);
      if (statusFilter !== "todos" && st !== statusFilter) return false;
      if (!q) return true;
      return (
        m.nome.toLowerCase().includes(q) ||
        m.dosagem.toLowerCase().includes(q) ||
        (m.lote ?? "").toLowerCase().includes(q) ||
        (m.principio ?? "").toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      switch (sortKey) {
        case "quantidade":
          return (a.quantidade ?? 0) - (b.quantidade ?? 0);
        case "validade":
          return daysUntil(a.validade) - daysUntil(b.validade);
        case "recentes":
          return b.id.localeCompare(a.id);
        case "nome":
        default:
          return a.nome.localeCompare(b.nome, "pt-BR");
      }
    });
    return list;
  }, [medicacoes, search, statusFilter, sortKey]);

  const allVisibleSelected =
    visible.length > 0 && visible.every((m) => selectedRows.has(m.id));

  const toggleRow = (id: string) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    if (allVisibleSelected) setSelectedRows(new Set());
    else setSelectedRows(new Set(visible.map((m) => m.id)));
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("todos");
    setSortKey("nome");
  };

  const handleBulkDelete = () => {
    if (selectedRows.size === 0) return;
    if (!window.confirm(`Excluir ${selectedRows.size} medicação(ões)?`)) return;
    selectedRows.forEach((id) => removeMed(id));
    toast.success(`${selectedRows.size} item(ns) excluído(s)`);
    setSelectedRows(new Set());
  };

  const handleDuplicate = (m: Medicacao) => {
    addMed({ ...m, id: crypto.randomUUID(), lote: (m.lote ?? "") + "-COPY" });
    toast.success("Medicação duplicada");
  };
  const handleDelete = (m: Medicacao) => {
    if (!window.confirm(`Excluir "${m.nome}"?`)) return;
    removeMed(m.id);
    toast.success("Medicação excluída");
  };

  const rightAnchor = detailsOpen ? DETAILS_WIDTH + 20 : 40;

  return (
    <>
      {/* Column divider (left) */}
      <div
        className="absolute"
        style={{ left: 480, top: 0, width: 1, height: 1080, background: "#ececec" }}
      />

      {/* Breadcrumb */}
      <div
        className="absolute font-[var(--font-zalando-stack)]"
        style={{ left: COL_LEFT, top: 38, width: 420 }}
      >
        <p className="text-[12px] font-medium text-[#1e1e1e]">Medicações</p>
        <p className="text-[12px] text-[#9f9f9f] leading-[20px]">
          Insumos › Medicações
        </p>
      </div>

      {/* Top-right cluster (minimal) */}
      <div
        className="absolute flex items-center gap-[14px]"
        style={{ right: rightAnchor, top: 45, transition: "right 320ms cubic-bezier(0.32, 0.72, 0, 1)" }}
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

      {/* Horizontal divider under header */}
      <div
        className="absolute"
        style={{ left: 480, right: 0, top: 104, height: 1, background: "#f0f0f0" }}
      />

      {/* Title + primary action */}
      <div
        className="absolute flex items-end justify-between gap-[20px]"
        style={{ left: COL_LEFT, right: rightAnchor, top: 134, transition: "right 320ms cubic-bezier(0.32, 0.72, 0, 1)" }}
      >
        <div className="font-[var(--font-zalando-stack)] min-w-0 flex-1">
          <p className="text-[22px] font-light text-[#1e1e1e] leading-[1.2]">
            Medicações
          </p>
          <p className="text-[12px] font-medium text-[#b0aea4] mt-[6px]">
            Controle e organize o estoque
          </p>
        </div>
        <button
          type="button"
          onClick={() => setNovaOpen(true)}
          className="shrink-0 inline-flex items-center justify-center gap-[14px] h-[48px] pl-[24px] pr-[32px] min-w-[200px] rounded-[24px] bg-[#2c3e4a] text-white text-[13px] font-semibold font-[var(--font-jakarta)] hover:bg-[#23323c] transition-colors shadow-[0_4px_12px_rgba(44,62,74,0.22)] whitespace-nowrap"
        >
          <Plus size={16} strokeWidth={2.6} />
          Nova Medicação
        </button>
      </div>

      {/* Summary cards */}
      <div
        className="absolute grid grid-cols-4 gap-[12px]"
        style={{ left: COL_LEFT, right: rightAnchor, top: 230, transition: "right 320ms cubic-bezier(0.32, 0.72, 0, 1)" }}
      >
        <SummaryCard
          icon={<Package size={18} strokeWidth={1.8} />}
          iconBg="#e7f0f7"
          iconColor="#5b7c99"
          label="Total de itens"
          value={hydrated ? summary.total : 0}
          active={statusFilter === "todos"}
          onClick={() => setStatusFilter("todos")}
        />
        <SummaryCard
          icon={<PackageCheck size={18} strokeWidth={1.8} />}
          iconBg="#e9f5ef"
          iconColor="#6aa380"
          label="Estoque OK"
          value={hydrated ? summary.ok : 0}
          active={statusFilter === "Disponível"}
          onClick={() => setStatusFilter("Disponível")}
        />
        <SummaryCard
          icon={<AlertTriangle size={18} strokeWidth={1.8} />}
          iconBg="#fbf6e7"
          iconColor="#b3a256"
          label="Estoque Baixo"
          value={hydrated ? summary.baixo : 0}
          active={statusFilter === "Baixa"}
          onClick={() => setStatusFilter("Baixa")}
        />
        <SummaryCard
          icon={<CalendarClock size={18} strokeWidth={1.8} />}
          iconBg="rgba(193,132,110,0.14)"
          iconColor="#c1846e"
          label="Vencendo em 30d"
          value={hydrated ? summary.vencendo : 0}
          active={false}
        />
      </div>

      {/* Filter bar */}
      <div
        className="absolute flex items-center gap-[10px]"
        style={{ left: COL_LEFT, right: rightAnchor, top: 348, transition: "right 320ms cubic-bezier(0.32, 0.72, 0, 1)" }}
      >
        <div className="flex-1 h-[44px] min-w-0 rounded-[10px] border border-[#ececec] bg-white flex items-center gap-[10px] px-[14px]">
          <Search size={16} className="text-[#9f9f9f] shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, lote ou princípio ativo"
            className="flex-1 bg-transparent text-[13px] text-[#1e1e1e] placeholder:text-[#9f9f9f] outline-none font-[var(--font-jakarta)]"
          />
        </div>
        <FilterDropdown
          label="Status"
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as StatusFilter)}
          options={[
            { value: "todos", label: "Todos" },
            { value: "Disponível", label: "Disponível" },
            { value: "Baixa", label: "Baixo" },
            { value: "Esgotado", label: "Esgotado" },
            { value: "Vencido", label: "Vencido" },
          ]}
        />
        <FilterDropdown
          label="Ordenar"
          value={sortKey}
          onChange={(v) => setSortKey(v as SortKey)}
          options={[
            { value: "nome", label: "Nome A-Z" },
            { value: "validade", label: "Validade" },
            { value: "quantidade", label: "Quantidade" },
            { value: "recentes", label: "Recentes" },
          ]}
        />
        <button
          type="button"
          onClick={clearFilters}
          className="shrink-0 inline-flex items-center justify-center h-[44px] px-[28px] min-w-[140px] rounded-[22px] border border-[#ececec] bg-white text-[12px] font-medium font-[var(--font-jakarta)] text-[#47535f] hover:bg-[#fafafa] transition-colors whitespace-nowrap"
        >
          Limpar filtros
        </button>
      </div>

      {/* Bulk action bar (shows when rows selected) */}
      {selectedRows.size > 0 && (
        <div
          className="absolute flex items-center justify-between rounded-[10px] bg-[#47535f] text-white px-[16px] h-[44px] shadow-[0_6px_16px_rgba(44,62,74,0.2)]"
          style={{ left: COL_LEFT, right: rightAnchor, top: 410, transition: "right 320ms cubic-bezier(0.32, 0.72, 0, 1)" }}
        >
          <span className="text-[13px] font-medium font-[var(--font-jakarta)]">
            {selectedRows.size} selecionado(s)
          </span>
          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              onClick={handleBulkDelete}
              className="text-[12px] font-medium text-white/90 hover:text-white px-[10px] h-[28px] rounded-[6px] hover:bg-white/10 transition-colors"
            >
              Excluir
            </button>
            <button
              type="button"
              onClick={() => setSelectedRows(new Set())}
              className="text-[12px] font-medium text-white/70 hover:text-white px-[10px] h-[28px] rounded-[6px] hover:bg-white/10 transition-colors"
            >
              Desmarcar
            </button>
          </div>
        </div>
      )}

      {/* Table header */}
      <div
        className="absolute rounded-[10px] bg-[#fafafa] border border-[#ececec] grid items-center h-[40px] px-[14px] font-[var(--font-jakarta)]"
        style={{
          left: COL_LEFT,
          right: rightAnchor,
          top: selectedRows.size > 0 ? 470 : 410,
          gridTemplateColumns: detailsOpen
            ? "28px 1.6fr 0.8fr 80px 110px"
            : "28px 1.6fr 1fr 110px 100px 120px 140px 60px",
          columnGap: 12,
          transition: "right 320ms cubic-bezier(0.32, 0.72, 0, 1), top 220ms ease",
        }}
      >
        <button
          type="button"
          onClick={toggleAll}
          aria-label="Selecionar todos"
          className={`w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center transition-colors ${
            allVisibleSelected
              ? "bg-[#47535f] border-[#47535f]"
              : "border-[#d1d5db] hover:border-[#9ca3af] bg-white"
          }`}
        >
          {allVisibleSelected && <Check size={10} strokeWidth={3} className="text-white" />}
        </button>
        <HeaderCell>Medicação</HeaderCell>
        {!detailsOpen && <HeaderCell>Princípio ativo</HeaderCell>}
        {!detailsOpen && <HeaderCell>Lote</HeaderCell>}
        <HeaderCell className="text-right">Qtd</HeaderCell>
        {!detailsOpen && <HeaderCell>Validade</HeaderCell>}
        <HeaderCell>Status</HeaderCell>
        {!detailsOpen && <HeaderCell className="text-right">Ações</HeaderCell>}
      </div>

      {/* Table body */}
      <div
        className="absolute overflow-y-auto pr-[4px]"
        style={{
          left: COL_LEFT,
          right: rightAnchor,
          top: selectedRows.size > 0 ? 522 : 462,
          bottom: 70,
          transition: "right 320ms cubic-bezier(0.32, 0.72, 0, 1), top 220ms ease",
        }}
      >
        {!hydrated ? null : visible.length === 0 ? (
          <EmptyState onClick={() => setNovaOpen(true)} />
        ) : (
          <div className="flex flex-col">
            {visible.map((m) => (
              <TableRow
                key={m.id}
                medicacao={m}
                selected={m.id === selectedId}
                checked={selectedRows.has(m.id)}
                onCheck={() => toggleRow(m.id)}
                onOpen={() => onSelect(m.id)}
                onDuplicate={() => handleDuplicate(m)}
                onDelete={() => handleDelete(m)}
                detailsOpen={detailsOpen}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer counter */}
      <div
        className="absolute flex items-center justify-between px-[4px]"
        style={{ left: COL_LEFT, right: rightAnchor, bottom: 30, height: 28, transition: "right 320ms cubic-bezier(0.32, 0.72, 0, 1)" }}
      >
        <p className="text-[11px] text-[#9f9f9f] font-[var(--font-jakarta)]">
          Mostrando {visible.length} de {medicacoes.length} medicações
        </p>
        <p className="text-[11px] text-[#9f9f9f] font-[var(--font-jakarta)]">
          Atualizado há poucos segundos
        </p>
      </div>

      <NovaMedicacaoForm open={novaOpen} onOpenChange={setNovaOpen} />
    </>
  );
}

function HeaderCell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-[11px] font-semibold uppercase tracking-wider text-[#8a929a] truncate ${className}`}>
      {children}
    </p>
  );
}

function SummaryCard({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`h-[96px] rounded-[12px] border bg-white px-[18px] flex flex-col justify-center text-left transition-all ${
        active
          ? "border-[#47535f] shadow-[0_4px_12px_rgba(71,83,95,0.15)]"
          : "border-[#ececec] hover:border-[#d1d5db] hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className="flex items-center gap-[10px] mb-[8px]">
        <div
          className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        <p className="text-[11px] uppercase tracking-wider font-semibold text-[#8a929a] font-[var(--font-jakarta)]">
          {label}
        </p>
      </div>
      <p className="text-[28px] font-light text-[#1e1e1e] font-[var(--font-zalando-stack)] leading-none">
        {value.toString().padStart(2, "0")}
      </p>
    </button>
  );
}

function FilterDropdown({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const current = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-[44px] min-w-[140px] px-[14px] rounded-[10px] border border-[#ececec] bg-white flex items-center justify-between gap-[10px] text-[12px] font-medium font-[var(--font-jakarta)] text-[#47535f] hover:bg-[#fafafa] transition-colors"
        >
          <span className="text-[#8a929a] shrink-0">{label}:</span>
          <span className="text-[#1e1e1e] flex-1 text-left truncate">
            {current?.label}
          </span>
          <ChevronDown size={14} className="text-[#8a929a] shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((o) => (
          <DropdownMenuItem key={o.value} onSelect={() => onChange(o.value)}>
            {o.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function TableRow({
  medicacao,
  selected,
  checked,
  onCheck,
  onOpen,
  onDuplicate,
  onDelete,
  detailsOpen,
}: {
  medicacao: Medicacao;
  selected: boolean;
  checked: boolean;
  onCheck: () => void;
  onOpen: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  detailsOpen: boolean;
}) {
  const st = derivedStatus(medicacao);
  const tone = statusTone[st];
  const qty = medicacao.quantidade ?? 0;
  const min = medicacao.estoqueMinimo ?? 0;
  const qtyLow = qty < min;
  const days = daysUntil(medicacao.validade);
  const vencendo = days >= 0 && days <= 30;
  const vencido = days < 0;

  return (
    <div
      className={`grid items-center px-[14px] h-[60px] rounded-[10px] font-[var(--font-jakarta)] transition-colors border-b border-[#f4f4f4] ${
        selected ? "bg-[#fafbfc]" : "hover:bg-[#fafbfc]"
      }`}
      style={{
        gridTemplateColumns: detailsOpen
          ? "28px 1.6fr 0.8fr 80px 110px"
          : "28px 1.6fr 1fr 110px 100px 120px 140px 60px",
        columnGap: 12,
      }}
    >
      <button
        type="button"
        onClick={onCheck}
        aria-label="Selecionar"
        className={`w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center transition-colors ${
          checked
            ? "bg-[#47535f] border-[#47535f]"
            : "border-[#d1d5db] hover:border-[#9ca3af] bg-white"
        }`}
      >
        {checked && <Check size={10} strokeWidth={3} className="text-white" />}
      </button>

      <button
        type="button"
        onClick={onOpen}
        className="flex items-center gap-[10px] min-w-0 text-left"
      >
        <div className="w-[32px] h-[32px] rounded-[8px] bg-[#e7f0f7] text-[#5b7c99] flex items-center justify-center shrink-0">
          <Package size={15} strokeWidth={1.8} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[#1e1e1e] truncate leading-tight">
            {medicacao.nome}
          </p>
          <p className="text-[11px] text-[#9f9f9f] truncate mt-[2px]">
            {medicacao.dosagem}
            {medicacao.forma ? ` · ${medicacao.forma}` : ""}
          </p>
        </div>
      </button>

      {!detailsOpen && (
        <p className="text-[12px] text-[#47535f] truncate">
          {medicacao.principio ?? "—"}
        </p>
      )}

      {!detailsOpen && (
        <p className="text-[12px] text-[#47535f] truncate">
          {medicacao.lote ?? "—"}
        </p>
      )}

      <p
        className={`text-[13px] font-semibold tabular-nums text-right ${
          qtyLow ? "text-[#c1846e]" : "text-[#1e1e1e]"
        }`}
      >
        {qty.toString().padStart(2, "0")} un
      </p>

      {!detailsOpen && (
        <p
          className={`text-[12px] ${
            vencido
              ? "text-[#4b5563] font-semibold"
              : vencendo
                ? "text-[#c1846e] font-semibold"
                : "text-[#47535f]"
          }`}
        >
          {formatDateBR(medicacao.validade)}
        </p>
      )}

      <span
        className="inline-flex items-center gap-[6px] h-[24px] px-[10px] rounded-full text-[11px] font-semibold w-fit"
        style={{ background: tone.bg, color: tone.text }}
      >
        <span className="w-[6px] h-[6px] rounded-full" style={{ background: tone.dot }} />
        {st}
      </span>

      {!detailsOpen && (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="Ações"
                className="w-[30px] h-[30px] rounded-[8px] border border-[#ececec] bg-white hover:bg-[#fafafa] flex items-center justify-center transition-colors"
              >
                <MoreVertical size={14} className="text-[#8a929a]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={onOpen}>Ver detalhes</DropdownMenuItem>
              <DropdownMenuItem onSelect={onDuplicate}>Duplicar</DropdownMenuItem>
              <DropdownMenuItem onSelect={onDelete}>Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-[60px] text-center">
      <div className="w-[64px] h-[64px] rounded-full bg-[#fafafa] flex items-center justify-center mb-[14px]">
        <XCircle size={28} className="text-[#b0aea4]" strokeWidth={1.6} />
      </div>
      <p className="text-[14px] font-medium text-[#47535f] font-[var(--font-jakarta)]">
        Nenhuma medicação encontrada
      </p>
      <p className="text-[11px] text-[#9f9f9f] mt-[4px] font-[var(--font-jakarta)] mb-[20px]">
        Ajuste os filtros ou cadastre uma nova
      </p>
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-[8px] h-[38px] px-[16px] rounded-[10px] bg-[#2c3e4a] text-white text-[12px] font-semibold font-[var(--font-jakarta)] hover:bg-[#23323c] transition-colors"
      >
        <Plus size={14} strokeWidth={2.4} />
        Cadastrar primeira medicação
      </button>
    </div>
  );
}
