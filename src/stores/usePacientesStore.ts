import type { Paciente } from "@/types";
import { seedPacientes } from "@/data/seed";
import { createEntityStore } from "./createEntityStore";

export const usePacientesStore = createEntityStore<Paciente>(
  "calvett-pacientes",
  seedPacientes,
);
