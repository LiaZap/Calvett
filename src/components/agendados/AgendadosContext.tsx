"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useCirurgiasStore } from "@/stores/useCirurgiasStore";
import { usePacientesStore } from "@/stores/usePacientesStore";
import { useSelectionStore } from "@/stores/useSelectionStore";
import { useHydrate } from "@/stores/useHydrate";
import type { Cirurgia, Paciente } from "@/types";

type ModalKind = null | "cirurgia" | "paciente";

type Ctx = {
  hydrated: boolean;
  // data
  cirurgias: Cirurgia[];
  pacientesList: Paciente[];
  pacMap: Map<string, Paciente>;
  // filters
  query: string;
  setQuery: (v: string) => void;
  year: number;
  month: number;
  goPrevMonth: () => void;
  goNextMonth: () => void;
  // derived
  filteredCirurgias: Cirurgia[];
  selectedId: string | null;
  effectiveSelectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedCirurgia: Cirurgia | undefined;
  // modal
  modal: ModalKind;
  setModal: (m: ModalKind) => void;
};

const AgendadosCtx = createContext<Ctx | null>(null);

export function AgendadosProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrate();
  const cirurgias = useCirurgiasStore((s) => s.items);
  const pacientesList = usePacientesStore((s) => s.items);
  const selectPaciente = useSelectionStore((s) => s.selectPaciente);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(0);
  const [modal, setModal] = useState<ModalKind>(null);

  // Consume cross-page paciente selection the same way the previous page did.
  useEffect(() => {
    if (!hydrated) return;
    const applySelection = (pacienteId: string | undefined) => {
      if (!pacienteId) return;
      const latest = useCirurgiasStore.getState().items;
      const match = latest.find((c) => c.pacienteId === pacienteId);
      if (match) {
        setSelectedId(match.id);
        const [cy, cm] = match.data.split("-").map((n) => Number(n));
        if (cy && cm) {
          setYear(cy);
          setMonth(cm - 1);
        }
      }
      selectPaciente(undefined);
    };
    applySelection(useSelectionStore.getState().selectedPacienteId);
    return useSelectionStore.subscribe((state, prev) => {
      if (state.selectedPacienteId !== prev.selectedPacienteId) {
        applySelection(state.selectedPacienteId);
      }
    });
  }, [hydrated, selectPaciente]);

  const pacMap = useMemo(
    () => new Map<string, Paciente>(pacientesList.map((p) => [p.id, p])),
    [pacientesList],
  );

  const filteredCirurgias = useMemo<Cirurgia[]>(() => {
    const q = query.trim().toLowerCase();
    return cirurgias.filter((c) => {
      const [cy, cm] = c.data.split("-").map((n) => Number(n));
      if (!cy || !cm) return false;
      if (cy !== year || cm - 1 !== month) return false;
      if (!q) return true;
      const nome = pacMap.get(c.pacienteId)?.nome ?? "";
      return (
        nome.toLowerCase().includes(q) ||
        c.procedimentos.some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [cirurgias, query, year, month, pacMap]);

  const effectiveSelectedId =
    selectedId && filteredCirurgias.some((c) => c.id === selectedId)
      ? selectedId
      : filteredCirurgias[0]?.id ?? cirurgias[0]?.id ?? null;

  const selectedCirurgia = useMemo<Cirurgia | undefined>(() => {
    if (!effectiveSelectedId) return undefined;
    return cirurgias.find((c) => c.id === effectiveSelectedId);
  }, [cirurgias, effectiveSelectedId]);

  const goPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  };
  const goNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const value: Ctx = {
    hydrated,
    cirurgias,
    pacientesList,
    pacMap,
    query,
    setQuery,
    year,
    month,
    goPrevMonth,
    goNextMonth,
    filteredCirurgias,
    selectedId,
    effectiveSelectedId,
    setSelectedId,
    selectedCirurgia,
    modal,
    setModal,
  };

  return <AgendadosCtx.Provider value={value}>{children}</AgendadosCtx.Provider>;
}

export function useAgendados(): Ctx {
  const ctx = useContext(AgendadosCtx);
  if (!ctx) throw new Error("useAgendados must be used inside AgendadosProvider");
  return ctx;
}

export const monthsPt = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function formatCirurgiaDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((n) => Number(n));
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, "0")} de ${monthsPt[m - 1]} de ${y}`;
}
