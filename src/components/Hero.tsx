"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/* ── Icono Tijeras ─────────────────────────────────────── */
function IconScissors() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hoja superior */}
      <g className="scissor-top" style={{ transformOrigin: "12px 14px" }}>
        <line x1="12" y1="14" x2="26" y2="5"  stroke="currentColor" strokeWidth="2"   strokeLinecap="round" />
        <circle cx="7" cy="9"  r="4.5" stroke="currentColor" strokeWidth="2"   fill="none" />
        <circle cx="7" cy="9"  r="1.2" fill="currentColor" />
      </g>
      {/* Hoja inferior */}
      <g className="scissor-bottom" style={{ transformOrigin: "12px 14px" }}>
        <line x1="12" y1="14" x2="26" y2="23" stroke="currentColor" strokeWidth="2"   strokeLinecap="round" />
        <circle cx="7" cy="19" r="4.5" stroke="currentColor" strokeWidth="2"   fill="none" />
        <circle cx="7" cy="19" r="1.2" fill="currentColor" />
      </g>
      {/* Perno */}
      <circle cx="12" cy="14" r="1.8" fill="currentColor" />
    </svg>
  );
}

/* ── Icono Máquina (clippers) ──────────────────────────── */
function IconClippers() {
  return (
    <svg className="icon-clipper" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cuerpo */}
      <rect x="4" y="6" width="20" height="13" rx="3" stroke="currentColor" strokeWidth="2" fill="none" />
      {/* Botón power */}
      <circle cx="14" cy="12" r="2.5" fill="currentColor" opacity="0.7" />
      {/* Cuchilla base */}
      <line x1="4" y1="19" x2="24" y2="19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Dientes */}
      <line x1="7"  y1="19" x2="7"  y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="19" x2="11" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="19" x2="15" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="19" x2="19" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Cable */}
      <path d="M14 6 Q14 2 19 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

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

        {/* Símbolo y líneas superiores */}
        <div className="hero-e1 flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c8921a]/70" />
          <span className="text-[#c8921a] text-xl">᛭</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c8921a]/70" />
        </div>

        {/* Etiqueta BARBERÍA */}
        <p
          className="hero-e2 text-[#c8921a] text-[11px] tracking-[0.65em] uppercase mb-5"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          Barbería
        </p>

        {/* Título INVICTUS */}
        <h1
          className="hero-e3 text-[#f0e6c8] text-7xl md:text-[9rem] font-black leading-none mb-6 tracking-tight"
          style={{
            fontFamily: "var(--font-cinzel-decorative)",
            textShadow: "0 0 60px rgba(200,146,26,0.15)",
          }}
        >
          INVICTUS
        </h1>

        {/* Lema */}
        <p
          className="hero-e4 text-[#b8a882] text-lg md:text-xl italic mb-8 leading-relaxed"
          style={{ fontFamily: "var(--font-lato)" }}
        >
          &ldquo;Donde el acero se afila con honor<br />
          y el oficio se lleva en la sangre.&rdquo;
        </p>

        {/* Separador */}
        <div className="hero-e5 flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c8921a]/60" />
          <span className="text-[#c8921a]">ᚢ</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c8921a]/60" />
        </div>

        {/* ── BOTONES ── */}
        <div className="hero-e6 flex flex-col sm:flex-row items-center justify-center gap-5">

          {/* Botón 1: Tijeras + Máquina → Reservar */}
          <Link
            href="/reservar"
            className="btn-tools group relative overflow-hidden flex items-center gap-3 px-8 py-4 font-bold transition-all duration-300"
            style={{
              background: "#c8921a",
              color: "#0f0d0a",
              boxShadow: "0 0 18px rgba(200,146,26,0.4), 0 0 40px rgba(200,146,26,0.15)",
            }}
          >
            {/* Shimmer */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.22) 50%, transparent 65%)" }}
            />
            {/* Hover glow */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
              style={{ boxShadow: "inset 0 0 20px rgba(255,255,255,0.05)" }}
            />

            <span className="relative z-10 text-[#0f0d0a]"><IconScissors /></span>
            <span
              className="relative z-10 text-[10px] tracking-[0.35em] uppercase"
              style={{ fontFamily: "var(--font-barlow)", color: "#0f0d0a" }}
            >
              Reservar Servicio
            </span>
            <span className="relative z-10 text-[#0f0d0a]"><IconClippers /></span>
          </Link>

          {/* Botón 2: INVICTUS → Nosotros */}
          <Link
            href="/nosotros"
            className="btn-invictus relative flex items-center justify-center px-10 py-4 border-2 border-[#c8921a]"
            style={{ fontFamily: "var(--font-cinzel-decorative)", color: "#f0e6c8", fontSize: "1rem", letterSpacing: "0.35em" }}
          >
            {/* Esquinas decorativas */}
            <span className="absolute top-0 left-0   w-3 h-3 border-t-2 border-l-2 border-[#c8921a]" />
            <span className="absolute top-0 right-0  w-3 h-3 border-t-2 border-r-2 border-[#c8921a]" />
            <span className="absolute bottom-0 left-0  w-3 h-3 border-b-2 border-l-2 border-[#c8921a]" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#c8921a]" />
            INVICTUS
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
