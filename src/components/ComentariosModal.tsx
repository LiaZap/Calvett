"use client";

import { useMemo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog } from "@/components/ui/dialog";
import { useLancamentosStore } from "@/stores/useLancamentosStore";
import type { Comentario } from "@/types";

export interface ComentariosModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When present, attaches the new comment to an existing lancamento's `comentarios` array. */
  lancamentoId?: string | null;
  /** Optional initial list of comments (for previewing from a not-yet-created lancamento). */
  comentarios?: Comentario[];
  /** Called when a new comment is added — receive the updated array. Used by NovoLancamentoForm to buffer comments before saving. */
  onComentariosChange?: (comentarios: Comentario[]) => void;
}

function formatData(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    const meses = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    const dia = d.getDate().toString().padStart(2, "0");
    const mes = meses[d.getMonth()];
    const hora = d.getHours().toString().padStart(2, "0");
    const min = d.getMinutes().toString().padStart(2, "0");
    return `${dia} de ${mes}  ${hora}:${min}`;
  } catch {
    return iso;
  }
}

function Avatar({ nome, src }: { nome: string; src?: string }) {
  const initials = useMemo(() => {
    const parts = nome.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase();
  }, [nome]);

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={nome}
        src={src}
        width={20}
        height={20}
        className="size-[20px] rounded-full object-cover shrink-0"
      />
    );
  }
  return (
    <div className="size-[20px] rounded-full bg-[#d9d9d9] text-[#5c5c5c] text-[8px] font-semibold font-[var(--font-jakarta)] flex items-center justify-center shrink-0">
      {initials}
    </div>
  );
}

export default function ComentariosModal({
  open,
  onOpenChange,
  lancamentoId,
  comentarios,
  onComentariosChange,
}: ComentariosModalProps) {
  const lancamento = useLancamentosStore((s) =>
    lancamentoId ? s.getById(lancamentoId) : undefined,
  );
  const updateLancamento = useLancamentosStore((s) => s.update);

  // Source of truth: store (if lancamentoId) otherwise the `comentarios` prop
  const sourceComentarios: Comentario[] =
    (lancamentoId ? lancamento?.comentarios : comentarios) ?? [];

  const [texto, setTexto] = useState("");

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const value = texto.trim();
    if (!value) return;
    const novo: Comentario = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `c_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      autorNome: "Dr. Ricardo Calvett",
      texto: value,
      data: new Date().toISOString(),
    };
    const novaLista = [...sourceComentarios, novo];

    if (lancamentoId) {
      updateLancamento(lancamentoId, { comentarios: novaLista });
    }
    onComentariosChange?.(novaLista);
    setTexto("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "w-[343px] bg-white border border-[#eaeaea] rounded-[13px]",
            "shadow-[0px_0px_27.2px_0px_rgba(0,0,0,0.1)]",
            "flex flex-col p-0 overflow-hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200",
          )}
        >
          {/* Header */}
          <div className="relative px-[24px] pt-[31px] pb-[14px]">
            <div className="flex flex-col gap-[4px] pr-[40px]">
              <DialogPrimitive.Title className="font-[var(--font-jakarta)] font-medium text-[14px] leading-normal text-[#1e1e1e]">
                Comentários
              </DialogPrimitive.Title>
              <p className="font-[var(--font-jakarta)] font-normal text-[10px] leading-[10px] text-[#9f9f9f]">
                Veja os comentários neste lançamento
              </p>
            </div>

            {/* Count badge */}
            <div className="absolute top-[31px] right-[24px] size-[30px] rounded-[12px] bg-[#f1f1f1] flex items-center justify-center">
              <span className="font-[var(--font-jakarta)] font-semibold text-[10px] text-[#727272] leading-none">
                {sourceComentarios.length}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#eaeaea]" />

          {/* Comments list */}
          <div className="flex flex-col gap-[10px] px-[15.25px] pt-[19px] pb-[20px] min-h-[232px] max-h-[320px] overflow-y-auto">
            {sourceComentarios.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-[12px] text-[#aaa] font-[var(--font-jakarta)] py-[40px]">
                Nenhum comentário ainda
              </div>
            ) : (
              sourceComentarios.map((c) => (
                <div
                  key={c.id}
                  className="bg-[#fafafa] rounded-[10px] p-[20px] flex flex-col gap-[11px]"
                >
                  <p className="font-[var(--font-jakarta)] font-normal text-[12px] leading-[18px] text-[#707070] whitespace-pre-wrap break-words">
                    {c.texto}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[7px]">
                      <Avatar nome={c.autorNome} src={c.autorAvatar} />
                      <span className="font-[var(--font-jakarta)] font-medium text-[10px] text-[#797979] whitespace-nowrap">
                        {c.autorNome}
                      </span>
                    </div>
                    <span className="font-[var(--font-jakarta)] font-normal text-[10px] text-[#aaa] whitespace-pre">
                      {formatData(c.data)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="relative px-[24px] pb-[24px] pt-[6px]"
          >
            <div className="relative">
              <input
                type="text"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Novo Comentário"
                aria-label="Novo comentário"
                className={cn(
                  "w-full h-[58px] bg-[#fcfcfa] border border-[#f2f2ee] rounded-[10px]",
                  "pl-[20px] pr-[56px]",
                  "font-[var(--font-jakarta)] font-medium text-[12px] text-[#535353]",
                  "placeholder:text-[#959595]",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47535f]/30 focus-visible:border-[#47535f]/50",
                )}
              />
              <button
                type="submit"
                aria-label="Enviar comentário"
                disabled={!texto.trim()}
                className={cn(
                  "absolute right-[12px] top-1/2 -translate-y-1/2",
                  "size-[30.737px] rounded-[10px] bg-[#47535f] text-white",
                  "flex items-center justify-center",
                  "transition-colors hover:bg-[#3c4751]",
                  "disabled:opacity-40 disabled:pointer-events-none",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#47535f]/50 focus-visible:ring-offset-2",
                )}
              >
                <ArrowRight size={17} strokeWidth={2} />
              </button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
