import type { Fornecedor } from "@/types";
import { seedFornecedores } from "@/data/seed";
import { createEntityStore } from "./createEntityStore";

export const useFornecedoresStore = createEntityStore<Fornecedor>(
  "calvett-fornecedores",
  seedFornecedores,
);
