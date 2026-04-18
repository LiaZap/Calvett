"use client";

import Sidebar from "@/components/Sidebar";
import ActionPanel from "@/components/ActionPanel";
import FinancialPanel from "@/components/FinancialPanel";

export default function DashboardPage() {
  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      {/* 1920×1080 Figma canvas — stretched non-uniformly to fill viewport */}
      <div
        id="dashboard-canvas"
        className="absolute top-0 left-0 bg-white"
        style={{
          width: "var(--canvas-w, 1920px)",
          height: 1080,
          transform: "scale(var(--app-scale-x, 1), var(--app-scale-y, 1)) translateX(var(--dash-offset-x, 0))", transition: "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
          transformOrigin: "top left",
        }}
      >
        {/* Vertical divider between ActionPanel and FinancialPanel */}
        <div
          className="absolute"
          style={{
            left: 1089,
            top: 0,
            width: 1,
            height: 1080,
            background: "#f4f4f4",
          }}
        />

        <Sidebar />
        <ActionPanel />
        <FinancialPanel />
      </div>
    </div>
  );
}
