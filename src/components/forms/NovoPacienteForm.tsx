"use client";

import { useState } from "react";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FloatingField,
  PremiumModalHeader,
  PremiumSubmitButton,
} from "@/components/ui/floating-field";
import { toast } from "@/components/ui/toast";
import { usePacientesStore } from "@/stores/usePacientesStore";
import type { Paciente } from "@/types";

export interface NovoPacienteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NovoPacienteForm({
  open,
  onOpenChange,
}: NovoPacienteFormProps) {
  const add = usePacientesStore((s) => s.add);

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  function reset() {
    setNome("");
    setCpf("");
    setTelefone("");
    setEmail("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("Informe o nome do paciente");
      return;
    }
    const p: Paciente = {
      id: crypto.randomUUID(),
      nome: nome.trim(),
      cpf: cpf.trim(),
      telefone: telefone.trim() || undefined,
      email: email.trim() || undefined,
      dataCadastro: new Date().toISOString().slice(0, 10),
    };
    add(p);
    toast.success("Paciente adicionado");
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[572px] border-0 p-0 bg-transparent shadow-none"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Adicionar Paciente</DialogTitle>
          <DialogDescription>
            Cadastre um novo paciente no sistema
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="relative rounded-[20px] bg-white px-[43px] pt-[48px] pb-[44px] shadow-[0_24px_70px_rgba(0,0,0,0.15)] border border-[#f0f0f0] min-h-[500px] flex flex-col"
        >
          <PremiumModalHeader
            title="Adicionar Paciente"
            subtitle="Cadastre um novo paciente no sistema"
            icon={<User size={24} strokeWidth={1.8} />}
            onClose={() => onOpenChange(false)}
          />

          <div className="flex flex-col gap-[12px]">
            <FloatingField
              label="Nome completo"
              value={nome}
              onChange={setNome}
              required
              autoFocus
            />
            <FloatingField
              label="CPF"
              value={cpf}
              onChange={setCpf}
              placeholder="000.000.000-00"
            />
            <div className="grid grid-cols-2 gap-[12px]">
              <FloatingField
                label="Telefone"
                value={telefone}
                onChange={setTelefone}
                placeholder="(11) 90000-0000"
              />
              <FloatingField
                label="E-mail"
                value={email}
                onChange={setEmail}
                type="email"
                placeholder="email@exemplo.com"
              />
            </div>
          </div>

          <PremiumSubmitButton>Adicionar Paciente</PremiumSubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
