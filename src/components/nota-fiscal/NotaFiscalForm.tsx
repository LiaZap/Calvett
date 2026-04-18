"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, X } from "lucide-react";
import { useFornecedoresStore } from "@/stores/useFornecedoresStore";
import { useNotasFiscaisStore } from "@/stores/useNotasFiscaisStore";
import { useHydrate } from "@/stores/useHydrate";
import { toast } from "@/components/ui/toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { NotaFiscal } from "@/types";

// Accepts "399.99" or "R$ 399,99" and returns the decimal string for <input type="number">.
function parseValorParam(raw: string | null): string | null {
  if (!raw) return null;
  const cleaned = raw
    .replace(/R\$\s?/gi, "")
    .replace(/\./g, "")
    .replace(",", ".")
    .trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? String(n) : null;
}

// Shared visual style for the white form inputs inside the modal card.
const inputShellClass =
  "h-[63px] bg-[#fcfcfa] border border-[#f2f2ee] rounded-[10px] px-[20px] text-[14px] font-medium text-[#535353] placeholder:text-[#959595] outline-none focus:border-[#47535f]";

export default function NotaFiscalForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrated = useHydrate();
  const fornecedores = useFornecedoresStore((s) => s.items);
  const add = useNotasFiscaisStore((s) => s.add);

  // Prefer query-string values so this page can be linked-to from a lançamento row.
  const initialFornecedorNome =
    searchParams.get("fornecedor") ?? "Oxigás Brasil";
  const initialCnpj = searchParams.get("cnpj") ?? "98.765.543/0001-98";
  const initialValor = parseValorParam(searchParams.get("valor")) ?? "1000";
  const initialNumero = searchParams.get("numero") ?? "";

  // Selection state uses the fornecedor id once we can match it against the store.
  const [fornecedorId, setFornecedorId] = useState<string>("");
  const [fornecedorNome, setFornecedorNome] = useState(initialFornecedorNome);
  const [cnpj, setCnpj] = useState(initialCnpj);
  const [dataPagamento, setDataPagamento] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [vencimento, setVencimento] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [numeroDocumento, setNumeroDocumento] = useState(initialNumero);
  const [valor, setValor] = useState(initialValor);

  // Resolve a matching store entry by name on first hydration so the Select
  // displays the correct option without clobbering the user's later picks.
  useEffect(() => {
    if (!hydrated || fornecedorId) return;
    const match = fornecedores.find(
      (f) => f.nome.toLowerCase() === initialFornecedorNome.toLowerCase(),
    );
    if (match) {
      setFornecedorId(match.id);
      setFornecedorNome(match.nome);
      if (match.cnpj) setCnpj(match.cnpj);
    }
  }, [hydrated, fornecedores, fornecedorId, initialFornecedorNome]);

  function handleFornecedorChange(id: string) {
    setFornecedorId(id);
    const f = fornecedores.find((x) => x.id === id);
    if (f) {
      setFornecedorNome(f.nome);
      if (f.cnpj) setCnpj(f.cnpj);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fornecedorNome.trim() || !cnpj.trim() || !numeroDocumento.trim()) {
      return;
    }
    const nota: NotaFiscal = {
      id: crypto.randomUUID(),
      fornecedorNome: fornecedorNome.trim(),
      cnpj: cnpj.trim(),
      dataPagamento,
      vencimento,
      numeroDocumento: numeroDocumento.trim(),
      valor: Number(valor) || 0,
    };
    add(nota);
    toast.success("Nota fiscal adicionada");
    router.push("/");
  }

  return (
    <div className="absolute inset-0 font-[var(--font-zalando-stack)]">
      {/* Top header strip — Hospital logo + chevrons (left) / bell pill (right) */}
      <div
        className="absolute flex items-center gap-[75px]"
        style={{ left: 142, top: 47 }}
      >
        <div className="flex items-center gap-[8px]">
          <div className="relative w-[42px] h-[42px] rounded-full overflow-hidden shrink-0 bg-white/10">
            <Image src="/avatar.png" alt="" fill sizes="42px" className="object-cover" />
          </div>
          <div className="flex flex-col gap-[2px] w-[132px]">
            <p className="text-[14px] leading-[1.1] text-[rgba(255,255,255,0.85)] truncate">
              Hospital da Plástica
            </p>
            <p className="text-[12px] text-[#b8b8b8] truncate">Conta Jurídica</p>
          </div>
        </div>
        <div className="flex flex-col -space-y-[2px]">
          <Image
            src="/icons/solar_alt-arrow-down-linear.svg"
            alt=""
            width={20}
            height={20}
            className="rotate-180 opacity-60"
          />
          <Image
            src="/icons/solar_alt-arrow-down-linear.svg"
            alt=""
            width={20}
            height={20}
            className="opacity-60"
          />
        </div>
      </div>

      {/* Bell + date pill (top-right) */}
      <div
        className="absolute border border-[rgba(244,244,244,0.07)] rounded-[37px] flex items-center gap-[10px] px-[10px]"
        style={{ right: 70, top: 31, width: 151, height: 50 }}
      >
        <div className="bg-[rgba(242,242,242,0.11)] rounded-full w-[37px] h-[37px] flex items-center justify-center shrink-0">
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c2d5e8"
            strokeWidth="1.5"
          >
            <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </div>
        <p className="text-[12px] font-medium text-[rgba(255,255,255,0.63)] whitespace-nowrap">
          Seg, 12 jan
        </p>
      </div>

      {/* Horizontal divider below header */}
      <div
        className="absolute bg-[rgba(255,255,255,0.08)]"
        style={{ left: 0, right: 0, top: 108, height: 1 }}
      />

      {/* Title block */}
      <div
        className="absolute flex flex-col gap-[5px]"
        style={{ left: "50%", transform: "translateX(-50%)", top: 184, width: 665 }}
      >
        <p className="text-[22px] leading-none text-[#c2d5e8]">
          Adicione Nota-Fiscal
        </p>
        <p className="text-[14px] font-medium leading-none text-[rgba(224,237,251,0.58)] font-[var(--font-jakarta)]">
          Use este ambiente para vincular uma nota fiscal ao pagamento
        </p>
      </div>

      {/* White modal card */}
      <form
        onSubmit={handleSubmit}
        className="absolute bg-white rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
        style={{ left: "50%", transform: "translateX(-50%)", top: 278, width: 570, height: 610 }}
      >
        {/* Card title — context-aware (receita vs despesa via ?tipo query) */}
        <div
          className="absolute flex flex-col gap-[7px]"
          style={{ left: 43, top: 50, width: 312 }}
        >
          <p className="text-[16px] font-medium text-[#1e1e1e] font-[var(--font-jakarta)]">
            {searchParams.get("tipo") === "Despesa"
              ? "Nova Despesa"
              : "Nova Receita"}
          </p>
          <p className="text-[14px] leading-[1.4] text-[#9f9f9f] font-[var(--font-jakarta)]">
            {searchParams.get("tipo") === "Despesa"
              ? "Criar novo lançamento de despesa"
              : "Criar novo lançamento de recebimento"}
          </p>
        </div>

        {/* Close button */}
        <Link
          href="/"
          aria-label="Fechar"
          className="absolute rounded-full border border-[#1e1e1e] flex items-center justify-center hover:bg-[#f4f4f4] transition-colors"
          style={{ left: 501, top: 58, width: 24, height: 24 }}
        >
          <X size={14} className="text-[#1e1e1e]" strokeWidth={2} />
        </Link>

        {/* Row 1 — Fornecedor (select) + CNPJ pill */}
        <div
          className="absolute"
          style={{ left: 43, top: 125, width: 490, height: 63 }}
        >
          <Select
            value={fornecedorId || undefined}
            onValueChange={handleFornecedorChange}
          >
            <SelectTrigger
              className="!h-[63px] !w-full !rounded-[10px] !bg-[#fcfcfa] !border-[#f2f2ee] !px-[20px] !text-[14px] !font-medium !text-[#535353]"
              aria-label="Fornecedor"
            >
              <span className="truncate text-[14px] font-medium text-[#535353] font-[var(--font-jakarta)]">
                {fornecedorNome || (
                  <SelectValue placeholder="Selecione um fornecedor" />
                )}
              </span>
              <div className="bg-[rgba(0,0,0,0.04)] rounded-[8px] px-[10px] py-[7px] ml-auto mr-[8px] shrink-0">
                <span className="text-[14px] font-medium text-[#959595] font-[var(--font-jakarta)] whitespace-nowrap">
                  {cnpj || "CNPJ"}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {fornecedores.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.nome}
                  {f.cnpj ? ` — ${f.cnpj}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Row 2 — Data de Pagamento + Vencimento */}
        <div
          className="absolute flex items-end gap-[10px]"
          style={{ left: 43, top: 198 }}
        >
          <label className="flex flex-col gap-[4px]">
            <span className="sr-only">Data de Pagamento</span>
            <input
              type="date"
              value={dataPagamento}
              onChange={(e) => setDataPagamento(e.target.value)}
              aria-label="Data de Pagamento"
              placeholder="Data de Pagamento"
              className={`${inputShellClass} w-[240px] font-[var(--font-jakarta)]`}
              required
            />
          </label>
          <label className="flex flex-col gap-[4px]">
            <span className="sr-only">Vencimento</span>
            <input
              type="date"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
              aria-label="Vencimento"
              placeholder="Vencimento"
              className={`${inputShellClass} w-[240px] font-[var(--font-jakarta)]`}
              required
            />
          </label>
        </div>

        {/* Row 3 — Número Documento + Valor */}
        <div
          className="absolute flex gap-[10px]"
          style={{ left: 43, top: 271 }}
        >
          <input
            value={numeroDocumento}
            onChange={(e) => setNumeroDocumento(e.target.value)}
            placeholder="Número Documento"
            aria-label="Número Documento"
            className={`${inputShellClass} w-[240px] font-[var(--font-jakarta)]`}
            required
          />
          <div
            className={`${inputShellClass} w-[240px] flex items-center justify-between px-[20px] font-[var(--font-jakarta)]`}
          >
            <span className="text-[14px] font-medium text-[#959595]">R$</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              aria-label="Valor"
              className="flex-1 bg-transparent outline-none text-right text-[14px] font-medium text-[#535353] placeholder:text-[#959595]"
              required
            />
          </div>
        </div>

        {/* Upload tile */}
        <div
          className="absolute flex flex-col items-center gap-[8px]"
          style={{ left: 259, top: 390, width: 52 }}
        >
          <button
            type="button"
            aria-label="Adicionar arquivo da nota fiscal"
            className="bg-[rgba(255,255,255,0.1)] border border-[#e8e8e8] rounded-full w-[52px] h-[52px] flex items-center justify-center hover:bg-[rgba(71,83,95,0.08)] transition-colors"
          >
            <FileText size={20} className="text-[#8a929a]" strokeWidth={1.5} />
          </button>
          <p className="text-[10px] font-semibold text-[#8a929a] text-center leading-[1.2] w-[77px]">
            Adicionar Nota Fiscal
          </p>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="absolute bg-[#47535f] text-white text-[12px] font-semibold rounded-[33px] font-[var(--font-jakarta)] hover:bg-[#3c4751] transition-colors"
          style={{
            left: 570 / 2 - 169 / 2,
            top: 510,
            width: 169,
            height: 61,
          }}
        >
          Adicionar Nota Fiscal
        </button>
      </form>
    </div>
  );
}
