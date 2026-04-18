"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useControlMenuStore } from "@/stores/useControlMenuStore";

const navItems = [
  { href: "/", icon: "solar_home-2-bold.svg", label: "Dashboard" },
  { href: "/agendados", icon: "solar_bookmark-circle-bold.svg", label: "Agendados" },
  { href: "/financeiro", icon: "solar_chat-round-money-bold.svg", label: "Financeiro" },
  { href: "/atividade", icon: "solar_pulse-bold.svg", label: "Atividade" },
  { href: "/estoque", icon: "solar_box-bold.svg", label: "Estoque" },
  { href: "/medicacoes", icon: "solar_add-folder-bold.svg", label: "Medicações" },
];

const RAIL_WIDTH = 92;

export default function EstoqueSidebar() {
  const pathname = usePathname();
  const toggleControlMenu = useControlMenuStore((s) => s.toggle);

  return (
    <>
      {/* Dark nav rail (0..92) */}
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
              className={`transition-opacity ${
                active ? "opacity-100" : "opacity-60 hover:opacity-100"
              }`}
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
