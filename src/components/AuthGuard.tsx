"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

const PUBLIC_ROUTES = ["/login"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const hydrated = useAuthStore((s) => s.hydrated);
  const currentUserId = useAuthStore((s) => s.currentUserId);

  const isPublic = PUBLIC_ROUTES.includes(pathname ?? "");

  useEffect(() => {
    if (!hydrated) return;
    if (!currentUserId && !isPublic) {
      router.replace("/login");
    }
  }, [hydrated, currentUserId, isPublic, router]);

  // Block rendering protected content until we know auth state.
  if (!hydrated) return null;
  if (!currentUserId && !isPublic) return null;

  return <>{children}</>;
}
