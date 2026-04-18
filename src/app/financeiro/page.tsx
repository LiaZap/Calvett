"use client";

import FinanceiroSidebar from "@/components/financeiro/FinanceiroSidebar";
import FinanceiroTabela from "@/components/financeiro/FinanceiroTabela";

export default function FinanceiroPage() {
  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      {/* 1920×1080 Figma canvas — stretched non-uniformly to fill viewport */}
      <div
        id="financeiro-canvas"
        className="absolute top-0 left-0 bg-white"
        style={{
          width: "var(--canvas-w, 1920px)",
          height: 1080,
          transform: "scale(var(--app-scale-x, 1), var(--app-scale-y, 1)) translateX(var(--dash-offset-x, 0))", transition: "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
          transformOrigin: "top left",
        }}
      >
        <FinanceiroSidebar />
        <FinanceiroTabela />
      </div>
    </div>
  );
}
