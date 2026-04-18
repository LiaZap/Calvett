"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navGroups = [
  [
    { href: "/", icon: "solar_home-2-bold.svg", label: "Dashboard" },
    { href: "/agendados", icon: "solar_bookmark-circle-bold.svg", label: "Agendados" },
  ],
  [
    { href: "/financeiro", icon: "solar_chat-round-money-bold.svg", label: "Financeiro" },
  ],
  [
    { href: "/atividade", icon: "solar_pulse-bold.svg", label: "Atividade" },
    { href: "/estoque", icon: "solar_box-bold.svg", label: "Estoque" },
    { href: "/medicacoes", icon: "solar_add-folder-bold.svg", label: "Medicações" },
  ],
];

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="w-[92px] min-w-[92px] min-h-screen bg-[#47535f] flex flex-col items-center justify-between py-6 border-r border-[rgba(255,255,255,0.06)]">
      {/* Collapse arrow at top */}
      <div className="flex items-center justify-center rotate-180">
        <Image src="/icons/solar_alt-arrow-left-linear.svg" alt="" width={24} height={24} />
      </div>

      {/* Icon groups (middle, centered via justify-between) */}
      <div className="flex flex-col gap-[40px] items-center">
        {navGroups.map((group, gi) => (
          <div key={gi} className="flex flex-col gap-[30px] items-center">
            {group.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-label={item.label}
                  className={`transition-opacity ${active ? "opacity-100" : "opacity-75 hover:opacity-100"}`}
                >
                  <Image src={`/icons/${item.icon}`} alt="" width={24} height={24} />
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Settings at bottom */}
      <Link
        href="/configuracoes"
        aria-label="Configurações"
        className={`transition-opacity ${pathname === "/configuracoes" ? "opacity-100" : "opacity-75 hover:opacity-100"}`}
      >
        <Image src="/icons/solar_settings-bold.svg" alt="" width={24} height={24} />
      </Link>
    </div>
  );
}
