import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BoostChat - Chatbot Inteligente com IA Humanizada",
  description: "Converse com um assistente virtual que entende suas necessidades, responde de forma natural e mantém o contexto de suas conversas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
