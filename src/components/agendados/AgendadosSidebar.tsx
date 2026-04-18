"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useAgendados } from "./AgendadosContext";
import { useControlMenuStore } from "@/stores/useControlMenuStore";
import NovaCirurgiaForm from "@/components/forms/NovaCirurgiaForm";
import NovoPacienteForm from "@/components/forms/NovoPacienteForm";

const navItems = [
  { href: "/", icon: "solar_home-2-bold.svg", label: "Dashboard" },
  { href: "/agendados", icon: "solar_bookmark-circle-bold.svg", label: "Agendados" },
  { href: "/financeiro", icon: "solar_chat-round-money-bold.svg", label: "Financeiro" },
  { href: "/atividade", icon: "solar_pulse-bold.svg", label: "Atividade" },
  { href: "/estoque", icon: "solar_box-bold.svg", label: "Estoque" },
  { href: "/medicacoes", icon: "solar_add-folder-bold.svg", label: "Medicações" },
];

export default function AgendadosSidebar() {
  const pathname = usePathname();
  const { hydrated, cirurgias, pacientesList, modal, setModal } = useAgendados();
  const toggleControlMenu = useControlMenuStore((s) => s.toggle);

  const stats = useMemo(() => {
    const realizadas = cirurgias.filter(
      (c) => c.status === "Realizada" || c.status === "Finalizada",
    ).length;
    const agendadas = cirurgias.filter((c) => c.status === "Agendada").length;
    return { total: cirurgias.length, realizadas, agendadas };
  }, [cirurgias]);

  const totalStr = String(hydrated ? stats.total : 0).padStart(2, "0");
  const realizadasStr = String(hydrated ? stats.realizadas : 0).padStart(2, "0");
  const agendadasStr = String(hydrated ? stats.agendadas : 0).padStart(2, "0");
  const pacientesCount = String(hydrated ? pacientesList.length : 0).padStart(2, "0");
  const primeiroPaciente = pacientesList[0]?.nome ?? "Adriana Goes";

  return (
    <>
      {/* Base dark sidebar */}
      <div
        className="absolute bg-[#47535f]"
        style={{ left: 0, top: 0, width: 652, height: 1080 }}
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

      {/* Nav rail */}
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

      {/* Top-right action buttons */}
      <button
        type="button"
        aria-label="Configurações"
        className="absolute rounded-[17px] bg-[rgba(0,0,0,0.32)] flex items-center justify-center hover:bg-[rgba(0,0,0,0.42)] transition-colors"
        style={{ left: 510, top: 48, width: 42, height: 42 }}
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
        style={{ left: 560, top: 48, width: 42, height: 42 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c2d5e8" strokeWidth="1.6" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Active "bookmark" tile with pulse icon inside */}
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
          src="/icons/solar_pulse-bold.svg"
          alt=""
          width={28}
          height={28}
          className="opacity-75"
        />
      </div>

      {/* xlsx chip next to the active tile */}
      <div
        className="absolute flex items-center gap-[6px] bg-[rgba(160,172,185,0.1)] rounded-[11px] px-[10px] py-[10px]"
        style={{ left: 234, top: 163, height: 36 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0acb9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6M8 13l2 3 2-3M12 13v5" />
        </svg>
        <span className="text-[12px] font-medium text-[#a0acb9] font-[var(--font-jakarta)] whitespace-nowrap">
          Cirurgias Particulares 2025 - Financeiro
        </span>
      </div>

      {/* Title: Cirurgias + subtitle */}
      <p
        className="absolute text-[33px] leading-normal font-normal text-[#c2d5e8] font-[var(--font-zalando-stack)]"
        style={{ left: 142, top: 250 }}
      >
        Cirurgias
      </p>
      <p
        className="absolute text-[14px] font-medium text-[rgba(224,237,251,0.58)] font-[var(--font-jakarta)]"
        style={{ left: 142, top: 294 }}
      >
        Estoque, Compras, Validades e Materiais
      </p>

      {/* Two action circles: Adicionar Cirurgia / Adicionar Paciente */}
      <ActionCircle
        left={142}
        top={376}
        label="Adicionar Cirurgia"
        onClick={() => setModal("cirurgia")}
      />
      <ActionCircle
        left={240}
        top={376}
        label="Adicionar Paciente"
        onClick={() => setModal("paciente")}
      />

      {/* Hero stat: NN Cirurgias */}
      <p
        className="absolute text-[27px] leading-[1.1] text-[#c2d5e8] font-[var(--font-zalando-stack)]"
        style={{ left: 142, top: 530 }}
      >
        {totalStr} Cirurgias
      </p>
      <p
        className="absolute text-[12px] font-medium text-[rgba(194,213,232,0.55)] font-[var(--font-zalando-stack)]"
        style={{ left: 142, top: 570 }}
      >
        Procedimentos Agendados
      </p>

      {/* Realizadas stat */}
      <div className="absolute" style={{ left: 142, top: 718 }}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c2d5e8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-90"
        >
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
      </div>
      <p
        className="absolute text-[18px] leading-[1.1] text-[#c2d5e8] font-[var(--font-zalando-stack)]"
        style={{ left: 142, top: 795 }}
      >
        {realizadasStr} Realizadas
      </p>
      <p
        className="absolute text-[12px] font-medium text-[rgba(194,213,232,0.55)] font-[var(--font-zalando-stack)]"
        style={{ left: 142, top: 828 }}
      >
        Cirurgias
      </p>

      {/* Agendadas stat */}
      <div className="absolute" style={{ left: 376, top: 718 }}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c2d5e8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-90"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </div>
      <p
        className="absolute text-[18px] leading-[1.1] text-[#c2d5e8] font-[var(--font-zalando-stack)]"
        style={{ left: 376, top: 795 }}
      >
        {agendadasStr} Agendadas
      </p>
      <p
        className="absolute text-[12px] font-medium text-[rgba(194,213,232,0.55)] font-[var(--font-zalando-stack)]"
        style={{ left: 376, top: 828 }}
      >
        Cirurgias
      </p>

      {/* Pacientes stack at bottom */}
      <div className="absolute" style={{ left: 142, top: 948, width: 220 }}>
        <div className="flex items-center mb-[10px]">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-[#363F48] border border-[#47535f] w-[28px] h-[28px] rounded-full"
              style={{ marginLeft: i === 0 ? 0 : -8 }}
            />
          ))}
        </div>
        <p className="text-[12px] font-semibold text-[#c2d5e8] truncate font-[var(--font-dm)]">
          {pacientesCount} Pacientes
        </p>
        <p className="text-[12px] text-[#8494a3] leading-[1.111] truncate mt-[4px] font-[var(--font-dm)]">
          {hydrated && pacientesList.length
            ? `${primeiroPaciente.split(" ").slice(0, 2).join(" ")} + ${Math.max(0, pacientesList.length - 1)} Pacientes`
            : "Adriana Goes + 5 Pacientes"}
        </p>
      </div>

      {/* Forms (portals) */}
      <NovaCirurgiaForm
        open={modal === "cirurgia"}
        onOpenChange={(open) => setModal(open ? "cirurgia" : null)}
      />
      <NovoPacienteForm
        open={modal === "paciente"}
        onOpenChange={(open) => setModal(open ? "paciente" : null)}
      />
    </>
  );
}

function ActionCircle({
  left,
  top,
  label,
  onClick,
}: {
  left: number;
  top: number;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute flex flex-col gap-[8px] items-center group"
      style={{ left, top, width: 68 }}
    >
      <span className="w-[57px] h-[57px] rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center group-hover:bg-[rgba(255,255,255,0.15)] transition-colors">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c2d5e8"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M12 8v8M8 12h8" />
        </svg>
      </span>
      <span className="text-[12px] font-medium text-[#8a929a] font-[var(--font-zalando-stack)] text-center leading-[1.2]">
        {label}
      </span>
    </button>
  );
}
