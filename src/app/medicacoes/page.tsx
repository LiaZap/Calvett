"use client";

import { useState } from "react";
import MedicacoesDrawer from "@/components/medicacoes/MedicacoesDrawer";
import MedicacoesLista from "@/components/medicacoes/MedicacoesLista";
import MedicacoesDetalhes from "@/components/medicacoes/MedicacoesDetalhes";

export default function MedicacoesPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const detailsOpen = selectedId !== null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setExpandedId(id);
  };
  const handleToggleExpand = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));
  const handleCloseDetails = () => setSelectedId(null);

  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      <div
        className="absolute top-0 left-0 bg-white"
        style={{
          width: "var(--canvas-w, 1920px)",
          height: 1080,
          transform: "scale(var(--app-scale-x, 1), var(--app-scale-y, 1)) translateX(var(--dash-offset-x, 0))",
          transition: "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
          transformOrigin: "top left",
        }}
      >
        <MedicacoesDrawer />
        <MedicacoesLista
          selectedId={selectedId}
          expandedId={expandedId}
          onSelect={handleSelect}
          onToggleExpand={handleToggleExpand}
          detailsOpen={detailsOpen}
        />
        <MedicacoesDetalhes
          selectedId={selectedId}
          open={detailsOpen}
          onClose={handleCloseDetails}
        />
      </div>
    </div>
  );
}
