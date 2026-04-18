"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  CreditCard,
  Eye,
  FolderPlus,
  Home,
  Package,
  Settings,
  Stethoscope,
} from "lucide-react";
import { useControlMenuStore } from "@/stores/useControlMenuStore";

type LeafItem = {
  type: "leaf";
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  exact?: boolean;
};

type GroupItem = {
  type: "group";
  label: string;
  href: string;
  icon: React.ReactNode;
  children: { label: string; href: string }[];
};

type MenuItem = LeafItem | GroupItem;

type Section = {
  label: string;
  items: MenuItem[];
};

const ICON_SIZE = 24;

// Figma colors (Slide 3 — node 72:1443)
const BG_COLOR = "#47535f";
const TEXT_DEFAULT = "rgba(255,255,255,0.75)";
const TEXT_MUTED = "rgba(255,255,255,0.5)";
const TEXT_ACTIVE = "#99ddff";
// Figma uses text-[rgba(0,0,0,0.5)] + opacity-75 for section labels — reads as muted white on dark bg
const SECTION_LABEL = "rgba(255,255,255,0.4)";

const sections: Section[] = [
  {
    label: "Início",
    items: [
      {
        type: "leaf",
        label: "Dashboard",
        href: "/",
        icon: <Home size={ICON_SIZE} strokeWidth={1.8} />,
        exact: true,
      },
      {
        type: "leaf",
        label: "Observações",
        href: "/atividade",
        icon: <Eye size={ICON_SIZE} strokeWidth={1.8} />,
        badge: "5",
      },
    ],
  },
  {
    label: "Financeiro",
    items: [
      {
        type: "group",
        label: "Lançamentos",
        href: "/financeiro",
        icon: <CreditCard size={ICON_SIZE} strokeWidth={1.8} />,
        children: [
          { label: "Recebimentos", href: "/financeiro?tipo=Receita" },
          { label: "Despesas", href: "/financeiro?tipo=Despesa" },
          { label: "Categorias", href: "/financeiro?view=categorias" },
          { label: "Contas", href: "/financeiro?view=contas" },
          { label: "Pagamentos", href: "/financeiro?view=pagamentos" },
        ],
      },
    ],
  },
  {
    label: "Operacional",
    items: [
      {
        type: "group",
        label: "Cirurgias",
        href: "/agendados",
        icon: <Stethoscope size={ICON_SIZE} strokeWidth={1.8} />,
        children: [
          { label: "Procedimentos", href: "/agendados?view=procedimentos" },
          { label: "Malhas", href: "/agendados?view=malhas" },
        ],
      },
      {
        type: "leaf",
        label: "Compras",
        href: "/estoque",
        icon: <Package size={ICON_SIZE} strokeWidth={1.8} />,
      },
      {
        type: "group",
        label: "Cadastros",
        href: "/estoque",
        icon: <FolderPlus size={ICON_SIZE} strokeWidth={1.8} />,
        children: [
          { label: "Pacientes", href: "/estoque?view=pacientes" },
          { label: "Fornecedores", href: "/estoque?view=fornecedores" },
        ],
      },
    ],
  },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  const path = href.split("?")[0];
  if (exact) return pathname === path;
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

export default function ControlMenuDrawer() {
  return (
    <Suspense fallback={null}>
      <ControlMenuDrawerInner />
    </Suspense>
  );
}

function ControlMenuDrawerInner() {
  const isOpen = useControlMenuStore((s) => s.isOpen);
  const close = useControlMenuStore((s) => s.close);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.toString();

  const initialExpanded = () => {
    const expanded: Record<string, boolean> = {};
    for (const section of sections) {
      for (const item of section.items) {
        if (item.type === "group" && isActive(pathname, item.href)) {
          expanded[item.label] = true;
        }
      }
    }
    return expanded;
  };

  const [expanded, setExpanded] =
    useState<Record<string, boolean>>(initialExpanded);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const toggleGroup = (label: string) =>
    setExpanded((e) => ({ ...e, [label]: !e[label] }));

  return (
    <div
      aria-hidden={!isOpen}
      className="fixed left-0 top-0 z-[9999]"
      style={{
        width: 300,
        height: 1080,
        transform:
          "scale(var(--app-scale-x, 1), var(--app-scale-y, 1))",
        transformOrigin: "top left",
        pointerEvents: "none",
      }}
    >
      <aside
        role="dialog"
        aria-modal="false"
        aria-label="Painel de Controle"
        className="absolute inset-0 flex flex-col will-change-transform font-[var(--font-jakarta)]"
        style={{
          backgroundColor: BG_COLOR,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 280ms cubic-bezier(0.32, 0.72, 0, 1)",
          pointerEvents: isOpen ? "auto" : "none",
          paddingLeft: 34,
          paddingRight: 34,
          paddingTop: 60,
          paddingBottom: 60,
        }}
      >
        {/* Header: title + close chevron — 98px gap before sections */}
        <div className="flex items-start justify-between mb-[98px]">
          <div className="flex flex-col gap-[5px]">
            <p
              className="font-medium leading-none"
              style={{ fontSize: 16, color: "#ffffff" }}
            >
              Painel de Controle
            </p>
            <p
              className="font-normal leading-none"
              style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}
            >
              Acesse as opções do sistema
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar Painel de Controle"
            className="shrink-0 w-[24px] h-[24px] flex items-center justify-center transition-opacity hover:opacity-100"
            style={{ color: "#ffffff", opacity: 0.75 }}
          >
            <ChevronLeft size={20} strokeWidth={1.8} />
          </button>
        </div>

        {/* Sections — 40px gap between sections */}
        <nav className="flex-1 overflow-y-auto flex flex-col gap-[40px]">
          {sections.map((section) => (
            <div key={section.label} className="flex flex-col gap-[20px]">
              <p
                className="font-semibold uppercase leading-none"
                style={{
                  fontSize: 12,
                  color: SECTION_LABEL,
                  letterSpacing: "0.02em",
                }}
              >
                {section.label}
              </p>
              <div className="flex flex-col gap-[30px]">
                {section.items.map((item) =>
                  item.type === "leaf" ? (
                    <LeafRow
                      key={item.label}
                      item={item}
                      pathname={pathname}
                      onNavigate={close}
                    />
                  ) : (
                    <GroupRow
                      key={item.label}
                      item={item}
                      pathname={pathname}
                      currentSearch={currentSearch}
                      expanded={!!expanded[item.label]}
                      onToggle={() => toggleGroup(item.label)}
                      onNavigate={close}
                    />
                  ),
                )}
              </div>
            </div>
          ))}
        </nav>

        {/* Configurações at bottom */}
        <Link
          href="/configuracoes"
          onClick={close}
          className="flex items-center gap-[9px] mt-[40px] hover:opacity-100 transition-opacity"
          style={{ color: "rgba(255,255,255,0.75)", opacity: 0.75 }}
        >
          <Settings size={ICON_SIZE} strokeWidth={1.8} />
          <span className="font-medium" style={{ fontSize: 16 }}>
            Configurações
          </span>
        </Link>
      </aside>
    </div>
  );
}

function LeafRow({
  item,
  pathname,
  onNavigate,
}: {
  item: LeafItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const active = isActive(pathname, item.href, item.exact);
  const color = active ? TEXT_ACTIVE : TEXT_DEFAULT;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="flex items-center justify-between w-full group"
    >
      <span className="flex items-center gap-[9px]">
        <span
          className="shrink-0 w-[24px] h-[24px] flex items-center justify-center"
          style={{ color }}
        >
          {item.icon}
        </span>
        <span
          className="font-medium leading-none whitespace-nowrap"
          style={{ fontSize: 16, color }}
        >
          {item.label}
        </span>
      </span>
      {item.badge && (
        <span
          className="inline-flex items-center justify-center rounded-[13px]"
          style={{
            backgroundColor: "#ffffff",
            width: 24,
            height: 28,
            padding: 5,
          }}
        >
          <span
            className="font-semibold"
            style={{
              fontSize: 10,
              color: "#495b67",
              fontFamily: "var(--font-zalando-stack)",
            }}
          >
            {item.badge}
          </span>
        </span>
      )}
    </Link>
  );
}

function GroupRow({
  item,
  pathname,
  currentSearch,
  expanded,
  onToggle,
  onNavigate,
}: {
  item: GroupItem;
  pathname: string;
  currentSearch: string;
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const active = isActive(pathname, item.href);
  const color = active ? TEXT_ACTIVE : TEXT_DEFAULT;
  return (
    <div className="flex flex-col gap-[10px]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex items-center justify-between w-full cursor-pointer"
      >
        <span className="flex items-center gap-[9px]">
          <span
            className="shrink-0 w-[24px] h-[24px] flex items-center justify-center"
            style={{ color }}
          >
            {item.icon}
          </span>
          <span
            className="font-medium leading-none whitespace-nowrap"
            style={{ fontSize: 16, color }}
          >
            {item.label}
          </span>
        </span>
        <span
          className="w-[14px] h-[14px] flex items-center justify-center"
          style={{ color: TEXT_DEFAULT }}
          aria-hidden
        >
          {expanded ? (
            <ChevronUp size={14} strokeWidth={2} />
          ) : (
            <ChevronDown size={14} strokeWidth={2} />
          )}
        </span>
      </button>
      {expanded && (
        <div className="flex items-center" style={{ paddingLeft: 12 }}>
          <div className="flex flex-col items-stretch" style={{ width: 100 }}>
            {item.children.map((child) => {
              const [childPath, childQuery = ""] = child.href.split("?");
              const childActive =
                pathname === childPath && currentSearch === childQuery;
              return (
                <div
                  key={child.label}
                  className="flex items-end"
                  style={{
                    borderLeft: "1px solid rgba(255,255,255,0.1)",
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                >
                  <Link
                    href={child.href}
                    onClick={onNavigate}
                    className="font-normal leading-none whitespace-nowrap transition-colors hover:opacity-100"
                    style={{
                      paddingLeft: 11,
                      fontSize: 14,
                      color: childActive ? TEXT_ACTIVE : TEXT_MUTED,
                    }}
                  >
                    {child.label}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
