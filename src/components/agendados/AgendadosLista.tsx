"use client";

import { MoreVertical, Search } from "lucide-react";
import { useAgendados, monthsPt } from "./AgendadosContext";
import { formatBRLTight } from "@/stores/format";
import UserMenu from "@/components/UserMenu";

export default function AgendadosLista() {
  const {
    hydrated,
    query,
    setQuery,
    year,
    month,
    goPrevMonth,
    goNextMonth,
    filteredCirurgias,
    effectiveSelectedId,
    setSelectedId,
    pacMap,
  } = useAgendados();

  return (
    <>
      {/* Column background (middle white panel) */}
      <div
        className="absolute bg-white"
        style={{ left: 652, top: 0, width: 636, height: 1080 }}
      />

      {/* Top header: Lançamentos / Lista de Lançamentos */}
      <div
        className="absolute font-[var(--font-zalando-stack)]"
        style={{ left: 700, top: 38 }}
      >
        <p className="text-[12px] font-medium text-[#1e1e1e]">Lançamentos</p>
        <p className="text-[12px] text-[#9f9f9f] leading-[20px]">
          Lista de Lançamentos
        </p>
      </div>

      {/* Top-right cluster — minimal: date + bell + avatar + menu */}
      <div
        className="absolute flex items-center gap-[14px]"
        style={{ left: 936, top: 45 }}
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
        style={{ left: 652, top: 108, width: 637, height: 1, background: "#f0f0f0" }}
      />

      {/* Cirurgias title + subtitle */}
      <div
        className="absolute font-[var(--font-zalando-stack)]"
        style={{ left: 700, top: 150 }}
      >
        <p className="text-[18px] font-light text-[#9d998a] leading-[1.2]">Cirurgias</p>
        <p className="text-[10px] font-medium text-[#b0aea4] mt-[6px]">
          Acompanhe e organize as movimentações
        </p>
      </div>

      {/* Date nav */}
      <div
        className="absolute flex items-center gap-[11px]"
        style={{ left: 1082, top: 155 }}
      >
        <button onClick={goPrevMonth} type="button" aria-label="Mês anterior">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="1.5" strokeLinecap="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <span className="text-[14px] font-medium text-[#6e6e6e] font-[var(--font-jakarta)] whitespace-nowrap">
          {monthsPt[month]} {year}
        </span>
        <button onClick={goNextMonth} type="button" aria-label="Próximo mês">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6e6e6e" strokeWidth="1.5" strokeLinecap="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      </div>

      {/* Search input */}
      <div
        className="absolute bg-[#fcfcfa] border border-[#f2f2ee] rounded-[10px] flex items-center gap-[12px] px-[20px]"
        style={{ left: 700, top: 222, width: 537, height: 60 }}
      >
        <Search size={18} className="text-[#959595] shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busque por pacientes ou procedimentos"
          className="w-full outline-none bg-transparent text-[12px] font-medium font-[var(--font-jakarta)] text-[#1e1e1e] placeholder:text-[#959595]"
        />
      </div>

      {/* Patient rows list */}
      <div
        className="absolute flex flex-col gap-[16px] overflow-y-auto"
        style={{ left: 700, top: 302, width: 538, height: 740 }}
      >
        {!hydrated ? null : filteredCirurgias.length === 0 ? (
          <p className="text-[12px] font-[var(--font-jakarta)] text-[#9f9f9f] italic py-6 text-center">
            Nenhuma cirurgia encontrada
          </p>
        ) : (
          filteredCirurgias.map((c) => {
            const nome = pacMap.get(c.pacienteId)?.nome ?? "(sem paciente)";
            const procedimento = c.procedimentos.join(" + ");
            const isSelected = c.id === effectiveSelectedId;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`flex items-center w-full justify-between gap-[10px] rounded-[12px] text-left transition-colors px-[8px] py-[4px] ${
                  isSelected ? "bg-[#fafafa]" : "hover:bg-[#fafafa]"
                }`}
              >
                <div className="flex items-center gap-[8px] min-w-0 flex-1">
                  <div className="relative w-[48px] h-[48px] rounded-full bg-[#f0f0f0] shrink-0 flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M5 20v-1a7 7 0 0114 0v1" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium text-black font-[var(--font-jakarta)] truncate">
                      {nome}
                    </p>
                    <p className="text-[12px] text-[#7f7f7f] font-[var(--font-jakarta)] truncate">
                      {procedimento}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-[10px] shrink-0">
                  <div className="text-right whitespace-nowrap" style={{ width: 82 }}>
                    <p className="text-[12px] font-semibold text-[#565143] font-[var(--font-jakarta)] leading-[1.2]">
                      {formatBRLTight(c.valor)}
                    </p>
                    <p className="text-[12px] font-medium text-[#9a9588] font-[var(--font-jakarta)] leading-[1.111]">
                      Valor Total
                    </p>
                  </div>
                  <span className="relative border border-[#e9e9e9] rounded-[10px] w-[30px] h-[30px] flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9f9f9f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                    <span className="absolute top-[4px] right-[4px] w-[5px] h-[5px] rounded-full bg-[#ff9898]" />
                  </span>
                  <span className="border border-[#e9e9e9] rounded-[10px] w-[30px] h-[30px] flex items-center justify-center">
                    <MoreVertical size={14} className="text-[#9f9f9f]" />
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>

    </>
  );
}
