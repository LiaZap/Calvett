"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useMedicacoesStore } from "@/stores/useMedicacoesStore";
import { useHydrate } from "@/stores/useHydrate";
import { useControlMenuStore } from "@/stores/useControlMenuStore";

type CategoryItem = {
  label: string;
  sub: string;
  href: string;
};

const categorias: CategoryItem[] = [
  { label: "Medicações", sub: "Acompanhe e organize as movimentações", href: "/medicacoes" },
  { label: "Materiais", sub: "Controle de medicamentos.", href: "/medicacoes" },
  { label: "Campos e Aventais", sub: "Gestão de materiais médicos.", href: "/medicacoes" },
  { label: "Fios", sub: "Itens de paramentação cirúrgica.", href: "/medicacoes" },
  { label: "Curativos", sub: "Fios e suturas.", href: "/medicacoes" },
  { label: "Assepsia", sub: "Produtos de assepsia.", href: "/medicacoes" },
  { label: "Soluções", sub: "Soluções médicas.", href: "/medicacoes" },
  { label: "CME", sub: "Materiais esterilizados.", href: "/medicacoes" },
  { label: "Gases Medicinais", sub: "Gases para procedimentos.", href: "/medicacoes" },
];

const navItems = [
  { href: "/", icon: "solar_home-2-bold.svg", label: "Dashboard" },
  { href: "/agendados", icon: "solar_bookmark-circle-bold.svg", label: "Agendados" },
  { href: "/financeiro", icon: "solar_chat-round-money-bold.svg", label: "Financeiro" },
  { href: "/atividade", icon: "solar_pulse-bold.svg", label: "Atividade" },
  { href: "/estoque", icon: "solar_box-bold.svg", label: "Estoque" },
  { href: "/medicacoes", icon: "solar_add-folder-bold.svg", label: "Medicações" },
];

// Nav rail (dark column) 92px + Insumos drawer 388px = 480px total
const RAIL_WIDTH = 92;
const DRAWER_WIDTH = 480;
const CONTENT_LEFT = RAIL_WIDTH + 32;
const CONTENT_WIDTH = DRAWER_WIDTH - CONTENT_LEFT - 40;

export default function MedicacoesDrawer() {
  const pathname = usePathname();
  const hydrated = useHydrate();
  const medicacoesCount = useMedicacoesStore((s) => s.items.length);
  const toggleControlMenu = useControlMenuStore((s) => s.toggle);

  return (
    <>
      {/* Light drawer background x=92..480 */}
      <div
        className="absolute"
        style={{
          left: RAIL_WIDTH,
          top: 0,
          width: DRAWER_WIDTH - RAIL_WIDTH,
          height: 1080,
          background: "rgba(95,120,142,0.08)",
        }}
      />

      {/* Insumos header */}
      <div
        className="absolute font-[var(--font-zalando-stack)]"
        style={{ left: CONTENT_LEFT, top: 52, width: CONTENT_WIDTH }}
      >
        <p className="text-[12px] font-medium text-[#1e1e1e]">Insumos</p>
        <p className="text-[12px] text-[#47535f] leading-[20px]">
          Listagem de todos os insumos
        </p>
      </div>

      {/* Category rows */}
      <div
        className="absolute flex flex-col gap-[6px] font-[var(--font-zalando-stack)]"
        style={{ left: RAIL_WIDTH + 16, top: 178, width: DRAWER_WIDTH - RAIL_WIDTH - 32 }}
      >
        {categorias.map((c, i) => {
          const active = i === 0;
          return (
            <Link
              key={c.label}
              href={c.href}
              className="group flex items-center justify-between gap-3 w-full rounded-[10px] px-[16px] py-[12px] transition-colors hover:bg-white/60"
            >
              <div className="flex flex-col gap-[3px] min-w-0 flex-1">
                <div className="flex items-center gap-[10px]">
                  <p
                    className={`text-[14px] truncate transition-colors ${
                      active
                        ? "text-[#1e1e1e] font-semibold"
                        : "text-[#47535f] group-hover:text-[#1e1e1e] font-medium"
                    }`}
                  >
                    {c.label}
                  </p>
                  {active && hydrated && medicacoesCount > 0 && (
                    <span className="inline-flex items-center justify-center h-[18px] min-w-[20px] px-[6px] rounded-full bg-[rgba(71,83,95,0.1)] text-[#47535f] text-[10px] font-semibold font-[var(--font-jakarta)]">
                      {medicacoesCount}
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-medium font-[var(--font-jakarta)] text-[rgba(71,83,95,0.55)] truncate">
                  {c.sub}
                </p>
              </div>
              <ChevronRight
                size={16}
                className={`shrink-0 transition-colors ${
                  active ? "text-[#47535f]" : "text-[rgba(71,83,95,0.35)] group-hover:text-[#47535f]"
                }`}
              />
            </Link>
          );
        })}
      </div>

      {/* Dark nav rail (x=0..92) — rendered after drawer so it sits on top */}
      <div
        className="absolute bg-[#47535f]"
        style={{ left: 0, top: 0, width: RAIL_WIDTH, height: 1080 }}
      />
      <div
        className="absolute"
        style={{
          left: RAIL_WIDTH,
          top: 0,
          width: 1,
          height: 1080,
          background: "rgba(255,255,255,0.06)",
        }}
      />
      <button
        type="button"
        onClick={toggleControlMenu}
        aria-label="Abrir Painel de Controle"
        className="absolute flex items-center justify-center hover:opacity-100 transition-opacity cursor-pointer"
        style={{ left: 34, top: 48, width: 24, height: 24 }}
      >
        <Image
          src="/icons/solar_alt-arrow-left-linear.svg"
          alt=""
          width={24}
          height={24}
          className="opacity-75"
        />
      </button>
      <div
        className="absolute flex flex-col gap-[28px] items-center"
        style={{ left: 34, top: 360, width: 24 }}
      >
        {navItems.map((it) => {
          const active = pathname === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-label={it.label}
              className={`transition-opacity ${active ? "opacity-100" : "opacity-60 hover:opacity-100"}`}
            >
              <Image src={`/icons/${it.icon}`} alt="" width={24} height={24} />
            </Link>
          );
        })}
      </div>
      <Link
        href="/configuracoes"
        aria-label="Configurações"
        className="absolute opacity-75 hover:opacity-100 transition-opacity"
        style={{ left: 34, top: 1008, width: 24, height: 24 }}
      >
        <Image src="/icons/solar_settings-bold.svg" alt="" width={24} height={24} />
      </Link>
    </>
  );
}
