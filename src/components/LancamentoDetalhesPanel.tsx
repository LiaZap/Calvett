"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  FileText,
  Layers,
  MessageSquare,
  Phone,
  Tag,
  Trash2,
  User,
  X,
} from "lucide-react";
import type { Lancamento, LancamentoStatus } from "@/types";
import { useLancamentosStore } from "@/stores/useLancamentosStore";
import { usePacientesStore } from "@/stores/usePacientesStore";
import { useFornecedoresStore } from "@/stores/useFornecedoresStore";
import { formatBRL } from "@/stores/format";
import { toast } from "@/components/ui/toast";
import ComentariosModal from "@/components/ComentariosModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATUSES: LancamentoStatus[] = ["Pago", "Pendente", "Parcela", "Agendado", "Atrasado"];

const statusStyle: Record<LancamentoStatus, { bg: string; text: string; dot: string }> = {
  Pago: { bg: "#ebf8ee", text: "#5e9a72", dot: "#6aa380" },
  Parcela: { bg: "#fafbf6", text: "#a5ac5d", dot: "#bac16e" },
  Agendado: { bg: "#fbf6e7", text: "#b3a256", dot: "#c1b26e" },
  Pendente: { bg: "#fef6e7", text: "#b3935e", dot: "#c1a36e" },
  Atrasado: { bg: "rgba(193,132,110,0.12)", text: "#b77660", dot: "#c1846e" },
};

const monthsPt = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function formatDataCompleta(iso: string): string {
  const d = new Date(iso + "T12:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  const dia = String(d.getDate()).padStart(2, "0");
  return `${dia} de ${monthsPt[d.getMonth()]} de ${d.getFullYear()}`;
}

const AVATAR_COLORS = [
  { bg: "#5b7c99", text: "#ffffff" },
  { bg: "#7ca598", text: "#ffffff" },
  { bg: "#c1846e", text: "#ffffff" },
  { bg: "#8a6ec1", text: "#ffffff" },
  { bg: "#c1a86e", text: "#ffffff" },
  { bg: "#6ec1a8", text: "#ffffff" },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

type Props = {
  lancamento: Lancamento | null;
  open: boolean;
  onClose: () => void;
  width?: number;
};

export default function LancamentoDetalhesPanel({
  lancamento,
  open,
  onClose,
  width = 520,
}: Props) {
  const router = useRouter();
  const updateLanc = useLancamentosStore((s) => s.update);
  const removeLanc = useLancamentosStore((s) => s.remove);
  const pacientes = usePacientesStore((s) => s.items);
  const fornecedores = useFornecedoresStore((s) => s.items);
  const [comentariosOpen, setComentariosOpen] = useState(false);

  const isReceita = lancamento?.tipo === "Receita";
  const accent = isReceita ? "#6aa380" : "#c1846e";
  const accentBgSoft = isReceita ? "rgba(106,163,128,0.10)" : "rgba(193,132,110,0.10)";

  const paciente = useMemo(
    () => (lancamento?.pacienteId ? pacientes.find((p) => p.id === lancamento.pacienteId) : null),
    [lancamento, pacientes],
  );
  const fornecedor = useMemo(
    () => (lancamento?.fornecedorId ? fornecedores.find((f) => f.id === lancamento.fornecedorId) : null),
    [lancamento, fornecedores],
  );

  const displayName = lancamento?.nome ?? "";
  const avatarColor = colorFor(displayName);
  const initials = getInitials(displayName);
  const badge = lancamento ? statusStyle[lancamento.status] : statusStyle.Pendente;

  const handleNotaFiscal = () => {
    if (!lancamento) return;
    const params = new URLSearchParams();
    params.set("tipo", lancamento.tipo);
    if (fornecedor?.nome) params.set("fornecedor", fornecedor.nome);
    if (fornecedor?.cnpj) params.set("cnpj", fornecedor.cnpj);
    if (lancamento.valor) params.set("valor", String(lancamento.valor));
    router.push(`/nota-fiscal?${params.toString()}`);
  };

  const handleDelete = () => {
    if (!lancamento) return;
    if (window.confirm(`Excluir lançamento "${lancamento.nome}"?`)) {
      removeLanc(lancamento.id);
      toast.success("Lançamento excluído");
      onClose();
    }
  };

  const handleStatusChange = (s: LancamentoStatus) => {
    if (!lancamento) return;
    updateLanc(lancamento.id, { status: s });
    toast.success(`Status alterado para ${s}`);
  };

  return (
    <>
      <aside
        aria-hidden={!open}
        className="absolute top-0 h-[1080px] bg-white border-l border-[#ececec] shadow-[-16px_0_48px_rgba(0,0,0,0.07)] flex flex-col"
        style={{
          right: 0,
          width,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 360ms cubic-bezier(0.32, 0.72, 0, 1)",
          pointerEvents: open ? "auto" : "none",
          zIndex: 40,
        }}
      >
        {lancamento && (
          <>
            {/* TOP BAR */}
            <div className="flex items-center justify-between px-[36px] pt-[34px] pb-[4px]">
              <span
                className="inline-flex items-center gap-[8px] rounded-full px-[14px] py-[7px]"
                style={{ background: accentBgSoft, color: accent }}
              >
                {isReceita ? <ArrowDownLeft size={13} strokeWidth={2.2} /> : <ArrowUpRight size={13} strokeWidth={2.2} />}
                <span className="text-[11px] font-bold uppercase tracking-[0.14em] font-[var(--font-jakarta)]">
                  {isReceita ? "Recebimento" : "Despesa"}
                </span>
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar"
                className="w-[36px] h-[36px] rounded-full bg-[#f7f7f5] hover:bg-[#eeeeec] flex items-center justify-center transition-colors"
              >
                <X size={16} className="text-[#47535f]" />
              </button>
            </div>

            {/* HERO */}
            <div className="px-[36px] pt-[28px] pb-[36px] border-b border-[#f0f0f0]">
              <div className="flex items-center gap-[16px] mb-[32px]">
                <div
                  className="w-[58px] h-[58px] rounded-full flex items-center justify-center shrink-0 shadow-[0_8px_20px_rgba(0,0,0,0.10)]"
                  style={{ background: avatarColor.bg, color: avatarColor.text }}
                >
                  <span className="text-[18px] font-bold font-[var(--font-dm)]">{initials}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-semibold text-[#1e1e1e] font-[var(--font-zalando-stack)] truncate leading-tight">
                    {displayName}
                  </p>
                  <p className="text-[12px] text-[#9f9f9f] font-[var(--font-zalando-stack)] truncate mt-[4px]">
                    {lancamento.descricao || lancamento.categoria || (isReceita ? "Procedimento" : "Transação")}
                  </p>
                </div>
              </div>

              <p className="text-[10px] uppercase tracking-[0.2em] text-[#9f9f9f] font-bold font-[var(--font-jakarta)] mb-[12px]">
                Valor {isReceita ? "recebido" : "da despesa"}
              </p>
              <div className="flex items-center justify-between gap-[14px]">
                <p className="text-[40px] font-light text-[#1e1e1e] font-[var(--font-zalando-stack)] leading-none tracking-[-0.02em]">
                  {formatBRL(lancamento.valor)}
                </p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-[7px] rounded-full px-[13px] py-[8px] text-[11px] font-bold hover:brightness-105 transition shrink-0"
                      style={{ backgroundColor: badge.bg, color: badge.text }}
                    >
                      <span
                        className="w-[7px] h-[7px] rounded-full"
                        style={{ backgroundColor: badge.dot }}
                      />
                      {lancamento.status}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {STATUSES.map((s) => (
                      <DropdownMenuItem key={s} onSelect={() => handleStatusChange(s)}>
                        {s}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto">
              {/* DETALHES */}
              <div className="px-[36px] py-[30px] border-b border-[#f0f0f0]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9f9f9f] font-bold font-[var(--font-jakarta)] mb-[22px]">
                  Detalhes do Lançamento
                </p>
                <div className="flex flex-col gap-[20px]">
                  <InfoRow
                    icon={<Calendar size={15} strokeWidth={1.8} />}
                    iconBg="#e7f0f7"
                    iconColor="#5b7c99"
                    label="Data"
                    value={formatDataCompleta(lancamento.data)}
                  />
                  {lancamento.vencimento && (
                    <InfoRow
                      icon={<Calendar size={15} strokeWidth={1.8} />}
                      iconBg="#fef2e7"
                      iconColor="#c1846e"
                      label="Vencimento"
                      value={formatDataCompleta(lancamento.vencimento)}
                    />
                  )}
                  <InfoRow
                    icon={<CreditCard size={15} strokeWidth={1.8} />}
                    iconBg="#f0ebf8"
                    iconColor="#8a6ec1"
                    label="Banco"
                    value={lancamento.banco}
                  />
                  {lancamento.categoria && (
                    <InfoRow
                      icon={<Tag size={15} strokeWidth={1.8} />}
                      iconBg="#e9f5ef"
                      iconColor="#6aa380"
                      label="Categoria"
                      value={lancamento.categoria}
                    />
                  )}
                  {lancamento.competencia && (
                    <InfoRow
                      icon={<Calendar size={15} strokeWidth={1.8} />}
                      iconBg="#fbf6e7"
                      iconColor="#b3a256"
                      label="Competência"
                      value={lancamento.competencia}
                    />
                  )}
                  {lancamento.parcelamento && (
                    <InfoRow
                      icon={<Layers size={15} strokeWidth={1.8} />}
                      iconBg="#e7f4f0"
                      iconColor="#6ec1a8"
                      label="Parcelamento"
                      value={`${lancamento.parcelamento.atual}/${lancamento.parcelamento.total}`}
                    />
                  )}
                </div>
              </div>

              {/* PACIENTE/FORNECEDOR */}
              {(paciente || fornecedor) && (
                <div className="px-[36px] py-[30px] border-b border-[#f0f0f0]">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#9f9f9f] font-bold font-[var(--font-jakarta)] mb-[22px]">
                    {paciente ? "Paciente" : "Fornecedor"}
                  </p>
                  <div className="flex items-center gap-[14px]">
                    <div
                      className="w-[46px] h-[46px] rounded-full flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.06)]"
                      style={{
                        background: colorFor((paciente?.nome ?? fornecedor?.nome) ?? "?").bg,
                        color: "white",
                      }}
                    >
                      {paciente ? <User size={18} strokeWidth={1.8} /> : <Building2 size={18} strokeWidth={1.8} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-[#1e1e1e] font-[var(--font-zalando-stack)] truncate leading-tight">
                        {paciente?.nome ?? fornecedor?.nome}
                      </p>
                      {paciente?.telefone && (
                        <p className="text-[12px] text-[#9f9f9f] flex items-center gap-[5px] mt-[4px] font-[var(--font-zalando-stack)]">
                          <Phone size={11} strokeWidth={1.8} />
                          {paciente.telefone}
                        </p>
                      )}
                      {fornecedor?.cnpj && (
                        <p className="text-[12px] text-[#9f9f9f] mt-[4px] font-[var(--font-zalando-stack)]">
                          CNPJ: {fornecedor.cnpj}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* AÇÕES */}
              <div className="px-[36px] py-[30px]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#9f9f9f] font-bold font-[var(--font-jakarta)] mb-[18px]">
                  Ações
                </p>
                <div className="flex flex-col gap-[10px]">
                  <ActionRow
                    icon={<FileText size={18} strokeWidth={1.8} />}
                    iconBg="#e7f0f7"
                    iconColor="#5b7c99"
                    label={lancamento.notaFiscalId ? "Ver Nota Fiscal" : "Vincular Nota Fiscal"}
                    sub={lancamento.notaFiscalId ? "Comprovante anexado ao lançamento" : "Enviar comprovante ao lançamento"}
                    badge={lancamento.notaFiscalId ? <CheckCircle2 size={16} className="text-[#6aa380]" /> : null}
                    onClick={handleNotaFiscal}
                  />
                  <ActionRow
                    icon={<MessageSquare size={18} strokeWidth={1.8} />}
                    iconBg="#f0ebf8"
                    iconColor="#8a6ec1"
                    label="Observações"
                    sub={
                      lancamento.comentarios?.length
                        ? `${lancamento.comentarios.length} nota(s) interna(s)`
                        : "Adicionar nota interna"
                    }
                    badge={
                      lancamento.comentarios?.length ? (
                        <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-[6px] rounded-full bg-[#8a6ec1] text-white text-[10px] font-bold">
                          {lancamento.comentarios.length}
                        </span>
                      ) : null
                    }
                    onClick={() => setComentariosOpen(true)}
                  />
                </div>
              </div>
            </div>

            {/* FOOTER — destructive */}
            <div className="px-[36px] py-[22px] border-t border-[#f0f0f0] bg-white">
              <button
                type="button"
                onClick={handleDelete}
                className="w-full h-[52px] rounded-[14px] border border-[rgba(193,132,110,0.28)] bg-[rgba(193,132,110,0.04)] hover:bg-[rgba(193,132,110,0.08)] text-[#c1846e] text-[13px] font-semibold font-[var(--font-zalando-stack)] transition-colors flex items-center justify-center gap-[8px]"
              >
                <Trash2 size={16} strokeWidth={1.8} />
                Excluir Lançamento
              </button>
            </div>
          </>
        )}
      </aside>

      <ComentariosModal
        open={comentariosOpen}
        onOpenChange={setComentariosOpen}
        lancamentoId={lancamento?.id ?? null}
      />
    </>
  );
}

function InfoRow({
  icon,
  iconBg,
  iconColor,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-[14px]">
      <div
        className="w-[38px] h-[38px] rounded-[11px] flex items-center justify-center shrink-0"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.16em] text-[#9f9f9f] font-bold font-[var(--font-jakarta)] mb-[3px]">
          {label}
        </p>
        <p className="text-[14px] font-semibold text-[#1e1e1e] font-[var(--font-zalando-stack)] truncate leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

function ActionRow({
  icon,
  iconBg,
  iconColor,
  label,
  sub,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
  sub: string;
  badge?: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-[14px] px-[16px] py-[14px] rounded-[14px] border border-[#ececec] bg-white hover:bg-[#fafbfc] hover:border-[#dcdcdc] transition-all text-left"
    >
      <div
        className="w-[42px] h-[42px] rounded-[12px] flex items-center justify-center shrink-0"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#1e1e1e] font-[var(--font-zalando-stack)] truncate leading-tight">
          {label}
        </p>
        <p className="text-[11px] text-[#9f9f9f] font-[var(--font-zalando-stack)] truncate mt-[3px]">
          {sub}
        </p>
      </div>
      {badge ? (
        <div className="shrink-0">{badge}</div>
      ) : (
        <ChevronRight size={16} className="text-[#bfbfbf] shrink-0 group-hover:text-[#8a929a] transition-colors" />
      )}
    </button>
  );
}
