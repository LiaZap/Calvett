import type { Medicacao } from "@/types";
import { seedMedicacoes } from "@/data/seed";
import { createEntityStore } from "./createEntityStore";

export const useMedicacoesStore = createEntityStore<Medicacao>(
  "calvett-medicacoes",
  seedMedicacoes,
  2,
);
