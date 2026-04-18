"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { ChevronDown, Plus, Minus, Download, UserPlus } from "lucide-react";
import { useLancamentosStore } from "@/stores/useLancamentosStore";
import { usePacientesStore } from "@/stores/usePacientesStore";
import { useFornecedoresStore } from "@/stores/useFornecedoresStore";
import { useHydrate } from "@/stores/useHydrate";
import { useControlMenuStore } from "@/stores/useControlMenuStore";
import { formatBRL } from "@/stores/format";
import NovoLancamentoForm from "@/components/forms/NovoLancamentoForm";
import NovoPacienteForm from "@/components/forms/NovoPacienteForm";
import { toast } from "@/components/ui/toast";

// Bar chart heights (mirrors the Figma chart) — 30 bars
const barHeights = [
  50, 9, 45, 45, 50, 48, 45, 43, 43, 40,
  50, 45, 43, 41, 40, 41, 43, 45, 50, 27,
  27, 35, 32, 37, 32, 22, 32, 27, 22, 14,
];

const navItems = [
  { href: "/", icon: "solar_home-2-bold.svg", label: "Dashboard" },
  { href: "/agendados", icon: "solar_bookmark-circle-bold.svg", label: "Agendados" },
  { href: "/financeiro", icon: "solar_chat-round-money-bold.svg", label: "Financeiro" },
  { href: "/atividade", icon: "solar_pulse-bold.svg", label: "Atividade" },
  { href: "/estoque", icon: "solar_box-bold.svg", label: "Estoque" },
  { href: "/medicacoes", icon: "solar_add-folder-bold.svg", label: "Medicações" },
];

export default function FinanceiroSidebar() {
  const pathname = usePathname();
  const hydrated = useHydrate();
  const lancamentos = useLancamentosStore((s) => s.items);
  const pacientes = usePacientesStore((s) => s.items);
  const fornecedores = useFornecedoresStore((s) => s.items);

  const [receitaOpen, setReceitaOpen] = useState(false);
  const [despesaOpen, setDespesaOpen] = useState(false);
  const [pacienteOpen, setPacienteOpen] = useState(false);
  const toggleControlMenu = useControlMenuStore((s) => s.toggle);

  const stats = useMemo(() => {
    let receitas = 0;
    let despesas = 0;
    for (const l of lancamentos) {
      if (l.tipo === "Receita") receitas += l.valor;
      else despesas += l.valor;
    }
    return { receitas, despesas, saldo: receitas - despesas };
  }, [lancamentos]);

  const pacientesCount = String(hydrated ? pacientes.length : 0).padStart(2, "0");
  const fornecedoresCount = String(hydrated ? fornecedores.length : 0).padStart(2, "0");
  const primeiroPaciente = pacientes[0]?.nome ?? "Adriana Goes";
  const primeiroFornecedor = fornecedores[0]?.nome ?? "Medekit";

  return (
    <>
      {/* Base background (full dark sidebar) — 652 wide per Figma Rectangle 2 */}
      <div
        className="absolute bg-[#47535f]"
        style={{ left: 0, top: 0, width: 652, height: 1080 }}
      />
      {/* Vertical divider — nav rail separator at x=92 */}
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

      {/* Nav rail: collapse arrow + icons + settings */}
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

      {/* Hospital da Plástica card */}
      <div
        className="absolute flex items-center gap-[10px] bg-white/5 rounded-[28px] pr-[14px] pl-[6px] py-[6px]"
        style={{ left: 142, top: 42, width: 277, height: 54 }}
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
        style={{ left: 482, top: 48, width: 42, height: 42 }}
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
        style={{ left: 542, top: 48, width: 42, height: 42 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c2d5e8" strokeWidth="1.6" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Money icon tile (active section) */}
      <div
        className="absolute rounded-[25px] flex items-center justify-center"
        style={{
          left: 142,
          top: 146,
          width: 70,
          height: 70,
          background: "rgba(48,56,65,0.5)",
        }}
      >
        <Image
          src="/icons/solar_chat-round-money-bold.svg"
          alt=""
          width={28}
          height={28}
        />
      </div>

      {/* File chips (xlsx pills) — to right of money tile, stacked cleanly */}
      <FileChip left={294} top={162} label="Recebimentos.xlsx" />
      <FileChip left={452} top={162} label="Despesas.xlsx" />
      <FileChip left={294} top={209} label="Livro Caixa.xlsx" />

      {/* Heading */}
      <p
        className="absolute text-[33px] leading-normal font-normal text-[#c2d5e8] font-[var(--font-zalando-stack)]"
        style={{ left: 142, top: 260 }}
      >
        Financeiro
      </p>
      <p
        className="absolute text-[13px] font-medium text-[rgba(224,237,251,0.58)] font-[var(--font-jakarta)]"
        style={{ left: 142, top: 302 }}
      >
        Todos os lançamentos do hospital
      </p>

      {/* 4 action circles */}
      <div className="absolute" style={{ left: 142, top: 376 }}>
        <div className="flex items-start gap-[28px]">
          <ActionCircle
            label="Nova Receita"
            onClick={() => setReceitaOpen(true)}
            icon={<Plus size={22} strokeWidth={1.6} />}
          />
          <ActionCircle
            label="Nova Despesa"
            onClick={() => setDespesaOpen(true)}
            icon={<Minus size={22} strokeWidth={1.6} />}
          />
          <ActionCircle
            label="Exportar Livro Caixa"
            onClick={() => toast.info("Exportação em breve")}
            icon={<Download size={22} strokeWidth={1.6} />}
            wide
          />
          <ActionCircle
            label="Adicionar Paciente"
            onClick={() => setPacienteOpen(true)}
            icon={<UserPlus size={22} strokeWidth={1.6} />}
          />
        </div>
      </div>

      {/* Bar chart */}
      <div
        aria-hidden
        className="absolute flex items-end gap-[5px]"
        style={{ left: 142, top: 544, width: 395, height: 60 }}
      >
        {barHeights.map((h, i) => (
          <div
            key={i}
            className="w-[6px] rounded-[1px] bg-[rgba(194,213,232,0.3)]"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      {/* Saldo Operacional */}
      <p
        className="absolute text-[27px] leading-[1.1] text-[#c2d5e8] font-[var(--font-zalando-stack)]"
        style={{ left: 142, top: 618 }}
      >
        {hydrated ? formatBRL(stats.saldo) : "R$ --"}
      </p>
      <p
        className="absolute text-[12px] font-medium text-[rgba(194,213,232,0.55)] font-[var(--font-jakarta)]"
        style={{ left: 142, top: 658 }}
      >
        Saldo Operacional
      </p>

      {/* Receitas / Despesas block */}
      <div className="absolute" style={{ left: 142, top: 727 }}>
        <Image
          src="/icons/solar_archive-down.svg"
          alt=""
          width={24}
          height={24}
        />
        <p className="text-[12px] text-[#8b9aaa] font-medium mt-[50px] font-[var(--font-zalando-stack)]">
          Receitas
        </p>
        <p className="text-[16px] text-[#c2d5e8] font-medium font-[var(--font-zalando-stack)] leading-[1.1] mt-[6px]">
          {hydrated ? formatBRL(stats.receitas) : "R$ --"}
        </p>
        <p className="text-[10px] text-[rgba(194,213,232,0.55)] font-[var(--font-jakarta)] mt-[6px]">
          Total {hydrated ? formatBRL(stats.receitas).replace("R$ ", "") : "--"}
        </p>
      </div>
      <div className="absolute" style={{ left: 384, top: 727 }}>
        <Image
          src="/icons/solar_archive-up.svg"
          alt=""
          width={24}
          height={24}
        />
        <p className="text-[12px] text-[#8b9aaa] font-medium mt-[50px] font-[var(--font-zalando-stack)]">
          Despesas
        </p>
        <p className="text-[16px] text-[#c2d5e8] font-medium font-[var(--font-zalando-stack)] leading-[1.1] mt-[6px]">
          {hydrated ? formatBRL(stats.despesas) : "R$ --"}
        </p>
        <p className="text-[10px] text-[rgba(194,213,232,0.55)] font-[var(--font-jakarta)] mt-[6px]">
          Total {hydrated ? formatBRL(stats.despesas).replace("R$ ", "") : "--"}
        </p>
      </div>

      {/* Pacientes / Fornecedores stacks */}
      <PeopleStack
        left={142}
        top={950}
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
        left={376}
        top={950}
        count={fornecedoresCount}
        label="Fornecedores"
        names={hydrated ? fornecedores.slice(0, 3).map((f) => f.nome) : ["Medekit", "OPME Brasil", "Cirúrgica"]}
        subtitle={
          hydrated && fornecedores.length
            ? `${primeiroFornecedor.split(" ")[0]} e outros ${Math.max(0, fornecedores.length - 1)} Fornecedores`
            : "Medekit e outros 5 Fornecedores"
        }
      />

      {/* Forms (portaled internally by Dialog) */}
      <NovoLancamentoForm tipo="Receita" open={receitaOpen} onOpenChange={setReceitaOpen} />
      <NovoLancamentoForm tipo="Despesa" open={despesaOpen} onOpenChange={setDespesaOpen} />
      <NovoPacienteForm open={pacienteOpen} onOpenChange={setPacienteOpen} />
    </>
  );
}

function FileChip({
  left,
  top,
  label,
}: {
  left: number;
  top: number;
  label: string;
}) {
  return (
    <button
      type="button"
      className="absolute group flex items-center gap-[10px] rounded-[12px] pl-[10px] pr-[14px] border border-[rgba(194,213,232,0.12)] bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(194,213,232,0.22)] transition-all"
      style={{ left, top, height: 38 }}
    >
      <span className="w-[24px] h-[24px] rounded-[7px] bg-[rgba(194,213,232,0.12)] flex items-center justify-center shrink-0">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c2d5e8"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6" />
        </svg>
      </span>
      <span className="text-[11px] font-medium font-[var(--font-jakarta)] text-[#c2d5e8] whitespace-nowrap">
        {label}
      </span>
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#8494a3"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
      </svg>
    </button>
  );
}

function ActionCircle({
  label,
  icon,
  onClick,
  wide,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col gap-[10px] items-center group"
      style={{ width: wide ? 96 : 68 }}
    >
      <span className="w-[62px] h-[62px] rounded-full flex items-center justify-center bg-[rgba(255,255,255,0.08)] border border-[rgba(194,213,232,0.15)] text-[#c2d5e8] group-hover:bg-[rgba(255,255,255,0.14)] transition-colors">
        {icon}
      </span>
      <span className="text-[11px] font-medium text-[#8a929a] text-center leading-[1.2] font-[var(--font-zalando-stack)]">
        {label}
      </span>
    </button>
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
