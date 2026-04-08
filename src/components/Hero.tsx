"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/* ── Partículas decorativas ────────────────────────────── */
const PARTICLES = [
  { left: "8%",  delay: "0s",   duration: "5s"  },
  { left: "18%", delay: "1.2s", duration: "4.5s" },
  { left: "30%", delay: "0.5s", duration: "6s"  },
  { left: "45%", delay: "2s",   duration: "4s"  },
  { left: "58%", delay: "0.8s", duration: "5.5s" },
  { left: "70%", delay: "1.7s", duration: "4.8s" },
  { left: "82%", delay: "0.3s", duration: "5.2s" },
  { left: "92%", delay: "1.5s", duration: "4.3s" },
];

/* ── Componente principal ──────────────────────────────── */
export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">

      {/* ── Fondo con parallax ── */}
      <div
        ref={bgRef}
        className="absolute inset-0 scale-110"
        style={{
          background: `
            linear-gradient(to bottom, rgba(15,13,10,0.25) 0%, rgba(15,13,10,0.65) 60%, rgba(15,13,10,1) 100%),
            radial-gradient(ellipse at 50% 35%, #2d1f0e 0%, #0f0d0a 70%)
          `,
        }}
      />

      {/* ── Patrón rúnico de fondo ── */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 L40 80 M0 40 L80 40 M10 10 L70 70 M70 10 L10 70' stroke='%23c8921a' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ── Luz ambiental central animada ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%", left: "50%",
          width: "700px", height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(200,146,26,0.12) 0%, transparent 70%)",
          animation: "ambientHero 5s ease-in-out infinite",
        }}
      />

      {/* ── Partículas flotantes ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="hero-particle"
          style={{
            left: p.left,
            bottom: "15%",
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* ── Líneas laterales decorativas ── */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-32 bg-gradient-to-b from-transparent to-[#c8921a]/60" />
        <span className="text-[#c8921a]/40 text-[9px] tracking-[0.4em] uppercase rotate-90 whitespace-nowrap"
          style={{ fontFamily: "var(--font-barlow)" }}>
          Est. MMXXV
        </span>
        <div className="w-px h-32 bg-gradient-to-t from-transparent to-[#c8921a]/60" />
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-32 bg-gradient-to-b from-transparent to-[#c8921a]/60" />
        <span className="text-[#c8921a]/40 text-[9px] tracking-[0.4em] uppercase -rotate-90 whitespace-nowrap"
          style={{ fontFamily: "var(--font-barlow)" }}>
          Honor · Fuerza · Oficio
        </span>
        <div className="w-px h-32 bg-gradient-to-t from-transparent to-[#c8921a]/60" />
      </div>

      {/* ── Contenido central ── */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">

        {/* Título INVICTUS */}
        <h1
          className="hero-e3 text-[#f0e6c8] text-7xl md:text-[9rem] font-black leading-none mb-2 tracking-tight"
          style={{
            fontFamily: "var(--font-cinzel-decorative)",
            textShadow: "0 0 60px rgba(200,146,26,0.15)",
          }}
        >
          INVICTUS
        </h1>

        {/* Separador entre INVICTUS y BARBERÍA */}
        <div className="hero-e1 flex items-center justify-center gap-4 mb-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c8921a]/70" />
          <span className="text-[#c8921a] text-xl">᛭</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c8921a]/70" />
        </div>

        {/* Etiqueta BARBERÍA */}
        <p
          className="hero-e2 text-[#c8921a] text-[11px] tracking-[0.65em] uppercase mb-10"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          Barbería
        </p>

        {/* Link dinámico → Nosotros */}
        <div className="hero-e4 mb-10">
          <Link
            href="/nosotros"
            className="group inline-flex items-center gap-3 text-[#b8a882] hover:text-[#f0c040] transition-colors duration-300"
            style={{ fontFamily: "var(--font-barlow)", fontSize: "clamp(0.75rem, 1.8vw, 0.95rem)", letterSpacing: "0.25em", textTransform: "uppercase" }}
          >
            <span className="relative">
              Conoce más sobre Vikingos Barber Club
              {/* Subrayado animado */}
              <span className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500 bg-[#f0c040]" />
            </span>
            {/* Flecha animada */}
            <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* ── Botón RESERVA CON NOSOTROS ── */}
        <div className="hero-e6 flex justify-center">
          <Link
            href="/reservar"
            className="group relative overflow-hidden inline-flex items-center justify-center gap-3 px-10 sm:px-16 py-5 sm:py-6 w-full sm:w-auto"
            style={{
              background: "linear-gradient(135deg, #a06010 0%, #c8921a 35%, #f0c040 60%, #c8921a 80%, #a06010 100%)",
              boxShadow: "0 0 35px rgba(200,146,26,0.55), 0 0 70px rgba(200,146,26,0.2), 0 6px 0 rgba(60,30,0,0.8)",
              fontFamily: "var(--font-barlow)",
              fontSize: "clamp(0.85rem, 2vw, 1rem)",
              fontWeight: 800,
              letterSpacing: "0.45em",
              textTransform: "uppercase",
              color: "#0f0d0a",
            }}
          >
            {/* Shimmer */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)" }} />
            {/* Esquinas decorativas */}
            <span className="absolute top-0 left-0  w-3 h-3 border-t-2 border-l-2 border-[#0f0d0a]/30" />
            <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#0f0d0a]/30" />
            <span className="absolute bottom-0 left-0  w-3 h-3 border-b-2 border-l-2 border-[#0f0d0a]/30" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#0f0d0a]/30" />
            <span className="relative z-10">Reserva con Nosotros</span>
          </Link>
        </div>
      </div>

      {/* ── Flecha scroll ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-50">
        <span
          className="text-[#c8921a] text-[9px] tracking-[0.5em] uppercase"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          Descender
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-[#c8921a] to-transparent" />
      </div>

    </section>
  );
}
