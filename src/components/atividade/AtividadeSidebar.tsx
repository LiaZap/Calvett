"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { usePacientesStore } from "@/stores/usePacientesStore";
import { useFornecedoresStore } from "@/stores/useFornecedoresStore";
import { useHydrate } from "@/stores/useHydrate";
import { useControlMenuStore } from "@/stores/useControlMenuStore";

const navItems = [
  { href: "/", icon: "solar_home-2-bold.svg", label: "Dashboard" },
  { href: "/agendados", icon: "solar_bookmark-circle-bold.svg", label: "Agendados" },
  { href: "/financeiro", icon: "solar_chat-round-money-bold.svg", label: "Financeiro" },
  { href: "/atividade", icon: "solar_pulse-bold.svg", label: "Atividade" },
  { href: "/estoque", icon: "solar_box-bold.svg", label: "Estoque" },
  { href: "/medicacoes", icon: "solar_add-folder-bold.svg", label: "Medicações" },
];

// 4 stat tiles — stats shown in the dark sidebar (2×2 grid)
const statTiles = [
  { value: "127", label: "Ações hoje", accent: "#5b7c99" },
  { value: "45", label: "Procedimentos", accent: "#6aa380" },
  { value: "18", label: "Agendamentos", accent: "#c1a86e" },
  { value: "08", label: "Alertas", accent: "#c1846e" },
];

export default function AtividadeSidebar() {
  const pathname = usePathname();
  const hydrated = useHydrate();
  const pacientes = usePacientesStore((s) => s.items);
  const fornecedores = useFornecedoresStore((s) => s.items);
  const toggleControlMenu = useControlMenuStore((s) => s.toggle);

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

      {/* Active atividade tile (pulse icon) */}
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
        <Image src="/icons/solar_pulse-bold.svg" alt="" width={26} height={26} />
      </div>

      {/* Live/Online chip (to the right of tile) */}
      <div
        className="absolute flex items-center gap-[8px] rounded-[12px] px-[12px] border border-[rgba(165,193,110,0.22)]"
        style={{
          left: 226,
          top: 167,
          height: 32,
          background: "rgba(165,193,110,0.10)",
        }}
      >
        <span className="relative flex shrink-0 h-[8px] w-[8px]">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[#a5c16e] opacity-60 animate-ping" />
          <span className="relative inline-flex h-[8px] w-[8px] rounded-full bg-[#a5c16e]" />
        </span>
        <span className="text-[11px] font-semibold font-[var(--font-jakarta)] text-[#a5c16e] whitespace-nowrap">
          Monitoramento ao vivo
        </span>
      </div>

      {/* Title */}
      <p
        className="absolute text-[33px] leading-normal font-normal text-[#c2d5e8] font-[var(--font-zalando-stack)]"
        style={{ left: 142, top: 250 }}
      >
        Atividade Recente
      </p>
      <p
        className="absolute text-[13px] font-medium text-[rgba(224,237,251,0.58)] font-[var(--font-jakarta)]"
        style={{ left: 142, top: 290 }}
      >
        Registro cronológico de todas as ações do dia
      </p>

      {/* Resumo do dia label */}
      <div className="absolute" style={{ left: 142, top: 360 }}>
        <p className="text-[14px] font-medium text-[#c2d5e8] font-[var(--font-zalando-stack)]">
          Resumo do Dia
        </p>
        <p className="text-[10px] text-[#a0acb9] font-[var(--font-jakarta)] mt-[4px]">
          Indicadores em tempo real
        </p>
      </div>

      {/* 2x2 stat tiles (Ações hoje, Procedimentos, Agendamentos, Alertas) */}
      <div
        className="absolute grid grid-cols-2 gap-[14px]"
        style={{ left: 142, top: 420, width: 412 }}
      >
        {statTiles.map((s) => (
          <div
            key={s.label}
            className="rounded-[14px] border border-white/8 bg-white/[0.04] flex flex-col gap-[12px]"
            style={{ padding: "20px 24px" }}
          >
            <div className="flex items-center gap-[8px]">
              <span
                className="w-[6px] h-[6px] rounded-full shrink-0"
                style={{ background: s.accent }}
              />
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[rgba(194,213,232,0.6)] font-[var(--font-jakarta)] truncate">
                {s.label}
              </p>
            </div>
            <p className="text-[30px] font-light leading-none text-[#c2d5e8] font-[var(--font-zalando-stack)] pl-[14px]">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Produtividade caption */}
      <p
        className="absolute text-[12px] text-[rgba(194,213,232,0.55)] font-[var(--font-jakarta)]"
        style={{ left: 142, top: 640, width: 412 }}
      >
        Produtividade registrada desde{" "}
        <span className="text-[#c2d5e8] font-medium">07:00</span> — equipe
        operando dentro da meta diária.
      </p>

      {/* Mini bar chart (decorative — hourly activity) */}
      <div
        aria-hidden
        className="absolute flex items-end gap-[6px]"
        style={{ left: 142, top: 710, width: 412, height: 90 }}
      >
        {[
          22, 28, 35, 44, 58, 64, 72, 80, 88, 82, 90, 74, 68, 60, 52, 44, 36, 30,
        ].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-[2px] bg-[rgba(194,213,232,0.28)]"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      {/* Pacientes / Fornecedores stacks at bottom */}
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
        names={hydrated ? fornecedores.slice(0, 3).map((f) => f.nome) : ["Medekit", "OPME Brasil", "Cirúrgica"]}
        subtitle={
          hydrated && fornecedores.length
            ? `${primeiroFornecedor.split(" ")[0]} e outros ${Math.max(0, fornecedores.length - 1)} Fornecedores`
            : "Medekit e outros 5 Fornecedores"
        }
      />
    </>
  );
}

const STACK_COLORS = ["#5b7c99", "#7ca598", "#c1846e", "#8a6ec1", "#c1a86e", "#6ec1a8"];

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return STACK_COLORS[Math.abs(hash) % STACK_COLORS.length];
}

function PeopleStack({
  left,
  top,
  count,
  label,
  subtitle,
  names,
}: {
  left: number;
  top: number;
  count: string;
  label: string;
  subtitle: string;
  names: string[];
}) {
  return (
    <div className="absolute" style={{ left, top, width: 200 }}>
      <div className="flex items-center mb-[12px]">
        {names.slice(0, 3).map((name, i) => (
          <div
            key={i}
            className="w-[30px] h-[30px] rounded-full flex items-center justify-center ring-2 ring-[#47535f] shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
            style={{
              marginLeft: i === 0 ? 0 : -10,
              background: colorForName(name),
              zIndex: 3 - i,
            }}
          >
            <span className="text-[10px] font-bold text-white font-[var(--font-dm)]">
              {initialsFor(name)}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[13px] font-semibold text-[#c2d5e8] truncate font-[var(--font-dm)]">
        {count} {label}
      </p>
      <p className="text-[11px] text-[#8494a3] leading-[1.3] truncate mt-[4px] font-[var(--font-dm)]">
        {subtitle}
      </p>
    </div>
  );
}
