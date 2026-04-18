import type { NotaFiscal } from "@/types";
import { seedNotasFiscais } from "@/data/seed";
import { createEntityStore } from "./createEntityStore";

export const useNotasFiscaisStore = createEntityStore<NotaFiscal>(
  "calvett-notas-fiscais",
  seedNotasFiscais,
);
