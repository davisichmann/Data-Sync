import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'sonner';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Data Sync Engine | Automação para Agências",
  description: "Sincronize Meta Ads, Google Ads e GA4 com Google Sheets automaticamente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} antialiased bg-slate-950 text-slate-50`}>
        {children}
        <Toaster position="top-right" theme="dark" />
      </body>
    </html>
  );
}
