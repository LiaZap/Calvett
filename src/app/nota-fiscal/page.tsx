"use client";

import { Suspense } from "react";
import NotaFiscalForm from "@/components/nota-fiscal/NotaFiscalForm";

export default function NotaFiscalPage() {
  return (
    <div className="fixed inset-0 bg-[#47535f] overflow-hidden">
      {/* 1920×1080 Figma canvas — stretched non-uniformly to fill viewport */}
      <div
        className="absolute top-0 left-0 bg-[#47535f]"
        style={{
          width: "var(--canvas-w, 1920px)",
          height: 1080,
          transform: "scale(var(--app-scale-x, 1), var(--app-scale-y, 1)) translateX(var(--dash-offset-x, 0))", transition: "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
          transformOrigin: "top left",
        }}
      >
        <Suspense fallback={null}>
          <NotaFiscalForm />
        </Suspense>
      </div>
    </div>
  );
}
