import { create } from "zustand";

// Session-only (no persistence) cross-page selection context.
// Pages write a target id before navigating; the destination reads it on mount
// and then clears the slot so subsequent visits don't re-trigger.
export interface SelectionState {
  selectedPacienteId?: string;
  selectedFornecedorId?: string;
  selectedCirurgiaId?: string;
  selectedMedicacaoId?: string;
  selectedLancamentoId?: string;
  selectPaciente: (id?: string) => void;
  selectFornecedor: (id?: string) => void;
  selectCirurgia: (id?: string) => void;
  selectMedicacao: (id?: string) => void;
  selectLancamento: (id?: string) => void;
  clear: () => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedPacienteId: undefined,
  selectedFornecedorId: undefined,
  selectedCirurgiaId: undefined,
  selectedMedicacaoId: undefined,
  selectedLancamentoId: undefined,
  selectPaciente: (id) => set({ selectedPacienteId: id }),
  selectFornecedor: (id) => set({ selectedFornecedorId: id }),
  selectCirurgia: (id) => set({ selectedCirurgiaId: id }),
  selectMedicacao: (id) => set({ selectedMedicacaoId: id }),
  selectLancamento: (id) => set({ selectedLancamentoId: id }),
  clear: () =>
    set({
      selectedPacienteId: undefined,
      selectedFornecedorId: undefined,
      selectedCirurgiaId: undefined,
      selectedMedicacaoId: undefined,
      selectedLancamentoId: undefined,
    }),
}));
