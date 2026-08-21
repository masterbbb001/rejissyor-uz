import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rejissyor.uz — No-Repeat Interactive Cinema",
  description:
    "Sun'iy intellekt bilan yaratilgan, hech qachon takrorlanmaydigan interaktiv kino tajribasi. Janrni tanlang, taqdirni yozing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={`${oswald.variable} ${inter.variable}`}>
      <body className="bg-void text-projector font-body antialiased">
        {children}
      </body>
    </html>
  );
}
