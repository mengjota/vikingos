"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Iconos SVG animados por servicio ─────────────────── */

const IconScissors = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
    {/* hoja superior — fija */}
    <circle cx="7" cy="7" r="3.5" />
    <line x1="10" y1="9.5" x2="27" y2="26" />
    {/* hoja inferior — animada */}
    <g className={active ? "animate-scissors-blade" : ""} style={{ transformOrigin: "7px 25px" }}>
      <circle cx="7" cy="25" r="3.5" />
      <line x1="10" y1="22.5" x2="27" y2="6" />
    </g>
    {/* tornillo central */}
    <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

const IconRazorBlade = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 overflow-visible">
    {/* cuerpo de la navaja */}
    <rect x="3" y="11" width="26" height="10" rx="1.5" />
    {/* filo superior */}
    <line x1="3" y1="14" x2="29" y2="14" strokeWidth="1" opacity="0.5" />
    {/* agujero central */}
    <rect x="13" y="13" width="6" height="6" rx="0.5" />
    {/* mango */}
    <line x1="8" y1="11" x2="8" y2="21" strokeWidth="1" opacity="0.4" />
    <line x1="24" y1="11" x2="24" y2="21" strokeWidth="1" opacity="0.4" />
    {/* destello animado */}
    {active && (
      <line
        x1="6" y1="13" x2="11" y2="19"
        className="animate-razor-gleam"
        stroke="#f0e6c8"
        strokeWidth="1.5"
        opacity="0.7"
      />
    )}
  </svg>
);

const IconCombScissors = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
    {/* peine */}
    <g className={active ? "animate-comb" : ""}>
      <rect x="2" y="14" width="16" height="4" rx="1" />
      <line x1="5"  y1="14" x2="5"  y2="10" />
      <line x1="8"  y1="14" x2="8"  y2="10" />
      <line x1="11" y1="14" x2="11" y2="10" />
      <line x1="14" y1="14" x2="14" y2="10" />
    </g>
    {/* tijeras pequeñas */}
    <circle cx="24" cy="10" r="2.5" />
    <circle cx="24" cy="22" r="2.5" />
    <line x1="26" y1="11.8" x2="30" y2="20" />
    <line x1="26" y1="20.2" x2="30" y2="12" />
    <circle cx="28" cy="16" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const IconBeard = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round"
    className={`w-12 h-12 ${active ? "animate-beard" : ""}`}>
    {/* cabeza */}
    <circle cx="16" cy="9" r="5" />
    {/* hombros */}
    <path d="M6 30 C6 22 10 20 16 20 C22 20 26 22 26 30" />
    {/* barba */}
    <path d="M10 14 C10 19 13 22 16 22 C19 22 22 19 22 14" />
    <line x1="16" y1="20" x2="16" y2="23" />
    <line x1="13" y1="21" x2="12" y2="24" />
    <line x1="19" y1="21" x2="20" y2="24" />
  </svg>
);

const IconChildScissors = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round"
    className={`w-12 h-12 ${active ? "animate-bounce-soft" : ""}`}>
    {/* tijeras pequeñas */}
    <circle cx="8" cy="8" r="3" />
    <circle cx="8" cy="20" r="3" />
    <line x1="10.5" y1="10" x2="26" y2="24" />
    <line x1="10.5" y1="18" x2="26" y2="8" />
    <circle cx="17" cy="16" r="1" fill="currentColor" stroke="none" />
    {/* estrellita de "niño" */}
    <path d="M26 26 L27 24 L28 26 L26.5 25 L27.5 25 Z" fill="currentColor" stroke="none" />
    <circle cx="26" cy="10" r="1" fill="currentColor" stroke="none" opacity="0.6" />
    <circle cx="29" cy="12" r="0.7" fill="currentColor" stroke="none" opacity="0.4" />
  </svg>
);

const IconCrown = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round"
    className={`w-12 h-12 ${active ? "animate-crown" : ""}`}>
    {/* base */}
    <rect x="4" y="22" width="24" height="4" rx="1" />
    {/* corona */}
    <path d="M4 22 L4 12 L10 17 L16 6 L22 17 L28 12 L28 22" />
    {/* joyas */}
    <circle cx="4"  cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="16" cy="6"  r="1.5" fill="currentColor" stroke="none" />
    <circle cx="28" cy="12" r="1.5" fill="currentColor" stroke="none" />
    {/* brillo */}
    <line x1="13" y1="9" x2="15" y2="11" strokeWidth="1" opacity="0.5" />
  </svg>
);

/* ── Datos de servicios ───────────────────────────────── */

const servicios = [
  {
    id: 1,
    nombre: "Corte del Guerrero",
    descripcion: "Corte clásico con tijera y máquina. Lavado y secado incluidos.",
    precio: "Q80",
    duracion: "45 min",
    Icon: IconScissors,
    popular: false,
  },
  {
    id: 2,
    nombre: "Ritual de Navaja",
    descripcion: "Afeitado completo con navaja recta, toalla caliente y bálsamo.",
    precio: "Q120",
    duracion: "60 min",
    Icon: IconRazorBlade,
    popular: true,
  },
  {
    id: 3,
    nombre: "Corte & Barba",
    descripcion: "La combinación completa. Corte de cabello más escultura de barba.",
    precio: "Q150",
    duracion: "75 min",
    Icon: IconCombScissors,
    popular: false,
  },
  {
    id: 4,
    nombre: "La Barba del Norte",
    descripcion: "Tratamiento completo de barba: lavado, acondicionado y aceite vikingo.",
    precio: "Q100",
    duracion: "45 min",
    Icon: IconBeard,
    popular: false,
  },
  {
    id: 5,
    nombre: "Corte de Niño Guerrero",
    descripcion: "Para los pequeños valientes. Corte suave y paciencia garantizada.",
    precio: "Q60",
    duracion: "30 min",
    Icon: IconChildScissors,
    popular: false,
  },
  {
    id: 6,
    nombre: "El Paquete del Jarl",
    descripcion: "Corte, navaja completa, tratamiento de barba y aceite premium.",
    precio: "Q220",
    duracion: "120 min",
    Icon: IconCrown,
    popular: false,
  },
];

const barberos = [
  { id: 0, name: "Sin preferencia", specialty: "Cualquier maestro disponible", rune: "᛭" },
  { id: 1, name: "Björn el Anciano", specialty: "Navaja Clásica", rune: "ᚠ" },
  { id: 2, name: "Erik Manos de Hierro", specialty: "Degradados y Líneas", rune: "ᚢ" },
  { id: 3, name: "Ragnar el Joven", specialty: "Estilo Moderno", rune: "ᚦ" },
];

const horas = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

/* ── Página principal ────────────────────────────────── */

export default function ReservarPage() {
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [servicioId, setServicioId] = useState<number | null>(null);
  const [barberoId, setBarberoId] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  const servicio = servicios.find((s) => s.id === servicioId);
  const barbero = barberos.find((b) => b.id === barberoId);

  /* Pantalla de confirmación */
  if (confirmado) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#0f0d0a" }}>
        <div className="text-center max-w-lg">
          <div className="animate-crown text-[#c8921a] mx-auto mb-6 w-16 h-16">
            <IconCrown active={true} />
          </div>
          <h2 className="text-[#f0e6c8] text-4xl font-black mb-4" style={{ fontFamily: "var(--font-cinzel-decorative)" }}>
            ¡Pacto Sellado!
          </h2>
          <p className="text-[#b8a882] italic text-lg mb-8" style={{ fontFamily: "var(--font-im-fell)" }}>
            Tu silla en Invictus Barberia te espera.
          </p>
          <div className="border border-[#c8921a]/40 p-8 text-left space-y-4 mb-8" style={{ backgroundColor: "#1a1510" }}>
            <Row label="Servicio"  value={`${servicio?.nombre} — ${servicio?.precio}`} />
            <Row label="Maestro"   value={barbero?.name ?? ""} />
            <Row label="Fecha"     value={`${fecha} a las ${hora}`} />
            <Row label="Nombre"    value={nombre} />
            <Row label="Teléfono"  value={telefono} />
          </div>
          <p className="text-[#b8a882]/40 text-xs mb-6" style={{ fontFamily: "var(--font-cinzel)" }}>
            Te contactaremos para confirmar tu cita.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setConfirmado(false); setPaso(1); setServicioId(null); setBarberoId(null); setFecha(""); setHora(""); setNombre(""); setTelefono(""); }}
              className="btn-glow border border-[#c8921a]/50 text-[#c8921a] text-xs tracking-widest uppercase px-8 py-3 hover:bg-[#c8921a] hover:text-[#0f0d0a] transition-all"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Nueva Reserva
            </button>
            <Link
              href="/"
              className="border border-[#5c3a1e] text-[#b8a882] text-xs tracking-widest uppercase px-8 py-3 hover:border-[#c8921a]/50 transition-all"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f0d0a" }}>

      {/* Header */}
      <div className="relative border-b border-[#5c3a1e]/40 px-6 py-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8921a]/60 to-transparent" />
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-none">
            <span className="text-[#c8921a] text-xl font-black tracking-[0.2em]" style={{ fontFamily: "var(--font-cinzel-decorative)" }}>
              INVICTUS
            </span>
            <span className="text-[#b8a882] text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
              Barberia
            </span>
          </Link>
          <h1 className="text-[#f0e6c8] text-lg tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
            Reservar Servicio
          </h1>
          <div className="w-20" />
        </div>
      </div>

      {/* Indicador de pasos */}
      <div className="border-b border-[#5c3a1e]/30 px-6 py-6" style={{ backgroundColor: "#0f0d0a" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-center">
          {[
            { num: 1, label: "Elige Servicio" },
            { num: 2, label: "Elige Maestro" },
            { num: 3, label: "Fecha & Confirmar" },
          ].map((p, i) => (
            <div key={p.num} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 flex items-center justify-center border-2 text-sm font-bold transition-all duration-300 ${
                    paso === p.num
                      ? "border-[#c8921a] bg-[#c8921a] text-[#0f0d0a] shadow-[0_0_14px_rgba(200,146,26,0.6)]"
                      : paso > p.num
                      ? "border-[#c8921a] text-[#c8921a]"
                      : "border-[#5c3a1e] text-[#5c3a1e]"
                  }`}
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {p.num}
                </div>
                <span
                  className={`text-[9px] tracking-widest uppercase whitespace-nowrap ${paso >= p.num ? "text-[#c8921a]" : "text-[#5c3a1e]"}`}
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {p.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-16 md:w-28 h-px mb-5 mx-2 transition-all duration-500 ${paso > p.num ? "bg-[#c8921a]" : "bg-[#5c3a1e]/50"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* ── PASO 1: Servicios ── */}
        {paso === 1 && (
          <div>
            <p className="text-[#b8a882]/70 text-center text-sm italic mb-10" style={{ fontFamily: "var(--font-im-fell)" }}>
              Elige el rito que deseas recibir hoy.
            </p>

            {/* Luz ambiental detrás del grid */}
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(200,146,26,0.07) 0%, transparent 70%)" }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {servicios.map((s) => {
                  const isSelected = servicioId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setServicioId(s.id)}
                      className={`service-card${isSelected ? " selected" : ""} p-6 border text-left`}
                      style={{ backgroundColor: isSelected ? "#2a1c0c" : "#141209" }}
                    >
                      {/* Línea superior brillante */}
                      <div className={`absolute top-0 left-0 right-0 h-px transition-all duration-500
                        ${isSelected
                          ? "bg-gradient-to-r from-transparent via-[#c8921a] to-transparent opacity-100"
                          : "bg-gradient-to-r from-transparent via-[#c8921a]/30 to-transparent opacity-60"
                        }`}
                      />

                      {/* Badge popular */}
                      {s.popular && (
                        <span
                          className="badge-pulse absolute -top-3 left-4 bg-[#c8921a] text-[#0f0d0a] text-[9px] tracking-widest uppercase px-3 py-0.5 font-bold"
                          style={{ fontFamily: "var(--font-cinzel)" }}
                        >
                          El Más Pedido
                        </span>
                      )}

                      {/* Check */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-[#c8921a] flex items-center justify-center"
                          style={{ boxShadow: "0 0 12px rgba(200,146,26,1), 0 0 24px rgba(200,146,26,0.5)" }}>
                          <span className="text-[#0f0d0a] text-xs font-black">✓</span>
                        </div>
                      )}

                      {/* Ícono SVG con glow */}
                      <div className={`icon-glow-idle mb-5 ${isSelected ? "text-[#e8b84b]" : "text-[#c8921a]/65"}`}>
                        <s.Icon active={isSelected} />
                      </div>

                      <h3
                        className={`text-sm font-bold mb-1 transition-colors duration-300 ${isSelected ? "text-[#e8b84b]" : "text-[#f0e6c8]"}`}
                        style={{ fontFamily: "var(--font-cinzel)" }}
                      >
                        {s.nombre}
                      </h3>
                      <p
                        className="text-[#b8a882]/65 text-xs italic leading-relaxed mb-5"
                        style={{ fontFamily: "var(--font-im-fell)" }}
                      >
                        {s.descripcion}
                      </p>
                      <div className={`flex items-center justify-between pt-3 border-t transition-colors duration-300 ${isSelected ? "border-[#c8921a]/50" : "border-[#5c3a1e]/40"}`}>
                        <span
                          className={`font-black text-xl transition-all duration-300 ${isSelected ? "text-[#e8b84b]" : "text-[#c8921a]"}`}
                          style={{
                            fontFamily: "var(--font-cinzel-decorative)",
                            textShadow: isSelected ? "0 0 12px rgba(200,146,26,0.8)" : "none",
                          }}
                        >
                          {s.precio}
                        </span>
                        <span
                          className="text-[#b8a882]/40 text-[9px] uppercase tracking-widest"
                          style={{ fontFamily: "var(--font-cinzel)" }}
                        >
                          {s.duracion}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => servicioId && setPaso(2)}
                disabled={!servicioId}
                className="btn-glow bg-[#c8921a] text-[#0f0d0a] px-12 py-4 text-xs tracking-widest uppercase font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e8b84b]"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 2: Barbero ── */}
        {paso === 2 && (
          <div>
            <p className="text-[#b8a882]/70 text-center text-sm italic mb-10" style={{ fontFamily: "var(--font-im-fell)" }}>
              Elige tu maestro o deja que el destino decida.
            </p>

            <div className="relative">
              {/* Luz ambiental detrás del grid */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(200,146,26,0.07) 0%, transparent 70%)" }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                {barberos.map((b) => {
                  const isSelected = barberoId === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setBarberoId(b.id)}
                      className={`service-card${isSelected ? " selected" : ""} p-6 border text-center`}
                      style={{ backgroundColor: isSelected ? "#2a1c0c" : "#141209" }}
                    >
                      {/* Línea superior brillante */}
                      <div className={`absolute top-0 left-0 right-0 h-px transition-all duration-500
                        ${isSelected
                          ? "bg-gradient-to-r from-transparent via-[#c8921a] to-transparent opacity-100"
                          : "bg-gradient-to-r from-transparent via-[#c8921a]/30 to-transparent opacity-60"
                        }`}
                      />

                      {/* Check */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-[#c8921a] flex items-center justify-center"
                          style={{ boxShadow: "0 0 12px rgba(200,146,26,1), 0 0 24px rgba(200,146,26,0.5)" }}>
                          <span className="text-[#0f0d0a] text-xs font-black">✓</span>
                        </div>
                      )}

                      {/* Runa */}
                      <span
                        className={`icon-glow-idle text-5xl block mb-4 transition-all duration-300 ${isSelected ? "text-[#e8b84b]" : "text-[#c8921a]/55"}`}
                        style={{ textShadow: isSelected ? "0 0 16px rgba(200,146,26,0.9), 0 0 32px rgba(200,146,26,0.4)" : "none" }}
                      >
                        {b.rune}
                      </span>

                      <p
                        className={`text-sm font-bold mb-1 transition-colors duration-300 ${isSelected ? "text-[#e8b84b]" : "text-[#f0e6c8]"}`}
                        style={{
                          fontFamily: "var(--font-cinzel)",
                          textShadow: isSelected ? "0 0 10px rgba(200,146,26,0.6)" : "none",
                        }}
                      >
                        {b.name}
                      </p>
                      <p
                        className={`text-[10px] uppercase tracking-widest transition-colors duration-300 ${isSelected ? "text-[#c8921a]/80" : "text-[#b8a882]/40"}`}
                        style={{ fontFamily: "var(--font-cinzel)" }}
                      >
                        {b.specialty}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setPaso(1)} className="border border-[#5c3a1e] text-[#b8a882] px-8 py-3 text-xs tracking-widest uppercase hover:border-[#c8921a]/50 transition-all" style={{ fontFamily: "var(--font-cinzel)" }}>
                ← Atrás
              </button>
              <button
                onClick={() => barberoId !== null && setPaso(3)}
                disabled={barberoId === null}
                className="btn-glow bg-[#c8921a] text-[#0f0d0a] px-12 py-4 text-xs tracking-widest uppercase font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e8b84b]"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 3: Fecha y confirmación ── */}
        {paso === 3 && (
          <div className="relative">

            {/* Luz ambiental de fondo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(200,146,26,0.06) 0%, transparent 70%)" }}
            />

            {/* Resumen con glow */}
            <div
              className="relative border p-5 mb-8 flex flex-wrap gap-8 overflow-hidden"
              style={{
                backgroundColor: "#141209",
                borderColor: "rgba(200,146,26,0.45)",
                boxShadow: "0 0 20px rgba(200,146,26,0.08), inset 0 0 20px rgba(200,146,26,0.04)",
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8921a] to-transparent" />
              <div>
                <span className="text-[#c8921a]/70 text-[9px] uppercase tracking-widest block mb-1" style={{ fontFamily: "var(--font-cinzel)" }}>Servicio</span>
                <span className="text-[#e8b84b] text-sm font-bold" style={{ fontFamily: "var(--font-cinzel)", textShadow: "0 0 8px rgba(200,146,26,0.5)" }}>
                  {servicio?.nombre} — {servicio?.precio}
                </span>
              </div>
              <div>
                <span className="text-[#c8921a]/70 text-[9px] uppercase tracking-widest block mb-1" style={{ fontFamily: "var(--font-cinzel)" }}>Maestro</span>
                <span className="text-[#e8b84b] text-sm font-bold" style={{ fontFamily: "var(--font-cinzel)", textShadow: "0 0 8px rgba(200,146,26,0.5)" }}>
                  {barbero?.name}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative">

              {/* Fecha */}
              <div>
                <label
                  className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2"
                  style={{ fontFamily: "var(--font-cinzel)", textShadow: "0 0 6px rgba(200,146,26,0.4)" }}
                >
                  Fecha
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 text-[#f0e6c8] focus:outline-none transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    colorScheme: "dark",
                    backgroundColor: "#141209",
                    border: fecha ? "1px solid rgba(200,146,26,0.7)" : "1px solid rgba(92,58,30,0.6)",
                    boxShadow: fecha
                      ? "0 0 16px rgba(200,146,26,0.2), inset 0 0 12px rgba(200,146,26,0.05)"
                      : "inset 0 0 6px rgba(0,0,0,0.3)",
                  }}
                />
              </div>

              {/* Hora */}
              <div>
                <label
                  className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2"
                  style={{ fontFamily: "var(--font-cinzel)", textShadow: "0 0 6px rgba(200,146,26,0.4)" }}
                >
                  Hora
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {horas.map((h) => {
                    const isHora = hora === h;
                    return (
                      <button
                        key={h}
                        onClick={() => setHora(h)}
                        className="service-card py-2.5 text-xs border text-center transition-all duration-200"
                        style={{
                          fontFamily: "var(--font-cinzel)",
                          backgroundColor: isHora ? "#c8921a" : "#141209",
                          borderColor: isHora ? "#c8921a" : "rgba(92,58,30,0.5)",
                          color: isHora ? "#0f0d0a" : "#b8a882",
                          fontWeight: isHora ? "700" : "400",
                          boxShadow: isHora
                            ? "0 0 18px rgba(200,146,26,0.7), 0 0 40px rgba(200,146,26,0.25), inset 0 0 10px rgba(255,220,100,0.2)"
                            : undefined,
                          textShadow: isHora ? "0 0 6px rgba(0,0,0,0.5)" : "none",
                        }}
                      >
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label
                  className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2"
                  style={{ fontFamily: "var(--font-cinzel)", textShadow: "0 0 6px rgba(200,146,26,0.4)" }}
                >
                  Tu Nombre
                </label>
                <input
                  type="text"
                  placeholder="Nombre del guerrero"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-3 text-[#f0e6c8] focus:outline-none transition-all duration-300 placeholder:text-[#5c3a1e]/80"
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    backgroundColor: "#141209",
                    border: nombre ? "1px solid rgba(200,146,26,0.7)" : "1px solid rgba(92,58,30,0.6)",
                    boxShadow: nombre
                      ? "0 0 16px rgba(200,146,26,0.2), inset 0 0 12px rgba(200,146,26,0.05)"
                      : "inset 0 0 6px rgba(0,0,0,0.3)",
                  }}
                />
              </div>

              {/* Teléfono */}
              <div>
                <label
                  className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2"
                  style={{ fontFamily: "var(--font-cinzel)", textShadow: "0 0 6px rgba(200,146,26,0.4)" }}
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  placeholder="Número de contacto"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full px-4 py-3 text-[#f0e6c8] focus:outline-none transition-all duration-300 placeholder:text-[#5c3a1e]/80"
                  style={{
                    fontFamily: "var(--font-cinzel)",
                    backgroundColor: "#141209",
                    border: telefono ? "1px solid rgba(200,146,26,0.7)" : "1px solid rgba(92,58,30,0.6)",
                    boxShadow: telefono
                      ? "0 0 16px rgba(200,146,26,0.2), inset 0 0 12px rgba(200,146,26,0.05)"
                      : "inset 0 0 6px rgba(0,0,0,0.3)",
                  }}
                />
              </div>
            </div>

            <p className="text-[#b8a882]/50 text-xs text-center italic mb-10" style={{ fontFamily: "var(--font-im-fell)" }}>
              Sin registro. Sin contraseña. Solo tu nombre y número.
            </p>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setPaso(2)}
                className="border border-[#5c3a1e] text-[#b8a882] px-8 py-3 text-xs tracking-widest uppercase hover:border-[#c8921a]/50 hover:text-[#c8921a] transition-all duration-300"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                ← Atrás
              </button>
              <button
                onClick={() => { if (fecha && hora && nombre && telefono) setConfirmado(true); }}
                disabled={!fecha || !hora || !nombre || !telefono}
                className="btn-glow relative px-14 py-4 text-xs tracking-[0.3em] uppercase font-bold disabled:opacity-25 disabled:cursor-not-allowed transition-all duration-300"
                style={{
                  fontFamily: "var(--font-cinzel)",
                  backgroundColor: (!fecha || !hora || !nombre || !telefono) ? "#5c3a1e" : "#c8921a",
                  color: (!fecha || !hora || !nombre || !telefono) ? "#b8a882" : "#0f0d0a",
                  boxShadow: (!fecha || !hora || !nombre || !telefono)
                    ? "none"
                    : "0 0 28px rgba(200,146,26,0.7), 0 0 60px rgba(200,146,26,0.3), inset 0 0 20px rgba(255,220,100,0.15)",
                }}
              >
                Sellar el Pacto ᚢ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[#c8921a] text-[9px] uppercase tracking-widest block mb-0.5" style={{ fontFamily: "var(--font-cinzel)" }}>{label}</span>
      <span className="text-[#f0e6c8] text-sm" style={{ fontFamily: "var(--font-cinzel)" }}>{value}</span>
    </div>
  );
}
