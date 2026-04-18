"use client";

import { useId, useMemo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useLancamentosStore } from "@/stores/useLancamentosStore";
import { usePacientesStore } from "@/stores/usePacientesStore";
import { useFornecedoresStore } from "@/stores/useFornecedoresStore";
import NovaNotaFiscalForm from "@/components/forms/NovaNotaFiscalForm";
import ComentariosModal from "@/components/ComentariosModal";
import type {
  Banco,
  Comentario,
  Lancamento,
  LancamentoTipo,
  Parcelamento,
} from "@/types";

export interface NovoLancamentoFormProps {
  tipo: LancamentoTipo;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const bancoOptions: { value: Banco; label: string; bg: string }[] = [
  { value: "C6 Bank", label: "C6 Bank", bg: "#1e1e1e" },
  { value: "Stone PF", label: "Stone PF", bg: "#00B050" },
];

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function competenciaAtual() {
  const now = new Date();
  return `${MESES[now.getMonth()]} ${now.getFullYear()}`;
}

const FIELD_CLASS =
  "h-16 rounded-[10px] bg-neutral-50 border border-stone-100 px-5 flex items-center transition-colors focus-within:bg-[#f3f3f2]";
const TEXT_INPUT_CLASS =
  "w-full bg-transparent outline-none text-sm font-medium font-[var(--font-jakarta)] text-[#1e1e1e] placeholder:text-neutral-400 placeholder:font-medium";
const PLACEHOLDER_SPAN_CLASS =
  "absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none text-sm text-neutral-400 font-medium font-[var(--font-jakarta)]";

function TextField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className={FIELD_CLASS}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={TEXT_INPUT_CLASS}
      />
    </div>
  );
}

function DateField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className={`${FIELD_CLASS} relative cursor-pointer`}>
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-transparent outline-none text-sm font-medium font-[var(--font-jakarta)] ${
          value ? "text-[#1e1e1e]" : "text-transparent"
        } [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
      />
      {!value && <span className={PLACEHOLDER_SPAN_CLASS}>{placeholder}</span>}
    </label>
  );
}

export default function NovoLancamentoForm({
  tipo,
  open,
  onOpenChange,
}: NovoLancamentoFormProps) {
  const add = useLancamentosStore((s) => s.add);
  const pacientes = usePacientesStore((s) => s.items);
  const fornecedores = useFornecedoresStore((s) => s.items);

  const identificacaoOptions = useMemo(() => {
    const list: { value: string; label: string; kind: "paciente" | "fornecedor" }[] = [];
    pacientes.forEach((p) => list.push({ value: `paciente:${p.id}`, label: p.nome, kind: "paciente" }));
    fornecedores.forEach((f) => list.push({ value: `fornecedor:${f.id}`, label: f.nome, kind: "fornecedor" }));
    return list;
  }, [pacientes, fornecedores]);

  const [identificacao, setIdentificacao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [dataPagamento, setDataPagamento] = useState("");
  const [competencia, setCompetencia] = useState("");
  const [banco, setBanco] = useState<Banco>("C6 Bank");
  const [valor, setValor] = useState("");
  const [notaFiscalId, setNotaFiscalId] = useState<string | undefined>(undefined);
  const [parcelamento, setParcelamento] = useState<Parcelamento | undefined>(undefined);
  const [comentarios, setComentarios] = useState<Comentario[]>([]);

  const [notaOpen, setNotaOpen] = useState(false);
  const [comentariosOpen, setComentariosOpen] = useState(false);

  const title = tipo === "Receita" ? "Nova Receita" : "Nova Despesa";
  const description =
    tipo === "Receita"
      ? "Criar novo lançamento de recebimento"
      : "Criar novo lançamento de despesa";

  const bancoInfo = bancoOptions.find((b) => b.value === banco) ?? bancoOptions[0];

  function resolveIdentificacao() {
    if (!identificacao) return { nome: "", pacienteId: undefined, fornecedorId: undefined };
    const [kind, id] = identificacao.split(":");
    if (kind === "paciente") {
      const p = pacientes.find((x) => x.id === id);
      return { nome: p?.nome ?? "", pacienteId: id, fornecedorId: undefined };
    }
    const f = fornecedores.find((x) => x.id === id);
    return { nome: f?.nome ?? "", pacienteId: undefined, fornecedorId: id };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { nome, pacienteId, fornecedorId } = resolveIdentificacao();
    const lancamento: Lancamento = {
      id: crypto.randomUUID(),
      tipo,
      nome: nome.trim(),
      descricao: "",
      categoria: categoria.trim(),
      banco,
      data: dataPagamento || vencimento || new Date().toISOString().slice(0, 10),
      valor: Number(valor.replace(",", ".")) || 0,
      status: dataPagamento ? "Pago" : "Pendente",
      pacienteId,
      fornecedorId,
      vencimento: vencimento || undefined,
      competencia: competencia.trim() || competenciaAtual(),
      notaFiscalId,
      parcelamento,
      comentarios: comentarios.length > 0 ? comentarios : undefined,
    };
    add(lancamento);
    toast.success(tipo === "Receita" ? "Receita adicionada" : "Despesa adicionada");
    resetAndClose();
  }

  function resetAndClose() {
    setIdentificacao("");
    setCategoria("");
    setVencimento("");
    setDataPagamento("");
    setCompetencia("");
    setBanco("C6 Bank");
    setValor("");
    setNotaFiscalId(undefined);
    setParcelamento(undefined);
    setComentarios([]);
    onOpenChange(false);
  }

  function handleParcelamentoClick() {
    const raw = typeof window !== "undefined"
      ? window.prompt("Número de parcelas", parcelamento ? String(parcelamento.total) : "2")
      : null;
    if (!raw) return;
    const total = Math.max(1, Math.floor(Number(raw)) || 0);
    if (total <= 1) {
      setParcelamento(undefined);
      toast.info("Parcelamento removido");
      return;
    }
    setParcelamento({ total, atual: 1 });
    toast.success(`Parcelamento em ${total}x configurado`);
  }

  return (
    <>
      <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            className="fixed left-1/2 top-1/2 z-50 w-[572px] max-h-[92vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-white shadow-[0_24px_70px_rgba(0,0,0,0.15)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
          >
            <div className="relative pb-[35px]">
              {/* Header */}
              <div className="pt-[48px] px-[43px]">
                <DialogPrimitive.Title className="text-base font-medium text-stone-900 font-[var(--font-jakarta)] leading-none">
                  {title}
                </DialogPrimitive.Title>
                <p className="mt-[6px] text-sm font-normal leading-[10px] text-neutral-400 font-[var(--font-jakarta)]">
                  {description}
                </p>
              </div>

              {/* Close X — solar-close-circle-linear */}
              <DialogPrimitive.Close
                className="absolute top-[56px] right-[47px] w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity focus:outline-none"
                aria-label="Fechar"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.5" />
                  <path d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </DialogPrimitive.Close>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="px-[43px] mt-[30px] flex flex-col gap-[10px]">
                  {/* Identificação — full width */}
                  <Select value={identificacao} onValueChange={setIdentificacao}>
                    <SelectPrimitive.Trigger
                      className={`${FIELD_CLASS} justify-between w-full text-left text-sm font-medium font-[var(--font-jakarta)] text-[#1e1e1e] data-[placeholder]:text-neutral-400 data-[placeholder]:font-medium focus:outline-none`}
                      aria-label="Identificação"
                    >
                      <SelectValue placeholder="Identificação (Paciente, Fornecedor)" />
                      <SelectPrimitive.Icon asChild>
                        <ChevronDown size={16} className="text-neutral-400 shrink-0 ml-2" />
                      </SelectPrimitive.Icon>
                    </SelectPrimitive.Trigger>
                    <SelectContent>
                      {identificacaoOptions.length === 0 ? (
                        <div className="px-4 py-2 text-[12px] text-neutral-400 font-[var(--font-jakarta)]">
                          Nenhum paciente ou fornecedor cadastrado
                        </div>
                      ) : (
                        identificacaoOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                            <span className="ml-2 text-[10px] uppercase tracking-wide text-neutral-400">
                              {o.kind === "paciente" ? "Paciente" : "Fornecedor"}
                            </span>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>

                  {/* Categoria | Vencimento */}
                  <div className="grid grid-cols-2 gap-[10px]">
                    <TextField value={categoria} onChange={setCategoria} placeholder="Categoria" />
                    <DateField value={vencimento} onChange={setVencimento} placeholder="Vencimento" />
                  </div>

                  {/* Data de Pagamento | Competência */}
                  <div className="grid grid-cols-2 gap-[10px]">
                    <DateField value={dataPagamento} onChange={setDataPagamento} placeholder="Data de Pagamento" />
                    <TextField value={competencia} onChange={setCompetencia} placeholder="Competência" />
                  </div>

                  {/* Banco | Valor — 320 / 176 grid matching Figma */}
                  <div className="grid grid-cols-[1fr_176px] gap-[10px]">
                    <Select value={banco} onValueChange={(v) => setBanco(v as Banco)}>
                      <SelectPrimitive.Trigger
                        className={`${FIELD_CLASS} justify-between w-full text-left focus:outline-none`}
                        aria-label="Banco"
                      >
                        <div className="flex items-center gap-[10px] min-w-0">
                          <span
                            className="w-5 h-5 rounded-full shrink-0"
                            style={{ background: bancoInfo.bg }}
                          />
                          <span className="text-sm font-medium font-[var(--font-jakarta)] text-[#1e1e1e] truncate">
                            <SelectValue />
                          </span>
                        </div>
                        <SelectPrimitive.Icon asChild>
                          <ChevronDown size={16} className="text-neutral-400 shrink-0 ml-2" />
                        </SelectPrimitive.Icon>
                      </SelectPrimitive.Trigger>
                      <SelectContent>
                        {bancoOptions.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className={FIELD_CLASS}>
                      <span className="text-sm font-medium text-neutral-400 font-[var(--font-jakarta)] shrink-0">
                        R$
                      </span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={valor}
                        onChange={(e) => setValor(e.target.value.replace(/[^0-9,.]/g, ""))}
                        onFocus={(e) => e.currentTarget.select()}
                        placeholder="0,00"
                        className="ml-2 min-w-0 flex-1 bg-transparent text-right text-sm font-medium font-[var(--font-jakarta)] text-[#1e1e1e] outline-none placeholder:text-neutral-400 placeholder:font-medium"
                        aria-label="Valor"
                      />
                    </div>
                  </div>
                </div>

                {/* Action circles — 3 items with w-24 each and gap-[6px] */}
                <div className="mt-[50px] flex justify-center items-start gap-[6px]">
                  <ActionCircle
                    icon={<FileIcon />}
                    activeIcon={<FileIcon active />}
                    label="Adicionar Nota Fiscal"
                    active={!!notaFiscalId}
                    onClick={() => setNotaOpen(true)}
                  />
                  <ActionCircle
                    icon={<ChatIcon />}
                    activeIcon={<ChatIcon active />}
                    label={comentarios.length > 0 ? `${comentarios.length} Observação(ões)` : "Adicionar Observação"}
                    active={comentarios.length > 0}
                    onClick={() => setComentariosOpen(true)}
                  />
                  <ActionCircle
                    icon={<ClockIcon />}
                    activeIcon={<ClockIcon active />}
                    label={parcelamento ? `Parcelado em ${parcelamento.total}x` : "Adicionar Parcelamento"}
                    active={!!parcelamento}
                    onClick={handleParcelamentoClick}
                  />
                </div>

                {/* Submit — 176x64, rounded-[33px], bg gray-600, 12px semibold */}
                <div className="mt-[66px] flex justify-center">
                  <button
                    type="submit"
                    className="h-16 min-w-[176px] px-[14px] py-[12px] rounded-[33px] bg-gray-600 text-white text-xs font-semibold font-[var(--font-jakarta)] hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600/40 focus:ring-offset-2 shadow-[0_6px_18px_rgba(75,85,99,0.25)]"
                  >
                    Adicionar Lançamento
                  </button>
                </div>
              </form>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      <NovaNotaFiscalForm open={notaOpen} onOpenChange={setNotaOpen} />

      <ComentariosModal
        lancamentoId={null}
        open={comentariosOpen}
        onOpenChange={setComentariosOpen}
        comentarios={comentarios}
        onComentariosChange={setComentarios}
      />
    </>
  );
}

function ActionCircle({
  icon,
  activeIcon,
  label,
  onClick,
  active = false,
}: {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-24 flex-col items-center gap-2 focus:outline-none group"
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
          active
            ? "border-gray-600 bg-gray-600 shadow-[0_4px_12px_rgba(75,85,99,0.22)]"
            : "border-gray-200 bg-white group-hover:border-gray-300"
        }`}
      >
        {active ? activeIcon : icon}
      </span>
      <span className="block w-full text-center font-[var(--font-jakarta)] text-[10px] font-semibold leading-3 text-neutral-400">
        {label}
      </span>
    </button>
  );
}

function FileIcon({ active = false }: { active?: boolean }) {
  const stroke = active ? "white" : "#737373";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.667 17.7087H8.33366V18.9587H11.667V17.7087ZM2.29199 11.667V8.3337H1.04199V11.667H2.29199ZM17.7087 11.3029V11.667H18.9587V11.3029H17.7087ZM12.4095 3.84287L15.7087 6.81204L16.5445 5.88204L13.2462 2.91287L12.4095 3.84287ZM18.9587 11.3029C18.9587 9.89537 18.9712 9.0037 18.617 8.20704L17.4745 8.7162C17.6962 9.21454 17.7087 9.78537 17.7087 11.3029H18.9587ZM15.7087 6.81204C16.8362 7.82704 17.2528 8.2187 17.4745 8.7162L18.617 8.20704C18.262 7.40954 17.5912 6.82371 16.5445 5.88204L15.7087 6.81204ZM8.35866 2.29204C9.67699 2.29204 10.1745 2.30204 10.617 2.47204L11.0653 1.30537C10.3553 1.03204 9.58199 1.04204 8.35866 1.04204V2.29204ZM13.2462 2.91371C12.3412 2.09954 11.7753 1.57704 11.0653 1.30537L10.6178 2.47204C11.0612 2.64204 11.4345 2.96537 12.4095 3.84287L13.2462 2.91371ZM8.33366 17.7087C6.74449 17.7087 5.61616 17.707 4.75866 17.592C3.92116 17.4795 3.43783 17.2679 3.08533 16.9154L2.20199 17.7987C2.82533 18.4237 3.61616 18.6995 4.59283 18.8312C5.55116 18.9604 6.78033 18.9587 8.33366 18.9587V17.7087ZM1.04199 11.667C1.04199 13.2204 1.04033 14.4487 1.16949 15.4079C1.30116 16.3845 1.57783 17.1754 2.20116 17.7995L3.08449 16.9162C2.73283 16.5629 2.52116 16.0795 2.40866 15.2412C2.29366 14.3854 2.29199 13.2562 2.29199 11.667H1.04199ZM11.667 18.9587C13.2203 18.9587 14.4487 18.9604 15.4078 18.8312C16.3845 18.6995 17.1753 18.4229 17.7995 17.7995L16.9162 16.9162C16.5628 17.2679 16.0795 17.4795 15.2412 17.592C14.3853 17.707 13.2562 17.7087 11.667 17.7087V18.9587ZM17.7087 11.667C17.7087 13.2562 17.707 14.3854 17.592 15.242C17.4795 16.0795 17.2678 16.5629 16.9153 16.9154L17.7987 17.7987C18.4237 17.1754 18.6995 16.3845 18.8312 15.4079C18.9603 14.4495 18.9587 13.2204 18.9587 11.667H17.7087ZM2.29199 8.3337C2.29199 6.74454 2.29366 5.61621 2.40866 4.75871C2.52116 3.92121 2.73283 3.43787 3.08533 3.08537L2.20199 2.20204C1.57699 2.82537 1.30116 3.61621 1.16949 4.59287C1.04033 5.55121 1.04199 6.78037 1.04199 8.3337H2.29199ZM8.35866 1.04204C6.79616 1.04204 5.56199 1.04037 4.59949 1.16954C3.61866 1.30121 2.82533 1.57787 2.20116 2.20121L3.08449 3.08454C3.43783 2.73287 3.92199 2.52121 4.76533 2.40871C5.62616 2.29371 6.76116 2.29204 8.35866 2.29204V1.04204Z"
        fill={stroke}
      />
      <path
        d="M10.834 2.08398V4.16732C10.834 6.13148 10.834 7.11398 11.444 7.72398C12.054 8.33398 13.0365 8.33398 15.0007 8.33398H18.334"
        stroke={stroke}
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ChatIcon({ active = false }: { active?: boolean }) {
  const fill = active ? "white" : "#8A929A";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.71699 1.04199H11.2837C12.6195 1.04199 13.667 1.04199 14.5037 1.12116C15.3562 1.20283 16.0545 1.37116 16.6703 1.74783C17.3153 2.14302 17.8576 2.68531 18.2528 3.33033C18.6295 3.94533 18.7978 4.64449 18.8795 5.49699C18.9587 6.33366 18.9587 7.38116 18.9587 8.71783V9.60699C18.9587 10.5578 18.9587 11.3037 18.917 11.9062C18.8753 12.5187 18.7895 13.0287 18.5937 13.5003C18.3529 14.0817 17.9999 14.61 17.5549 15.0549C17.11 15.4999 16.5817 15.8529 16.0003 16.0937C15.3295 16.372 14.5662 16.4337 13.5195 16.452C13.2611 16.4511 13.0028 16.4611 12.7453 16.482C12.5803 16.5003 12.5162 16.527 12.4787 16.5487C12.4395 16.572 12.3853 16.6137 12.292 16.742C12.1912 16.8803 12.077 17.072 11.8953 17.3787L11.4437 18.142C10.7995 19.2312 9.20199 19.2312 8.55699 18.142L8.10533 17.3787C7.98185 17.1611 7.84951 16.9487 7.70866 16.742C7.61533 16.6137 7.56116 16.572 7.52199 16.5487C7.48449 16.527 7.42033 16.5003 7.25533 16.482C7.07866 16.4628 6.84699 16.457 6.48033 16.4512C5.43449 16.4337 4.67116 16.372 4.00033 16.0937C3.41895 15.8529 2.89069 15.4999 2.44572 15.0549C2.00076 14.61 1.6478 14.0817 1.40699 13.5003C1.21116 13.0287 1.12533 12.5187 1.08283 11.9062C1.04199 11.3037 1.04199 10.5578 1.04199 9.60616V8.71783C1.04199 7.38116 1.04199 6.33449 1.12116 5.49699C1.20283 4.64449 1.37116 3.94533 1.74783 3.33033C2.14302 2.68531 2.68531 2.14302 3.33033 1.74783C3.94533 1.37116 4.64449 1.20283 5.49699 1.12116C6.33366 1.04199 7.38116 1.04199 8.71783 1.04199M5.61616 2.36616C4.85449 2.43866 4.37033 2.57699 3.98366 2.81366C3.50675 3.10581 3.10581 3.50675 2.81366 3.98366C2.57699 4.37033 2.43866 4.85449 2.36616 5.61699C2.29283 6.38699 2.29199 7.37533 2.29199 8.75116V9.58449C2.29199 10.5637 2.29199 11.267 2.33033 11.822C2.36783 12.3712 2.43949 12.7295 2.56199 13.0228C2.92145 13.8906 3.61089 14.58 4.47866 14.9395C4.90783 15.1178 5.45616 15.1845 6.50283 15.2028H6.52866C6.86033 15.2087 7.15116 15.2137 7.39283 15.2403C7.65199 15.2695 7.90616 15.327 8.15033 15.4687C8.39199 15.6103 8.56699 15.7978 8.71866 16.0062C8.85949 16.1995 9.00366 16.4437 9.16699 16.7195L9.63282 17.5062C9.67177 17.5685 9.72594 17.6199 9.79023 17.6555C9.85452 17.6912 9.92682 17.7099 10.0003 17.7099C10.0738 17.7099 10.1461 17.6912 10.2104 17.6555C10.2747 17.6199 10.3289 17.5685 10.3678 17.5062L10.8337 16.7195C10.997 16.4437 11.142 16.1995 11.282 16.0062C11.4337 15.7978 11.6087 15.6095 11.8503 15.4687C12.0945 15.327 12.3487 15.2687 12.6078 15.2403C12.8495 15.2137 13.1403 15.2087 13.472 15.2028H13.4987C14.5445 15.1845 15.0928 15.1178 15.522 14.9395C16.3898 14.58 17.0792 13.8906 17.4387 13.0228C17.5612 12.7295 17.6328 12.3712 17.6703 11.822C17.7087 11.267 17.7087 10.5637 17.7087 9.58449V8.75116C17.7087 7.37533 17.7087 6.38699 17.6345 5.61616C17.562 4.85449 17.4237 4.37033 17.187 3.98366C16.895 3.50715 16.4943 3.10651 16.0178 2.81449C15.6312 2.57783 15.147 2.43949 14.3845 2.36699C13.6145 2.29366 12.6262 2.29283 11.2503 2.29283H8.75033C7.37449 2.29283 6.38616 2.29283 5.61533 2.36699M6.04199 7.50033C6.04199 7.33457 6.10784 7.17559 6.22505 7.05838C6.34226 6.94117 6.50123 6.87533 6.66699 6.87533H13.3337C13.4994 6.87533 13.6584 6.94117 13.7756 7.05838C13.8928 7.17559 13.9587 7.33457 13.9587 7.50033C13.9587 7.66609 13.8928 7.82506 13.7756 7.94227C13.6584 8.05948 13.4994 8.12533 13.3337 8.12533H6.66699C6.50123 8.12533 6.34226 8.05948 6.22505 7.94227C6.10784 7.82506 6.04199 7.66609 6.04199 7.50033ZM6.04199 10.417C6.04199 10.2512 6.10784 10.0923 6.22505 9.97505C6.34226 9.85784 6.50123 9.79199 6.66699 9.79199H11.2503C11.4161 9.79199 11.5751 9.85784 11.6923 9.97505C11.8095 10.0923 11.8753 10.2512 11.8753 10.417C11.8753 10.5828 11.8095 10.7417 11.6923 10.8589C11.5751 10.9761 11.4161 11.042 11.2503 11.042H6.66699C6.50123 11.042 6.34226 10.9761 6.22505 10.8589C6.10784 10.7417 6.04199 10.5828 6.04199 10.417Z"
        fill={fill}
      />
    </svg>
  );
}

function ClockIcon({ active = false }: { active?: boolean }) {
  const stroke = active ? "white" : "#8A929A";
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.0003 18.3337C14.6027 18.3337 18.3337 14.6027 18.3337 10.0003C18.3337 5.39795 14.6027 1.66699 10.0003 1.66699C5.39795 1.66699 1.66699 5.39795 1.66699 10.0003C1.66699 14.6027 5.39795 18.3337 10.0003 18.3337Z"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path
        d="M10 6.66699V10.0003L12.0833 12.0837"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
