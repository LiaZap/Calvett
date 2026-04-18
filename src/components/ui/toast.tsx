"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: "12px",
          border: "1px solid #e9e9e9",
          padding: "14px 18px",
          fontFamily: "var(--font-jakarta)",
          fontSize: "13px",
          color: "#1e1e1e",
          background: "#ffffff",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        },
      }}
    />
  );
}

export { toast } from "sonner";
