"use client";

import { useState } from "react";
import EstoqueSidebar from "@/components/estoque/EstoqueSidebar";
import EstoqueInsumos from "@/components/estoque/EstoqueInsumos";
import EstoqueMedicacoes from "@/components/estoque/EstoqueMedicacoes";
import type { FornecedorCategoria } from "@/types";

export default function EstoquePage() {
  const [categoria, setCategoria] = useState<FornecedorCategoria>("Medicações");

  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      <div
        id="estoque-canvas"
        className="absolute top-0 left-0 bg-white"
        style={{
          width: "var(--canvas-w, 1920px)",
          height: 1080,
          transform:
            "scale(var(--app-scale-x, 1), var(--app-scale-y, 1)) translateX(var(--dash-offset-x, 0))",
          transition: "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
          transformOrigin: "top left",
        }}
      >
        <EstoqueSidebar />
        <EstoqueInsumos categoria={categoria} onChange={setCategoria} />
        <EstoqueMedicacoes categoria={categoria} />
      </div>
    </div>
  );
}
