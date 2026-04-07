"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [tab, setTab] = useState<"entrar" | "registrar">("entrar");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0f0d0a" }}
    >
      {/* Ambient glow */}
      <div
        className="fixed top-1/2 left-1/2 pointer-events-none"
        style={{
          width: "600px", height: "500px",
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(ellipse, rgba(200,146,26,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <p className="text-[#c8921a] text-[10px] tracking-[0.5em] uppercase mb-2"
              style={{ fontFamily: "var(--font-barlow)" }}>
              Barbería
            </p>
            <h1
              className="text-[#f0e6c8] text-4xl font-black"
              style={{ fontFamily: "var(--font-cinzel-decorative)", textShadow: "0 0 30px rgba(200,146,26,0.3)" }}
            >
              INVICTUS
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c8921a]/60" />
            <span className="text-[#c8921a]">᛭</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c8921a]/60" />
          </div>
        </div>

        {/* Card */}
        <div
          className="relative border border-[#5c3a1e]/60 p-8"
          style={{
            backgroundColor: "#141209",
            boxShadow: "0 0 40px rgba(200,146,26,0.06), inset 0 0 30px rgba(200,146,26,0.03)",
          }}
        >
          {/* Línea superior dorada */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8921a] to-transparent" />

          {/* Tabs */}
          <div className="flex mb-8 border-b border-[#5c3a1e]/40">
            <button
              onClick={() => setTab("entrar")}
              className="flex-1 pb-3 text-[10px] tracking-[0.35em] uppercase transition-all duration-300"
              style={{
                fontFamily: "var(--font-barlow)",
                color: tab === "entrar" ? "#c8921a" : "#b8a882/40",
                borderBottom: tab === "entrar" ? "2px solid #c8921a" : "2px solid transparent",
              }}
            >
              Entrar
            </button>
            <button
              onClick={() => setTab("registrar")}
              className="flex-1 pb-3 text-[10px] tracking-[0.35em] uppercase transition-all duration-300"
              style={{
                fontFamily: "var(--font-barlow)",
                color: tab === "registrar" ? "#c8921a" : "#b8a882",
                borderBottom: tab === "registrar" ? "2px solid #c8921a" : "2px solid transparent",
              }}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Form Entrar */}
          {tab === "entrar" && (
            <div className="space-y-5">
              <div>
                <label className="block text-[#c8921a]/70 text-[9px] tracking-[0.4em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-barlow)" }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full bg-[#0f0d0a] border border-[#5c3a1e]/60 text-[#f0e6c8] px-4 py-3 text-sm outline-none focus:border-[#c8921a] transition-colors"
                  style={{ fontFamily: "var(--font-lato)" }}
                />
              </div>
              <div>
                <label className="block text-[#c8921a]/70 text-[9px] tracking-[0.4em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-barlow)" }}>
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#0f0d0a] border border-[#5c3a1e]/60 text-[#f0e6c8] px-4 py-3 text-sm outline-none focus:border-[#c8921a] transition-colors"
                  style={{ fontFamily: "var(--font-lato)" }}
                />
              </div>
              <button
                className="btn-glow w-full bg-[#c8921a] text-[#0f0d0a] py-4 text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-[#e8b84b] transition-colors mt-2"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                Entrar al Gremio
              </button>
            </div>
          )}

          {/* Form Registrar */}
          {tab === "registrar" && (
            <div className="space-y-5">
              <div>
                <label className="block text-[#c8921a]/70 text-[9px] tracking-[0.4em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-barlow)" }}>
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  className="w-full bg-[#0f0d0a] border border-[#5c3a1e]/60 text-[#f0e6c8] px-4 py-3 text-sm outline-none focus:border-[#c8921a] transition-colors"
                  style={{ fontFamily: "var(--font-lato)" }}
                />
              </div>
              <div>
                <label className="block text-[#c8921a]/70 text-[9px] tracking-[0.4em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-barlow)" }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="w-full bg-[#0f0d0a] border border-[#5c3a1e]/60 text-[#f0e6c8] px-4 py-3 text-sm outline-none focus:border-[#c8921a] transition-colors"
                  style={{ fontFamily: "var(--font-lato)" }}
                />
              </div>
              <div>
                <label className="block text-[#c8921a]/70 text-[9px] tracking-[0.4em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-barlow)" }}>
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#0f0d0a] border border-[#5c3a1e]/60 text-[#f0e6c8] px-4 py-3 text-sm outline-none focus:border-[#c8921a] transition-colors"
                  style={{ fontFamily: "var(--font-lato)" }}
                />
              </div>
              <button
                className="btn-glow w-full bg-[#c8921a] text-[#0f0d0a] py-4 text-[10px] tracking-[0.4em] uppercase font-bold hover:bg-[#e8b84b] transition-colors mt-2"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                Crear mi Cuenta
              </button>
            </div>
          )}

          {/* Volver */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-[#b8a882]/40 hover:text-[#c8921a] text-[9px] tracking-widest uppercase transition-colors"
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
