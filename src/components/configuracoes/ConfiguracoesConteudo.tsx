"use client";

import Link from "next/link";
import { useState } from "react";
import {
  User,
  Building2,
  Users,
  Plug,
  Bell,
  Sliders,
  CreditCard,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

type CategoryKey =
  | "perfil"
  | "hospital"
  | "usuarios"
  | "integracoes"
  | "notificacoes"
  | "preferencias"
  | "faturamento"
  | "seguranca";

interface Category {
  key: CategoryKey;
  label: string;
  desc: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  {
    key: "perfil",
    label: "Perfil",
    desc: "Dados do responsável",
    icon: User,
  },
  {
    key: "hospital",
    label: "Hospital",
    desc: "Informações da clínica",
    icon: Building2,
  },
  {
    key: "usuarios",
    label: "Usuários e permissões",
    desc: "Equipe e acessos",
    icon: Users,
  },
  {
    key: "integracoes",
    label: "Integrações",
    desc: "APIs e serviços externos",
    icon: Plug,
  },
  {
    key: "notificacoes",
    label: "Notificações",
    desc: "Alertas e lembretes",
    icon: Bell,
  },
  {
    key: "preferencias",
    label: "Preferências",
    desc: "Tema, idioma e exibição",
    icon: Sliders,
  },
  {
    key: "faturamento",
    label: "Faturamento",
    desc: "Plano e métodos de pagamento",
    icon: CreditCard,
  },
  {
    key: "seguranca",
    label: "Segurança",
    desc: "Senha e 2FA",
    icon: Lock,
  },
];

const COL_LEFT = 604;
const CONTENT_LEFT = 628;
const SUBNAV_LEFT = 628;
const SUBNAV_TOP = 150;
const SUBNAV_WIDTH = 280;
const PANEL_LEFT = 940;
const PANEL_TOP = 150;
const PANEL_RIGHT = 20;

interface ProfileFields {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  cargo: string;
  departamento: string;
}

const initialProfile: ProfileFields = {
  nome: "Lucas Campos",
  email: "lucas.campos@hospitaldaplastica.com.br",
  telefone: "(11) 98765-4321",
  cpf: "123.456.789-00",
  cargo: "Administrador",
  departamento: "Gestão Clínica",
};

export default function ConfiguracoesConteudo() {
  const [active, setActive] = useState<CategoryKey>("perfil");
  const [profile, setProfile] = useState<ProfileFields>(initialProfile);
  const [toggles, setToggles] = useState({
    emailReports: true,
    pushNotifications: false,
    twoFARequired: true,
  });

  const activeCategory = categories.find((c) => c.key === active) ?? categories[0];

  function handleChange<K extends keyof ProfileFields>(
    key: K,
    value: ProfileFields[K],
  ) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Alterações salvas");
  }

  function handleCancel() {
    setProfile(initialProfile);
    toast.info("Alterações descartadas");
  }

  return (
    <>
      {/* Column background (white content area) — stretches to canvas right edge */}
      <div
        className="absolute bg-white"
        style={{ left: COL_LEFT, right: 0, top: 0, height: 1080 }}
      />

      {/* Right-column top bar: date pill + bell + avatar + hamburger — right-anchored to stretch with canvas */}
      <p
        className="absolute text-[12px] font-medium text-[rgba(15,15,15,0.63)] font-[var(--font-zalando-stack)] whitespace-nowrap"
        style={{ right: 217, top: 45 }}
      >
        Seg, 12 jan
      </p>
      <div
        className="absolute border border-[#f4f4f4] rounded-[37px] flex items-center px-[8px] gap-[8px]"
        style={{ right: 110, top: 27, width: 90, height: 50 }}
      >
        <div className="bg-[#f2f2f2] rounded-full w-[37px] h-[37px] flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#47535f"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </div>
        <div className="bg-[#ff9898] rounded-[13px] px-[5px] py-[3px]">
          <span className="text-[10px] font-semibold text-white">05</span>
        </div>
      </div>
      <div
        className="absolute bg-[#d9d9d9] border border-[#e9e9e9] rounded-[17px]"
        style={{ right: 52, top: 27, width: 50, height: 50 }}
      />
      <button
        type="button"
        aria-label="Menu"
        className="absolute border border-[#e9e9e9] rounded-[17px] flex items-center justify-center hover:bg-[#fafafa] transition-colors"
        style={{ right: 0, top: 27, width: 50, height: 50 }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#47535f"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Breadcrumb */}
      <div
        className="absolute font-[var(--font-zalando-stack)]"
        style={{ left: CONTENT_LEFT, top: 46 }}
      >
        <p className="text-[12px] font-medium text-[#1e1e1e]">Configurações</p>
        <p className="text-[12px] text-[#9f9f9f] leading-[20px]">
          <Link href="/" className="hover:text-[#1e1e1e] transition-colors">
            Início
          </Link>
          / Configurações
        </p>
      </div>

      {/* Sub-nav column (left side of right area) */}
      <div
        className="absolute"
        style={{ left: SUBNAV_LEFT, top: SUBNAV_TOP, width: SUBNAV_WIDTH }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9f9f9f] font-[var(--font-zalando-stack)] mb-[14px]">
          Categorias
        </p>
        <div className="flex flex-col gap-[6px]">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.key === active;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActive(cat.key)}
                className={`flex items-center gap-[12px] rounded-[14px] px-[14px] py-[12px] text-left transition-colors ${
                  isActive
                    ? "bg-[#47535f] text-white"
                    : "text-[#535353] hover:bg-[#f6f6f6]"
                }`}
              >
                <span
                  className={`w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0 ${
                    isActive ? "bg-white/10" : "bg-[#f4f6f8]"
                  }`}
                >
                  <Icon
                    size={18}
                    color={isActive ? "#ffffff" : "#47535f"}
                    strokeWidth={1.6}
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-[13px] font-medium font-[var(--font-zalando-stack)] truncate ${
                      isActive ? "text-white" : "text-[#1e1e1e]"
                    }`}
                  >
                    {cat.label}
                  </span>
                  <span
                    className={`block text-[11px] font-[var(--font-zalando-stack)] truncate ${
                      isActive ? "text-white/70" : "text-[#9f9f9f]"
                    }`}
                  >
                    {cat.desc}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right sub-panel — stretches to canvas right edge */}
      <div
        className="absolute"
        style={{ left: PANEL_LEFT, right: PANEL_RIGHT, top: PANEL_TOP }}
      >
        {/* Section title */}
        <div className="flex items-start justify-between mb-[24px]">
          <div>
            <p className="text-[18px] font-medium text-[#1e1e1e] font-[var(--font-zalando-stack)]">
              {activeCategory.label}
            </p>
            <p className="text-[12px] text-[#9f9f9f] font-[var(--font-zalando-stack)]">
              {active === "perfil"
                ? "Informações pessoais do responsável"
                : activeCategory.desc}
            </p>
          </div>
          <span className="inline-flex items-center gap-[6px] rounded-[14px] border border-[#f0f0f0] px-[12px] py-[6px] bg-[#fafafa]">
            <span className="w-[6px] h-[6px] rounded-full bg-[#a5c16e]" />
            <span className="text-[11px] font-medium text-[#535353] font-[var(--font-zalando-stack)]">
              Sincronizado
            </span>
          </span>
        </div>

        {active === "perfil" ? (
          <form onSubmit={handleSave}>
            {/* 2-column form grid */}
            <div className="grid grid-cols-2 gap-x-[20px] gap-y-[18px]">
              <Field
                label="Nome completo"
                id="cfg-nome"
                value={profile.nome}
                onChange={(v) => handleChange("nome", v)}
                placeholder="Nome completo"
              />
              <Field
                label="E-mail"
                id="cfg-email"
                type="email"
                value={profile.email}
                onChange={(v) => handleChange("email", v)}
                placeholder="email@exemplo.com"
              />
              <Field
                label="Telefone"
                id="cfg-telefone"
                value={profile.telefone}
                onChange={(v) => handleChange("telefone", v)}
                placeholder="(11) 90000-0000"
              />
              <Field
                label="CPF"
                id="cfg-cpf"
                value={profile.cpf}
                onChange={(v) => handleChange("cpf", v)}
                placeholder="000.000.000-00"
              />
              <Field
                label="Cargo"
                id="cfg-cargo"
                value={profile.cargo}
                onChange={(v) => handleChange("cargo", v)}
                placeholder="Cargo"
              />
              <Field
                label="Departamento"
                id="cfg-dep"
                value={profile.departamento}
                onChange={(v) => handleChange("departamento", v)}
                placeholder="Departamento"
              />
            </div>

            {/* Toggles */}
            <div className="mt-[32px] border-t border-[#f0f0f0] pt-[24px]">
              <p className="text-[13px] font-medium text-[#1e1e1e] font-[var(--font-zalando-stack)] mb-[4px]">
                Preferências de conta
              </p>
              <p className="text-[12px] text-[#9f9f9f] font-[var(--font-zalando-stack)] mb-[18px]">
                Controle as notificações e políticas de segurança
              </p>
              <div className="flex flex-col gap-[10px]">
                <ToggleRow
                  label="Receber relatórios por e-mail"
                  desc="Resumo diário enviado às 18:00"
                  checked={toggles.emailReports}
                  onChange={(v) =>
                    setToggles((t) => ({ ...t, emailReports: v }))
                  }
                />
                <ToggleRow
                  label="Notificações push"
                  desc="Alertas em tempo real no navegador"
                  checked={toggles.pushNotifications}
                  onChange={(v) =>
                    setToggles((t) => ({ ...t, pushNotifications: v }))
                  }
                />
                <ToggleRow
                  label="2FA obrigatório"
                  desc="Exigir autenticação em dois fatores no login"
                  checked={toggles.twoFARequired}
                  onChange={(v) =>
                    setToggles((t) => ({ ...t, twoFARequired: v }))
                  }
                />
              </div>
            </div>

            {/* Actions */}
            <div className="mt-[32px] flex items-center justify-end gap-[12px]">
              <button
                type="button"
                onClick={handleCancel}
                className="border border-[#e9e9e9] text-[#535353] text-[13px] font-medium font-[var(--font-zalando-stack)] rounded-[24px] px-[20px] py-[12px] hover:bg-[#fafafa] transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#47535f] text-white text-[13px] font-medium font-[var(--font-zalando-stack)] rounded-[24px] px-[20px] py-[12px] hover:bg-[#3b4651] transition-colors"
              >
                Salvar alterações
              </button>
            </div>
          </form>
        ) : (
          <PlaceholderPanel
            label={activeCategory.label}
            desc={activeCategory.desc}
          />
        )}
      </div>
    </>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-[6px] min-w-0">
      <label
        htmlFor={id}
        className="text-[12px] font-medium text-[#535353] font-[var(--font-zalando-stack)]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[12px] border border-[#e9e9e9] bg-white px-[14px] py-[14px] text-[13px] font-medium text-[#1e1e1e] placeholder:text-[#9f9f9f] font-[var(--font-zalando-stack)] focus:outline-none focus:border-[#47535f] transition-colors"
      />
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-[14px] border border-[#f0f0f0] rounded-[14px] px-[16px] py-[14px] min-w-0">
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[#1e1e1e] font-[var(--font-zalando-stack)] truncate">
          {label}
        </p>
        <p className="text-[12px] text-[#9f9f9f] font-[var(--font-zalando-stack)] truncate">
          {desc}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-[44px] h-[24px] rounded-full transition-colors ${
          checked ? "bg-[#47535f]" : "bg-[#e0e0e0]"
        }`}
      >
        <span
          className="absolute top-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.18)] transition-all"
          style={{ left: checked ? 22 : 2 }}
        />
      </button>
    </div>
  );
}

function PlaceholderPanel({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="border border-dashed border-[#e9e9e9] rounded-[19px] bg-[#fafafa] p-[40px] flex flex-col items-center justify-center text-center">
      <div className="w-[56px] h-[56px] rounded-full bg-white border border-[#f0f0f0] flex items-center justify-center mb-[16px]">
        <Sliders size={22} className="text-[#47535f]" />
      </div>
      <p className="text-[15px] font-medium text-[#1e1e1e] font-[var(--font-zalando-stack)] mb-[4px]">
        {label}
      </p>
      <p className="text-[12px] text-[#9f9f9f] font-[var(--font-zalando-stack)] max-w-[360px]">
        {desc}. Esta seção estará disponível em breve — o conteúdo será liberado
        junto com as próximas configurações do sistema.
      </p>
    </div>
  );
}
