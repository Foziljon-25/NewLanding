import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import "./globals.css";

const geologica = Geologica({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geologica",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Procare | Professional servis markazi",
  description:
    "Procare servis markazi Apple qurilmalari uchun diagnostika, ta'mirlash, ehtiyot qismlar va kafolatli xizmatlarni taklif qiladi.",
  icons: {
    icon: "/favicon.svg"
  },
  openGraph: {
    title: "Procare | Professional servis markazi",
    description:
      "Apple qurilmalari uchun tezkor, kafolatli va professional ta'mirlash xizmatlari.",
    type: "website",
    locale: "uz_UZ"
  }
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
