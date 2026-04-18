import type { Cirurgia } from "@/types";
import { seedCirurgias } from "@/data/seed";
import { createEntityStore } from "./createEntityStore";

export const useCirurgiasStore = createEntityStore<Cirurgia>(
  "calvett-cirurgias",
  seedCirurgias,
);
