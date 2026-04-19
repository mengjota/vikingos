"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

/* ── Iconos SVG ────────────────────────────────────────── */
const IconScissors = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
    <circle cx="7" cy="7" r="3.5" /><line x1="10" y1="9.5" x2="27" y2="26" />
    <g className={active ? "animate-scissors-blade" : ""} style={{ transformOrigin: "7px 25px" }}>
      <circle cx="7" cy="25" r="3.5" /><line x1="10" y1="22.5" x2="27" y2="6" />
    </g>
    <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);
const IconRazorBlade = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 overflow-visible">
    <rect x="3" y="11" width="26" height="10" rx="1.5" /><line x1="3" y1="14" x2="29" y2="14" strokeWidth="1" opacity="0.5" />
    <rect x="13" y="13" width="6" height="6" rx="0.5" />
    <line x1="8" y1="11" x2="8" y2="21" strokeWidth="1" opacity="0.4" /><line x1="24" y1="11" x2="24" y2="21" strokeWidth="1" opacity="0.4" />
    {active && <line x1="6" y1="13" x2="11" y2="19" className="animate-razor-gleam" stroke="#f0e6c8" strokeWidth="1.5" opacity="0.7" />}
  </svg>
);
const IconCombScissors = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
    <g className={active ? "animate-comb" : ""}><rect x="2" y="14" width="16" height="4" rx="1" /><line x1="5" y1="14" x2="5" y2="10" /><line x1="8" y1="14" x2="8" y2="10" /><line x1="11" y1="14" x2="11" y2="10" /><line x1="14" y1="14" x2="14" y2="10" /></g>
    <circle cx="24" cy="10" r="2.5" /><circle cx="24" cy="22" r="2.5" /><line x1="26" y1="11.8" x2="30" y2="20" /><line x1="26" y1="20.2" x2="30" y2="12" /><circle cx="28" cy="16" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);
const IconBeard = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`w-12 h-12 ${active ? "animate-beard" : ""}`}>
    <circle cx="16" cy="9" r="5" /><path d="M6 30 C6 22 10 20 16 20 C22 20 26 22 26 30" />
    <path d="M10 14 C10 19 13 22 16 22 C19 22 22 19 22 14" /><line x1="16" y1="20" x2="16" y2="23" /><line x1="13" y1="21" x2="12" y2="24" /><line x1="19" y1="21" x2="20" y2="24" />
  </svg>
);
const IconCrown = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`w-12 h-12 ${active ? "animate-crown" : ""}`}>
    <rect x="4" y="22" width="24" height="4" rx="1" /><path d="M4 22 L4 12 L10 17 L16 6 L22 17 L28 12 L28 22" />
    <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="16" cy="6" r="1.5" fill="currentColor" stroke="none" /><circle cx="28" cy="12" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);
const IconChildScissors = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`w-12 h-12 ${active ? "animate-bounce-soft" : ""}`}>
    <circle cx="8" cy="8" r="3" /><circle cx="8" cy="20" r="3" /><line x1="10.5" y1="10" x2="26" y2="24" /><line x1="10.5" y1="18" x2="26" y2="8" /><circle cx="17" cy="16" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const ICONS = [IconScissors, IconRazorBlade, IconCombScissors, IconBeard, IconCrown, IconChildScissors];

/* ── Tipos ─────────────────────────────────────────────── */
interface BarberoScheduleDay { day_of_week: number; is_working: boolean; }
interface Barbero { id: number; name: string; specialty: string; rune: string; schedule: BarberoScheduleDay[] | null; }
interface DbService { id: number; name: string; price: string; duration_min: number; description: string; }
interface DaySchedule { day_of_week: number; active: boolean; }

const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAY_LABELS  = ["Lu","Ma","Mi","Ju","Vi","Sá","Do"];

/* ── Helpers de calendario ──────────────────────────────── */
function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function todayISO() { return toISO(new Date()); }

/* ── Componente calendario ─────────────────────────────── */
function MiniCal({ value, onChange, schedule, barberSchedule }: {
  value: string;
  onChange: (d: string) => void;
  schedule: DaySchedule[];
  barberSchedule?: { day_of_week: number; is_working: boolean }[] | null;
}) {
  const [month, setMonth] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  const today = todayISO();

  const firstDow = (month.getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  function isOpen(day: number) {
    const date = new Date(month.getFullYear(), month.getMonth(), day);
    const dow = date.getDay();
    const shopCfg = schedule.find(s => s.day_of_week === dow);
    const shopOpen = shopCfg ? shopCfg.active : dow !== 0;
    if (!shopOpen) return false;
    if (barberSchedule) {
      const barberCfg = barberSchedule.find(s => s.day_of_week === dow);
      return barberCfg ? barberCfg.is_working : dow !== 0;
    }
    return true;
  }
  function isPast(day: number) {
    const iso = toISO(new Date(month.getFullYear(), month.getMonth(), day));
    return iso < today;
  }
  function isoOf(day: number) {
    return toISO(new Date(month.getFullYear(), month.getMonth(), day));
  }

  return (
    <div>
      {/* Navegación de mes */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          style={{ background: "none", border: "1px solid rgba(92,58,30,0.4)", color: "rgba(184,168,138,0.6)", cursor: "pointer", padding: "6px 12px", fontFamily: "var(--font-barlow)", fontSize: "0.85rem" }}>
          ‹
        </button>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 700, color: "#f0e6c8", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {MONTH_NAMES[month.getMonth()]} {month.getFullYear()}
        </p>
        <button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          style={{ background: "none", border: "1px solid rgba(92,58,30,0.4)", color: "rgba(184,168,138,0.6)", cursor: "pointer", padding: "6px 12px", fontFamily: "var(--font-barlow)", fontSize: "0.85rem" }}>
          ›
        </button>
      </div>

      {/* Cabecera días */}
      <div className="cal-grid" style={{ marginBottom: "4px" }}>
        {DAY_LABELS.map(d => (
          <div key={d} style={{ textAlign: "center", fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(200,146,26,0.5)", paddingBottom: "4px" }}>{d}</div>
        ))}
      </div>

      {/* Grid días */}
      <div className="cal-grid">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const iso = isoOf(day);
          const past = isPast(day);
          const open = isOpen(day);
          const selected = iso === value;
          const disabled = past || !open;

          return (
            <button key={i} onClick={() => !disabled && onChange(iso)} disabled={disabled}
              style={{
                height: "40px",
                fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: selected ? 800 : 400,
                border: selected ? "1px solid #c8921a" : open && !past ? "1px solid rgba(92,58,30,0.3)" : "1px solid transparent",
                backgroundColor: selected ? "#c8921a" : "transparent",
                color: selected ? "#080604" : past ? "rgba(92,58,30,0.3)" : !open ? "rgba(92,58,30,0.25)" : "#b8a882",
                cursor: disabled ? "not-allowed" : "pointer",
                textDecoration: !open && !past ? "line-through" : "none",
                boxShadow: selected ? "0 0 16px rgba(200,146,26,0.6)" : "none",
                transition: "all 0.15s",
                position: "relative",
              }}>
              {day}
              {open && !past && !selected && (
                <span style={{ position: "absolute", bottom: "4px", left: "50%", transform: "translateX(-50%)", width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "rgba(200,146,26,0.5)" }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Página principal ────────────────────────────────── */
export default function ReservarPage() {
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [servicioId, setServicioId] = useState<number | null>(null);
  const [barberoId, setBarberoId] = useState<number | null>(null);
  const [servicios, setServicios] = useState<DbService[]>([]);
  const [barberos, setBarberos] = useState<Barbero[]>([
    { id: 0, name: "El que más pronto me pueda atender", specialty: "Cualquier maestro disponible", rune: "᛭", schedule: null },
  ]);

  const [fecha, setFecha] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [hora, setHora] = useState("");

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [serviciosLoaded, setServiciosLoaded] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [errorReserva, setErrorReserva] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    fetch("/api/services").then(r => r.json()).then((d: DbService[]) => { if (Array.isArray(d)) setServicios(d); }).catch(() => {}).finally(() => setServiciosLoaded(true));
    fetch("/api/barbers").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length > 0) setBarberos(d); }).catch(() => {});
    fetch("/api/availability?schedule=true").then(r => r.json()).then(setSchedule).catch(() => {});
  }, []);

  // Cargar slots cuando cambia fecha o barbero
  const fetchSlots = useCallback(() => {
    if (!fecha) { setSlots([]); return; }
    const b = barberos.find(b => b.id === barberoId);
    const barberoName = b?.name ?? "";
    setSlotsLoading(true);
    fetch(`/api/availability?fecha=${fecha}&barbero=${encodeURIComponent(barberoName)}`)
      .then(r => r.json())
      .then(data => { setSlots(data.slots ?? []); setSlotsLoading(false); })
      .catch(() => { setSlots([]); setSlotsLoading(false); });
  }, [fecha, barberoId, barberos]);

  useEffect(() => { fetchSlots(); setHora(""); }, [fecha, barberoId]);

  const servicio = servicios.find(s => s.id === servicioId);
  const barbero  = barberos.find(b => b.id === barberoId);

  async function confirmar() {
    if (!nombre.trim()) { setErrorReserva("Introduce tu nombre."); return; }
    if (!telefono.trim()) { setErrorReserva("Introduce tu teléfono."); return; }
    if (!fecha) { setErrorReserva("Selecciona una fecha."); return; }
    if (!hora) { setErrorReserva("Selecciona una hora."); return; }
    setSubmitting(true);
    setErrorReserva("");
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clienteNombre: nombre.trim(),
          clienteEmail:  email.trim() || null,
          clientePhone:  telefono.trim(),
          servicio:      servicio?.name ?? "Sin especificar",
          precio:        servicio?.price ?? "—",
          barbero:       barbero?.name ?? "El que más pronto me pueda atender",
          fecha,
          hora,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErrorReserva(d.error ?? `Error ${res.status} al confirmar la reserva.`);
        return;
      }
      setConfirmado(true);
    } catch (_) {
      setErrorReserva("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Confirmación ── */
  if (confirmado) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#080604" }}>
        <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,146,26,0.15) 0%, transparent 65%)" }} />
        <div style={{ textAlign: "center", maxWidth: "560px", width: "100%", position: "relative" }}>
          <div style={{ color: "#c8921a", width: "72px", height: "72px", margin: "0 auto 24px" }}>
            <IconCrown active />
          </div>
          <h2 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(2rem,6vw,3.5rem)", fontWeight: 900, color: "#f5ead0", textShadow: "0 0 60px rgba(200,146,26,0.5)", marginBottom: "16px" }}>
            ¡Pacto Sellado!
          </h2>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1.1rem", color: "rgba(184,168,138,0.7)", marginBottom: "36px", fontStyle: "italic" }}>
            Tu silla en el salón te espera.
          </p>
          <div style={{ border: "1px solid rgba(200,146,26,0.4)", padding: "32px", textAlign: "left", backgroundColor: "#0e0b07", marginBottom: "32px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #c8921a 30%, #e8b84b 50%, #c8921a 70%, transparent)" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Row label="Servicio" value={`${servicio?.name ?? "—"} — ${servicio?.price ?? ""}`} />
              <Row label="Maestro"  value={barbero?.name ?? "El que más pronto me pueda atender"} />
              <Row label="Fecha"    value={`${fecha} a las ${hora}`} />
              <Row label="Nombre"   value={nombre} />
              <Row label="Teléfono" value={telefono} />
              {email && <Row label="Email" value={email} />}
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.35)", marginBottom: "28px", letterSpacing: "0.1em" }}>
            {email ? "Te hemos enviado la confirmación por email. También recibirás un recordatorio el día anterior." : "Te contactaremos para confirmar tu cita."}
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { setConfirmado(false); setPaso(1); setServicioId(null); setBarberoId(null); setFecha(""); setHora(""); setNombre(""); setTelefono(""); setEmail(""); setSlots([]); }}
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, color: "#c8921a", border: "1px solid rgba(200,146,26,0.5)", backgroundColor: "transparent", padding: "14px 28px", cursor: "pointer" }}>
              Nueva Reserva
            </button>
            <Link href="/"
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, color: "#080604", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", padding: "14px 28px", display: "inline-block", boxShadow: "0 0 30px rgba(200,146,26,0.4)", textDecoration: "none" }}>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stepTitles = ["", "¿Qué Servicio Deseas?", "¿Con Quién Quieres la Experiencia?", "Elige tu Momento"];
  const stepSubs   = ["", "Selecciona el servicio que buscas", "Elige tu maestro o deja que el destino decida", "Calendario · Hora · Tus datos"];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080604", paddingTop: "100px" }}>
      <div className="fixed inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(200,146,26,0.1) 0%, transparent 65%)" }} />

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "48px 24px 56px" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.7em", textTransform: "uppercase", color: "#c8921a", marginBottom: "20px" }}>— Tu Experiencia Comienza Aquí —</p>
        <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(2.4rem,7vw,5.5rem)", fontWeight: 900, color: "#f5ead0", lineHeight: 1.1, textShadow: "0 0 80px rgba(200,146,26,0.55)", letterSpacing: "0.04em", marginBottom: "24px" }}>
          Reserva tu Cita
        </h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "16px" }}>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.8))" }} />
          <span style={{ color: "#c8921a", fontSize: "1.3rem" }}>᛭</span>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.8))" }} />
        </div>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", color: "rgba(184,168,138,0.4)", letterSpacing: "0.3em" }}>
          Sin cuenta. Sin contraseña. Solo tu nombre y número.
        </p>
      </div>

      {/* Steps */}
      <div style={{ borderTop: "1px solid rgba(92,58,30,0.3)", borderBottom: "1px solid rgba(92,58,30,0.3)", padding: "24px", backgroundColor: "rgba(14,11,7,0.8)" }}>
        <div className="step-bar" style={{ maxWidth: "600px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {[{ num: 1, label: "Servicio" }, { num: 2, label: "Maestro" }, { num: 3, label: "Confirmar" }].map((p, i) => (
            <div key={p.num} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center",
                  border: paso === p.num ? "2px solid #c8921a" : paso > p.num ? "2px solid rgba(200,146,26,0.6)" : "2px solid rgba(92,58,30,0.5)",
                  backgroundColor: paso === p.num ? "#c8921a" : "transparent",
                  color: paso === p.num ? "#080604" : paso > p.num ? "#c8921a" : "rgba(92,58,30,0.7)",
                  fontFamily: "var(--font-barlow)", fontSize: "1rem", fontWeight: 800,
                  boxShadow: paso === p.num ? "0 0 20px rgba(200,146,26,0.7)" : "none",
                }}>
                  {p.num}
                </div>
                <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: paso >= p.num ? "#c8921a" : "rgba(92,58,30,0.6)" }}>
                  {p.label}
                </span>
              </div>
              {i < 2 && <div className="step-connector" style={{ width: "80px", height: "1px", margin: "0 8px 20px", backgroundColor: paso > p.num ? "#c8921a" : "rgba(92,58,30,0.4)", transition: "background 0.4s" }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: "960px", width: "100%", margin: "0 auto", padding: "56px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.6rem,4.5vw,3rem)", fontWeight: 900, color: "#f5ead0", textShadow: "0 0 50px rgba(200,146,26,0.4)", marginBottom: "12px" }}>
            {stepTitles[paso]}
          </h2>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", color: "rgba(184,168,138,0.5)", letterSpacing: "0.1em" }}>
            {stepSubs[paso]}
          </p>
        </div>

        {/* ── PASO 1: Servicios ── */}
        {paso === 1 && (
          <div>
            {!serviciosLoaded && (
              <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(184,168,138,0.3)", fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.3em" }}>CARGANDO SERVICIOS...</div>
            )}
            {serviciosLoaded && servicios.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0e0b07" }}>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.3)", marginBottom: "8px" }}>Sin servicios disponibles</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", color: "rgba(184,168,138,0.2)" }}>El equipo está configurando el catálogo</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {servicios.map((s, idx) => {
                const isSelected = servicioId === s.id;
                const Icon = ICONS[idx % ICONS.length];
                return (
                  <button key={s.id} onClick={() => { setServicioId(s.id); setTimeout(() => setPaso(2), 280); }}
                    className={`service-card${isSelected ? " selected" : ""} p-6 border text-left`}
                    style={{ backgroundColor: isSelected ? "#2a1c0c" : "#141209" }}>
                    <div className={`absolute top-0 left-0 right-0 h-px ${isSelected ? "bg-gradient-to-r from-transparent via-[#c8921a] to-transparent" : "bg-gradient-to-r from-transparent via-[#c8921a]/30 to-transparent opacity-60"}`} />
                    <div className={`icon-glow-idle mb-4 ${isSelected ? "text-[#e8b84b]" : "text-[#c8921a]/65"}`}><Icon active={isSelected} /></div>
                    <p className={`font-bold mb-1 ${isSelected ? "text-[#e8b84b]" : "text-[#f0e6c8]"}`} style={{ fontFamily: "var(--font-oswald)", fontSize: "1.05rem" }}>{s.name}</p>
                    {s.description && <p className="text-[#b8a882]/50 text-xs leading-relaxed mb-3" style={{ fontFamily: "var(--font-lato)" }}>{s.description}</p>}
                    <div className="flex justify-between items-center mt-2">
                      <span className={`font-black text-lg ${isSelected ? "text-[#e8b84b]" : "text-[#c8921a]"}`} style={{ fontFamily: "var(--font-barlow)" }}>{s.price}</span>
                      <span className="text-[#b8a882]/35 text-[10px] tracking-wider" style={{ fontFamily: "var(--font-barlow)" }}>{s.duration_min} min</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PASO 2: Barbero ── */}
        {paso === 2 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {barberos.map(b => {
                const isSelected = barberoId === b.id;
                return (
                  <button key={b.id} onClick={() => setBarberoId(b.id)}
                    className={`service-card${isSelected ? " selected" : ""} p-6 border text-center`}
                    style={{ backgroundColor: isSelected ? "#2a1c0c" : "#141209" }}>
                    <div className={`absolute top-0 left-0 right-0 h-px ${isSelected ? "bg-gradient-to-r from-transparent via-[#c8921a] to-transparent" : "bg-gradient-to-r from-transparent via-[#c8921a]/30 to-transparent opacity-60"}`} />
                    <span className={`icon-glow-idle text-5xl block mb-4 ${isSelected ? "text-[#e8b84b]" : "text-[#c8921a]/55"}`}>{b.rune}</span>
                    <p className={`text-sm font-bold mb-1 ${isSelected ? "text-[#e8b84b]" : "text-[#f0e6c8]"}`} style={{ fontFamily: "var(--font-oswald)" }}>{b.name}</p>
                    <p className={`text-[10px] uppercase tracking-widest ${isSelected ? "text-[#c8921a]/80" : "text-[#b8a882]/40"}`} style={{ fontFamily: "var(--font-barlow)" }}>{b.specialty}</p>
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
              <button onClick={() => setPaso(1)} style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", padding: "16px 32px", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.5)", color: "rgba(184,168,138,0.6)", cursor: "pointer" }}>← Atrás</button>
              <button onClick={() => barberoId !== null && setPaso(3)} disabled={barberoId === null}
                style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.4em", textTransform: "uppercase", padding: "18px 48px", border: "none", cursor: barberoId === null ? "not-allowed" : "pointer", background: barberoId === null ? "rgba(92,58,30,0.4)" : "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", color: barberoId === null ? "rgba(184,168,138,0.3)" : "#080604", boxShadow: barberoId === null ? "none" : "0 0 40px rgba(200,146,26,0.5)" }}>
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* ── PASO 3: Fecha + Hora + Datos ── */}
        {paso === 3 && (
          <div>
            {/* Resumen */}
            <div style={{ border: "1px solid rgba(200,146,26,0.35)", backgroundColor: "#141209", padding: "20px 24px", marginBottom: "32px", position: "relative", display: "flex", gap: "32px", flexWrap: "wrap" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, #c8921a, transparent)" }} />
              <div><p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,146,26,0.6)", marginBottom: "4px" }}>Servicio</p><p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#e8b84b" }}>{servicio?.name} — {servicio?.price}</p></div>
              <div><p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,146,26,0.6)", marginBottom: "4px" }}>Maestro</p><p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#e8b84b" }}>{barbero?.name}</p></div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", alignItems: "start" }} className="grid-cols-1 md:grid-cols-2">

              {/* Calendario */}
              <div>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#c8921a", marginBottom: "16px" }}>Elige una Fecha</p>
                <div style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "20px" }}>
                  <MiniCal value={fecha} onChange={f => { setFecha(f); setHora(""); }} schedule={schedule} barberSchedule={barbero?.schedule ?? null} />
                </div>
              </div>

              {/* Slots de hora */}
              <div>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#c8921a", marginBottom: "16px" }}>
                  {fecha ? `Horas disponibles — ${fecha}` : "Selecciona primero una fecha"}
                </p>
                <div style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "20px", minHeight: "200px" }}>
                  {!fecha && <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.25)", textAlign: "center", paddingTop: "60px" }}>← Elige un día</p>}
                  {fecha && slotsLoading && <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.25)", textAlign: "center", paddingTop: "60px", letterSpacing: "0.3em" }}>CARGANDO...</p>}
                  {fecha && !slotsLoading && slots.length === 0 && (
                    <div style={{ textAlign: "center", paddingTop: "40px" }}>
                      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", color: "rgba(184,168,138,0.3)", marginBottom: "8px" }}>Sin horas disponibles</p>
                      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "rgba(184,168,138,0.2)", letterSpacing: "0.15em" }}>Prueba con otro día</p>
                    </div>
                  )}
                  {fecha && !slotsLoading && slots.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
                      {slots.map(s => (
                        <button key={s} onClick={() => setHora(s)}
                          style={{
                            padding: "10px 4px", fontFamily: "var(--font-barlow)", fontSize: "0.78rem", fontWeight: hora === s ? 700 : 400,
                            border: hora === s ? "1px solid #c8921a" : "1px solid rgba(92,58,30,0.35)",
                            backgroundColor: hora === s ? "#c8921a" : "transparent",
                            color: hora === s ? "#080604" : "#b8a882",
                            cursor: "pointer",
                            boxShadow: hora === s ? "0 0 16px rgba(200,146,26,0.7)" : "none",
                          }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Datos del cliente */}
            <div style={{ marginTop: "32px", border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0e0b07", padding: "28px" }}>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#c8921a", marginBottom: "20px" }}>Tus Datos</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }} className="grid-cols-1 md:grid-cols-2">
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,146,26,0.7)", marginBottom: "8px" }}>Tu Nombre *</label>
                  <input type="text" placeholder="Carlos García" value={nombre} onChange={e => setNombre(e.target.value)}
                    style={{ width: "100%", padding: "14px 16px", backgroundColor: "#141209", border: nombre ? "1px solid rgba(200,146,26,0.5)" : "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "1rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,146,26,0.7)", marginBottom: "8px" }}>Teléfono *</label>
                  <input type="tel" placeholder="Número de contacto" value={telefono} onChange={e => setTelefono(e.target.value)}
                    style={{ width: "100%", padding: "14px 16px", backgroundColor: "#141209", border: telefono ? "1px solid rgba(200,146,26,0.5)" : "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "1rem", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              <div style={{ marginTop: "16px" }}>
                <label style={{ display: "block", fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,146,26,0.7)", marginBottom: "8px" }}>Email (opcional — para recordatorio)</label>
                <input type="email" placeholder="carlos@correo.com" value={email} onChange={e => setEmail(e.target.value)}
                  style={{ width: "100%", padding: "14px 16px", backgroundColor: "#141209", border: email ? "1px solid rgba(200,146,26,0.5)" : "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "1rem", outline: "none", boxSizing: "border-box" }} />
              </div>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "rgba(184,168,138,0.25)", marginTop: "12px", letterSpacing: "0.1em" }}>
                Sin registro · Sin contraseña · Si añades email te mandamos confirmación y recordatorio
              </p>
            </div>

            {errorReserva && (
              <div style={{ marginTop: "16px", padding: "12px 16px", backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: "0.8rem", fontFamily: "var(--font-barlow)" }}>
                ⚠ {errorReserva}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
              <button onClick={() => setPaso(2)} style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.35em", textTransform: "uppercase", padding: "16px 32px", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.5)", color: "rgba(184,168,138,0.6)", cursor: "pointer" }}>← Atrás</button>
              <button onClick={confirmar} disabled={!fecha || !hora || !nombre.trim() || !telefono.trim() || submitting}
                style={{
                  fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 900,
                  letterSpacing: "0.4em", textTransform: "uppercase",
                  padding: "20px 52px", border: "none",
                  cursor: (!fecha || !hora || !nombre.trim() || !telefono.trim() || submitting) ? "not-allowed" : "pointer",
                  background: (!fecha || !hora || !nombre.trim() || !telefono.trim()) ? "rgba(92,58,30,0.35)" : "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)",
                  color: (!fecha || !hora || !nombre.trim() || !telefono.trim()) ? "rgba(184,168,138,0.25)" : "#080604",
                  boxShadow: (!fecha || !hora || !nombre.trim() || !telefono.trim()) ? "none" : "0 0 50px rgba(200,146,26,0.6)",
                }}>
                {submitting ? "Confirmando..." : "Confirmar Cita ᚢ"}
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
