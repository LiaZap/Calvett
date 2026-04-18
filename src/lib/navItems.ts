/**
 * Shared nav rail items — used by every page's dark sidebar component.
 * Keeping this in one place prevents drift (e.g., an icon changing on one page).
 */

export type NavItem = {
  href: string;
  icon: string;
  label: string;
};

export const navItems: readonly NavItem[] = [
  { href: "/", icon: "solar_home-2-bold.svg", label: "Dashboard" },
  { href: "/agendados", icon: "solar_bookmark-circle-bold.svg", label: "Agendados" },
  { href: "/financeiro", icon: "solar_chat-round-money-bold.svg", label: "Financeiro" },
  { href: "/atividade", icon: "solar_pulse-bold.svg", label: "Atividade" },
  { href: "/estoque", icon: "solar_box-bold.svg", label: "Estoque" },
  { href: "/medicacoes", icon: "solar_add-folder-bold.svg", label: "Medicações" },
];
