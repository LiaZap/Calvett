import { create } from "zustand";

/**
 * Global toggle store for the shared "Painel de Controle" side drawer.
 * Intentionally minimal — no persistence, no derived state.
 */
export interface ControlMenuState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useControlMenuStore = create<ControlMenuState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));
