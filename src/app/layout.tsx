import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { Suspense } from "react";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import "./globals.css";

const plusJakartaSans = localFont({
  src: "../fonts/plus-jakarta-sans-latin.woff2",
  weight: "200 800",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://parafa.com.br"),
  title: "Parafa | Guia de empresas e serviços no Brasil",
  description: "Encontre hotéis, lojas, restaurantes e serviços perto de você.",
  other: { "google-adsense-account": "ca-pub-9322585020374860" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} antialiased`}>
      <body className="min-h-screen">
        {children}
        <Suspense fallback={null}><GoogleAnalytics /></Suspense>
        <Script
          id="adsense"
          strategy="afterInteractive"
          async
          crossOrigin="anonymous"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9322585020374860"
        />
      </body>
    </html>
  );
}
