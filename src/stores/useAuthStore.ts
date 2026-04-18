"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { seedUsers } from "@/data/users";
import type { User } from "@/types";

type AuthState = {
  users: User[];
  currentUserId: string | null;
  hydrated: boolean;
  login: (email: string, senha: string) => { ok: boolean; error?: string };
  loginAs: (userId: string) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: seedUsers,
      currentUserId: null,
      hydrated: false,
      login: (email, senha) => {
        const match = get().users.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
        );
        if (!match) return { ok: false, error: "Usuário não encontrado" };
        if (match.senha !== senha) return { ok: false, error: "Senha incorreta" };
        set({ currentUserId: match.id });
        return { ok: true };
      },
      loginAs: (userId) => set({ currentUserId: userId }),
      logout: () => set({ currentUserId: null }),
      hydrate: () => {
        if (!get().hydrated) set({ hydrated: true });
      },
    }),
    {
      name: "calvett-auth",
      partialize: (s) => ({ currentUserId: s.currentUserId }),
      onRehydrateStorage: () => (state) => {
        state?.hydrate();
      },
    },
  ),
);

export function useCurrentUser(): User | null {
  const id = useAuthStore((s) => s.currentUserId);
  const users = useAuthStore((s) => s.users);
  if (!id) return null;
  return users.find((u) => u.id === id) ?? null;
}
