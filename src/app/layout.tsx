import type { Metadata } from "next";
import { DM_Sans, Plus_Jakarta_Sans, Zalando_Sans_Expanded } from "next/font/google";
import ViewportScaler from "@/components/ViewportScaler";
import ControlMenuDrawer from "@/components/ControlMenuDrawer";
import AuthGuard from "@/components/AuthGuard";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const zalandoExpanded = Zalando_Sans_Expanded({
  variable: "--font-zalando",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sistema Financeiro - Hospital da Plástica",
  description: "Dashboard financeiro do Hospital da Plástica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className={`${dmSans.variable} ${plusJakarta.variable} ${zalandoExpanded.variable} h-full`}>
        <ViewportScaler />
        <AuthGuard>{children}</AuthGuard>
        <ControlMenuDrawer />
        <Toaster />
      </body>
    </html>
  );
}
