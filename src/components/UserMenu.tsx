"use client";

import { useRouter } from "next/navigation";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/data/users";
import { useAuthStore, useCurrentUser } from "@/stores/useAuthStore";
import { toast } from "@/components/ui/toast";

type Props = {
  size?: number;
  onDark?: boolean;
};

export default function UserMenu({ size = 36, onDark = false }: Props) {
  const router = useRouter();
  const user = useCurrentUser();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    toast.success("Sessão encerrada");
    router.replace("/login");
  };

  const handleProfile = () => toast.info("Meu perfil em breve");
  const handleSettings = () => router.push("/configuracoes");

  const initials = user ? getInitials(user.nome) : "??";
  const bg = user?.avatarColor ?? (onDark ? "rgba(255,255,255,0.12)" : "#d9d9d9");
  const fontPx = Math.max(10, Math.round(size * 0.36));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={user ? `Menu de ${user.nome}` : "Menu do usuário"}
          className={`rounded-full flex items-center justify-center text-white font-bold font-[var(--font-dm)] shrink-0 hover:brightness-110 transition ${
            user ? "" : "border border-[#e9e9e9]"
          }`}
          style={{
            width: size,
            height: size,
            background: bg,
            fontSize: fontPx,
          }}
        >
          {user ? initials : ""}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[240px]">
        {user && (
          <>
            <div className="px-[10px] py-[10px] flex items-center gap-[10px]">
              <div
                className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white text-[13px] font-bold font-[var(--font-dm)] shrink-0"
                style={{ background: user.avatarColor }}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-[#1e1e1e] truncate font-[var(--font-jakarta)] leading-tight">
                  {user.nome}
                </p>
                <p className="text-[11px] text-[#8a929a] truncate mt-[2px] font-[var(--font-jakarta)]">
                  {user.role}
                  {user.especialidade ? ` · ${user.especialidade}` : ""}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onSelect={handleProfile}>
          <UserIcon size={14} className="mr-[8px] text-[#8a929a]" />
          Meu perfil
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleSettings}>
          <Settings size={14} className="mr-[8px] text-[#8a929a]" />
          Configurações
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOut size={14} className="mr-[8px] text-[#c1846e]" />
          <span className="text-[#c1846e]">Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
