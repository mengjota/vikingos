import type { Metadata } from "next";
import NavbarWrapper from "@/components/NavbarWrapper";
import PwaManager from "@/components/PwaManager";
import { LangProvider } from "@/lib/i18n";
import {
  Cinzel_Decorative,
  Oswald,
  Barlow_Condensed,
  Lato,
  IM_Fell_English,
} from "next/font/google";
import "./globals.css";

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
  title: "BarberOS",
  description: "Reserva tu cita en tu barbería favorita",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BarberOS",
    startupImage: "/api/icon?size=512",
  },
  icons: {
    apple: "/api/icon?size=192",
    icon: [
      { url: "/api/icon?size=192", sizes: "192x192", type: "image/png" },
      { url: "/api/icon?size=512", sizes: "512x512", type: "image/png" },
    ],
  },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#080604",
    "msapplication-TileImage": "/api/icon?size=192",
  },
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
      <body className="min-h-full flex flex-col bg-viking-black">
        <LangProvider>
          <NavbarWrapper />
          {children}
          <PwaManager />
        </LangProvider>
      </body>
    </html>
  );
}
