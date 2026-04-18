"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePacientesStore } from "./usePacientesStore";
import { useFornecedoresStore } from "./useFornecedoresStore";
import { useCirurgiasStore } from "./useCirurgiasStore";
import { useLancamentosStore } from "./useLancamentosStore";
import { useMedicacoesStore } from "./useMedicacoesStore";
import { useNotasFiscaisStore } from "./useNotasFiscaisStore";

// Subscribing to a no-op external store gives us a stable "is mounted"
// signal without a setState-in-effect (avoids React 19's
// react-hooks/set-state-in-effect warning). On the server the getServerSnapshot
// returns false; on the client getSnapshot returns true after hydration.
function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/**
 * Triggers seed hydration for all entity stores after the persist middleware
 * has rehydrated from localStorage. Returns `true` once safe to render
 * store-driven UI (prevents SSR/CSR mismatch).
 */
export function useHydrate(): boolean {
  const mounted = useMounted();

  const pacientesHydrated = usePacientesStore((s) => s.hydrated);
  const fornecedoresHydrated = useFornecedoresStore((s) => s.hydrated);
  const cirurgiasHydrated = useCirurgiasStore((s) => s.hydrated);
  const lancamentosHydrated = useLancamentosStore((s) => s.hydrated);
  const medicacoesHydrated = useMedicacoesStore((s) => s.hydrated);
  const notasFiscaisHydrated = useNotasFiscaisStore((s) => s.hydrated);

  useEffect(() => {
    if (!mounted) return;
    usePacientesStore.getState().hydrate();
    useFornecedoresStore.getState().hydrate();
    useCirurgiasStore.getState().hydrate();
    useLancamentosStore.getState().hydrate();
    useMedicacoesStore.getState().hydrate();
    useNotasFiscaisStore.getState().hydrate();
  }, [
    mounted,
    pacientesHydrated,
    fornecedoresHydrated,
    cirurgiasHydrated,
    lancamentosHydrated,
    medicacoesHydrated,
    notasFiscaisHydrated,
  ]);

  return (
    mounted &&
    pacientesHydrated &&
    fornecedoresHydrated &&
    cirurgiasHydrated &&
    lancamentosHydrated &&
    medicacoesHydrated &&
    notasFiscaisHydrated
  );
}
