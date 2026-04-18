"use client";

import { useState } from "react";
import { Stethoscope } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FloatingField,
  FloatingDate,
  FloatingSelect,
  PremiumModalHeader,
  PremiumSubmitButton,
} from "@/components/ui/floating-field";
import { toast } from "@/components/ui/toast";
import { useCirurgiasStore } from "@/stores/useCirurgiasStore";
import { usePacientesStore } from "@/stores/usePacientesStore";
import type { Cirurgia, CirurgiaStatus } from "@/types";

export interface NovaCirurgiaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusOptions: { value: CirurgiaStatus; label: string }[] = [
  { value: "Agendada", label: "Agendada" },
  { value: "Realizada", label: "Realizada" },
  { value: "Finalizada", label: "Finalizada" },
  { value: "Cancelada", label: "Cancelada" },
];

export default function NovaCirurgiaForm({
  open,
  onOpenChange,
}: NovaCirurgiaFormProps) {
  const add = useCirurgiasStore((s) => s.add);
  const pacientes = usePacientesStore((s) => s.items);

  const [pacienteId, setPacienteId] = useState(pacientes[0]?.id ?? "");
  const [cirurgiao, setCirurgiao] = useState("");
  const [procedimentos, setProcedimentos] = useState("");
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState<CirurgiaStatus>("Agendada");

  const hasPacientes = pacientes.length > 0;

  function reset() {
    setPacienteId(pacientes[0]?.id ?? "");
    setCirurgiao("");
    setProcedimentos("");
    setValor("");
    setStatus("Agendada");
    setData(new Date().toISOString().slice(0, 10));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pacienteId) {
      toast.error("Selecione um paciente");
      return;
    }
    if (!cirurgiao.trim() || !procedimentos.trim()) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    const c: Cirurgia = {
      id: crypto.randomUUID(),
      pacienteId,
      cirurgiao: cirurgiao.trim(),
      procedimentos: procedimentos
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      data,
      valor: Number(valor) || 0,
      status,
      agendamentos: [],
    };
    add(c);
    toast.success("Orçamento adicionado");
    reset();
    onOpenChange(false);
  }

  const pacienteOptions = hasPacientes
    ? pacientes.map((p) => ({ value: p.id, label: p.nome }))
    : [{ value: "", label: "Nenhum paciente cadastrado" }];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[572px] border-0 p-0 bg-transparent shadow-none"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Adicionar Orçamento</DialogTitle>
          <DialogDescription>Criar um novo orçamento de cirurgia</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="relative rounded-[20px] bg-white px-[43px] py-[44px] shadow-[0_24px_70px_rgba(0,0,0,0.15)] border border-[#f0f0f0]"
        >
          <PremiumModalHeader
            title="Adicionar Orçamento"
            subtitle="Criar um novo orçamento de cirurgia"
            icon={<Stethoscope size={24} strokeWidth={1.8} />}
            onClose={() => onOpenChange(false)}
          />

          <div className="flex flex-col gap-[12px]">
            <FloatingSelect
              label="Paciente"
              value={pacienteId}
              onChange={setPacienteId}
              options={pacienteOptions}
              required
              disabled={!hasPacientes}
            />
            <FloatingField
              label="Cirurgião"
              value={cirurgiao}
              onChange={setCirurgiao}
              placeholder="Nome do cirurgião"
              required
            />
            <FloatingField
              label="Procedimentos (separe por vírgula)"
              value={procedimentos}
              onChange={setProcedimentos}
              placeholder="Rinoplastia, Lipo HD"
              required
            />
            <div className="grid grid-cols-2 gap-[12px]">
              <FloatingDate
                label="Data"
                value={data}
                onChange={setData}
                required
              />
              <FloatingField
                label="Valor"
                value={valor}
                onChange={setValor}
                type="number"
                placeholder="0,00"
                rightAdornment={<span>R$</span>}
              />
            </div>
            <FloatingSelect
              label="Status"
              value={status}
              onChange={(v) => setStatus(v as CirurgiaStatus)}
              options={statusOptions}
            />
          </div>

          <PremiumSubmitButton disabled={!hasPacientes}>
            Adicionar Orçamento
          </PremiumSubmitButton>
          {!hasPacientes && (
            <p className="mt-[14px] text-[12px] text-[#c1846e] font-medium text-center font-[var(--font-jakarta)]">
              Cadastre um paciente antes de criar um orçamento
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
