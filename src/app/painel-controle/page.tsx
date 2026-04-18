"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ControlMenu from "@/components/ControlMenu";
import { useMemo } from "react";
import { useLancamentosStore } from "@/stores/useLancamentosStore";
import { usePacientesStore } from "@/stores/usePacientesStore";
import { useFornecedoresStore } from "@/stores/useFornecedoresStore";
import { useHydrate } from "@/stores/useHydrate";
import { formatBRL } from "@/stores/format";
import type { Lancamento } from "@/types";

const barHeights = [
  109, 19, 99, 99, 109, 104, 99, 93, 93, 86,
  109, 99, 93, 90, 86, 90, 93, 99, 109, 59,
  59, 76, 69, 80, 69, 47, 69, 59, 47, 30,
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

function formatDateLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, "0")} de ${monthsPt[m - 1]} de ${y}`;
}

type TxnViewRow = {
  nome: string;
  procedure: string;
  status: string;
  statusColor: string;
  statusBg?: string;
  amount: string;
  date: string;
};

function statusForReceita(l: Lancamento): { label: string; color: string } {
  if (l.status === "Parcela") {
    return { label: l.statusDetalhe ?? "Parcela", color: "#bac16e" };
  }
  return { label: l.status, color: "#a5c16e" };
}

function statusForDespesa(l: Lancamento): {
  label: string;
  color: string;
  bg: string;
} {
  if (l.status === "Agendado") {
    return { label: "Agendado", color: "#c1b26e", bg: "#fafbf6" };
  }
  if (l.status === "Atrasado" || l.status === "Pendente") {
    return {
      label: l.status,
      color: "#c1846e",
      bg: "rgba(193,132,110,0.1)",
    };
  }
  return { label: "Pago", color: "#a5c16e", bg: "#fafbf6" };
}

export default function PainelControlePage() {
  const hydrated = useHydrate();
  const lancamentos = useLancamentosStore((s) => s.items);
  const pacientesList = usePacientesStore((s) => s.items);
  const fornecedoresList = useFornecedoresStore((s) => s.items);

  const { receitas, despesas, totals, counts } = useMemo(() => {
    const rec: TxnViewRow[] = lancamentos
      .filter((l) => l.tipo === "Receita")
      .map((l) => {
        const s = statusForReceita(l);
        return {
          nome: l.nome,
          procedure: l.descricao,
          status: s.label,
          statusColor: s.color,
          amount: formatBRL(l.valor),
          date: formatDateLong(l.data),
        };
      });
    const desp: TxnViewRow[] = lancamentos
      .filter((l) => l.tipo === "Despesa")
      .map((l) => {
        const s = statusForDespesa(l);
        return {
          nome: l.nome,
          procedure: l.descricao,
          status: s.label,
          statusColor: s.color,
          statusBg: s.bg,
          amount: formatBRL(l.valor),
          date: formatDateLong(l.data),
        };
      });
    const recTotal = lancamentos
      .filter((l) => l.tipo === "Receita")
      .reduce((sum, l) => sum + l.valor, 0);
    const despTotal = lancamentos
      .filter((l) => l.tipo === "Despesa")
      .reduce((sum, l) => sum + l.valor, 0);
    return {
      receitas: rec,
      despesas: desp,
      totals: { receitas: recTotal, despesas: despTotal, faturamento: recTotal - despTotal },
      counts: {
        pacientes: pacientesList.length,
        fornecedores: fornecedoresList.length,
        lancamentos: lancamentos.length,
      },
    };
  }, [lancamentos, pacientesList, fornecedoresList]);

  if (!hydrated) return <div className="h-screen bg-white" />;

  return (
    <div id="app-root" className="flex h-screen overflow-hidden bg-white font-[var(--font-zalando-stack)]">
      {/* ========== DARK COLUMN (Menu + Dashboard) - 802px ========== */}
      <aside className="relative h-full w-[802px] shrink-0 bg-[#47535f] text-[#c2d5e8] overflow-hidden">
        {/* Menu (left portion 0-293px) */}
        <div className="absolute left-[34px] top-[47px] bottom-[47px] z-10 w-[238px]">
          <ControlMenu activeHref="/" />
        </div>

        {/* Vertical divider between menu and dashboard */}
        <div className="absolute left-[293px] top-0 bottom-0 w-px bg-[rgba(255,255,255,0.08)]" />

        {/* Dashboard content (right portion starts at ~340px) */}
        <div className="absolute left-[340px] top-0 right-0 h-full overflow-y-auto pr-[30px] py-[47px]">
          {/* Header avatar row */}
          <div className="flex items-center justify-between mb-[60px]">
            <div className="flex items-center gap-2">
              <div className="w-[42px] h-[42px] rounded-full overflow-hidden shrink-0">
                <Image src="/avatar.png" alt="" width={42} height={42} className="w-full h-full object-cover" />
              </div>
              <div className="w-[132px]">
                <p className="text-[14px] text-[rgba(0,0,0,0.63)]">Hospital da Plástica</p>
                <p className="text-[12px] text-[#b8b8b8]">Conta Jurídica</p>
              </div>
              <div className="ml-1">
                <Image src="/icons/solar_alt-arrow-down-linear.svg" alt="" width={20} height={20} />
              </div>
            </div>
            <div className="flex items-center gap-[18px]">
              <div className="bg-[rgba(0,0,0,0.32)] rounded-[17px] w-[42px] h-[42px] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c2d5e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4" />
                </svg>
              </div>
              <div className="bg-[rgba(0,0,0,0.32)] rounded-[17px] w-[42px] h-[42px] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c2d5e8" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
            </div>
          </div>

          {/* Home icon highlight */}
          <div className="bg-[rgba(48,56,65,0.5)] rounded-[25px] w-[70px] h-[70px] flex items-center justify-center mb-[48px]">
            <Image src="/icons/solar_home-2-bold.svg" alt="" width={29} height={29} />
          </div>

          {/* Dashboard Title */}
          <div className="mb-[36px]">
            <p className="text-[28px] text-[#c2d5e8] font-normal leading-tight">Dashboard</p>
            <p className="text-[14px] font-medium text-[rgba(224,237,251,0.58)] mt-2 font-[var(--font-jakarta)]">
              Principais informações financeiras compiladas
            </p>
          </div>

          {/* Faturamento do Mês */}
          <div className="mb-[30px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-medium text-[#c2d5e8]">Faturamento do Mês</p>
                <p className="text-[10px] text-[#a0acb9] leading-[20px]">Detalhamento do Mês</p>
              </div>
              <div className="bg-[rgba(0,183,255,0.2)] px-[10px] py-[10px] rounded-[11.2px]">
                <p className="text-[#00b7ff] text-[10px] font-medium whitespace-nowrap">Aumentou 16%</p>
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-[5px] h-[110px] mb-[28px]">
            {barHeights.map((h, i) => (
              <div key={i} className="w-[5px] min-w-[5px] rounded-t-sm" style={{ height: `${h}px`, backgroundColor: "rgba(194,213,232,0.3)" }} />
            ))}
          </div>

          {/* R$ faturamento */}
          <div className="mb-[16px]">
            <div className="flex items-center">
              <p className="text-[27px] text-[#c2d5e8]">{formatBRL(totals.faturamento)}</p>
              <div className="border border-[rgba(139,154,170,0.25)] rounded-[17px] w-[43px] h-[43px] flex items-center justify-center shrink-0 ml-auto">
                <Image src="/icons/solar_arrow-right-up-linear.svg" alt="" width={21} height={21} />
              </div>
            </div>
            <p className="text-[12px] text-[rgba(194,213,232,0.55)] mt-1">
              Recebido até <span>o momento</span> de<span className="text-[#c2d5e8]"> {formatBRL(totals.receitas)}</span>
            </p>
          </div>

          {/* Receitas + Despesas */}
          <div className="flex mt-[40px]">
            <div className="flex flex-col">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/solar_archive-down.svg" alt="" width={24} height={24} className="mb-[52px]" />
              <p className="text-[12px] text-[#8b9aaa] mb-[4px]">Receitas</p>
              <p className="text-[16px] text-[#c2d5e8]">{formatBRL(totals.receitas)}</p>
              <p className="text-[10px] text-[rgba(194,213,232,0.5)]">Total {totals.receitas.toFixed(2)}</p>
            </div>
            <div className="flex flex-col ml-auto mr-[40px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icons/solar_archive-up.svg" alt="" width={24} height={24} className="mb-[52px]" />
              <p className="text-[12px] text-[#8b9aaa] mb-[4px]">Despesas</p>
              <p className="text-[16px] text-[#c2d5e8]">{formatBRL(totals.despesas)}</p>
              <p className="text-[10px] text-[rgba(194,213,232,0.5)]">Total {totals.despesas.toFixed(2)}</p>
            </div>
          </div>

          {/* Pacientes e Fornecedores */}
          <div className="flex gap-[40px] mt-[56px] font-[var(--font-dm)]">
            <div>
              <div className="flex mb-[10px]">
                {[1, 2, 3].map((n, i) => (
                  <div key={n} className="w-[28px] h-[28px] rounded-full bg-[#363F48] border border-[#47535f] shrink-0" style={{ marginLeft: i > 0 ? -8 : 0 }} />
                ))}
              </div>
              <p className="text-[12px] font-semibold text-[#c2d5e8]">{String(counts.pacientes).padStart(2, "0")} Pacientes</p>
              <p className="text-[12px] text-[#8494a3]">{pacientesList[0]?.nome ?? ""} + {Math.max(counts.pacientes - 1, 0)}  Pacientes</p>
            </div>
            <div>
              <div className="flex mb-[10px]">
                {[1, 2, 3].map((n, i) => (
                  <div key={n} className="w-[28px] h-[28px] rounded-full bg-[#363F48] border border-[#47535f] shrink-0" style={{ marginLeft: i > 0 ? -8 : 0 }} />
                ))}
              </div>
              <p className="text-[12px] font-semibold text-[#c2d5e8]">{String(counts.fornecedores).padStart(2, "0")} Fornecedores</p>
              <p className="text-[12px] text-[#8494a3]">{fornecedoresList[0]?.nome ?? ""} e outros {Math.max(counts.fornecedores - 1, 0)} Pacientes</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ========== PAINEL DE AÇÕES COLUMN - ~473px ========== */}
      <section className="relative w-[473px] shrink-0 bg-white border-l border-[#f4f4f4] overflow-y-auto">
        {/* User pill top */}
        <div className="flex items-center justify-between px-[30px] pt-[27px] pb-[20px]">
          <div className="flex items-center gap-2">
            <div className="w-[42px] h-[42px] rounded-full bg-[#d9d9d9] shrink-0" />
            <div className="w-[160px]">
              <p className="text-[14px] text-[rgba(0,0,0,0.63)]">Daniele Souza</p>
              <p className="text-[10px] font-medium text-[#b8b8b8]">Financeiro • Permissão de edição</p>
            </div>
          </div>
          <button className="border border-[#d9d9d9] rounded-[17px] w-[42px] h-[42px] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#47535f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4" />
            </svg>
          </button>
        </div>

        {/* Money icon */}
        <div className="px-[30px] mt-[40px]">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#47535f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v10M9 9.5h4.5a1.5 1.5 0 010 3H9M9 12.5h5a1.5 1.5 0 010 3H9" />
          </svg>
        </div>

        {/* Painel de Ações header */}
        <div className="px-[30px] mt-2">
          <p className="text-[18px] font-light text-[#9d998a]">Painel de Ações</p>
          <p className="text-[10px] font-medium text-[#b0aea4] mt-1">
            Acompanhe e organize as movimentações
          </p>
        </div>

        {/* Pill buttons */}
        <div className="flex gap-3 mt-6 px-[30px]">
          <div className="border border-[#e5e5e5] rounded-[23px] h-[47px] px-5 flex items-center gap-2">
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#47535f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2v6a6 6 0 0012 0V2" />
              <path d="M6 2H4M20 2h-2" />
              <circle cx="18" cy="18" r="3" />
              <path d="M18 15V8" />
            </svg>
            <div className="bg-[#ff9898] rounded-[13px] px-[5px] py-[5px]">
              <span className="text-[10px] font-semibold text-white">{String(counts.pacientes).padStart(2, "0")}</span>
            </div>
          </div>
          <div className="border border-[#e5e5e5] rounded-[23px] h-[47px] px-5 flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#47535f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M16 7V5a4 4 0 00-8 0v2" />
              <path d="M12 11v4M10 13h4" />
            </svg>
            <div className="bg-[#ff9898] rounded-[13px] px-[5px] py-[5px]">
              <span className="text-[10px] font-semibold text-white">{String(counts.fornecedores).padStart(2, "0")}</span>
            </div>
          </div>
        </div>

        {/* 6 Action circles - 2 rows x 3 cols */}
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 px-[30px] mt-[40px]">
          <ActionCircle label="Adicionar Cliente" icon="user" />
          <ActionCircle label="Adicionar Orçamento" icon="stethoscope" />
          <ActionCircle label="Adicionar Fornecedor" icon="medkit" />
          <ActionCircle label="Função Personalizada" icon="user" ghost />
          <ActionCircle label="Função Personalizada" icon="user" ghost />
          <ActionCircle label="Função Personalizada" icon="user" ghost />
        </div>

        {/* Adicionar Informações */}
        <div className="px-[30px] mt-[40px]">
          <p className="text-[14px] font-medium text-[#1e1e1e]">Adicionar Informações</p>
          <p className="text-[10px] text-[#9f9f9f]">Cadastre Recebimentos e Despesas</p>
        </div>

        {/* Novo Recebimento */}
        <div className="px-[30px] mt-4 flex items-center justify-between h-[88px] rounded-[19px]">
          <div className="flex items-center gap-[13px]">
            <div className="bg-[rgba(165,193,110,0.06)] p-[14px] rounded-[24px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9d998a" strokeWidth="1.5">
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#9d998a]">Novo Recebimento</p>
              <p className="text-[12.5px] text-[rgba(198,194,179,0.7)]">Adicionar novo Recebimento</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#c6c2b3]" />
        </div>

        {/* Nova Despesa */}
        <div className="px-[30px] flex items-center justify-between h-[88px] rounded-[19px] pb-10">
          <div className="flex items-center gap-[13px]">
            <div className="bg-[rgba(255,140,140,0.06)] p-[14px] rounded-[24px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9d998a" strokeWidth="1.5">
                <path d="M5 12h14" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#9d998a]">Nova Despesa</p>
              <p className="text-[12.5px] text-[rgba(198,194,179,0.7)]">Adicionar novo Recebimento</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-[#c6c2b3]" />
        </div>
      </section>

      {/* ========== OPERACIONAL FINANCEIRO COLUMN - flex-1 ========== */}
      <main className="flex-1 bg-white border-l border-[#f4f4f4] overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-[50px] pt-[27px] pb-4">
          <div>
            <p className="text-[12px] font-medium text-[#1e1e1e]">Operacional Financeiro</p>
            <p className="text-[12px] text-[#9f9f9f] leading-[20px]">
              <Link href="/" className="hover:text-[#1e1e1e] transition-colors">
                Início
              </Link>
              {"/ Financeiro"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="border border-[#f4f4f4] rounded-[37px] h-[50px] flex items-center px-4 gap-3">
              <div className="bg-[#f2f2f2] rounded-full w-[37px] h-[37px] flex items-center justify-center">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#47535f" strokeWidth="1.5">
                  <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </div>
              <p className="text-[12px] font-medium text-[rgba(15,15,15,0.63)]">Seg, 12 jan</p>
              <div className="bg-[#ff9898] rounded-[13px] px-[5px] py-[5px]">
                <span className="text-[10px] font-semibold text-white">05</span>
              </div>
            </div>
            <div className="border border-[#e9e9e9] rounded-[17px] w-[50px] h-[50px] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#47535f" strokeWidth="1.5">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Receitas header */}
        <div className="px-[50px] mt-4 flex items-center justify-between">
          <div>
            <p className="text-[14px] font-medium text-[#1e1e1e]">Receitas</p>
            <p className="text-[10px] text-[#9f9f9f]">Detalhamento do Mês</p>
          </div>
          <div className="flex gap-[6px]">
            <button className="bg-[#47535f] text-white text-[12px] font-semibold font-[var(--font-jakarta)] px-[15px] py-[12px] rounded-[33px]">Hoje</button>
            <button className="border border-[rgba(0,0,0,0.1)] text-[rgba(43,43,43,0.51)] text-[12px] font-semibold font-[var(--font-jakarta)] px-[15px] py-[12px] rounded-[33px]">Semana</button>
            <button className="border border-[rgba(0,0,0,0.1)] text-[rgba(43,43,43,0.51)] text-[12px] font-semibold font-[var(--font-jakarta)] px-[15px] py-[12px] rounded-[33px]">Mês</button>
          </div>
        </div>

        {/* Receitas list */}
        <div className="px-[50px] mt-6 flex flex-col gap-[30px]">
          {receitas.map((r, i) => (
            <TxnRow key={`r-${i}`} {...r} />
          ))}
        </div>

        {/* Despesas + Ver 84 Lançamentos */}
        <div className="px-[50px] mt-6 flex items-start justify-between">
          <div>
            <p className="text-[14px] font-medium text-[#1e1e1e]">Despesas</p>
            <p className="text-[10px] text-[#9f9f9f]">Detalhamento do Mês</p>
          </div>
          <p className="text-[12px] font-medium text-[rgba(92,86,77,0.55)]">
            Ver <span className="text-[rgba(0,0,0,0.55)]">{counts.lancamentos} Lançamentos</span>
          </p>
        </div>

        {/* Despesas list */}
        <div className="px-[50px] mt-6 flex flex-col gap-[30px] pb-10">
          {despesas.map((d, i) => (
            <TxnRow key={`d-${i}`} {...d} statusBg={d.statusBg} />
          ))}
        </div>
      </main>
    </div>
  );
}

function ActionCircle({ label, icon, ghost }: { label: string; icon: "user" | "stethoscope" | "medkit"; ghost?: boolean }) {
  return (
    <div className="flex flex-col gap-[8.5px] items-center">
      <div className={`rounded-full p-[19px] w-[57px] h-[57px] flex items-center justify-center ${ghost ? "bg-[#f9f8f4]" : "bg-[rgba(71,83,95,0.1)]"}`}>
        {icon === "user" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ghost ? "#c7c5bc" : "#47535f"} strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M5 20v-1a7 7 0 0114 0v1" strokeLinecap="round" />
          </svg>
        )}
        {icon === "stethoscope" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ghost ? "#c7c5bc" : "#47535f"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2v6a6 6 0 0012 0V2" />
            <path d="M6 2H4M20 2h-2" />
            <circle cx="18" cy="18" r="3" />
            <path d="M18 15V8" />
          </svg>
        )}
        {icon === "medkit" && (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={ghost ? "#c7c5bc" : "#47535f"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M16 7V5a4 4 0 00-8 0v2" />
            <path d="M12 11v4M10 13h4" />
          </svg>
        )}
      </div>
      <p className={`text-[12px] font-medium text-center leading-[1.2] w-[90px] ${ghost ? "text-[#b9b7b0]" : "text-[#47535f]"}`}>
        {label}
      </p>
    </div>
  );
}

function TxnRow({ nome, procedure, status, statusColor, statusBg, amount, date }: { nome: string; procedure: string; status: string; statusColor: string; statusBg?: string; amount: string; date: string }) {
  return (
    <div className="flex items-center w-full min-w-0 gap-3">
      <div className="flex items-center gap-[12px] min-w-0 flex-1">
        <div className="w-[48px] h-[48px] rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4" />
            <path d="M5 20v-1a7 7 0 0114 0v1" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex flex-col gap-[5px] min-w-0 flex-1">
          <p className="text-[14px] font-medium font-[var(--font-dm)] text-[#535353] truncate">{nome}</p>
          <p className="text-[12px] font-[var(--font-dm)] text-[#a2a2a2] truncate">{procedure}</p>
        </div>
      </div>
      <div className="shrink-0">
        <div className="px-[15px] py-[8px] rounded-[28px]" style={{ backgroundColor: statusBg || "#fafbf6" }}>
          <p className="text-[12px] font-medium whitespace-nowrap" style={{ color: statusColor }}>{status}</p>
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-[14px] font-medium font-[var(--font-dm)] text-[#5b5b5b] whitespace-nowrap">{amount}</p>
        <p className="text-[12px] font-[var(--font-dm)] text-[#a2a2a2] whitespace-nowrap">{date}</p>
      </div>
      <div className="border border-[#efefef] rounded-full w-[32px] h-[32px] flex items-center justify-center shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0c0c0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7M17 7H10M17 7V14" />
        </svg>
      </div>
      <ChevronRight size={18} className="text-[#d0d0d0] shrink-0" />
    </div>
  );
}
