import type { Metadata } from "next";
import { Cinzel, Cinzel_Decorative, IM_Fell_English } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const imFell = IM_Fell_English({
  variable: "--font-im-fell",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "INVICTUS BARBERIA",
  description: "Donde el acero se encuentra con el honor. Barbería artesanal con estilo vikingo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cinzel.variable} ${cinzelDecorative.variable} ${imFell.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-viking-black">{children}</body>
    </html>
  );
}
