"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarClock,
  ChevronDown,
  FileSpreadsheet,
  Package,
  PackageCheck,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMedicacoesStore } from "@/stores/useMedicacoesStore";
import { useFornecedoresStore } from "@/stores/useFornecedoresStore";
import { useHydrate } from "@/stores/useHydrate";
import { toast } from "@/components/ui/toast";
import { formatBRL } from "@/stores/format";
import NovaMedicacaoForm from "@/components/forms/NovaMedicacaoForm";
import NovoFornecedorForm from "@/components/forms/NovoFornecedorForm";
import UserMenu from "@/components/UserMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  FornecedorCategoria,
  Medicacao,
  MedicacaoStatus,
} from "@/types";

const COL_LEFT = 360;
const PAD_R = 40;

type Periodo = "7d" | "30d" | "90d";

type Props = {
  categoria: FornecedorCategoria;
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

// Mock movimentações (demo seed — not persistent)
type Movimento = {
  id: string;
  tipo: "entrada" | "saida" | "ajuste";
  item: string;
  qtd: number;
  autor: string;
  quando: string;
};

const movimentosMock: Movimento[] = [
  { id: "mv1", tipo: "entrada", item: "Dipirona 500mg", qtd: 50, autor: "Enf. João", quando: "há 12 min" },
  { id: "mv2", tipo: "saida", item: "Fentanila 0,05mg", qtd: 4, autor: "Dr. Ricardo", quando: "há 1h" },
  { id: "mv3", tipo: "saida", item: "Midazolam 5mg", qtd: 2, autor: "Sala 3", quando: "há 2h" },
  { id: "mv4", tipo: "entrada", item: "Cefazolina 1g", qtd: 30, autor: "Farmácia", quando: "há 3h" },
  { id: "mv5", tipo: "ajuste", item: "Heparina 5000 UI", qtd: -3, autor: "Inventário", quando: "ontem" },
  { id: "mv6", tipo: "entrada", item: "Propofol 10mg", qtd: 20, autor: "Farmácia", quando: "ontem" },
  { id: "mv7", tipo: "saida", item: "Cetoprofeno 100mg", qtd: 6, autor: "Sala 2", quando: "ontem" },
];

const CAT_COLORS: Record<FornecedorCategoria, string> = {
  "Medicações": "#5b7c99",
  "Materiais": "#6aa380",
  "Campos e Aventais": "#8a6ec1",
  "Fios": "#c1a86e",
  "Curativos": "#c1846e",
  "Assepsia": "#6ec1a8",
  "Soluções": "#b3a256",
  "CME": "#7ca598",
  "Gases Medicinais": "#5b99c1",
};

const ALL_CATEGORIAS: FornecedorCategoria[] = [
  "Medicações",
  "Materiais",
  "Campos e Aventais",
  "Fios",
  "Curativos",
  "Assepsia",
  "Soluções",
  "CME",
  "Gases Medicinais",
];

export default function EstoqueMedicacoes({ categoria }: Props) {
  const hydrated = useHydrate();
  const medicacoes = useMedicacoesStore((s) => s.items);
  const fornecedores = useFornecedoresStore((s) => s.items);

  const [periodo, setPeriodo] = useState<Periodo>("30d");
  const [novoMedOpen, setNovoMedOpen] = useState(false);
  const [novoFornOpen, setNovoFornOpen] = useState(false);

  // Global KPIs
  const kpis = useMemo(() => {
    let total = 0;
    let baixo = 0;
    let vencendo = 0;
    let valorEstimado = 0;
    for (const m of medicacoes) {
      total++;
      const st = derivedStatus(m);
      if (st === "Baixa" || st === "Esgotado") baixo++;
      const days = daysUntil(m.validade);
      if (days >= 0 && days <= 30) vencendo++;
      const precoMed =
        m.fornecedores.length > 0
          ? m.fornecedores.reduce((s, f) => s + f.preco, 0) / m.fornecedores.length
          : 0;
      valorEstimado += precoMed * (m.quantidade ?? 0);
    }
    return {
      total,
      baixo,
      vencendo,
      valorEstimado,
      fornecedores: fornecedores.length,
    };
  }, [medicacoes, fornecedores]);

  // Inventory by category (counts, not just Medicações)
  const inventarioPorCategoria = useMemo(() => {
    const map = new Map<FornecedorCategoria, number>();
    for (const m of medicacoes) {
      const c = m.categoria ?? "Medicações";
      map.set(c, (map.get(c) ?? 0) + (m.quantidade ?? 0));
    }
    const arr = ALL_CATEGORIAS.map((c) => ({
      categoria: c,
      qtd: map.get(c) ?? 0,
    }));
    const max = Math.max(...arr.map((a) => a.qtd), 1);
    return { arr, max };
  }, [medicacoes]);

  // Critical items (the heart of the dashboard — what needs action)
  const itensCriticos = useMemo(() => {
    return medicacoes
      .map((m) => ({ m, st: derivedStatus(m), days: daysUntil(m.validade) }))
      .filter(({ st, days }) => st !== "Disponível" || (days >= 0 && days <= 30))
      .sort((a, b) => {
        const rank = (x: { st: MedicacaoStatus; days: number }) => {
          if (x.st === "Vencido") return 0;
          if (x.st === "Esgotado") return 1;
          if (x.st === "Baixa") return 2;
          return 3;
        };
        return rank(a) - rank(b);
      })
      .slice(0, 6);
  }, [medicacoes]);

  return (
    <>
      {/* Top-right cluster */}
      <div
        className="absolute flex items-center gap-[14px]"
        style={{ right: 40, top: 45 }}
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
        style={{ left: COL_LEFT, top: 38, width: 420 }}
      >
        <p className="text-[12px] font-medium text-[#1e1e1e]">Estoque</p>
        <p className="text-[12px] text-[#9f9f9f] leading-[20px]">
          Início › Estoque
        </p>
      </div>

      {/* Divider */}
      <div
        className="absolute"
        style={{ left: COL_LEFT - 16, right: 0, top: 104, height: 1, background: "#f0f0f0" }}
      />

      {/* Title + actions */}
      <div
        className="absolute flex items-end justify-between gap-[20px]"
        style={{ left: COL_LEFT, right: PAD_R, top: 124 }}
      >
        <div className="font-[var(--font-zalando-stack)] min-w-0">
          <p className="text-[22px] font-light text-[#1e1e1e] leading-[1.2]">
            Visão geral do estoque
          </p>
          <p className="text-[12px] font-medium text-[#b0aea4] mt-[6px]">
            O que precisa de atenção agora · {categoria}
          </p>
        </div>
        <div className="flex items-center gap-[14px] shrink-0">
          <PeriodoDropdown value={periodo} onChange={setPeriodo} />
          <button
            type="button"
            onClick={() => toast.info("Importação em breve")}
            className="shrink-0 inline-flex items-center gap-[8px] h-[44px] px-[20px] rounded-[12px] border border-[#ececec] bg-white text-[12px] font-medium font-[var(--font-jakarta)] text-[#47535f] hover:bg-[#fafafa] transition-colors whitespace-nowrap"
          >
            <FileSpreadsheet size={14} strokeWidth={1.8} />
            Importar planilha
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="shrink-0 inline-flex items-center justify-center gap-[10px] h-[44px] pl-[20px] pr-[16px] rounded-[12px] bg-[#2c3e4a] text-white text-[13px] font-semibold font-[var(--font-jakarta)] hover:bg-[#23323c] transition-colors shadow-[0_4px_12px_rgba(44,62,74,0.22)] whitespace-nowrap"
              >
                <Plus size={15} strokeWidth={2.6} />
                Novo Item
                <ChevronDown size={14} strokeWidth={2} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setNovoMedOpen(true)}>
                Nova Medicação / Insumo
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setNovoFornOpen(true)}>
                Novo Fornecedor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* HERO ROW: Valor estimado + 3 quick stats + 2 hero widgets side by side */}
      {/* Stat band (single horizontal card with 4 stats) */}
      <div
        className="absolute rounded-[14px] border border-[#ececec] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex"
        style={{ left: COL_LEFT, right: PAD_R, top: 216, height: 106 }}
      >
        <HeroStat
          label="Valor em estoque"
          value={hydrated ? formatBRL(kpis.valorEstimado) : "R$ —"}
          hint="+ R$ 4.120 este mês"
          tone="neutral"
          icon={<Package size={16} strokeWidth={1.8} />}
          iconBg="#e7f0f7"
          iconColor="#5b7c99"
          trend="up"
        />
        <StatDivider />
        <HeroStat
          label="Itens cadastrados"
          value={hydrated ? String(kpis.total).padStart(2, "0") : "—"}
          hint="+12 este mês"
          tone="neutral"
          icon={<PackageCheck size={16} strokeWidth={1.8} />}
          iconBg="#e9f5ef"
          iconColor="#6aa380"
          trend="up"
        />
        <StatDivider />
        <HeroStat
          label="Precisam de ação"
          value={hydrated ? String(kpis.baixo + kpis.vencendo).padStart(2, "0") : "—"}
          hint={`${kpis.baixo} baixo · ${kpis.vencendo} vencendo`}
          tone="warning"
          icon={<AlertTriangle size={16} strokeWidth={1.8} />}
          iconBg="#fbf6e7"
          iconColor="#b3a256"
          trend="down"
        />
        <StatDivider />
        <HeroStat
          label="Fornecedores ativos"
          value={hydrated ? String(kpis.fornecedores).padStart(2, "0") : "—"}
          hint="2 pendentes"
          tone="neutral"
          icon={<Building2 size={16} strokeWidth={1.8} />}
          iconBg="#f0ebf8"
          iconColor="#8a6ec1"
        />
      </div>

      {/* TWO-COLUMN WIDGET ROW: Inventário bar chart (left) + Movimentações feed (right) */}
      <div
        className="absolute rounded-[14px] border border-[#ececec] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
        style={{ left: COL_LEFT, top: 344, width: 1020, height: 360, padding: "28px 30px" }}
      >
        <div className="flex items-center justify-between mb-[22px]">
          <div className="flex flex-col gap-[4px]">
            <p className="text-[14px] font-semibold text-[#1e1e1e] font-[var(--font-zalando-stack)] leading-none">
              Inventário por categoria
            </p>
            <p className="text-[11px] text-[#9f9f9f] font-[var(--font-jakarta)] leading-none">
              Unidades em estoque por tipo de insumo
            </p>
          </div>
          <span className="text-[11px] text-[#9f9f9f] font-[var(--font-jakarta)]">
            total {inventarioPorCategoria.arr.reduce((s, c) => s + c.qtd, 0)} un
          </span>
        </div>
        <div className="flex flex-col gap-[14px]">
          {inventarioPorCategoria.arr.map((c) => {
            const pct = c.qtd === 0 ? 0 : (c.qtd / inventarioPorCategoria.max) * 100;
            return (
              <div key={c.categoria} className="flex items-center gap-[16px]">
                <p className="w-[150px] text-[12px] font-medium text-[#47535f] truncate font-[var(--font-jakarta)]">
                  {c.categoria}
                </p>
                <div className="flex-1 h-[8px] rounded-full bg-[#f4f4f4] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: hydrated ? `${pct}%` : "0%",
                      background: CAT_COLORS[c.categoria],
                    }}
                  />
                </div>
                <p className="w-[64px] text-right text-[12px] font-semibold tabular-nums text-[#1e1e1e] font-[var(--font-jakarta)]">
                  {c.qtd}
                  <span className="text-[10px] text-[#9f9f9f] font-normal ml-[3px]">un</span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Movimentações feed (right side) */}
      <div
        className="absolute rounded-[14px] border border-[#ececec] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col"
        style={{ left: 1370, right: PAD_R, top: 344, height: 360, padding: "28px 24px" }}
      >
        <div className="flex items-center justify-between mb-[18px]">
          <div className="flex flex-col gap-[4px]">
            <p className="text-[14px] font-semibold text-[#1e1e1e] font-[var(--font-zalando-stack)] leading-none">
              Movimentações recentes
            </p>
            <p className="text-[11px] text-[#9f9f9f] font-[var(--font-jakarta)] leading-none">
              Entradas, saídas e ajustes
            </p>
          </div>
        </div>
        <div
          className="flex-1 overflow-y-auto flex flex-col gap-[6px] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {movimentosMock.map((mv) => (
            <MovimentoRow key={mv.id} mv={mv} />
          ))}
        </div>
        <button
          type="button"
          onClick={() => toast.info("Histórico completo em breve")}
          className="mt-[14px] inline-flex items-center justify-center gap-[6px] h-[36px] rounded-[8px] text-[12px] font-semibold text-[#47535f] hover:bg-[#fafafa] transition-colors font-[var(--font-jakarta)] border border-[#ececec]"
        >
          Ver histórico completo
          <ArrowRight size={13} strokeWidth={2.2} />
        </button>
      </div>

      {/* ITENS CRÍTICOS — grid of cards */}
      <div
        className="absolute"
        style={{ left: COL_LEFT, right: PAD_R, top: 728 }}
      >
        <div className="flex items-center justify-between mb-[16px]">
          <div>
            <p className="text-[14px] font-semibold text-[#1e1e1e] font-[var(--font-zalando-stack)]">
              Itens críticos · precisa de ação
            </p>
            <p className="text-[11px] text-[#9f9f9f] font-[var(--font-jakarta)] mt-[2px]">
              Vencidos, esgotados e abaixo do estoque mínimo
            </p>
          </div>
          <Link
            href="/medicacoes"
            className="text-[12px] font-semibold text-[#47535f] hover:text-[#1e1e1e] transition-colors font-[var(--font-jakarta)] inline-flex items-center gap-[4px]"
          >
            Ver catálogo completo
            <ArrowRight size={13} strokeWidth={2.2} />
          </Link>
        </div>

        {hydrated && itensCriticos.length === 0 ? (
          <div className="rounded-[14px] border border-[#ececec] bg-white p-[40px] text-center">
            <PackageCheck size={34} className="text-[#6aa380] mx-auto mb-[10px]" strokeWidth={1.6} />
            <p className="text-[14px] font-semibold text-[#1e1e1e] font-[var(--font-jakarta)]">
              Tudo em ordem
            </p>
            <p className="text-[11px] text-[#9f9f9f] font-[var(--font-jakarta)] mt-[4px]">
              Nenhum item precisa de atenção agora
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-[12px]">
            {itensCriticos.map(({ m, st, days }) => (
              <CriticalCard key={m.id} medicacao={m} status={st} days={days} />
            ))}
          </div>
        )}
      </div>

      <NovaMedicacaoForm open={novoMedOpen} onOpenChange={setNovoMedOpen} />
      <NovoFornecedorForm open={novoFornOpen} onOpenChange={setNovoFornOpen} />
    </>
  );
}

function StatDivider() {
  return (
    <div className="my-[18px] w-[1px] bg-[#ececec]" style={{ height: 70 }} />
  );
}

function HeroStat({
  label,
  value,
  hint,
  tone,
  icon,
  iconBg,
  iconColor,
  trend,
}: {
  label: string;
  value: string;
  hint: string;
  tone: "neutral" | "warning" | "danger";
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: "up" | "down";
}) {
  const hintColor =
    tone === "warning" ? "#b3935e" : tone === "danger" ? "#c1846e" : "#8a929a";
  const trendColor = trend === "up" ? "#6aa380" : "#c1846e";
  return (
    <div className="flex-1 flex flex-col gap-[10px]" style={{ padding: "22px 28px" }}>
      <div className="flex items-center gap-[10px]">
        <div
          className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        <p className="text-[11px] uppercase tracking-wider font-semibold text-[#8a929a] font-[var(--font-jakarta)] truncate">
          {label}
        </p>
      </div>
      <div className="flex items-baseline gap-[10px] pl-[2px]">
        <p className="text-[24px] font-light text-[#1e1e1e] font-[var(--font-zalando-stack)] leading-none tracking-tight">
          {value}
        </p>
        {trend && (
          <span className="inline-flex items-center" style={{ color: trendColor }}>
            {trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          </span>
        )}
      </div>
      <p className="text-[11px] font-medium font-[var(--font-jakarta)] truncate pl-[2px]" style={{ color: hintColor }}>
        {hint}
      </p>
    </div>
  );
}

function MovimentoRow({ mv }: { mv: Movimento }) {
  const tipoConfig = {
    entrada: {
      icon: <ArrowDownLeft size={14} strokeWidth={2} />,
      bg: "#e9f5ef",
      color: "#6aa380",
      label: "Entrada",
      sign: "+",
    },
    saida: {
      icon: <ArrowUpRight size={14} strokeWidth={2} />,
      bg: "rgba(193,132,110,0.12)",
      color: "#c1846e",
      label: "Saída",
      sign: "-",
    },
    ajuste: {
      icon: <AlertTriangle size={14} strokeWidth={2} />,
      bg: "#fbf6e7",
      color: "#b3a256",
      label: "Ajuste",
      sign: "",
    },
  }[mv.tipo];
  return (
    <div className="flex items-center gap-[12px] py-[10px] px-[10px] rounded-[8px] hover:bg-[#fafbfc] transition-colors">
      <div
        className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center shrink-0"
        style={{ background: tipoConfig.bg, color: tipoConfig.color }}
      >
        {tipoConfig.icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-semibold text-[#1e1e1e] truncate font-[var(--font-jakarta)] leading-tight">
          {mv.item}
        </p>
        <p className="text-[10px] text-[#9f9f9f] truncate font-[var(--font-jakarta)] mt-[3px]">
          {tipoConfig.label} · {mv.autor} · {mv.quando}
        </p>
      </div>
      <p className="text-[12px] font-semibold tabular-nums font-[var(--font-jakarta)] shrink-0 ml-[4px]" style={{ color: tipoConfig.color }}>
        {tipoConfig.sign}
        {Math.abs(mv.qtd)} un
      </p>
    </div>
  );
}

function CriticalCard({
  medicacao,
  status,
  days,
}: {
  medicacao: Medicacao;
  status: MedicacaoStatus;
  days: number;
}) {
  const qty = medicacao.quantidade ?? 0;
  const min = medicacao.estoqueMinimo ?? 0;
  const vencendo = days >= 0 && days <= 30 && status !== "Vencido";

  const config =
    status === "Vencido"
      ? { bg: "#e5e7eb", color: "#4b5563", label: "Vencido", msg: `há ${Math.abs(days)} dias` }
      : status === "Esgotado"
        ? { bg: "rgba(193,132,110,0.12)", color: "#b77660", label: "Esgotado", msg: "0 unidades" }
        : status === "Baixa"
          ? { bg: "#fef6e7", color: "#b3935e", label: "Baixo", msg: `${qty} de ${min} un (mín.)` }
          : vencendo
            ? { bg: "rgba(193,132,110,0.10)", color: "#b77660", label: "Vencendo", msg: `em ${days} dias` }
            : { bg: "#ebf8ee", color: "#5e9a72", label: "OK", msg: "" };

  return (
    <div className="rounded-[14px] border border-[#ececec] bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-shadow" style={{ padding: "20px 22px" }}>
      <div className="flex items-start justify-between mb-[16px]">
        <div className="w-[38px] h-[38px] rounded-[10px] bg-[#e7f0f7] text-[#5b7c99] flex items-center justify-center">
          <Package size={17} strokeWidth={1.8} />
        </div>
        <span
          className="inline-flex items-center gap-[6px] h-[24px] px-[10px] rounded-full text-[10px] font-semibold"
          style={{ background: config.bg, color: config.color }}
        >
          <span className="w-[5px] h-[5px] rounded-full" style={{ background: config.color }} />
          {config.label}
        </span>
      </div>
      <p className="text-[14px] font-semibold text-[#1e1e1e] font-[var(--font-zalando-stack)] truncate leading-tight">
        {medicacao.nome}
      </p>
      <p className="text-[11px] text-[#9f9f9f] mt-[4px] truncate font-[var(--font-jakarta)]">
        {medicacao.dosagem} · Lote {medicacao.lote ?? "—"}
      </p>
      <div className="mt-[16px] pt-[14px] border-t border-[#f0f0f0] flex items-center justify-between">
        <p className="text-[10px] text-[#9f9f9f] uppercase tracking-wider font-semibold font-[var(--font-jakarta)]">
          {status === "Vencido" ? "Venceu" : status === "Baixa" || status === "Esgotado" ? "Estoque" : "Vence"}
        </p>
        <p className="text-[11px] font-semibold font-[var(--font-jakarta)]" style={{ color: config.color }}>
          {config.msg || formatDateBR(medicacao.validade)}
        </p>
      </div>
    </div>
  );
}

function PeriodoDropdown({
  value,
  onChange,
}: {
  value: Periodo;
  onChange: (p: Periodo) => void;
}) {
  const options: { value: Periodo; label: string }[] = [
    { value: "7d", label: "Últimos 7 dias" },
    { value: "30d", label: "Últimos 30 dias" },
    { value: "90d", label: "Últimos 90 dias" },
  ];
  const current = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="shrink-0 inline-flex items-center gap-[8px] h-[44px] px-[20px] rounded-[12px] border border-[#ececec] bg-white text-[12px] font-medium font-[var(--font-jakarta)] text-[#47535f] hover:bg-[#fafafa] transition-colors whitespace-nowrap"
        >
          <CalendarClock size={13} strokeWidth={1.8} className="text-[#8a929a]" />
          {current?.label}
          <ChevronDown size={14} className="text-[#8a929a]" />
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
