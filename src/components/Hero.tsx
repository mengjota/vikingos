"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

/* ── Icono Tijeras Realistas ───────────────────────────── */
function IconScissors() {
  return (
    <svg width="64" height="64" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Hoja superior */}
      <g className="scissor-top" style={{ transformOrigin: "30px 30px" }}>
        {/* Aro del dedo — exterior */}
        <circle cx="10" cy="13" r="8"  stroke="#c8921a" strokeWidth="2.5" fill="rgba(200,146,26,0.08)" />
        {/* Aro del dedo — interior hueco */}
        <circle cx="10" cy="13" r="4"  stroke="#c8921a" strokeWidth="1.2" fill="rgba(200,146,26,0.15)" />
        {/* Reflejo del aro (3D) */}
        <path d="M5 9 Q7 6 11 7" stroke="rgba(255,220,100,0.5)" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        {/* Mango (shank) hacia el pivote */}
        <path d="M17 15 L30 28" stroke="#c8921a" strokeWidth="3.5" strokeLinecap="round"/>
        {/* Sombra del mango (3D) */}
        <path d="M18 16 L31 29" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"/>
        {/* Hoja (blade) hacia la punta */}
        <path d="M30 28 L56 10" stroke="#c8921a" strokeWidth="2" strokeLinecap="round"/>
        {/* Filo de la hoja (highlight) */}
        <path d="M30 28 L56 12" stroke="rgba(255,220,100,0.4)" strokeWidth="0.8" strokeLinecap="round"/>
      </g>

      {/* Hoja inferior */}
      <g className="scissor-bottom" style={{ transformOrigin: "30px 30px" }}>
        {/* Aro del dedo — exterior */}
        <circle cx="10" cy="47" r="8"  stroke="#c8921a" strokeWidth="2.5" fill="rgba(200,146,26,0.08)" />
        {/* Aro del dedo — interior */}
        <circle cx="10" cy="47" r="4"  stroke="#c8921a" strokeWidth="1.2" fill="rgba(200,146,26,0.15)" />
        {/* Reflejo */}
        <path d="M5 43 Q7 40 11 41" stroke="rgba(255,220,100,0.5)" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
        {/* Mango */}
        <path d="M17 45 L30 32" stroke="#c8921a" strokeWidth="3.5" strokeLinecap="round"/>
        {/* Sombra mango */}
        <path d="M18 46 L31 33" stroke="rgba(0,0,0,0.4)" strokeWidth="2" strokeLinecap="round"/>
        {/* Hoja */}
        <path d="M30 32 L56 50" stroke="#c8921a" strokeWidth="2" strokeLinecap="round"/>
        {/* Filo highlight */}
        <path d="M30 32 L56 48" stroke="rgba(255,220,100,0.4)" strokeWidth="0.8" strokeLinecap="round"/>
      </g>

      {/* Tornillo pivote */}
      <circle cx="30" cy="30" r="4.5" fill="#c8921a"/>
      <circle cx="30" cy="30" r="2.5" fill="#0f0d0a"/>
      <circle cx="30" cy="30" r="1"   fill="#c8921a" opacity="0.6"/>
      {/* Reflejo del tornillo */}
      <circle cx="28.5" cy="28.5" r="1" fill="rgba(255,220,100,0.6)"/>
    </svg>
  );
}

/* ── Icono Máquina Realista (clippers) ─────────────────── */
function IconClippers() {
  return (
    <svg width="64" height="64" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sombra del cuerpo (profundidad 3D) */}
      <rect x="10" y="10" width="40" height="28" rx="6" fill="rgba(0,0,0,0.5)"/>

      {/* Cuerpo principal */}
      <rect x="8" y="8" width="40" height="28" rx="6" fill="#1a1209" stroke="#c8921a" strokeWidth="2"/>

      {/* Cara superior (highlight 3D) */}
      <rect x="8" y="8" width="40" height="9" rx="6" fill="rgba(200,146,26,0.12)"/>
      <path d="M9 11 Q28 9 47 11" stroke="rgba(255,220,100,0.3)" strokeWidth="1" fill="none"/>

      {/* Detalle de grip lateral izquierdo */}
      <line x1="10" y1="18" x2="10" y2="32" stroke="rgba(200,146,26,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="13" y1="18" x2="13" y2="32" stroke="rgba(200,146,26,0.15)" strokeWidth="1"   strokeLinecap="round"/>

      {/* Botón power (centro) */}
      <circle cx="28" cy="22" r="5.5" fill="rgba(0,0,0,0.4)" />
      <circle cx="28" cy="22" r="4.5" stroke="#c8921a" strokeWidth="1.5" fill="rgba(200,146,26,0.15)"/>
      <circle cx="28" cy="22" r="2.5" fill="#c8921a"/>
      <circle cx="27" cy="21" r="1"   fill="rgba(255,220,100,0.7)"/>

      {/* LED indicador */}
      <circle cx="42" cy="13" r="2.5" fill="#c8921a"/>
      <circle cx="42" cy="13" r="1.5" fill="rgba(255,240,150,0.9)"/>

      {/* Cable */}
      <path d="M28 8 Q28 3 36 3 Q44 3 44 8" stroke="#c8921a" strokeWidth="2" strokeLinecap="round" fill="none"/>
      <path d="M29 8 Q29 4 37 4 Q44 4 44 9"  stroke="rgba(255,220,100,0.2)" strokeWidth="0.8" fill="none"/>

      {/* Base de la cuchilla */}
      <rect x="6" y="36" width="44" height="6" rx="2" fill="#c8921a"/>
      <rect x="6" y="36" width="44" height="3" rx="2" fill="rgba(255,220,100,0.2)"/>

      {/* Dientes de la cuchilla */}
      <g className="icon-blade">
        <rect x="9"  y="42" width="4" height="10" rx="1.5" fill="#c8921a"/>
        <rect x="16" y="42" width="4" height="10" rx="1.5" fill="#c8921a"/>
        <rect x="23" y="42" width="4" height="10" rx="1.5" fill="#c8921a"/>
        <rect x="30" y="42" width="4" height="10" rx="1.5" fill="#c8921a"/>
        <rect x="37" y="42" width="4" height="10" rx="1.5" fill="#c8921a"/>
        <rect x="44" y="42" width="4" height="10" rx="1.5" fill="#c8921a"/>
        {/* Highlights de dientes (filo) */}
        <rect x="9"  y="42" width="2" height="10" rx="1" fill="rgba(255,220,100,0.45)"/>
        <rect x="16" y="42" width="2" height="10" rx="1" fill="rgba(255,220,100,0.45)"/>
        <rect x="23" y="42" width="2" height="10" rx="1" fill="rgba(255,220,100,0.45)"/>
        <rect x="30" y="42" width="2" height="10" rx="1" fill="rgba(255,220,100,0.45)"/>
        <rect x="37" y="42" width="2" height="10" rx="1" fill="rgba(255,220,100,0.45)"/>
        <rect x="44" y="42" width="2" height="10" rx="1" fill="rgba(255,220,100,0.45)"/>
      </g>
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

        {/* ── BOTONES ROW 1 ── */}
        <div className="hero-e6 flex flex-col sm:flex-row items-center justify-center gap-6">

          {/* Botón 1: Solo iconos 3D → Reservar */}
          <Link
            href="/reservar"
            className="btn-tools group relative overflow-hidden flex items-center gap-6 px-12 py-6"
            style={{
              background: "linear-gradient(145deg, #d9a020 0%, #c8921a 50%, #a87215 100%)",
              boxShadow: "0 6px 0 rgba(80,40,0,0.9), 0 0 25px rgba(200,146,26,0.5), 0 0 55px rgba(200,146,26,0.2)",
              color: "#0f0d0a",
            }}
          >
            {/* Shimmer sweep */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)" }}
            />
            <span className="relative z-10 scissors-float"><IconScissors /></span>
            <span className="relative z-10 clippers-float"><IconClippers /></span>
          </Link>

          {/* Botón 2: INVICTUS → Nosotros (fondo transparente) */}
          <Link
            href="/nosotros"
            className="btn-invictus relative flex items-center justify-center px-10 py-5 border-2 border-[#c8921a]"
            style={{
              background: "transparent",
              fontFamily: "var(--font-cinzel-decorative)",
              color: "#f0e6c8",
              fontSize: "1rem",
              letterSpacing: "0.35em",
            }}
          >
            {/* Esquinas decorativas */}
            <span className="absolute top-0 left-0   w-3 h-3 border-t-2 border-l-2 border-[#c8921a]" />
            <span className="absolute top-0 right-0  w-3 h-3 border-t-2 border-r-2 border-[#c8921a]" />
            <span className="absolute bottom-0 left-0  w-3 h-3 border-b-2 border-l-2 border-[#c8921a]" />
            <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#c8921a]" />
            INVICTUS
          </Link>

        </div>

        {/* ── Iniciar Sesión (centrado debajo) ── */}
        <div className="hero-e6 mt-6 flex justify-center">
          <Link
            href="/login"
            className="group flex items-center gap-2 px-8 py-3 border border-[#c8921a]/40 text-[#b8a882]/70 text-[10px] tracking-[0.4em] uppercase hover:border-[#c8921a] hover:text-[#c8921a] transition-all duration-300"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            {/* Icono usuario */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
            Iniciar Sesión
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
