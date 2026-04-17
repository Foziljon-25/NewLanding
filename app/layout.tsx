import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import "./globals.css";

const geologica = Geologica({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geologica",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Probox Marketplace",
  description: "Probox orqali iPhone xarid qilish uchun landing sahifa"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className={geologica.variable}>{children}</body>
    </html>
  );
}
