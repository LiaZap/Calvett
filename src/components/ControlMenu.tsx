"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type MenuItem = {
  icon: string;
  label: string;
  active?: boolean;
  badge?: string;
  children?: string[];
  href?: string;
};

const sections: { title: string; items: MenuItem[] }[] = [
  {
    title: "Início",
    items: [
      { icon: "solar_home-2-bold.svg", label: "Dashboard", active: true, href: "/" },
      { icon: "solar_bookmark-circle-bold.svg", label: "Observações", badge: "5", href: "/agendados" },
    ],
  },
  {
    title: "Financeiro",
    items: [
      {
        icon: "solar_chat-round-money-bold.svg",
        label: "Lançamentos",
        href: "/financeiro",
        children: ["Recebimentos", "Despesas", "Categorias", "Contas", "Pagamentos"],
      },
    ],
  },
  {
    title: "Operacional",
    items: [
      {
        icon: "solar_pulse-bold.svg",
        label: "Cirurgias",
        href: "/atividade",
        children: ["Procedimentos", "Malhas"],
      },
      { icon: "solar_box-bold.svg", label: "Compras", href: "/estoque" },
      {
        icon: "solar_add-folder-bold.svg",
        label: "Cadastros",
        href: "/medicacoes",
        children: ["Pacientes", "Fornecedores"],
      },
    ],
  },
];

export default function ControlMenu({ activeHref }: { activeHref?: string }) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Lançamentos: true,
  });

  const toggle = (label: string) =>
    setExpanded((s) => ({ ...s, [label]: !s[label] }));

  return (
    <div className="flex flex-col h-full w-[238px] font-[var(--font-jakarta)]">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-[5px] items-start w-[168px]">
          <p className="font-medium text-[16px] text-white leading-normal">Painel de Controle</p>
          <p className="font-normal text-[12px] text-[rgba(255,255,255,0.5)] leading-normal">
            Acesse as opções do sistema
          </p>
        </div>
        <Image
          src="/icons/solar_alt-arrow-left-linear.svg"
          alt=""
          width={24}
          height={24}
          className="opacity-75"
        />
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-[40px] w-full mt-[60px]">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col gap-[20px] w-full">
            <p className="font-semibold text-[12px] text-[rgba(0,0,0,0.5)] uppercase opacity-75 leading-normal">
              {section.title}
            </p>
            <div className="flex flex-col gap-[30px] w-full">
              {section.items.map((item) => (
                <MenuRow
                  key={item.label}
                  item={{
                    ...item,
                    active: activeHref ? item.href === activeHref : item.active,
                  }}
                  isExpanded={expanded[item.label]}
                  onToggle={() => toggle(item.label)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/configuracoes"
        className="flex items-center gap-[9px] w-full h-[24px] mt-auto opacity-75 hover:opacity-100 transition-opacity"
      >
        <Image src="/icons/solar_settings-bold.svg" alt="" width={24} height={24} />
        <span className="font-medium text-[16px] text-[rgba(255,255,255,0.75)] leading-normal">
          Configurações
        </span>
      </Link>
    </div>
  );
}

function MenuRow({
  item,
  isExpanded,
  onToggle,
}: {
  item: MenuItem;
  isExpanded?: boolean;
  onToggle: () => void;
}) {
  const hasChildren = !!item.children?.length;
  const textColor = item.active ? "text-[#99ddff]" : "text-[rgba(255,255,255,0.75)]";
  const opacityClass = item.active ? "" : "opacity-75";

  const content = (
    <div className="flex items-center justify-between w-full">
      <div className="flex gap-[9px] items-center">
        <div className={`relative size-[24px] ${opacityClass}`}>
          <Image src={`/icons/${item.icon}`} alt="" width={24} height={24} />
        </div>
        <span
          className={`font-medium text-[16px] ${textColor} ${opacityClass} leading-normal whitespace-nowrap`}
        >
          {item.label}
        </span>
      </div>
      {item.badge && (
        <div className="bg-white flex items-center justify-center px-[5px] py-[5px] rounded-[13px] h-[28px] w-[24px]">
          <span className="font-[var(--font-zalando-stack)] font-semibold text-[10px] text-[#495b67]">
            {item.badge}
          </span>
        </div>
      )}
      {hasChildren && (
        <Image
          src="/icons/solar_alt-arrow-left-linear.svg"
          alt=""
          width={14}
          height={14}
          className={`${isExpanded ? "rotate-0" : "-rotate-90"} transition-transform`}
        />
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-[10px] items-start w-full">
      {hasChildren ? (
        <button onClick={onToggle} className="w-full cursor-pointer" aria-expanded={isExpanded}>
          {content}
        </button>
      ) : item.href ? (
        <Link href={item.href} className="w-full">
          {content}
        </Link>
      ) : (
        <div className="w-full">{content}</div>
      )}

      {hasChildren && isExpanded && (
        <div className="flex flex-col items-start pl-[12px]">
          {item.children!.map((child) => (
            <div
              key={child}
              className="border-l border-[rgba(255,255,255,0.1)] flex items-end py-[10px] min-w-[100px]"
            >
              <div className="flex items-center justify-center pl-[11px]">
                <span className="font-normal text-[14px] text-[rgba(255,255,255,0.5)] leading-normal whitespace-nowrap">
                  {child}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
