"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FloatingField,
  FloatingSelect,
  PremiumModalHeader,
  PremiumSubmitButton,
} from "@/components/ui/floating-field";
import { toast } from "@/components/ui/toast";
import { useFornecedoresStore } from "@/stores/useFornecedoresStore";
import type { Fornecedor, FornecedorCategoria } from "@/types";

export interface NovoFornecedorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoriaOptions: { value: FornecedorCategoria; label: string }[] = [
  { value: "Medicações", label: "Medicações" },
  { value: "Materiais", label: "Materiais" },
  { value: "Campos e Aventais", label: "Campos e Aventais" },
  { value: "Fios", label: "Fios" },
  { value: "Curativos", label: "Curativos" },
  { value: "Assepsia", label: "Assepsia" },
  { value: "Soluções", label: "Soluções" },
  { value: "CME", label: "CME" },
  { value: "Gases Medicinais", label: "Gases Medicinais" },
];

export default function NovoFornecedorForm({
  open,
  onOpenChange,
}: NovoFornecedorFormProps) {
  const add = useFornecedoresStore((s) => s.add);

  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [categoria, setCategoria] =
    useState<FornecedorCategoria>("Medicações");
  const [contato, setContato] = useState("");

  function reset() {
    setNome("");
    setCnpj("");
    setCategoria("Medicações");
    setContato("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      toast.error("Informe o nome do fornecedor");
      return;
    }
    const f: Fornecedor = {
      id: crypto.randomUUID(),
      nome: nome.trim(),
      cnpj: cnpj.trim() || undefined,
      categoria,
      contato: contato.trim() || undefined,
      dataCadastro: new Date().toISOString().slice(0, 10),
    };
    add(f);
    toast.success("Fornecedor adicionado");
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
          <DialogTitle>Adicionar Fornecedor</DialogTitle>
          <DialogDescription>Cadastre um novo fornecedor</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="relative rounded-[20px] bg-white px-[43px] pt-[48px] pb-[44px] shadow-[0_24px_70px_rgba(0,0,0,0.15)] border border-[#f0f0f0] min-h-[500px] flex flex-col"
        >
          <PremiumModalHeader
            title="Adicionar Fornecedor"
            subtitle="Cadastre um novo fornecedor no sistema"
            icon={<Building2 size={24} strokeWidth={1.8} />}
            onClose={() => onOpenChange(false)}
          />

          <div className="flex flex-col gap-[12px]">
            <FloatingField
              label="Nome do Fornecedor"
              value={nome}
              onChange={setNome}
              required
              autoFocus
            />
            <div className="grid grid-cols-2 gap-[12px]">
              <FloatingField
                label="CNPJ"
                value={cnpj}
                onChange={setCnpj}
                placeholder="00.000.000/0000-00"
              />
              <FloatingSelect
                label="Categoria"
                value={categoria}
                onChange={(v) => setCategoria(v as FornecedorCategoria)}
                options={categoriaOptions}
                required
              />
            </div>
            <FloatingField
              label="Contato"
              value={contato}
              onChange={setContato}
              placeholder="Telefone ou e-mail"
            />
          </div>

          <PremiumSubmitButton>Adicionar Fornecedor</PremiumSubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
