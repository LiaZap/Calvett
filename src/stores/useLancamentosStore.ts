import type { Lancamento } from "@/types";
import { seedLancamentos } from "@/data/seed";
import { createEntityStore } from "./createEntityStore";

export const useLancamentosStore = createEntityStore<Lancamento>(
  "calvett-lancamentos",
  seedLancamentos,
);
