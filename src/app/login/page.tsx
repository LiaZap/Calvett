"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { getInitials } from "@/data/users";
import { toast } from "@/components/ui/toast";

export default function LoginPage() {
  const router = useRouter();
  const users = useAuthStore((s) => s.users);
  const login = useAuthStore((s) => s.login);
  const loginAs = useAuthStore((s) => s.loginAs);
  const currentUserId = useAuthStore((s) => s.currentUserId);
  const hydrated = useAuthStore((s) => s.hydrated);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && currentUserId) {
      router.replace("/");
    }
  }, [hydrated, currentUserId, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = login(email, senha);
    if (result.ok) {
      toast.success("Bem-vindo!");
      router.replace("/");
    } else {
      toast.error(result.error ?? "Falha no login");
      setLoading(false);
    }
  }

  function handleQuickLogin(userId: string) {
    loginAs(userId);
    const u = users.find((x) => x.id === userId);
    toast.success(`Entrando como ${u?.nome.split(" ").slice(0, 2).join(" ")}`);
    router.replace("/");
  }

  return (
    <div className="min-h-screen flex bg-[#f6f6f4]">
      {/* Left hero */}
      <div
        className="hidden lg:flex flex-col justify-between w-[44%] relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2c3e4a 0%, #47535f 50%, #1e2830 100%)",
          padding: "64px 72px",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute rounded-full opacity-40"
          style={{
            width: 560,
            height: 560,
            top: -120,
            right: -180,
            background: "radial-gradient(circle, rgba(92,124,153,0.4) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full opacity-30"
          style={{
            width: 420,
            height: 420,
            bottom: -140,
            left: -120,
            background: "radial-gradient(circle, rgba(138,110,193,0.3) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 flex items-center gap-[14px]">
          <div className="w-[46px] h-[46px] rounded-[12px] bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <Image src="/avatar.png" alt="" width={28} height={28} className="rounded-full" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-white font-[var(--font-zalando-stack)] leading-tight">
              Hospital da Plástica
            </p>
            <p className="text-[12px] text-white/60 font-[var(--font-jakarta)]">
              Sistema de gestão integrada
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-[32px]">
          <div>
            <h1 className="text-[48px] font-light text-white font-[var(--font-zalando-stack)] leading-[1.1] tracking-tight">
              Gestão cirúrgica,
              <br />
              financeira e de estoque
              <br />
              <span className="font-semibold">num só lugar.</span>
            </h1>
          </div>

          <div className="flex flex-col gap-[14px]">
            <FeatureLine text="Controle completo de pacientes e cirurgias" />
            <FeatureLine text="Lançamentos financeiros com status e parcelamento" />
            <FeatureLine text="Estoque, medicações e fornecedores organizados" />
            <FeatureLine text="Relatórios operacionais em tempo real" />
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-[10px] text-white/60 text-[11px] font-[var(--font-jakarta)]">
          <ShieldCheck size={14} />
          <span>Sessão protegida · Dados locais · v1.0</span>
        </div>
      </div>

      {/* Right login form */}
      <div className="flex-1 flex items-center justify-center p-[32px]">
        <div className="w-full max-w-[420px]">
          <div className="mb-[40px]">
            <p className="text-[11px] font-semibold text-[#8a929a] uppercase tracking-widest font-[var(--font-jakarta)] mb-[8px]">
              Acesso ao sistema
            </p>
            <h2 className="text-[28px] font-semibold text-[#1e1e1e] font-[var(--font-jakarta)] leading-tight">
              Entre na sua conta
            </h2>
            <p className="text-[13px] text-[#6b7280] mt-[6px] font-[var(--font-jakarta)]">
              Use seu email corporativo ou selecione um perfil abaixo para demo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[14px] mb-[32px]">
            <label className="flex flex-col gap-[6px]">
              <span className="text-[11px] font-semibold text-[#47535f] uppercase tracking-wider font-[var(--font-jakarta)]">
                Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@hdp.com"
                autoComplete="email"
                className="h-[52px] rounded-[10px] bg-[#f6f6f4] border border-transparent focus:bg-white focus:border-[#47535f]/30 outline-none px-[18px] text-[14px] font-medium font-[var(--font-jakarta)] text-[#1e1e1e] placeholder:text-[#9ca3af] transition-colors"
              />
            </label>
            <label className="flex flex-col gap-[6px]">
              <span className="text-[11px] font-semibold text-[#47535f] uppercase tracking-wider font-[var(--font-jakarta)]">
                Senha
              </span>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••"
                  autoComplete="current-password"
                  className="w-full h-[52px] rounded-[10px] bg-[#f6f6f4] border border-transparent focus:bg-white focus:border-[#47535f]/30 outline-none pl-[18px] pr-[48px] text-[14px] font-medium font-[var(--font-jakarta)] text-[#1e1e1e] placeholder:text-[#9ca3af] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? "Esconder senha" : "Mostrar senha"}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#47535f] transition-colors"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>
            <button
              type="submit"
              disabled={loading}
              className="mt-[8px] h-[52px] rounded-[10px] bg-[#2c3e4a] text-white text-[14px] font-semibold font-[var(--font-jakarta)] hover:bg-[#23323c] transition-colors shadow-[0_6px_20px_rgba(44,62,74,0.25)] disabled:opacity-60 inline-flex items-center justify-center gap-[8px]"
            >
              Entrar
              <ArrowRight size={15} strokeWidth={2.4} />
            </button>
          </form>

          {/* Quick login users */}
          <div>
            <div className="flex items-center gap-[12px] mb-[16px]">
              <div className="flex-1 h-[1px] bg-[#ececec]" />
              <p className="text-[11px] text-[#9ca3af] font-medium font-[var(--font-jakarta)] uppercase tracking-wider">
                Acesso rápido
              </p>
              <div className="flex-1 h-[1px] bg-[#ececec]" />
            </div>

            <div className="grid grid-cols-1 gap-[8px]">
              {users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u.id)}
                  className="group flex items-center gap-[14px] p-[12px] rounded-[12px] border border-[#ececec] bg-white hover:border-[#47535f]/30 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all text-left"
                >
                  <div
                    className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0 text-white text-[13px] font-bold font-[var(--font-dm)] shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
                    style={{ background: u.avatarColor }}
                  >
                    {getInitials(u.nome)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-[#1e1e1e] truncate font-[var(--font-jakarta)] leading-tight">
                      {u.nome}
                    </p>
                    <p className="text-[11px] text-[#8a929a] truncate mt-[2px] font-[var(--font-jakarta)]">
                      {u.role}
                      {u.especialidade ? ` · ${u.especialidade}` : ""}
                    </p>
                  </div>
                  <ArrowRight
                    size={15}
                    className="text-[#bfbfbf] shrink-0 group-hover:text-[#47535f] group-hover:translate-x-[2px] transition-all"
                  />
                </button>
              ))}
            </div>

            <p className="text-[10px] text-[#9ca3af] font-[var(--font-jakarta)] text-center mt-[16px]">
              Senha de todos os perfis para demo: <code className="font-mono text-[#47535f]">demo</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureLine({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-[10px] text-white/80 text-[13px] font-[var(--font-jakarta)]">
      <span className="w-[5px] h-[5px] rounded-full bg-white/50" />
      {text}
    </div>
  );
}
