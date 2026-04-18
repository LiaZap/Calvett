"use client";

import { useMemo } from "react";
import {
  Beaker,
  Biohazard,
  Droplet,
  Package,
  Pill,
  Scissors,
  Shirt,
  Syringe,
  Wind,
} from "lucide-react";
import { useMedicacoesStore } from "@/stores/useMedicacoesStore";
import { useHydrate } from "@/stores/useHydrate";
import type { FornecedorCategoria } from "@/types";

type CategoryDef = {
  nome: FornecedorCategoria;
  icon: React.ReactNode;
  color: string;
};

const categorias: CategoryDef[] = [
  { nome: "Medicações", icon: <Pill size={16} strokeWidth={1.8} />, color: "#5b7c99" },
  { nome: "Materiais", icon: <Package size={16} strokeWidth={1.8} />, color: "#6aa380" },
  { nome: "Campos e Aventais", icon: <Shirt size={16} strokeWidth={1.8} />, color: "#8a6ec1" },
  { nome: "Fios", icon: <Scissors size={16} strokeWidth={1.8} />, color: "#c1a86e" },
  { nome: "Curativos", icon: <Biohazard size={16} strokeWidth={1.8} />, color: "#c1846e" },
  { nome: "Assepsia", icon: <Droplet size={16} strokeWidth={1.8} />, color: "#6ec1a8" },
  { nome: "Soluções", icon: <Beaker size={16} strokeWidth={1.8} />, color: "#b3a256" },
  { nome: "CME", icon: <Syringe size={16} strokeWidth={1.8} />, color: "#7ca598" },
  { nome: "Gases Medicinais", icon: <Wind size={16} strokeWidth={1.8} />, color: "#5b99c1" },
];

const COL_LEFT = 92;
const COL_WIDTH = 240;

type Props = {
  categoria: FornecedorCategoria;
  onChange: (c: FornecedorCategoria) => void;
};

export default function EstoqueInsumos({ categoria, onChange }: Props) {
  const hydrated = useHydrate();
  const medicacoes = useMedicacoesStore((s) => s.items);

  const counts = useMemo(() => {
    const map = new Map<FornecedorCategoria, number>();
    for (const m of medicacoes) {
      const c = m.categoria ?? "Medicações";
      map.set(c, (map.get(c) ?? 0) + 1);
    }
    return map;
  }, [medicacoes]);

  return (
    <>
      {/* Drawer background */}
      <div
        className="absolute bg-[rgba(95,120,142,0.06)] border-r border-[#ececec]"
        style={{ left: COL_LEFT, top: 0, width: COL_WIDTH, height: 1080 }}
      />

      {/* Header */}
      <div
        className="absolute font-[var(--font-zalando-stack)]"
        style={{ left: COL_LEFT + 20, top: 46, width: COL_WIDTH - 40 }}
      >
        <p className="text-[12px] font-medium text-[#1e1e1e]">Insumos</p>
        <p className="text-[11px] text-[#9f9f9f] leading-[18px]">
          Categorias
        </p>
      </div>

      {/* Category rows */}
      <div
        className="absolute flex flex-col gap-[2px]"
        style={{ left: COL_LEFT + 12, top: 110, width: COL_WIDTH - 24 }}
      >
        {categorias.map((c) => {
          const active = c.nome === categoria;
          const count = hydrated ? counts.get(c.nome) ?? 0 : 0;
          return (
            <button
              key={c.nome}
              type="button"
              onClick={() => onChange(c.nome)}
              className={`group flex items-center gap-[10px] w-full h-[42px] px-[10px] rounded-[8px] transition-colors text-left ${
                active ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]" : "hover:bg-white/60"
              }`}
            >
              <span
                className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center shrink-0"
                style={{
                  background: active ? `${c.color}18` : "rgba(71,83,95,0.08)",
                  color: active ? c.color : "#47535f",
                }}
              >
                {c.icon}
              </span>
              <span
                className={`flex-1 text-[12px] truncate font-[var(--font-zalando-stack)] ${
                  active ? "text-[#1e1e1e] font-semibold" : "text-[#47535f] font-medium"
                }`}
              >
                {c.nome}
              </span>
              {count > 0 && (
                <span
                  className={`inline-flex items-center justify-center h-[18px] min-w-[22px] px-[6px] rounded-full text-[10px] font-semibold font-[var(--font-jakarta)] ${
                    active
                      ? "bg-[rgba(71,83,95,0.12)] text-[#47535f]"
                      : "bg-[rgba(71,83,95,0.08)] text-[#8a929a]"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
