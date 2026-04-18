"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSession, saveReservation } from "@/lib/auth";

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

/* ── Iconos por índice (rotación) ─────────────────────── */
const ICONS = [IconScissors, IconRazorBlade, IconCombScissors, IconBeard, IconChildScissors, IconCrown];

interface Barbero { id: number; name: string; specialty: string; rune: string; }
interface DbService { id: number; name: string; price: string; duration_min: number; description: string; }

const horas = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

/* ── Página principal ────────────────────────────────── */

export default function ReservarPage() {
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [servicioId, setServicioId] = useState<number | null>(null);
  const [barberoId, setBarberoId] = useState<number | null>(null);
  const [servicios, setServicios] = useState<DbService[]>([]);
  const [barberos, setBarberos] = useState<Barbero[]>([
    { id: 0, name: "El que más pronto me pueda atender", specialty: "Cualquier maestro disponible", rune: "᛭" },
  ]);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [sessionNombre, setSessionNombre] = useState<string>("");
  const [pedirLogin, setPedirLogin] = useState(false);
  const [errorReserva, setErrorReserva] = useState("");
  const [horasOcupadas, setHorasOcupadas] = useState<string[]>([]);

  // Cargar servicios y barberos desde la DB
  useEffect(() => {
    fetch("/api/services").then(r => r.json()).then((data: DbService[]) => { if (Array.isArray(data)) setServicios(data); }).catch(() => {});
    fetch("/api/barbers").then(r => r.json()).then(data => { if (Array.isArray(data) && data.length > 0) setBarberos(data); }).catch(() => {});
  }, []);

  useEffect(() => {
    getSession().then((s) => {
      if (s) {
        setSessionEmail(s.email);
        setSessionNombre(s.name);
        if (!nombre) setNombre(s.name);
      }
    });
  }, []);

  // Cargar horas ocupadas desde la DB cuando cambia barbero o fecha
  useEffect(() => {
    const barberoNombre = barberos.find(b => b.id === barberoId)?.name ?? "";
    const esEspecifico  = barberoNombre && barberoNombre !== "El que más pronto me pueda atender";
    if (!esEspecifico || !fecha) { setHorasOcupadas([]); return; }
    fetch(`/api/reservations/check?barbero=${encodeURIComponent(barberoNombre)}&fecha=${fecha}`)
      .then(r => r.json())
      .then(setHorasOcupadas)
      .catch(() => setHorasOcupadas([]));
  }, [barberoId, fecha]);

  const servicio = servicios.find((s) => s.id === servicioId);
  const barbero  = barberos.find((b) => b.id === barberoId);

  /* Pantalla de confirmación */
  if (confirmado) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#080604" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,146,26,0.15) 0%, transparent 65%)" }} />
        <div style={{ textAlign: "center", maxWidth: "560px", width: "100%", position: "relative" }}>
          <div style={{ color: "#c8921a", width: "72px", height: "72px", margin: "0 auto 24px" }}>
            <IconCrown active={true} />
          </div>
          <h2 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 900, color: "#f5ead0", textShadow: "0 0 60px rgba(200,146,26,0.5)", marginBottom: "16px" }}>
            ¡Pacto Sellado!
          </h2>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1.1rem", color: "rgba(184,168,138,0.7)", marginBottom: "36px", fontStyle: "italic" }}>
            Tu silla en el salón te espera.
          </p>
          <div style={{ border: "1px solid rgba(200,146,26,0.4)", padding: "32px", textAlign: "left", backgroundColor: "#0e0b07", marginBottom: "32px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #c8921a 30%, #e8b84b 50%, #c8921a 70%, transparent)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Row label="Servicio"  value={`${servicio?.name} — ${servicio?.price}`} />
              <Row label="Maestro"   value={barbero?.name ?? ""} />
              <Row label="Fecha"     value={`${fecha} a las ${hora}`} />
              <Row label="Nombre"    value={nombre} />
              <Row label="Teléfono"  value={telefono} />
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.35)", marginBottom: "28px", letterSpacing: "0.1em" }}>
            Te contactaremos para confirmar tu cita.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { setConfirmado(false); setPaso(1); setServicioId(null); setBarberoId(null); setFecha(""); setHora(""); setNombre(""); setTelefono(""); }}
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, color: "#c8921a", border: "1px solid rgba(200,146,26,0.5)", backgroundColor: "transparent", padding: "14px 28px", cursor: "pointer" }}>
              Nueva Reserva
            </button>
            <Link href="/perfil"
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, color: "#080604", background: "linear-gradient(135deg, #a06010, #c8921a, #f0c040, #c8921a, #a06010)", padding: "14px 28px", display: "inline-block", boxShadow: "0 0 30px rgba(200,146,26,0.4)" }}>
              Ver mis citas
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stepTitles = ["", "Echale un Ojo a Nuestros Servicios", "Puedes Seleccionar tu Barbero", "Confírmanos tu Asistencia"];
  const stepSubs   = ["", "¿Qué servicio deseas recibir hoy?", "¿Con quién quieres vivir la experiencia?", "Elige fecha, hora y confirma tu cita."];

  /* Modal: pedir cuenta para confirmar */
  if (pedirLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#080604" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,146,26,0.12) 0%, transparent 65%)" }} />
        <div style={{ textAlign: "center", maxWidth: "520px", width: "100%", position: "relative" }}>

          {/* Ícono */}
          <div style={{ fontSize: "3rem", color: "#c8921a", marginBottom: "24px" }}>ᚠ</div>

          <h2 style={{
            fontFamily: "var(--font-cinzel-decorative)",
            fontSize: "clamp(1.6rem, 5vw, 2.8rem)",
            fontWeight: 900, color: "#f5ead0",
            textShadow: "0 0 50px rgba(200,146,26,0.4)",
            marginBottom: "16px",
          }}>
            Un último paso
          </h2>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "20px" }}>
            <div style={{ height: "1px", width: "60px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.7))" }} />
            <span style={{ color: "#c8921a" }}>᛭</span>
            <div style={{ height: "1px", width: "60px", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.7))" }} />
          </div>

          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1rem", color: "rgba(184,168,138,0.7)", lineHeight: 1.8, marginBottom: "36px" }}>
            Para confirmar tu reserva necesitas una cuenta.<br />
            Es rápido, gratis y solo lo harás una vez.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px", alignItems: "center" }}>
            <Link href="/login"
              style={{
                fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 900,
                letterSpacing: "0.45em", textTransform: "uppercase",
                padding: "18px 52px", display: "block", width: "100%", textAlign: "center",
                background: "linear-gradient(135deg, #a06010, #c8921a, #f0c040, #c8921a, #a06010)",
                color: "#080604",
                boxShadow: "0 0 40px rgba(200,146,26,0.5), 0 0 80px rgba(200,146,26,0.2)",
              }}>
              Crear Cuenta / Iniciar Sesión
            </Link>
            <button
              type="button" onClick={() => setPedirLogin(false)}
              style={{
                fontFamily: "var(--font-barlow)", fontSize: "0.75rem", fontWeight: 600,
                letterSpacing: "0.35em", textTransform: "uppercase",
                padding: "14px 32px", backgroundColor: "transparent",
                border: "1px solid rgba(92,58,30,0.5)", color: "rgba(184,168,138,0.5)",
                cursor: "pointer", width: "100%",
              }}>
              ← Volver a mi reserva
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080604", paddingTop: "100px" }}>

      {/* Glow fondo */}
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(200,146,26,0.1) 0%, transparent 65%)" }} />

      {/* ── HERO SECTION ── */}
      <div style={{ textAlign: "center", padding: "48px 24px 56px", position: "relative" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.7em", textTransform: "uppercase", color: "#c8921a", marginBottom: "20px" }}>
          — Tu Experiencia Comienza Aquí —
        </p>
        <h1 style={{
          fontFamily: "var(--font-cinzel-decorative)",
          fontSize: "clamp(2.4rem, 7vw, 5.5rem)",
          fontWeight: 900,
          color: "#f5ead0",
          textAlign: "center",
          lineHeight: 1.1,
          textShadow: "0 0 80px rgba(200,146,26,0.55), 0 0 30px rgba(200,146,26,0.25), 0 3px 6px rgba(0,0,0,0.9)",
          letterSpacing: "0.04em",
          marginBottom: "24px",
        }}>
          Ven y Vívete la Experiencia
        </h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.8))" }} />
          <span style={{ color: "#c8921a", fontSize: "1.3rem" }}>᛭</span>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.8))" }} />
        </div>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "clamp(0.9rem, 2vw, 1.1rem)", color: "rgba(184,168,138,0.6)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.8 }}>
          Tres pasos. Una experiencia que no olvidarás.
        </p>
      </div>

      {/* ── PASOS INDICATOR ── */}
      <div style={{ borderTop: "1px solid rgba(92,58,30,0.3)", borderBottom: "1px solid rgba(92,58,30,0.3)", padding: "24px 24px", backgroundColor: "rgba(14,11,7,0.8)" }}>
        <div style={{ maxWidth: "700px", width: "100%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[
            { num: 1, label: "Servicio" },
            { num: 2, label: "Maestro" },
            { num: 3, label: "Confirmar" },
          ].map((p, i) => (
            <div key={p.num} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: "44px", height: "44px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: paso === p.num ? "2px solid #c8921a" : paso > p.num ? "2px solid rgba(200,146,26,0.6)" : "2px solid rgba(92,58,30,0.5)",
                  backgroundColor: paso === p.num ? "#c8921a" : "transparent",
                  color: paso === p.num ? "#080604" : paso > p.num ? "#c8921a" : "rgba(92,58,30,0.7)",
                  fontFamily: "var(--font-barlow)", fontSize: "1rem", fontWeight: 800,
                  boxShadow: paso === p.num ? "0 0 20px rgba(200,146,26,0.7), 0 0 40px rgba(200,146,26,0.3)" : "none",
                  transition: "all 0.4s",
                }}>
                  {p.num}
                </div>
                <span style={{
                  fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em",
                  textTransform: "uppercase", whiteSpace: "nowrap",
                  color: paso >= p.num ? "#c8921a" : "rgba(92,58,30,0.6)",
                }}>
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
      <div style={{ maxWidth: "960px", width: "100%", margin: "0 auto", padding: "56px 24px 80px" }}>

        {/* Título dramático del paso actual */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{
            fontFamily: "var(--font-cinzel-decorative)",
            fontSize: "clamp(1.6rem, 4.5vw, 3rem)",
            fontWeight: 900,
            color: "#f5ead0",
            textShadow: "0 0 50px rgba(200,146,26,0.4), 0 2px 4px rgba(0,0,0,0.8)",
            marginBottom: "12px",
            letterSpacing: "0.04em",
          }}>
            {stepTitles[paso]}
          </h2>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "clamp(0.85rem, 1.8vw, 1rem)", color: "rgba(184,168,138,0.5)", letterSpacing: "0.1em" }}>
            {stepSubs[paso]}
          </p>
        </div>

        {/* ── PASO 1: Servicios ── */}
        {paso === 1 && (
          <div>

            {/* Luz ambiental detrás del grid */}
            <div className="relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(200,146,26,0.07) 0%, transparent 70%)" }}
              />

              {servicios.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(184,168,138,0.3)", fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.3em" }}>
                  CARGANDO SERVICIOS...
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
                {servicios.map((s, idx) => {
                  const isSelected = servicioId === s.id;
                  const Icon = ICONS[idx % ICONS.length];
                  return (
                    <button
                      key={s.id}
                      onClick={() => { setServicioId(s.id); setTimeout(() => setPaso(2), 280); }}
                      className={`service-card${isSelected ? " selected" : ""} p-6 border text-left`}
                      style={{ backgroundColor: isSelected ? "#2a1c0c" : "#141209" }}
                    >
                      <div className={`absolute top-0 left-0 right-0 h-px transition-all duration-500
                        ${isSelected
                          ? "bg-gradient-to-r from-transparent via-[#c8921a] to-transparent opacity-100"
                          : "bg-gradient-to-r from-transparent via-[#c8921a]/30 to-transparent opacity-60"
                        }`}
                      />
                      <div className={`icon-glow-idle mb-4 ${isSelected ? "text-[#e8b84b]" : "text-[#c8921a]/65"}`}>
                        <Icon active={isSelected} />
                      </div>

                      <p className={`font-bold mb-1 transition-colors duration-300 ${isSelected ? "text-[#e8b84b]" : "text-[#f0e6c8]"}`}
                        style={{ fontFamily: "var(--font-oswald)", fontSize: "1.05rem", textShadow: isSelected ? "0 0 10px rgba(200,146,26,0.6)" : "none" }}>
                        {s.name}
                      </p>
                      {s.description && (
                        <p className="text-[#b8a882]/50 text-xs leading-relaxed mb-3" style={{ fontFamily: "var(--font-lato)" }}>
                          {s.description}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <span className={`font-black text-lg ${isSelected ? "text-[#e8b84b]" : "text-[#c8921a]"}`}
                          style={{ fontFamily: "var(--font-barlow)" }}>
                          {s.price}
                        </span>
                        <span className="text-[#b8a882]/35 text-[10px] tracking-wider" style={{ fontFamily: "var(--font-barlow)" }}>
                          {s.duration_min} min
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── PASO 2: Barbero ── */}
        {paso === 2 && (
          <div>
            <p className="text-[#b8a882]/70 text-center text-sm italic mb-10" style={{ fontFamily: "var(--font-lato)" }}>
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
                          fontFamily: "var(--font-oswald)",
                          textShadow: isSelected ? "0 0 10px rgba(200,146,26,0.6)" : "none",
                        }}
                      >
                        {b.name}
                      </p>
                      <p
                        className={`text-[10px] uppercase tracking-widest transition-colors duration-300 ${isSelected ? "text-[#c8921a]/80" : "text-[#b8a882]/40"}`}
                        style={{ fontFamily: "var(--font-barlow)" }}
                      >
                        {b.specialty}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <button type="button" onClick={() => setPaso(1)}
                style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", padding: "16px 32px", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.5)", color: "rgba(184,168,138,0.6)", cursor: "pointer" }}>
                ← Atrás
              </button>
              <button
                type="button"
                onClick={() => barberoId !== null && setPaso(3)}
                disabled={barberoId === null}
                style={{
                  fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 800,
                  letterSpacing: "0.4em", textTransform: "uppercase",
                  padding: "18px 48px", border: "none", cursor: barberoId === null ? "not-allowed" : "pointer",
                  background: barberoId === null ? "rgba(92,58,30,0.4)" : "linear-gradient(135deg, #a06010, #c8921a, #f0c040, #c8921a, #a06010)",
                  color: barberoId === null ? "rgba(184,168,138,0.3)" : "#080604",
                  boxShadow: barberoId === null ? "none" : "0 0 40px rgba(200,146,26,0.5), 0 0 80px rgba(200,146,26,0.2)",
                }}
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
                <span className="text-[#c8921a]/70 text-[9px] uppercase tracking-widest block mb-1" style={{ fontFamily: "var(--font-barlow)" }}>Servicio</span>
                <span className="text-[#e8b84b] text-sm font-bold" style={{ fontFamily: "var(--font-barlow)", textShadow: "0 0 8px rgba(200,146,26,0.5)" }}>
                  {servicio?.name} — {servicio?.price}
                </span>
              </div>
              <div>
                <span className="text-[#c8921a]/70 text-[9px] uppercase tracking-widest block mb-1" style={{ fontFamily: "var(--font-barlow)" }}>Maestro</span>
                <span className="text-[#e8b84b] text-sm font-bold" style={{ fontFamily: "var(--font-barlow)", textShadow: "0 0 8px rgba(200,146,26,0.5)" }}>
                  {barbero?.name}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 relative">

              {/* Fecha */}
              <div>
                <label
                  className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2"
                  style={{ fontFamily: "var(--font-barlow)", textShadow: "0 0 6px rgba(200,146,26,0.4)" }}
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
                    fontFamily: "var(--font-barlow)",
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
                  style={{ fontFamily: "var(--font-barlow)", textShadow: "0 0 6px rgba(200,146,26,0.4)" }}
                >
                  Hora
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {horas.map((h) => {
                    const isHora  = hora === h;
                    const ocupada = horasOcupadas.includes(h);
                    return (
                      <button
                        key={h}
                        onClick={() => { if (!ocupada) setHora(h); }}
                        disabled={ocupada}
                        title={ocupada ? "Hora no disponible" : h}
                        className="service-card py-2.5 text-xs border text-center transition-all duration-200"
                        style={{
                          fontFamily: "var(--font-barlow)",
                          backgroundColor: ocupada ? "rgba(239,68,68,0.05)" : isHora ? "#c8921a" : "#141209",
                          borderColor: ocupada ? "rgba(239,68,68,0.2)" : isHora ? "#c8921a" : "rgba(92,58,30,0.5)",
                          color: ocupada ? "rgba(239,68,68,0.35)" : isHora ? "#0f0d0a" : "#b8a882",
                          fontWeight: isHora ? "700" : "400",
                          cursor: ocupada ? "not-allowed" : "pointer",
                          textDecoration: ocupada ? "line-through" : "none",
                          boxShadow: isHora
                            ? "0 0 22px rgba(200,146,26,0.95), 0 0 50px rgba(200,146,26,0.45), 0 0 90px rgba(200,146,26,0.18), 0 6px 18px rgba(0,0,0,0.85), inset 0 0 18px rgba(255,220,100,0.12), inset 0 1px 0 rgba(255,220,100,0.3)"
                            : undefined,
                          textShadow: isHora ? "0 0 6px rgba(0,0,0,0.5)" : "none",
                        }}
                      >
                        {ocupada ? "—" : h}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label
                  className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2"
                  style={{ fontFamily: "var(--font-barlow)", textShadow: "0 0 6px rgba(200,146,26,0.4)" }}
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
                    fontFamily: "var(--font-barlow)",
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
                  style={{ fontFamily: "var(--font-barlow)", textShadow: "0 0 6px rgba(200,146,26,0.4)" }}
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
                    fontFamily: "var(--font-barlow)",
                    backgroundColor: "#141209",
                    border: telefono ? "1px solid rgba(200,146,26,0.7)" : "1px solid rgba(92,58,30,0.6)",
                    boxShadow: telefono
                      ? "0 0 16px rgba(200,146,26,0.2), inset 0 0 12px rgba(200,146,26,0.05)"
                      : "inset 0 0 6px rgba(0,0,0,0.3)",
                  }}
                />
              </div>
            </div>

            <p className="text-[#b8a882]/50 text-xs text-center italic mb-10" style={{ fontFamily: "var(--font-lato)" }}>
              Sin registro. Sin contraseña. Solo tu nombre y número.
            </p>

            {errorReserva && (
              <div style={{ marginBottom: "16px", padding: "12px 16px", backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: "0.8rem", fontFamily: "var(--font-barlow)" }}>
                ⚠ {errorReserva}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <button type="button" onClick={() => setPaso(2)}
                style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", padding: "16px 32px", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.5)", color: "rgba(184,168,138,0.6)", cursor: "pointer" }}>
                ← Atrás
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (fecha && hora && nombre && telefono) {
                    if (!sessionEmail) {
                      setPedirLogin(true);
                      return;
                    }
                    if (servicio && barbero) {
                      try {
                        await saveReservation(sessionEmail, sessionNombre, { servicio: servicio.name, precio: servicio.price, barbero: barbero.name, fecha, hora });
                        setErrorReserva("");
                        setConfirmado(true);
                      } catch (e) {
                        setErrorReserva((e as Error).message);
                        return;
                      }
                    } else {
                      setConfirmado(true);
                    }
                  }
                }}
                disabled={!fecha || !hora || !nombre || !telefono}
                style={{
                  fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 900,
                  letterSpacing: "0.4em", textTransform: "uppercase",
                  padding: "20px 52px", border: "none",
                  cursor: (!fecha || !hora || !nombre || !telefono) ? "not-allowed" : "pointer",
                  background: (!fecha || !hora || !nombre || !telefono) ? "rgba(92,58,30,0.35)" : "linear-gradient(135deg, #a06010, #c8921a, #f0c040, #c8921a, #a06010)",
                  color: (!fecha || !hora || !nombre || !telefono) ? "rgba(184,168,138,0.25)" : "#080604",
                  boxShadow: (!fecha || !hora || !nombre || !telefono) ? "none" : "0 0 50px rgba(200,146,26,0.6), 0 0 100px rgba(200,146,26,0.25), 0 8px 30px rgba(0,0,0,0.6)",
                }}
              >
                Confirmar Asistencia ᚢ
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
      <span className="text-[#c8921a] text-[9px] uppercase tracking-widest block mb-0.5" style={{ fontFamily: "var(--font-barlow)" }}>{label}</span>
      <span className="text-[#f0e6c8] text-sm" style={{ fontFamily: "var(--font-barlow)" }}>{value}</span>
    </div>
  );
}
