"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FileText, MessageSquare, MoreHorizontal, X } from "lucide-react";
import { useMedicacoesStore } from "@/stores/useMedicacoesStore";
import { useFornecedoresStore } from "@/stores/useFornecedoresStore";
import { useHydrate } from "@/stores/useHydrate";
import { formatBRL } from "@/stores/format";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * RIGHT slide-in panel — "Detalhes / Informações sobre compras".
 * Opens when a medication is selected; slides in from the right with a
 * smooth transform animation. Children positions are local to the panel.
 */

const PANEL_WIDTH = 608;
const PAD_L = 20; // distance from panel's left edge
const PAD_R = 40; // distance from panel's right edge

const detailsTabs = ["Compras", "Vendas", "Devoluções"] as const;
type DetailsTab = (typeof detailsTabs)[number];

type Props = {
  selectedId: string | null;
  open: boolean;
  onClose: () => void;
};

export default function MedicacoesDetalhes({ selectedId, open, onClose }: Props) {
  const hydrated = useHydrate();
  const router = useRouter();
  const medicacoes = useMedicacoesStore((s) => s.items);
  const fornecedoresList = useFornecedoresStore((s) => s.items);
  const [detailsTab, setDetailsTab] = useState<DetailsTab>("Compras");

  const selectedMed = useMemo(
    () => medicacoes.find((m) => m.id === selectedId) ?? null,
    [medicacoes, selectedId],
  );

  const compras = useMemo(() => {
    if (!selectedMed) return [];
    const fornMap = new Map(fornecedoresList.map((f) => [f.id, f]));
    return selectedMed.compras.map((c) => ({
      id: c.id,
      fornecedor: fornMap.get(c.fornecedorId)?.nome ?? "",
      unidades: `${c.unidades} Unidades`,
      marca: c.marca,
      validade: c.validade,
      preco: formatBRL(c.preco),
      data: c.data,
    }));
  }, [selectedMed, fornecedoresList]);

  return (
    <aside
      aria-hidden={!open}
      className="absolute top-0 h-[1080px] bg-white border-l border-[#ececec] shadow-[-4px_0_20px_rgba(0,0,0,0.04)]"
      style={{
        right: 0,
        width: PANEL_WIDTH,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 320ms cubic-bezier(0.32, 0.72, 0, 1)",
        pointerEvents: open ? "auto" : "none",
      }}
    >
      {/* Top label + close button */}
      <div
        className="absolute flex items-start justify-between font-[var(--font-zalando-stack)]"
        style={{ left: PAD_L, right: PAD_R, top: 46 }}
      >
        <div>
          <p className="text-[12px] font-medium text-[#1e1e1e]">Detalhes</p>
          <p className="text-[12px] text-[#47535f] leading-[20px]">
            Informações sobre compras
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar detalhes"
          className="border border-[#e9e9e9] rounded-full w-[32px] h-[32px] flex items-center justify-center hover:bg-[#fafafa] transition-colors shrink-0"
        >
          <X size={16} className="text-[#47535f]" />
        </button>
      </div>

      {/* Medicamento label + title + "Em Estoque" badge */}
      <div
        className="absolute font-[var(--font-zalando-stack)]"
        style={{ left: PAD_L, right: PAD_R, top: 140 }}
      >
        <p className="text-[12px] font-semibold text-[#5f5c54] mb-[4px]">Medicamento</p>
        <div className="flex items-center justify-between gap-3 mt-[4px] min-w-0">
          <p className="text-[34px] font-light text-[#47535f] leading-[1.1] tracking-tight truncate min-w-0 flex-1">
            {hydrated ? selectedMed?.nome ?? "" : ""}
          </p>
          <div className="bg-[#fafbf6] rounded-[24px] px-[14px] py-[8px] h-[38px] flex items-center justify-center shrink-0">
            <span className="text-[13px] font-medium font-[var(--font-dm)] text-[#a5c16e] whitespace-nowrap">
              Em Estoque
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="absolute" style={{ left: PAD_L, right: PAD_R, top: 262 }}>
        <Tabs value={detailsTab} onValueChange={(v) => setDetailsTab(v as DetailsTab)}>
          <TabsList className="flex gap-[6px] flex-wrap">
            {detailsTabs.map((t) => (
              <TabsTrigger key={t} value={t} className="px-[16px] py-[10px]">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Divider */}
      <div
        className="absolute"
        style={{ left: PAD_L, right: PAD_R, top: 344, height: 1, background: "#ececec" }}
      />

      {/* Section title */}
      <div
        className="absolute font-[var(--font-zalando-stack)]"
        style={{ left: PAD_L, right: PAD_R, top: 374 }}
      >
        <p className="text-[22px] font-light text-[#9d998a] leading-[1.2]">
          {detailsTab}
        </p>
        <p className="text-[11px] font-medium text-[#b0aea4] mt-[4px]">
          {detailsTab === "Compras"
            ? "Detalhamento de todas as compras"
            : detailsTab === "Vendas"
              ? "Detalhamento de todas as vendas"
              : "Detalhamento de todas as devoluções"}
        </p>
      </div>

      {/* Content list */}
      <div
        className="absolute overflow-y-auto flex flex-col gap-[2px]"
        style={{
          left: PAD_L - 6,
          right: PAD_R,
          top: 454,
          height: 1080 - 454 - 40,
        }}
      >
        {!hydrated ? null : !selectedMed ? null : detailsTab !== "Compras" ? (
          <div className="text-[12px] text-[#9f9f9f] italic py-10 text-center">
            Em breve
          </div>
        ) : compras.length === 0 ? (
          <div className="text-[12px] text-[#9f9f9f] italic py-10 text-center">
            Sem compras registradas
          </div>
        ) : (
          compras.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-[8px] p-[10px] rounded-[15px] hover:bg-[#fafafa] transition-colors"
            >
              <div className="bg-[#ebeef1] rounded-[10px] h-[34px] w-[28px] flex items-center justify-center shrink-0">
                <Image
                  src="/icons/solar_box-bold.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="opacity-80"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium font-[var(--font-jakarta)] text-[#646464] truncate leading-tight">
                  {c.fornecedor}
                </p>
                <p className="text-[10px] font-[var(--font-jakarta)] text-[#b0b0b0] truncate leading-tight">
                  {c.unidades}
                </p>
              </div>
              <div className="bg-[rgba(215,221,227,0.5)] rounded-[6px] px-[8px] h-[25px] flex items-center justify-center shrink-0 min-w-[36px]">
                <span className="text-[10px] font-medium font-[var(--font-jakarta)] text-[#787878] whitespace-nowrap">
                  {c.marca}
                </span>
              </div>
              <div className="bg-[rgba(215,221,227,0.5)] rounded-[6px] px-[8px] h-[25px] flex items-center justify-center shrink-0">
                <span className="text-[10px] font-medium font-[var(--font-jakarta)] text-[#787878] whitespace-nowrap">
                  {c.validade}
                </span>
              </div>
              <div className="text-right shrink-0 whitespace-nowrap w-[74px]">
                <p className="text-[12px] font-semibold font-[var(--font-jakarta)] text-[#646464] leading-tight">
                  {c.preco}
                </p>
                <p className="text-[10px] font-medium font-[var(--font-jakarta)] text-[#b0b0b0] leading-tight">
                  {c.data}
                </p>
              </div>
              <div className="flex gap-[6px] shrink-0">
                <button
                  type="button"
                  aria-label="Solicitar nota fiscal"
                  onClick={(e) => {
                    e.stopPropagation();
                    const params = new URLSearchParams();
                    if (c.fornecedor) params.set("fornecedor", c.fornecedor);
                    const parsed = Number(
                      c.preco.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", "."),
                    );
                    if (Number.isFinite(parsed)) params.set("valor", String(parsed));
                    params.set("numero", c.id);
                    router.push(`/nota-fiscal?${params.toString()}`);
                  }}
                  className="border border-[#e9e9e9] rounded-[10px] w-[30px] h-[30px] flex items-center justify-center hover:bg-[#fafafa] transition-colors"
                >
                  <FileText size={14} className="text-[#9f9f9f]" />
                </button>
                <button
                  type="button"
                  aria-label="Mensagem"
                  className="relative border border-[#e9e9e9] rounded-[10px] w-[30px] h-[30px] flex items-center justify-center hover:bg-[#fafafa] transition-colors"
                >
                  <MessageSquare size={14} className="text-[#9f9f9f]" />
                  <span className="absolute top-[4px] right-[4px] w-[5px] h-[5px] rounded-full bg-[#ff9898]" />
                </button>
                <button
                  type="button"
                  aria-label="Mais ações"
                  className="border border-[#e9e9e9] rounded-[10px] w-[30px] h-[30px] flex items-center justify-center hover:bg-[#fafafa] transition-colors"
                >
                  <MoreHorizontal size={14} className="text-[#9f9f9f] rotate-90" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
