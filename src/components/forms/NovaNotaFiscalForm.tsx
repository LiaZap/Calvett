"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
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
  PremiumModalHeader,
  PremiumSubmitButton,
} from "@/components/ui/floating-field";
import { toast } from "@/components/ui/toast";
import { useNotasFiscaisStore } from "@/stores/useNotasFiscaisStore";
import type { NotaFiscal } from "@/types";

export interface NovaNotaFiscalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NovaNotaFiscalForm({
  open,
  onOpenChange,
}: NovaNotaFiscalFormProps) {
  const add = useNotasFiscaisStore((s) => s.add);

  const [fornecedorNome, setFornecedorNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [dataPagamento, setDataPagamento] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [vencimento, setVencimento] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [numeroDocumento, setNumeroDocumento] = useState("");
  const [valor, setValor] = useState("");

  function reset() {
    setFornecedorNome("");
    setCnpj("");
    setNumeroDocumento("");
    setValor("");
    const today = new Date().toISOString().slice(0, 10);
    setDataPagamento(today);
    setVencimento(today);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fornecedorNome.trim() || !cnpj.trim() || !numeroDocumento.trim()) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }
    const n: NotaFiscal = {
      id: crypto.randomUUID(),
      fornecedorNome: fornecedorNome.trim(),
      cnpj: cnpj.trim(),
      dataPagamento,
      vencimento,
      numeroDocumento: numeroDocumento.trim(),
      valor: Number(valor) || 0,
    };
    add(n);
    toast.success("Nota fiscal adicionada");
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
          <DialogTitle>Adicionar Nota Fiscal</DialogTitle>
          <DialogDescription>
            Vincule uma nota fiscal ao pagamento
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="relative rounded-[20px] bg-white px-[43px] py-[44px] shadow-[0_24px_70px_rgba(0,0,0,0.15)] border border-[#f0f0f0]"
        >
          <PremiumModalHeader
            title="Adicionar Nota Fiscal"
            subtitle="Vincule uma nota fiscal ao pagamento"
            icon={<FileText size={24} strokeWidth={1.8} />}
            onClose={() => onOpenChange(false)}
          />

          <div className="flex flex-col gap-[12px]">
            <div className="grid grid-cols-2 gap-[12px]">
              <FloatingField
                label="Fornecedor"
                value={fornecedorNome}
                onChange={setFornecedorNome}
                placeholder="Ex.: Oxigás Brasil"
                required
                autoFocus
              />
              <FloatingField
                label="CNPJ"
                value={cnpj}
                onChange={setCnpj}
                placeholder="00.000.000/0000-00"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-[12px]">
              <FloatingDate
                label="Data de Pagamento"
                value={dataPagamento}
                onChange={setDataPagamento}
                required
              />
              <FloatingDate
                label="Vencimento"
                value={vencimento}
                onChange={setVencimento}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-[12px]">
              <FloatingField
                label="Número do Documento"
                value={numeroDocumento}
                onChange={setNumeroDocumento}
                placeholder="Ex.: 123456"
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
          </div>

          <PremiumSubmitButton>Adicionar Nota Fiscal</PremiumSubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
