import type { Metadata } from "next";
import {
  Cinzel_Decorative,
  Oswald,
  Barlow_Condensed,
  Lato,
  IM_Fell_English,
} from "next/font/google";
import "./globals.css";

// Logo / marca — solo para INVICTUS
const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

// Títulos de sección, nombres de servicio — impacto moderno
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Botones, labels, navegación — limpio y profesional
const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

// Descripciones, cuerpo de texto — legible y elegante
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
});

// Citas y acentos poéticos — toque clásico selectivo
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
      className={`${cinzelDecorative.variable} ${oswald.variable} ${barlowCondensed.variable} ${lato.variable} ${imFell.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-viking-black">{children}</body>
    </html>
  );
}
