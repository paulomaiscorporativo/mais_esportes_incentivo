import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Mais Esportes Incentivo | Engajamento B2B",
    description: "Plataforma de fidelidade e incentivo Mais Esportes.",
    manifest: "/manifest.json",
    themeColor: "#0c2444",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
