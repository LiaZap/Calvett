"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ChevronDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { useLancamentosStore } from "@/stores/useLancamentosStore";
import { usePacientesStore } from "@/stores/usePacientesStore";
import { useFornecedoresStore } from "@/stores/useFornecedoresStore";
import { useHydrate } from "@/stores/useHydrate";
import { useControlMenuStore } from "@/stores/useControlMenuStore";
import { formatBRL } from "@/stores/format";

// 30-bar chart heights (percent) — mimics Figma decorative chart
const barHeights = [
  70, 60, 95, 80, 88, 72, 66, 75, 58, 82, 68, 78, 62, 90, 54, 85, 70, 64, 92,
  60, 74, 50, 82, 46, 70, 42, 66, 38, 58, 30,
];

// All 30 bars represent days of the month — all filled in blue gradient

const navItems = [
  { href: "/", icon: "solar_home-2-bold.svg", label: "Dashboard" },
  { href: "/agendados", icon: "solar_bookmark-circle-bold.svg", label: "Agendados" },
  { href: "/financeiro", icon: "solar_chat-round-money-bold.svg", label: "Financeiro" },
  { href: "/atividade", icon: "solar_pulse-bold.svg", label: "Atividade" },
  { href: "/estoque", icon: "solar_box-bold.svg", label: "Estoque" },
  { href: "/medicacoes", icon: "solar_add-folder-bold.svg", label: "Medicações" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const hydrated = useHydrate();
  const lancamentos = useLancamentosStore((s) => s.items);
  const pacientes = usePacientesStore((s) => s.items);
  const fornecedores = useFornecedoresStore((s) => s.items);
  const toggleControlMenu = useControlMenuStore((s) => s.toggle);

  const stats = useMemo(() => {
    let receitasMes = 0;
    let recebidoAcumulado = 0;
    let totalReceitas = 0;
    let totalDespesas = 0;
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    for (const l of lancamentos) {
      if (l.tipo === "Receita") {
        totalReceitas += l.valor;
        if (l.status === "Pago") recebidoAcumulado += l.valor;
        if (l.data.startsWith(monthPrefix)) receitasMes += l.valor;
      } else {
        totalDespesas += l.valor;
      }
    }

    return {
      faturamentoMes: receitasMes,
      recebido: recebidoAcumulado,
      receitasValue: totalReceitas,
      despesasValue: totalDespesas,
    };
  }, [lancamentos]);

  const pacientesCount = String(hydrated ? pacientes.length : 0).padStart(2, "0");
  const fornecedoresCount = String(hydrated ? fornecedores.length : 0).padStart(2, "0");
  const primeiroPaciente = pacientes[0]?.nome ?? "Adriana Goes";
  const primeiroFornecedor = fornecedores[0]?.nome ?? "Medekit";

  return (
    <>
      {/* Base background (full dark sidebar) */}
      <div
        className="absolute bg-[#47535f]"
        style={{ left: 0, top: 0, width: 604, height: 1080 }}
      />
      {/* Inner overlay (slightly lighter panel) */}
      <div
        className="absolute"
        style={{
          left: 217,
          top: 0,
          width: 387,
          height: 1080,
          background: "rgba(95,120,142,0.08)",
        }}
      />
      {/* Vertical divider — nav rail separator */}
      <div
        className="absolute"
        style={{
          left: 92,
          top: 0,
          width: 1,
          height: 1080,
          background: "rgba(255,255,255,0.06)",
        }}
      />

      {/* Nav rail: collapse arrow (top) + icons (middle) + settings (bottom) */}
      <button
        type="button"
        onClick={toggleControlMenu}
        aria-label="Abrir Painel de Controle"
        className="absolute flex items-center justify-center hover:opacity-100 transition-opacity cursor-pointer"
        style={{ left: 34, top: 48, width: 24, height: 24 }}
      >
        <Image
          src="/icons/solar_alt-arrow-left-linear.svg"
          alt=""
          width={24}
          height={24}
          className="opacity-75"
        />
      </button>
      <div
        className="absolute flex flex-col gap-[28px] items-center"
        style={{ left: 34, top: 360, width: 24 }}
      >
        {navItems.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-label={it.label}
              className={`transition-opacity ${active ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
            >
              <Image src={`/icons/${it.icon}`} alt="" width={24} height={24} />
            </Link>
          );
        })}
      </div>
      <Link
        href="/configuracoes"
        aria-label="Configurações"
        className="absolute opacity-75 hover:opacity-100 transition-opacity"
        style={{ left: 34, top: 1008, width: 24, height: 24 }}
      >
        <Image src="/icons/solar_settings-bold.svg" alt="" width={24} height={24} />
      </Link>

      {/* Hospital da Plástica card (top-left of content area) */}
      <div
        className="absolute flex items-center gap-[10px] bg-white/5 rounded-[28px] pr-[14px] pl-[6px] py-[6px]"
        style={{ left: 142, top: 42, width: 220, height: 54 }}
      >
        <div className="relative w-[42px] h-[42px] rounded-full overflow-hidden shrink-0 bg-white/10">
          <Image src="/avatar.png" alt="" fill sizes="42px" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-[1.1] text-white/85 truncate font-[var(--font-zalando-stack)]">
            Hospital da Plástica
          </p>
          <p className="text-[12px] text-[#b8b8b8] truncate font-[var(--font-zalando-stack)]">
            Conta Jurídica
          </p>
        </div>
        <ChevronDown size={16} className="text-[#c2d5e8] shrink-0" />
      </div>

      {/* Top-right action buttons (settings + hamburger) */}
      <button
        type="button"
        aria-label="Configurações"
        className="absolute rounded-[17px] bg-[rgba(0,0,0,0.32)] flex items-center justify-center hover:bg-[rgba(0,0,0,0.42)] transition-colors"
        style={{ left: 384, top: 48, width: 42, height: 42 }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c2d5e8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Menu"
        className="absolute rounded-[17px] bg-[rgba(0,0,0,0.32)] flex items-center justify-center hover:bg-[rgba(0,0,0,0.42)] transition-colors"
        style={{ left: 432, top: 48, width: 42, height: 42 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c2d5e8" strokeWidth="1.6" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Active home tile */}
      <div
        className="absolute rounded-[25px] flex items-center justify-center"
        style={{
          left: 142,
          top: 146,
          width: 64,
          height: 64,
          background: "rgba(48,56,65,0.5)",
        }}
      >
        <Image src="/icons/solar_home-2-bold.svg" alt="" width={26} height={26} />
      </div>

      {/* Dashboard heading */}
      <p
        className="absolute text-[33px] leading-normal font-normal text-[#c2d5e8] font-[var(--font-zalando-stack)]"
        style={{ left: 142, top: 250 }}
      >
        Dashboard
      </p>
      <p
        className="absolute text-[13px] font-medium text-[rgba(224,237,251,0.58)] font-[var(--font-jakarta)]"
        style={{ left: 142, top: 290 }}
      >
        Principais informações financeiras compiladas
      </p>

      {/* Faturamento do Mês label */}
      <div className="absolute" style={{ left: 142, top: 360 }}>
        <p className="text-[14px] font-medium text-[#c2d5e8] font-[var(--font-zalando-stack)]">
          Faturamento do Mês
        </p>
        <p className="text-[10px] text-[#a0acb9] font-[var(--font-jakarta)] mt-[4px]">
          Detalhamento do Mês
        </p>
      </div>

      {/* "Aumentou 16%" badge — prominent pill */}
      <span
        className="absolute inline-flex items-center gap-[6px] bg-gradient-to-br from-[#3ccaff] to-[#008fcc] text-white text-[13px] font-bold font-[var(--font-jakarta)] px-[14px] py-[8px] rounded-full whitespace-nowrap shadow-[0_4px_16px_rgba(60,202,255,0.35)] ring-1 ring-inset ring-white/20"
        style={{ left: 380, top: 365 }}
      >
        <TrendingUp size={15} strokeWidth={2.4} />
        Aumentou 16%
      </span>

      {/* Bar chart — recharts with per-bar fill (mix of muted + blue highlight) */}
      <div
        aria-hidden
        className="absolute"
        style={{ left: 142, top: 430, width: 350, height: 110 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={barHeights.map((h, i) => ({
              i,
              v: h,
              fill: "url(#sidebarBarBlue)",
            }))}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="sidebarBarMuted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c2d5e8" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#c2d5e8" stopOpacity={0.25} />
              </linearGradient>
              <linearGradient id="sidebarBarBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3ccaff" stopOpacity={1} />
                <stop offset="100%" stopColor="#3ccaff" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <Bar
              dataKey="v"
              radius={[3, 3, 1, 1]}
              animationDuration={900}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Big amount — uses month receipts; falls back to total so dashboard never shows R$ 0,00 */}
      <p
        className="absolute text-[27px] leading-[1.1] text-[#c2d5e8] font-[var(--font-zalando-stack)]"
        style={{ left: 142, top: 585 }}
      >
        {hydrated
          ? formatBRL(stats.faturamentoMes > 0 ? stats.faturamentoMes : stats.receitasValue)
          : "R$ --"}
      </p>
      {/* Arrow button → navigates to /financeiro */}
      <Link
        href="/financeiro"
        aria-label="Abrir detalhes em Financeiro"
        className="absolute border border-[rgba(139,154,170,0.25)] rounded-[17px] flex items-center justify-center hover:bg-white/5 hover:border-[rgba(194,213,232,0.5)] transition-colors"
        style={{ left: 502, top: 589, width: 43, height: 43 }}
      >
        <Image src="/icons/solar_arrow-right-up-linear.svg" alt="" width={21} height={21} />
      </Link>

      {/* Recebido caption */}
      <p
        className="absolute text-[12px] text-[rgba(194,213,232,0.55)] font-[var(--font-jakarta)]"
        style={{ left: 142, top: 628 }}
      >
        Recebido até o momento de{" "}
        <span className="text-[#c2d5e8] font-medium">
          {hydrated ? formatBRL(stats.recebido) : "R$ --"}
        </span>
      </p>

      {/* Receitas / Despesas block */}
      <div className="absolute" style={{ left: 142, top: 720 }}>
        <Image
          src="/icons/solar_archive-down.svg"
          alt=""
          width={24}
          height={24}
        />
        <p className="text-[12px] text-[#8b9aaa] font-medium mt-[24px] font-[var(--font-zalando-stack)]">
          Receitas
        </p>
        <p className="text-[16px] text-[#c2d5e8] font-medium mt-[4px] font-[var(--font-zalando-stack)]">
          {hydrated ? formatBRL(stats.receitasValue) : "R$ --"}
        </p>
        <p className="text-[10px] text-[rgba(194,213,232,0.55)] font-[var(--font-jakarta)] mt-[4px]">
          Total 12.093,49
        </p>
      </div>
      <div className="absolute" style={{ left: 330, top: 720 }}>
        <Image
          src="/icons/solar_archive-up.svg"
          alt=""
          width={24}
          height={24}
        />
        <p className="text-[12px] text-[#8b9aaa] font-medium mt-[24px] font-[var(--font-zalando-stack)]">
          Despesas
        </p>
        <p className="text-[16px] text-[#c2d5e8] font-medium mt-[4px] font-[var(--font-zalando-stack)]">
          {hydrated ? formatBRL(stats.despesasValue) : "R$ --"}
        </p>
        <p className="text-[10px] text-[rgba(194,213,232,0.55)] font-[var(--font-jakarta)] mt-[4px]">
          Total 9.333,49
        </p>
      </div>

      {/* Pacientes / Fornecedores stacks — avatars with colored initials */}
      <PeopleStack
        left={142}
        top={930}
        count={pacientesCount}
        label="Pacientes"
        names={hydrated ? pacientes.slice(0, 3).map((p) => p.nome) : ["Adriana Goes", "Maria Silva", "Ana Paula"]}
        subtitle={
          hydrated && pacientes.length
            ? `${primeiroPaciente.split(" ").slice(0, 2).join(" ")} + ${Math.max(0, pacientes.length - 1)} Pacientes`
            : "Adriana Goes + 5 Pacientes"
        }
      />
      <PeopleStack
        left={330}
        top={930}
        count={fornecedoresCount}
        label="Fornecedores"
        names={hydrated ? fornecedores.slice(0, 3).map((f) => f.nome) : ["Medekit", "OPME Brasil", "CleanMed"]}
        subtitle={
          hydrated && fornecedores.length
            ? `${primeiroFornecedor.split(" ")[0]} e outros ${Math.max(0, fornecedores.length - 1)} Fornecedores`
            : "Medekit e outros 5 Fornecedores"
        }
      />
    </>
  );
}

// Colored avatar palette — deterministic by initials so names get consistent colors
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

function PeopleStack({
  left,
  top,
  count,
  label,
  names,
  subtitle,
}: {
  left: number;
  top: number;
  count: string;
  label: string;
  names: string[];
  subtitle: string;
}) {
  const avatars = names.slice(0, 3);
  while (avatars.length < 3) avatars.push("?");
  return (
    <div className="absolute" style={{ left, top, width: 180 }}>
      <div className="flex items-center mb-[10px]">
        {avatars.map((n, i) => {
          const c = colorFor(n);
          return (
            <div
              key={i}
              className="w-[30px] h-[30px] rounded-full flex items-center justify-center border-2 border-[#47535f] shadow-[0_1px_3px_rgba(0,0,0,0.2)]"
              style={{
                marginLeft: i === 0 ? 0 : -10,
                background: c.bg,
                color: c.text,
                zIndex: 3 - i,
              }}
            >
              <span className="text-[10px] font-semibold font-[var(--font-dm)] leading-none">
                {getInitials(n)}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-[12px] font-semibold text-[#c2d5e8] truncate font-[var(--font-dm)]">
        {count} {label}
      </p>
      <p className="text-[12px] text-[#8494a3] leading-[1.111] truncate mt-[4px] font-[var(--font-dm)]">
        {subtitle}
      </p>
    </div>
  );
}
