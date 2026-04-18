"use client";

import { useState } from "react";
import { ChevronRight, Plus, Minus } from "lucide-react";
import { usePacientesStore } from "@/stores/usePacientesStore";
import { useFornecedoresStore } from "@/stores/useFornecedoresStore";
import { useHydrate } from "@/stores/useHydrate";
import NovoPacienteForm from "@/components/forms/NovoPacienteForm";
import NovaCirurgiaForm from "@/components/forms/NovaCirurgiaForm";
import NovoFornecedorForm from "@/components/forms/NovoFornecedorForm";
import NovoLancamentoForm from "@/components/forms/NovoLancamentoForm";

export default function ActionPanel() {
  const hydrated = useHydrate();
  const pacientes = usePacientesStore((s) => s.items);
  const fornecedores = useFornecedoresStore((s) => s.items);

  const [pacienteOpen, setPacienteOpen] = useState(false);
  const [cirurgiaOpen, setCirurgiaOpen] = useState(false);
  const [fornecedorOpen, setFornecedorOpen] = useState(false);
  const [receitaOpen, setReceitaOpen] = useState(false);
  const [despesaOpen, setDespesaOpen] = useState(false);

  const pacientesCount = String(hydrated ? pacientes.length : 0).padStart(2, "0");
  const fornecedoresCount = String(hydrated ? fornecedores.length : 0).padStart(2, "0");

  return (
    <>
      {/* Column background (white panel between sidebar and financial) */}
      <div
        className="absolute bg-white border-l border-r border-[#f4f4f4]"
        style={{ left: 604, top: 0, width: 485, height: 1080 }}
      />

      {/* Small header (top-left of the column) */}
      <div className="absolute" style={{ left: 628, top: 46, width: 280 }}>
        <p className="text-[12px] font-medium text-[#1e1e1e] font-[var(--font-zalando-stack)]">
          Painel de Ações
        </p>
        <p className="text-[12px] text-[#47535f] leading-[20px] font-[var(--font-zalando-stack)]">
          Acompanhe e organize as movimentações
        </p>
      </div>

      {/* Count pills (top-right) — polished with filled icons + gradient badges */}
      <div
        className="absolute flex items-center gap-[10px]"
        style={{ left: 920, top: 48 }}
      >
        <button
          type="button"
          className="flex items-center gap-[8px] transition-opacity hover:opacity-80"
          aria-label={`${pacientesCount} pacientes`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#47535f">
            <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
          </svg>
          <span className="inline-flex items-center justify-center bg-gradient-to-br from-[#ff9898] to-[#f47272] text-white text-[11px] font-bold rounded-[14px] h-[24px] min-w-[28px] px-[6px] leading-none shadow-[0_1px_3px_rgba(244,114,114,0.4)]">
            {pacientesCount}
          </span>
        </button>
        <button
          type="button"
          className="flex items-center gap-[8px] transition-opacity hover:opacity-80"
          aria-label={`${fornecedoresCount} fornecedores`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#47535f">
            <path d="M10 2h4a2 2 0 012 2v2h3a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h3V4a2 2 0 012-2zm4 4V4h-4v2h4zm-2 4a1 1 0 011 1v2h2a1 1 0 110 2h-2v2a1 1 0 11-2 0v-2H9a1 1 0 110-2h2v-2a1 1 0 011-1z" />
          </svg>
          <span className="inline-flex items-center justify-center bg-gradient-to-br from-[#ff9898] to-[#f47272] text-white text-[11px] font-bold rounded-[14px] h-[24px] min-w-[28px] px-[6px] leading-none shadow-[0_1px_3px_rgba(244,114,114,0.4)]">
            {fornecedoresCount}
          </span>
        </button>
      </div>

      {/* Money icon */}
      <div className="absolute" style={{ left: 628, top: 150 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#47535f" opacity="0.95">
          <path d="M12 2a4 4 0 00-4 4v1h8V6a4 4 0 00-4-4zm-6 6a2 2 0 00-2 2v9a3 3 0 003 3h10a3 3 0 003-3v-9a2 2 0 00-2-2H6zm6 4a3 3 0 110 6 3 3 0 010-6zm0 2a1 1 0 100 2 1 1 0 000-2z" />
        </svg>
      </div>

      {/* Big title */}
      <div className="absolute" style={{ left: 628, top: 210 }}>
        <p className="text-[18px] font-light text-[#9d998a] font-[var(--font-zalando-stack)] leading-[1.2]">
          Painel de Ações
        </p>
        <p className="text-[10px] font-medium text-[#b0aea4] font-[var(--font-zalando-stack)] mt-[4px]">
          Acompanhe e organize as movimentações
        </p>
      </div>

      {/* 3 circular action buttons — left-aligned inside ActionPanel column */}
      <div
        className="absolute flex items-start gap-[24px]"
        style={{ left: 628, top: 300 }}
      >
        <ActionCircle
          label="Adicionar Paciente"
          onClick={() => setPacienteOpen(true)}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#47535f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
        />
        <ActionCircle
          label="Adicionar Orçamento"
          onClick={() => setCirurgiaOpen(true)}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#47535f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2v6a6 6 0 0012 0V2" />
              <circle cx="20" cy="14" r="2" />
              <path d="M18 14v3a6 6 0 01-12 0" />
            </svg>
          }
        />
        <ActionCircle
          label="Adicionar Fornecedor"
          onClick={() => setFornecedorOpen(true)}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#47535f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
              <path d="M12 11v6M9 14h6" />
            </svg>
          }
        />
      </div>

      {/* Adicionar Informações header */}
      <div className="absolute" style={{ left: 628, top: 640 }}>
        <p className="text-[14px] font-medium text-[#1e1e1e] font-[var(--font-zalando-stack)]">
          Adicionar Informações
        </p>
        <p className="text-[10px] text-[#9f9f9f] font-[var(--font-zalando-stack)] mt-[4px]">
          Cadastrar Recebimentos e Despesas
        </p>
      </div>

      {/* CTA rows */}
      <div
        className="absolute flex flex-col gap-[14px]"
        style={{ left: 628, top: 720, width: 437 }}
      >
        <CtaRow
          label="Novo Recebimento"
          sub="Adicionar novo Recebimento"
          onClick={() => setReceitaOpen(true)}
          iconBg="bg-[rgba(165,193,110,0.06)]"
          icon={<Plus size={20} className="text-[#9d998a]" />}
        />
        <CtaRow
          label="Nova Despesa"
          sub="Adicionar nova Despesa"
          onClick={() => setDespesaOpen(true)}
          iconBg="bg-[rgba(255,140,140,0.06)]"
          icon={<Minus size={20} className="text-[#c1846e]" />}
        />
      </div>

      {/* Forms (rendered outside the absolute layout via portals internally) */}
      <NovoPacienteForm open={pacienteOpen} onOpenChange={setPacienteOpen} />
      <NovaCirurgiaForm open={cirurgiaOpen} onOpenChange={setCirurgiaOpen} />
      <NovoFornecedorForm open={fornecedorOpen} onOpenChange={setFornecedorOpen} />
      <NovoLancamentoForm tipo="Receita" open={receitaOpen} onOpenChange={setReceitaOpen} />
      <NovoLancamentoForm tipo="Despesa" open={despesaOpen} onOpenChange={setDespesaOpen} />
    </>
  );
}

function ActionCircle({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col gap-[8px] items-center w-[96px] group">
      <span className="w-[68px] h-[68px] bg-[rgba(71,83,95,0.1)] rounded-full flex items-center justify-center group-hover:bg-[rgba(71,83,95,0.15)] transition-colors">
        {icon}
      </span>
      <span className="text-[12px] font-medium text-[#47535f] font-[var(--font-zalando-stack)] text-center leading-[1.2]">
        {label}
      </span>
    </button>
  );
}

function CtaRow({
  label,
  sub,
  icon,
  iconBg,
  onClick,
}: {
  label: string;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-[14px] h-[88px] rounded-[19px] border border-[#f4f4f4] bg-white px-[16px] hover:bg-[#fafafa] transition-colors"
    >
      <span className={`shrink-0 rounded-[24px] p-[14px] flex items-center justify-center ${iconBg}`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0 text-left">
        <p className="text-[14px] font-medium text-[#1e1e1e] font-[var(--font-zalando-stack)] truncate">
          {label}
        </p>
        <p className="text-[10px] text-[#9f9f9f] font-[var(--font-zalando-stack)] truncate">
          {sub}
        </p>
      </div>
      <ChevronRight size={18} className="text-[#9f9f9f] shrink-0" />
    </button>
  );
}
