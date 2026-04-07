"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [tab, setTab] = useState<"entrar" | "registrar">("entrar");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ backgroundColor: "#080604" }}
    >
      {/* Glow de fondo central */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(200,146,26,0.18) 0%, rgba(140,80,5,0.08) 45%, transparent 70%)",
        }}
      />
      {/* Puntos de luz esquinas */}
      <div className="fixed top-0 left-0 w-64 h-64 pointer-events-none"
        style={{ background: "radial-gradient(circle at top left, rgba(200,146,26,0.12), transparent 70%)" }} />
      <div className="fixed bottom-0 right-0 w-64 h-64 pointer-events-none"
        style={{ background: "radial-gradient(circle at bottom right, rgba(200,146,26,0.12), transparent 70%)" }} />

      <div className="relative w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-14">
          <Link href="/" className="inline-block">
            <p
              className="text-[#c8921a] tracking-[0.7em] uppercase mb-3"
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 600 }}
            >
              Barbería
            </p>
            <h1
              className="text-[#f5ead0] font-black leading-none"
              style={{
                fontFamily: "var(--font-cinzel-decorative)",
                fontSize: "clamp(3.5rem, 10vw, 6rem)",
                textShadow: "0 0 80px rgba(200,146,26,0.6), 0 0 30px rgba(200,146,26,0.3), 0 2px 4px rgba(0,0,0,0.8)",
                letterSpacing: "0.06em",
              }}
            >
              INVICTUS
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-5 mt-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#c8921a]/80" />
            <span className="text-[#c8921a] text-xl">᛭</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#c8921a]/80" />
          </div>
          <p
            className="text-[#b8a882]/70 tracking-[0.4em] uppercase mt-5"
            style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem" }}
          >
            Accede a tu cuenta
          </p>
        </div>

        {/* Card */}
        <div
          className="relative border border-[#5c3a1e]/60 px-10 py-12 sm:px-16 sm:py-14"
          style={{
            backgroundColor: "#0e0b07",
            boxShadow:
              "0 0 100px rgba(200,146,26,0.1), 0 0 40px rgba(200,146,26,0.05), inset 0 0 80px rgba(200,146,26,0.03)",
          }}
        >
          {/* Línea dorada superior */}
          <div className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: "linear-gradient(to right, transparent, #c8921a 30%, #e8b84b 50%, #c8921a 70%, transparent)" }} />

          {/* Tabs */}
          <div className="flex mb-12 border-b-2 border-[#5c3a1e]/30">
            <button
              onClick={() => setTab("entrar")}
              className="flex-1 pb-5 uppercase transition-all duration-300"
              style={{
                fontFamily: "var(--font-barlow)",
                fontSize: "1rem",
                letterSpacing: "0.35em",
                fontWeight: tab === "entrar" ? 700 : 400,
                color: tab === "entrar" ? "#c8921a" : "#7a6a50",
                borderBottom: tab === "entrar" ? "3px solid #c8921a" : "3px solid transparent",
                marginBottom: "-2px",
              }}
            >
              Entrar
            </button>
            <button
              onClick={() => setTab("registrar")}
              className="flex-1 pb-5 uppercase transition-all duration-300"
              style={{
                fontFamily: "var(--font-barlow)",
                fontSize: "1rem",
                letterSpacing: "0.35em",
                fontWeight: tab === "registrar" ? 700 : 400,
                color: tab === "registrar" ? "#c8921a" : "#7a6a50",
                borderBottom: tab === "registrar" ? "3px solid #c8921a" : "3px solid transparent",
                marginBottom: "-2px",
              }}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Form Entrar */}
          {tab === "entrar" && (
            <div className="space-y-7">
              <div>
                <label
                  className="block text-[#c8921a] uppercase mb-3"
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.35em", fontWeight: 600 }}
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full bg-[#080604] border-b-2 border-[#5c3a1e]/70 text-[#f0e6c8] px-2 py-4 outline-none focus:border-[#c8921a] transition-colors placeholder:text-[#3a2a18]"
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "1.1rem" }}
                />
              </div>
              <div>
                <label
                  className="block text-[#c8921a] uppercase mb-3"
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.35em", fontWeight: 600 }}
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#080604] border-b-2 border-[#5c3a1e]/70 text-[#f0e6c8] px-2 py-4 outline-none focus:border-[#c8921a] transition-colors placeholder:text-[#3a2a18]"
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "1.1rem" }}
                />
              </div>
              <div className="pt-4">
                <button
                  className="w-full py-6 uppercase font-black tracking-[0.6em] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontSize: "1rem",
                    background: "linear-gradient(135deg, #a06010 0%, #c8921a 35%, #f0c040 60%, #c8921a 80%, #a06010 100%)",
                    color: "#080604",
                    boxShadow: "0 0 40px rgba(200,146,26,0.5), 0 0 80px rgba(200,146,26,0.2), 0 6px 24px rgba(0,0,0,0.6)",
                  }}
                >
                  Entrar al Gremio
                </button>
              </div>
            </div>
          )}

          {/* Form Registrar */}
          {tab === "registrar" && (
            <div className="space-y-7">
              <div>
                <label
                  className="block text-[#c8921a] uppercase mb-3"
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.35em", fontWeight: 600 }}
                >
                  Nombre completo
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full bg-[#080604] border-b-2 border-[#5c3a1e]/70 text-[#f0e6c8] px-2 py-4 outline-none focus:border-[#c8921a] transition-colors placeholder:text-[#3a2a18]"
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "1.1rem" }}
                />
              </div>
              <div>
                <label
                  className="block text-[#c8921a] uppercase mb-3"
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.35em", fontWeight: 600 }}
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full bg-[#080604] border-b-2 border-[#5c3a1e]/70 text-[#f0e6c8] px-2 py-4 outline-none focus:border-[#c8921a] transition-colors placeholder:text-[#3a2a18]"
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "1.1rem" }}
                />
              </div>
              <div>
                <label
                  className="block text-[#c8921a] uppercase mb-3"
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.35em", fontWeight: 600 }}
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#080604] border-b-2 border-[#5c3a1e]/70 text-[#f0e6c8] px-2 py-4 outline-none focus:border-[#c8921a] transition-colors placeholder:text-[#3a2a18]"
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "1.1rem" }}
                />
              </div>
              <div className="pt-4">
                <button
                  className="w-full py-6 uppercase font-black tracking-[0.6em] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                  style={{
                    fontFamily: "var(--font-barlow)",
                    fontSize: "1rem",
                    background: "linear-gradient(135deg, #a06010 0%, #c8921a 35%, #f0c040 60%, #c8921a 80%, #a06010 100%)",
                    color: "#080604",
                    boxShadow: "0 0 40px rgba(200,146,26,0.5), 0 0 80px rgba(200,146,26,0.2), 0 6px 24px rgba(0,0,0,0.6)",
                  }}
                >
                  Crear mi Cuenta
                </button>
              </div>
            </div>
          )}

          {/* Volver */}
          <div className="mt-10 text-center">
            <Link
              href="/"
              className="text-[#7a6a50] hover:text-[#c8921a] uppercase tracking-[0.35em] transition-colors duration-300"
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem" }}
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
