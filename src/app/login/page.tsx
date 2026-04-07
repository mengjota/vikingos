"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [tab, setTab] = useState<"entrar" | "registrar">("entrar");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{ backgroundColor: "#0a0805" }}
    >
      {/* Fondo con gradiente radial dramático */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(200,146,26,0.13) 0%, rgba(120,70,10,0.06) 40%, transparent 70%)",
        }}
      />

      {/* Líneas decorativas de esquina — arriba izquierda */}
      <div className="fixed top-0 left-0 pointer-events-none">
        <div style={{ width: "160px", height: "1px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.5))" }} />
        <div style={{ width: "1px", height: "160px", background: "linear-gradient(to bottom, transparent, rgba(200,146,26,0.5))" }} />
      </div>
      {/* Líneas decorativas de esquina — abajo derecha */}
      <div className="fixed bottom-0 right-0 pointer-events-none">
        <div style={{ width: "160px", height: "1px", marginLeft: "auto", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.5))" }} />
        <div style={{ width: "1px", height: "160px", marginLeft: "auto", background: "linear-gradient(to top, transparent, rgba(200,146,26,0.5))" }} />
      </div>

      <div className="relative w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block group">
            <p
              className="text-[#c8921a] text-xs tracking-[0.6em] uppercase mb-3"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              Barbería
            </p>
            <h1
              className="text-[#f0e6c8] font-black leading-none"
              style={{
                fontFamily: "var(--font-cinzel-decorative)",
                fontSize: "clamp(2.8rem, 8vw, 4.5rem)",
                textShadow: "0 0 60px rgba(200,146,26,0.5), 0 0 20px rgba(200,146,26,0.25)",
                letterSpacing: "0.08em",
              }}
            >
              INVICTUS
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-4 mt-5">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c8921a]/70" />
            <span className="text-[#c8921a] text-lg">᛭</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c8921a]/70" />
          </div>
          <p
            className="text-[#b8a882]/60 text-xs tracking-[0.3em] uppercase mt-4"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            Accede a tu cuenta
          </p>
        </div>

        {/* Card */}
        <div
          className="relative border border-[#5c3a1e]/50 px-8 py-10 sm:px-12 sm:py-12"
          style={{
            backgroundColor: "#110e09",
            boxShadow:
              "0 0 80px rgba(200,146,26,0.08), 0 0 30px rgba(200,146,26,0.04), inset 0 0 60px rgba(200,146,26,0.03)",
          }}
        >
          {/* Línea superior brillante */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c8921a] to-transparent" />
          {/* Línea inferior tenue */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8921a]/30 to-transparent" />

          {/* Tabs */}
          <div className="flex mb-10 border-b border-[#5c3a1e]/40">
            <button
              onClick={() => setTab("entrar")}
              className="flex-1 pb-4 text-sm tracking-[0.35em] uppercase transition-all duration-300"
              style={{
                fontFamily: "var(--font-barlow)",
                color: tab === "entrar" ? "#c8921a" : "#b8a882",
                borderBottom: tab === "entrar" ? "2px solid #c8921a" : "2px solid transparent",
                fontWeight: tab === "entrar" ? "700" : "400",
              }}
            >
              Entrar
            </button>
            <button
              onClick={() => setTab("registrar")}
              className="flex-1 pb-4 text-sm tracking-[0.35em] uppercase transition-all duration-300"
              style={{
                fontFamily: "var(--font-barlow)",
                color: tab === "registrar" ? "#c8921a" : "#b8a882",
                borderBottom: tab === "registrar" ? "2px solid #c8921a" : "2px solid transparent",
                fontWeight: tab === "registrar" ? "700" : "400",
              }}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Form Entrar */}
          {tab === "entrar" && (
            <div className="space-y-6">
              <div>
                <label
                  className="block text-[#c8921a]/80 text-xs tracking-[0.4em] uppercase mb-3"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full bg-[#0a0805] border border-[#5c3a1e]/60 text-[#f0e6c8] px-5 py-4 text-base outline-none focus:border-[#c8921a] transition-colors placeholder:text-[#5c3a1e]"
                  style={{ fontFamily: "var(--font-barlow)" }}
                />
              </div>
              <div>
                <label
                  className="block text-[#c8921a]/80 text-xs tracking-[0.4em] uppercase mb-3"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#0a0805] border border-[#5c3a1e]/60 text-[#f0e6c8] px-5 py-4 text-base outline-none focus:border-[#c8921a] transition-colors placeholder:text-[#5c3a1e]"
                  style={{ fontFamily: "var(--font-barlow)" }}
                />
              </div>
              <button
                className="w-full py-5 text-sm tracking-[0.5em] uppercase font-bold transition-all duration-300 mt-2"
                style={{
                  fontFamily: "var(--font-barlow)",
                  background: "linear-gradient(135deg, #c8921a 0%, #e8b84b 50%, #c8921a 100%)",
                  color: "#0a0805",
                  boxShadow: "0 0 30px rgba(200,146,26,0.4), 0 0 60px rgba(200,146,26,0.15), 0 4px 20px rgba(0,0,0,0.5)",
                }}
              >
                Entrar al Gremio
              </button>
            </div>
          )}

          {/* Form Registrar */}
          {tab === "registrar" && (
            <div className="space-y-6">
              <div>
                <label
                  className="block text-[#c8921a]/80 text-xs tracking-[0.4em] uppercase mb-3"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full bg-[#0a0805] border border-[#5c3a1e]/60 text-[#f0e6c8] px-5 py-4 text-base outline-none focus:border-[#c8921a] transition-colors placeholder:text-[#5c3a1e]"
                  style={{ fontFamily: "var(--font-barlow)" }}
                />
              </div>
              <div>
                <label
                  className="block text-[#c8921a]/80 text-xs tracking-[0.4em] uppercase mb-3"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full bg-[#0a0805] border border-[#5c3a1e]/60 text-[#f0e6c8] px-5 py-4 text-base outline-none focus:border-[#c8921a] transition-colors placeholder:text-[#5c3a1e]"
                  style={{ fontFamily: "var(--font-barlow)" }}
                />
              </div>
              <div>
                <label
                  className="block text-[#c8921a]/80 text-xs tracking-[0.4em] uppercase mb-3"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#0a0805] border border-[#5c3a1e]/60 text-[#f0e6c8] px-5 py-4 text-base outline-none focus:border-[#c8921a] transition-colors placeholder:text-[#5c3a1e]"
                  style={{ fontFamily: "var(--font-barlow)" }}
                />
              </div>
              <button
                className="w-full py-5 text-sm tracking-[0.5em] uppercase font-bold transition-all duration-300 mt-2"
                style={{
                  fontFamily: "var(--font-barlow)",
                  background: "linear-gradient(135deg, #c8921a 0%, #e8b84b 50%, #c8921a 100%)",
                  color: "#0a0805",
                  boxShadow: "0 0 30px rgba(200,146,26,0.4), 0 0 60px rgba(200,146,26,0.15), 0 4px 20px rgba(0,0,0,0.5)",
                }}
              >
                Crear mi Cuenta
              </button>
            </div>
          )}

          {/* Volver */}
          <div className="mt-8 text-center">
            <Link
              href="/"
              className="text-[#b8a882]/50 hover:text-[#c8921a] text-xs tracking-[0.35em] uppercase transition-colors duration-300"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
