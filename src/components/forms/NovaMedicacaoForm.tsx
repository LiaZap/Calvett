"use client";

import { useId, useState } from "react";
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
import { useMedicacoesStore } from "@/stores/useMedicacoesStore";
import type { Medicacao, MedicacaoForma, MedicacaoStatus } from "@/types";

export interface NovaMedicacaoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
}

const formaOptions: { value: MedicacaoForma; label: string }[] = [
  { value: "Ampola", label: "Ampola" },
  { value: "Comprimido", label: "Comprimido" },
  { value: "Cápsula", label: "Cápsula" },
  { value: "Frasco", label: "Frasco" },
  { value: "Pomada", label: "Pomada" },
  { value: "Solução", label: "Solução" },
  { value: "Pó", label: "Pó" },
];

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
  type = "text",
  inputMode,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div className={FIELD_CLASS}>
      <input
        type={type}
        inputMode={inputMode}
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

export default function NovaMedicacaoForm({
  open,
  onOpenChange,
  title = "Nova Medicação",
}: NovaMedicacaoFormProps) {
  const add = useMedicacoesStore((s) => s.add);

  const [nome, setNome] = useState("");
  const [principio, setPrincipio] = useState("");
  const [dosagem, setDosagem] = useState("");
  const [forma, setForma] = useState<MedicacaoForma>("Ampola");
  const [lote, setLote] = useState("");
  const [validade, setValidade] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [estoqueMinimo, setEstoqueMinimo] = useState("");
  const [fornecedorPrincipal, setFornecedorPrincipal] = useState("");
  const [observacoes, setObservacoes] = useState("");

  function reset() {
    setNome("");
    setPrincipio("");
    setDosagem("");
    setForma("Ampola");
    setLote("");
    setValidade("");
    setQuantidade("");
    setEstoqueMinimo("");
    setFornecedorPrincipal("");
    setObservacoes("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !dosagem.trim() || !lote.trim() || !validade || !quantidade) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    const qty = Number(quantidade);
    const min = Number(estoqueMinimo) || 0;
    let status: MedicacaoStatus = "Disponível";
    if (qty === 0) status = "Esgotado";
    else if (qty < min) status = "Baixa";

    const m: Medicacao = {
      id: crypto.randomUUID(),
      nome: nome.trim(),
      dosagem: dosagem.trim(),
      status,
      principio: principio.trim() || undefined,
      forma,
      lote: lote.trim(),
      validade,
      quantidade: qty,
      estoqueMinimo: min,
      fornecedorPrincipal: fornecedorPrincipal.trim() || undefined,
      observacoes: observacoes.trim() || undefined,
      categoria: "Medicações",
      fornecedores: [],
      compras: [],
    };
    add(m);
    toast.success("Medicação adicionada");
    reset();
    onOpenChange(false);
  }

  return (
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
                Cadastre uma nova medicação no estoque
              </p>
            </div>

            {/* Close X */}
            <DialogPrimitive.Close
              className="absolute top-[56px] right-[47px] w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity focus:outline-none"
              aria-label="Fechar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.5" />
                <path d="M14.5 9.5L9.5 14.5M9.5 9.5L14.5 14.5" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </DialogPrimitive.Close>

            <form onSubmit={handleSubmit}>
              <div className="px-[43px] mt-[30px] flex flex-col gap-[10px]">
                {/* Nome (full width) */}
                <TextField
                  value={nome}
                  onChange={setNome}
                  placeholder="Nome da medicação *"
                />

                {/* Princípio ativo (full width) */}
                <TextField
                  value={principio}
                  onChange={setPrincipio}
                  placeholder="Princípio ativo"
                />

                {/* Dosagem | Forma */}
                <div className="grid grid-cols-2 gap-[10px]">
                  <TextField
                    value={dosagem}
                    onChange={setDosagem}
                    placeholder="Dosagem (ex.: 500mg) *"
                  />
                  <Select value={forma} onValueChange={(v) => setForma(v as MedicacaoForma)}>
                    <SelectPrimitive.Trigger
                      className={`${FIELD_CLASS} justify-between w-full text-left text-sm font-medium font-[var(--font-jakarta)] text-[#1e1e1e] focus:outline-none`}
                      aria-label="Forma farmacêutica"
                    >
                      <SelectValue placeholder="Forma" />
                      <SelectPrimitive.Icon asChild>
                        <ChevronDown size={16} className="text-neutral-400 shrink-0 ml-2" />
                      </SelectPrimitive.Icon>
                    </SelectPrimitive.Trigger>
                    <SelectContent>
                      {formaOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Lote | Validade */}
                <div className="grid grid-cols-2 gap-[10px]">
                  <TextField
                    value={lote}
                    onChange={setLote}
                    placeholder="Lote * (ex.: LT-1234)"
                  />
                  <DateField
                    value={validade}
                    onChange={setValidade}
                    placeholder="Data de Validade *"
                  />
                </div>

                {/* Quantidade | Estoque mínimo */}
                <div className="grid grid-cols-2 gap-[10px]">
                  <TextField
                    value={quantidade}
                    onChange={(v) => setQuantidade(v.replace(/[^0-9]/g, ""))}
                    placeholder="Quantidade inicial *"
                    type="text"
                    inputMode="numeric"
                  />
                  <TextField
                    value={estoqueMinimo}
                    onChange={(v) => setEstoqueMinimo(v.replace(/[^0-9]/g, ""))}
                    placeholder="Estoque mínimo"
                    type="text"
                    inputMode="numeric"
                  />
                </div>

                {/* Fornecedor principal */}
                <TextField
                  value={fornecedorPrincipal}
                  onChange={setFornecedorPrincipal}
                  placeholder="Fornecedor principal"
                />

                {/* Observações */}
                <div className={`${FIELD_CLASS} h-[86px] !items-start pt-[18px]`}>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Observações"
                    rows={2}
                    className="w-full bg-transparent outline-none text-sm font-medium font-[var(--font-jakarta)] text-[#1e1e1e] placeholder:text-neutral-400 placeholder:font-medium resize-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="mt-[32px] flex justify-center">
                <button
                  type="submit"
                  className="h-16 min-w-[200px] px-[14px] py-[12px] rounded-[33px] bg-gray-600 text-white text-xs font-semibold font-[var(--font-jakarta)] hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600/40 focus:ring-offset-2 shadow-[0_6px_18px_rgba(75,85,99,0.25)]"
                >
                  Adicionar Medicação
                </button>
              </div>
            </form>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
