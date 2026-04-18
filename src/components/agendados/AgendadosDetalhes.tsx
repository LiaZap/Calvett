"use client";

import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { useAgendados, formatCirurgiaDate } from "./AgendadosContext";
import { formatBRLTight } from "@/stores/format";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = ["Agendamentos", "Orçamento", "Pagamento", "Malhas", "Despesas"] as const;
type Tab = (typeof tabs)[number];

export default function AgendadosDetalhes() {
  const { hydrated, selectedCirurgia, pacMap } = useAgendados();
  const [tab, setTab] = useState<Tab>("Agendamentos");

  const paciente = selectedCirurgia
    ? pacMap.get(selectedCirurgia.pacienteId)
    : undefined;
  const nome = paciente?.nome ?? "";
  const status = selectedCirurgia?.status ?? "";
  const displayStatus = status === "Finalizada" ? "Finalizado" : status;
  const procedimentos = selectedCirurgia?.procedimentos ?? [];
  const cirurgiao = selectedCirurgia?.cirurgiao ?? "";
  const data = selectedCirurgia?.data ?? "";
  const valor = selectedCirurgia?.valor ?? 0;
  const agendamentos = selectedCirurgia?.agendamentos ?? [];

  return (
    <>
      {/* Right column left-border divider (Figma: border-l at 1288.67) */}
      <div
        className="absolute"
        style={{ left: 1288, top: 0, width: 1, height: 1080, background: "#e8e8e8" }}
      />

      {/* Column background — stretches to canvas right edge */}
      <div
        className="absolute bg-white"
        style={{ left: 1289, right: 0, top: 0, height: 1080 }}
      />

      {/* Header: Detalhes / Detalhes de negociação e procedimento */}
      <div
        className="absolute font-[var(--font-zalando-stack)]"
        style={{ left: 1338, top: 38 }}
      >
        <p className="text-[12px] font-medium text-[#1e1e1e]">Detalhes</p>
        <p className="text-[12px] text-[#47535f] leading-[20px]">
          Detalhes de negociação e procedimento
        </p>
      </div>

      {/* PACIENTE label */}
      <p
        className="absolute text-[12px] font-semibold text-[#5f5c54] font-[var(--font-zalando-stack)]"
        style={{ left: 1338, top: 119 }}
      >
        PACIENTE
      </p>

      {/* Patient name */}
      <p
        className="absolute text-[33px] text-[#47535f] font-[var(--font-zalando-stack)] leading-[1.1]"
        style={{ left: 1338, top: 141, width: 370 }}
      >
        {hydrated ? nome : ""}
      </p>

      {/* Status badge — right-anchored */}
      {hydrated && displayStatus ? (
        <div
          className="absolute bg-[#fafbf6] rounded-[28px] flex items-center justify-center px-[15px]"
          style={{ right: 68, top: 155, height: 42, minWidth: 103 }}
        >
          <span className="text-[14px] font-medium font-[var(--font-dm)] text-[#a5c16e] whitespace-nowrap">
            {displayStatus}
          </span>
        </div>
      ) : null}

      {/* CIRURGIA label */}
      <p
        className="absolute text-[10px] font-semibold text-[#47535f] font-[var(--font-zalando-stack)]"
        style={{ left: 1338, top: 240 }}
      >
        CIRURGIA
      </p>

      {/* Procedure pills */}
      <div
        className="absolute flex flex-wrap gap-[11px]"
        style={{ left: 1338, top: 267, width: 540 }}
      >
        {procedimentos.map((p) => (
          <div
            key={p}
            className="bg-[rgba(160,172,185,0.1)] rounded-[11px] px-[10px] py-[10px] flex items-center"
          >
            <span className="text-[12px] font-[var(--font-jakarta)] text-[#7f7f7f] whitespace-nowrap">
              {p}
            </span>
          </div>
        ))}
      </div>

      {/* 3-col info: CIRURGIÃO | DATA | VALOR */}
      <InfoBlock left={1338} top={361} label="CIRURGIÃO" value={hydrated ? cirurgiao : ""} />
      <InfoBlock
        left={1537}
        top={359}
        label="DATA"
        value={hydrated && data ? formatCirurgiaDate(data) : ""}
      />
      <InfoBlock
        right={168}
        top={359}
        label="VALOR"
        value={hydrated ? formatBRLTight(valor) : ""}
      />

      {/* Horizontal divider — stretches to canvas right edge */}
      <div
        className="absolute"
        style={{ left: 1289, right: 0, top: 451, height: 1, background: "#e8e8e8" }}
      />

      {/* Tab pills */}
      <div
        className="absolute"
        style={{ left: 1336, top: 486, width: 528 }}
      >
        <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
          <TabsList className="flex items-center justify-between gap-[6px] w-full">
            {tabs.map((t) => (
              <TabsTrigger key={t} value={t} className="shrink-0">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Agendamentos title */}
      <div
        className="absolute font-[var(--font-zalando-stack)]"
        style={{ left: 1338, top: 571 }}
      >
        <p className="text-[18px] font-medium text-[#47535f] leading-[1.2]">Agendamentos</p>
        <p className="text-[10px] font-medium text-[rgba(71,83,95,0.54)] mt-[5px]">
          Confira todos os agendamentos relacionados
        </p>
      </div>

      {/* Agendamentos list or "em breve" */}
      {tab === "Agendamentos" ? (
        <div
          className="absolute flex flex-col gap-[12px]"
          style={{ left: 1328, top: 631, width: 559 }}
        >
          {!hydrated ? null : agendamentos.length === 0 ? (
            <p className="text-[12px] font-[var(--font-jakarta)] text-[#9f9f9f] italic text-center py-[20px]">
              Nenhum agendamento
            </p>
          ) : (
            agendamentos.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-[10px] rounded-[15px] hover:bg-[#fafafa] transition-colors"
              >
                <div className="flex items-center gap-[6px] min-w-0" style={{ width: 173 }}>
                  <div className="bg-[#ebeef1] rounded-[10px] w-[28px] h-[34px] flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#47535f">
                      <path d="M19 8h-2v3h-2v2h2v3h2v-3h2v-2h-2V8zM5 5h14v2H5zM4 9h16v11H4z" opacity="0.9" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-[#646464] font-[var(--font-jakarta)] truncate">
                      {a.tipo}
                    </p>
                    <p className="text-[10px] text-[#b0b0b0] font-[var(--font-jakarta)] truncate">
                      Agendamento
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-[20px] shrink-0">
                  <div className="text-right whitespace-nowrap">
                    <p className="text-[12px] font-semibold text-[#646464] font-[var(--font-jakarta)]">
                      {a.data}
                    </p>
                    <p className="text-[10px] font-medium text-[#b0b0b0] font-[var(--font-jakarta)]">
                      {a.dia}
                    </p>
                  </div>
                  <div className="flex items-center gap-[11px]">
                    <span className="relative border border-[#e9e9e9] rounded-[10px] w-[30px] h-[30px] flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9f9f9f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                      </svg>
                      <span className="absolute top-[4px] right-[4px] w-[5px] h-[5px] rounded-full bg-[#ff9898]" />
                    </span>
                    <span className="border border-[#e9e9e9] rounded-[10px] w-[30px] h-[30px] flex items-center justify-center">
                      <MoreHorizontal size={14} className="text-[#9f9f9f] rotate-90" />
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div
          className="absolute text-center"
          style={{ left: 1289, right: 0, top: 700 }}
        >
          <p className="text-[14px] font-medium font-[var(--font-jakarta)] text-[#9f9f9f] italic">
            Em breve
          </p>
        </div>
      )}
    </>
  );
}

function InfoBlock({
  left,
  right,
  top,
  label,
  value,
}: {
  left?: number;
  right?: number;
  top: number;
  label: string;
  value: string;
}) {
  const anchor = left !== undefined ? { left } : { right };
  return (
    <>
      <p
        className="absolute text-[10px] font-semibold text-[#47535f] font-[var(--font-zalando-stack)] whitespace-nowrap"
        style={{ ...anchor, top }}
      >
        {label}
      </p>
      <p
        className="absolute text-[14px] font-medium text-[rgba(0,0,0,0.5)] font-[var(--font-jakarta)]"
        style={{ ...anchor, top: top + 17, maxWidth: 356 }}
      >
        {value}
      </p>
    </>
  );
}
