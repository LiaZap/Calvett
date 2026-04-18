"use client";

import AgendadosSidebar from "@/components/agendados/AgendadosSidebar";
import AgendadosLista from "@/components/agendados/AgendadosLista";
import AgendadosDetalhes from "@/components/agendados/AgendadosDetalhes";
import { AgendadosProvider } from "@/components/agendados/AgendadosContext";

export default function AgendadosPage() {
  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      <div
        className="absolute top-0 left-0 bg-white"
        style={{
          width: "var(--canvas-w, 1920px)",
          height: 1080,
          transform: "scale(var(--app-scale-x, 1), var(--app-scale-y, 1)) translateX(var(--dash-offset-x, 0))", transition: "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
          transformOrigin: "top left",
        }}
      >
        <AgendadosProvider>
          <AgendadosSidebar />
          <AgendadosLista />
          <AgendadosDetalhes />
        </AgendadosProvider>
      </div>
    </div>
  );
}
