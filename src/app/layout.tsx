import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Parafa | Guia de empresas e serviços no Brasil",
  description: "Encontre hotéis, lojas, restaurantes e serviços mais bem avaliados perto de você.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
