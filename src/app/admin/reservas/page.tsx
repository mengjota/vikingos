"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isAdminLoggedIn,
  saveFactura, getProductos,
  getPausas, savePausa, deletePausa,
  type Producto, type ProductoVendido, type Pausa,
} from "@/lib/adminAuth";
import type { Reservation } from "@/lib/auth";

type MetodoPago = "efectivo" | "tarjeta" | "transferencia" | "otro";

const BARBEROS = [
  { name: "Carlos Mendoza",   specialty: "Navaja Clásica",      rune: "ᚠ", col: "#c8921a", rgb: "200,146,26" },
  { name: "Andrés Vega",      specialty: "Degradados y Líneas", rune: "ᚢ", col: "#a78bfa", rgb: "167,139,250" },
  { name: "Sebastián Torres", specialty: "Estilo Moderno",      rune: "ᚦ", col: "#60a5fa", rgb: "96,165,250"  },
];

const SERVICIOS = [
  { nombre: "Corte Clásico",       precio: "$25" },
  { nombre: "Corte + Barba",       precio: "$35" },
  { nombre: "Afeitado con Navaja", precio: "$30" },
  { nombre: "Limpieza Facial",     precio: "$40" },
  { nombre: "Corte Degradado",     precio: "$28" },
  { nombre: "Diseño de Barba",     precio: "$20" },
];

const HORAS = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
  "16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00",
];

const MOTIVOS = ["Descanso", "Almuerzo", "Cita médica", "Capacitación", "Otro"];
const ESTADO_COLOR: Record<string, string> = { pendiente: "#f0c040", completada: "#4ade80", cancelada: "#ef4444" };

const DIAS_ES = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];
const MESES_ES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function todayISO() { return new Date().toISOString().split("T")[0]; }

function isoFromDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function semanaDesde(offsetSemanas: number): Date[] {
  const hoy = new Date();
  const lunes = new Date(hoy);
  const dia = hoy.getDay() === 0 ? 6 : hoy.getDay() - 1;
  lunes.setDate(hoy.getDate() - dia + offsetSemanas * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes);
    d.setDate(lunes.getDate() + i);
    return d;
  });
}

export default function AdminReservas() {
  const router = useRouter();
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [pausas, setPausas]     = useState<Pausa[]>([]);
  const [filtro, setFiltro]     = useState<"todas"|"pendiente"|"completada"|"cancelada">("todas");
  const [productosDisp, setProductosDisp] = useState<Producto[]>([]);

  // ── Navegador de semana ──
  const [offsetSemana, setOffsetSemana] = useState(0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(todayISO);

  // ── Horas ocupadas para modal nueva reserva ──
  const [horasOcupadasModal, setHorasOcupadasModal] = useState<string[]>([]);

  // ── Modal nueva reserva ──
  const [modalNueva, setModalNueva]       = useState(false);
  const [nuevaBarbero, setNuevaBarbero]   = useState(BARBEROS[0].name);
  const [nuevaNombre, setNuevaNombre]     = useState("");
  const [nuevaTel, setNuevaTel]           = useState("");
  const [errorNueva, setErrorNueva]       = useState("");
  const [nuevaServicio, setNuevaServicio] = useState(SERVICIOS[0].nombre);
  const [nuevaPrecio, setNuevaPrecio]     = useState(SERVICIOS[0].precio);
  const [nuevaFecha, setNuevaFecha]       = useState(todayISO);
  const [nuevaHora, setNuevaHora]         = useState("09:00");

  // ── Modal completar servicio ──
  const [modalCompletar, setModalCompletar]     = useState<Reservation | null>(null);
  const [metodoPago, setMetodoPago]             = useState<MetodoPago>("efectivo");
  const [productosEnFactura, setProductosEnFactura] = useState<ProductoVendido[]>([]);
  const [guardando, setGuardando]               = useState(false);

  // ── Modal pausa ──
  const [modalPausa, setModalPausa]     = useState(false);
  const [pausaBarbero, setPausaBarbero] = useState("");
  const [pausaFecha, setPausaFecha]     = useState(todayISO);
  const [pausaInicio, setPausaInicio]   = useState("");
  const [pausaFin, setPausaFin]         = useState("");
  const [pausaMotivo, setPausaMotivo]   = useState("Descanso");
  const [errorPausa, setErrorPausa]     = useState("");

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin"); return; }
    reloadAll();
    setProductosDisp(getProductos());
  }, [router]);

  // Cargar horas ocupadas cuando cambia barbero o fecha en modal nueva reserva
  useEffect(() => {
    if (!modalNueva || !nuevaFecha) { setHorasOcupadasModal([]); return; }
    fetch(`/api/reservations/check?barbero=${encodeURIComponent(nuevaBarbero)}&fecha=${nuevaFecha}`)
      .then(r => r.json())
      .then(setHorasOcupadasModal)
      .catch(() => setHorasOcupadasModal([]));
  }, [nuevaBarbero, nuevaFecha, modalNueva]);

  async function reloadAll() {
    const [resData] = await Promise.all([
      fetch("/api/reservations").then(r => r.json()),
    ]);
    setReservas(resData);
    setPausas(getPausas());
  }

  // ── Nueva reserva ──
  function abrirNueva(barberoName?: string) {
    setNuevaBarbero(barberoName ?? BARBEROS[0].name);
    setNuevaNombre(""); setNuevaTel(""); setErrorNueva("");
    setNuevaServicio(SERVICIOS[0].nombre); setNuevaPrecio(SERVICIOS[0].precio);
    setNuevaFecha(todayISO()); setNuevaHora("09:00");
    setModalNueva(true);
  }

  async function crearReserva() {
    setErrorNueva("");
    if (!nuevaNombre.trim()) { setErrorNueva("Ingresa el nombre del cliente."); return; }
    if (!nuevaFecha)         { setErrorNueva("Selecciona una fecha."); return; }
    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteNombre: nuevaNombre,
        clienteEmail:  nuevaTel ? `tel:${nuevaTel}` : "admin-walk-in",
        servicio: nuevaServicio, precio: nuevaPrecio,
        barbero: nuevaBarbero, fecha: nuevaFecha, hora: nuevaHora,
      }),
    });
    if (!res.ok) {
      const d = await res.json();
      setErrorNueva(d.error ?? "Error al crear la reserva.");
      return;
    }
    reloadAll(); setModalNueva(false);
  }

  // ── Completar servicio ──
  function abrirCompletar(r: Reservation) { setModalCompletar(r); setMetodoPago("efectivo"); setProductosEnFactura([]); }

  function agregarProducto(p: Producto) {
    setProductosEnFactura(prev => {
      const idx = prev.findIndex(x => x.nombre === p.nombre);
      if (idx !== -1) { const n = [...prev]; n[idx] = { ...n[idx], cantidad: n[idx].cantidad + 1 }; return n; }
      return [...prev, { nombre: p.nombre, precio: p.precio, cantidad: 1 }];
    });
  }

  async function completarServicio() {
    if (!modalCompletar) return;
    setGuardando(true);
    const precioServicio     = parseFloat(modalCompletar.precio?.replace(/[^0-9.]/g, "")) || 0;
    const subtotalProductos  = productosEnFactura.reduce((s, p) => s + p.precio * p.cantidad, 0);
    const factura = saveFactura({
      reservaId: modalCompletar.id, clienteEmail: modalCompletar.clienteEmail ?? "",
      clienteNombre: modalCompletar.clienteNombre ?? "Cliente", servicio: modalCompletar.servicio,
      barbero: modalCompletar.barbero, fecha: modalCompletar.fecha, hora: modalCompletar.hora,
      precioServicio, metodoPago, productosAdicionales: productosEnFactura,
      subtotalProductos, total: precioServicio + subtotalProductos,
    });
    await fetch(`/api/reservations/${modalCompletar.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "completada", facturaId: factura.id }),
    });
    reloadAll(); setGuardando(false); setModalCompletar(null);
  }

  // ── Pausas ──
  function abrirPausa(barberoName: string) {
    setPausaBarbero(barberoName); setPausaFecha(todayISO());
    setPausaInicio(""); setPausaFin(""); setPausaMotivo("Descanso"); setErrorPausa("");
    setModalPausa(true);
  }

  function guardarPausa() {
    setErrorPausa("");
    if (!pausaInicio) { setErrorPausa("Selecciona la hora de inicio."); return; }
    if (!pausaFin)    { setErrorPausa("Selecciona la hora de fin."); return; }
    if (pausaFin <= pausaInicio) { setErrorPausa("La hora de fin debe ser después del inicio."); return; }
    savePausa({ barbero: pausaBarbero, fecha: pausaFecha, horaInicio: pausaInicio, horaFin: pausaFin, motivo: pausaMotivo });
    reloadAll(); setModalPausa(false);
  }

  // Reservas + pausas mezcladas, filtradas por fecha seleccionada
  function itemsDe(nombre: string) {
    const r = reservas
      .filter(r => r.barbero === nombre && r.fecha === fechaSeleccionada)
      .filter(r => filtro === "todas" || (r.estado ?? "pendiente") === filtro)
      .map(r => ({ tipo: "reserva" as const, hora: r.hora ?? "00:00", data: r }));
    const p = pausas
      .filter(p => p.barbero === nombre && p.fecha === fechaSeleccionada)
      .map(p => ({ tipo: "pausa" as const, hora: p.horaInicio, data: p }));
    return [...r, ...p].sort((a, b) => a.hora.localeCompare(b.hora));
  }

  const pendientes = reservas.filter(r => (r.estado ?? "pendiente") === "pendiente").length;

  // Semana actual según offset
  const diasSemana = semanaDesde(offsetSemana);

  // Cuántas reservas hay por día (para los indicadores)
  function citasDia(iso: string) {
    return reservas.filter(r => r.fecha === iso && (r.estado ?? "pendiente") !== "cancelada").length;
  }

  // Horas disponibles para fin (solo después del inicio)
  const horasFin = pausaInicio ? HORAS.filter(h => h > pausaInicio) : HORAS;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060504", fontFamily: "var(--font-barlow)" }}>

      {/* ── Header ── */}
      <div style={{ backgroundColor: "#0a0806", borderBottom: "1px solid rgba(92,58,30,0.45)", padding: "0 28px" }}>
        <div style={{ maxWidth: "1500px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/admin/dashboard" style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ color: "rgba(92,58,30,0.5)" }}>|</span>
            <span style={{ fontSize: "1rem", fontWeight: 800, color: "#f0e6c8" }}>Panel de Reservas</span>
            {pendientes > 0 && <span style={{ backgroundColor: "#c8921a", color: "#060504", fontSize: "0.65rem", fontWeight: 900, borderRadius: "20px", padding: "2px 10px" }}>{pendientes} pendiente{pendientes > 1 ? "s" : ""}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            {(["todas","pendiente","completada","cancelada"] as const).map(f => (
              <button key={f} onClick={() => setFiltro(f)}
                style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", padding: "6px 12px", border: `1px solid ${filtro===f ? "#c8921a" : "rgba(92,58,30,0.3)"}`, backgroundColor: filtro===f ? "rgba(200,146,26,0.12)" : "transparent", color: filtro===f ? "#c8921a" : "rgba(184,168,138,0.35)", cursor: "pointer" }}>
                {f}
              </button>
            ))}
            <button onClick={() => abrirNueva()}
              style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", padding: "8px 18px", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", border: "none", color: "#060504", cursor: "pointer", boxShadow: "0 0 18px rgba(200,146,26,0.4)", marginLeft: "6px" }}>
              + Nueva Cita
            </button>
          </div>
        </div>
      </div>

      {/* ── Navegador de semana ── */}
      <div style={{ backgroundColor: "#080604", borderBottom: "1px solid rgba(92,58,30,0.3)", padding: "0 28px" }}>
        <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "14px 0", display: "flex", alignItems: "center", gap: "10px" }}>

          {/* Flecha anterior */}
          <button onClick={() => setOffsetSemana(o => o - 1)}
            style={{ width: "34px", height: "34px", border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "transparent", color: "rgba(184,168,138,0.5)", cursor: "pointer", fontSize: "1rem", flexShrink: 0 }}>
            ‹
          </button>

          {/* Días */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "6px", flex: 1 }}>
            {diasSemana.map(d => {
              const iso     = isoFromDate(d);
              const esHoy   = iso === todayISO();
              const esSel   = iso === fechaSeleccionada;
              const citas   = citasDia(iso);
              const esPasado = iso < todayISO();
              return (
                <button key={iso} onClick={() => setFechaSeleccionada(iso)}
                  style={{
                    padding: "10px 6px", border: `1px solid ${esSel ? "#c8921a" : esHoy ? "rgba(200,146,26,0.35)" : "rgba(92,58,30,0.25)"}`,
                    backgroundColor: esSel ? "rgba(200,146,26,0.15)" : esHoy ? "rgba(200,146,26,0.05)" : "transparent",
                    cursor: "pointer", textAlign: "center", position: "relative",
                  }}>
                  <p style={{ fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "4px",
                    color: esSel ? "#c8921a" : esHoy ? "rgba(200,146,26,0.7)" : "rgba(184,168,138,0.35)" }}>
                    {DIAS_ES[d.getDay()]}
                  </p>
                  <p style={{ fontSize: "1.15rem", fontWeight: 900, lineHeight: 1, marginBottom: "6px",
                    color: esSel ? "#f0c040" : esHoy ? "#c8921a" : esPasado ? "rgba(184,168,138,0.25)" : "#f0e6c8" }}>
                    {d.getDate()}
                  </p>
                  <p style={{ fontSize: "0.5rem", letterSpacing: "0.15em", color: "rgba(184,168,138,0.3)", marginBottom: "4px" }}>
                    {MESES_ES[d.getMonth()]}
                  </p>
                  {/* Puntos de citas */}
                  <div style={{ display: "flex", justifyContent: "center", gap: "3px", minHeight: "8px" }}>
                    {citas > 0 && Array.from({ length: Math.min(citas, 5) }).map((_, i) => (
                      <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%",
                        backgroundColor: esSel ? "#f0c040" : "#c8921a", opacity: esPasado ? 0.4 : 1 }} />
                    ))}
                    {citas > 5 && <span style={{ fontSize: "0.45rem", color: "#c8921a", lineHeight: "6px" }}>+</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Flecha siguiente */}
          <button onClick={() => setOffsetSemana(o => o + 1)}
            style={{ width: "34px", height: "34px", border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "transparent", color: "rgba(184,168,138,0.5)", cursor: "pointer", fontSize: "1rem", flexShrink: 0 }}>
            ›
          </button>

          {/* Botón Hoy */}
          <button onClick={() => { setOffsetSemana(0); setFechaSeleccionada(todayISO()); }}
            style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", padding: "8px 14px", border: "1px solid rgba(200,146,26,0.4)", backgroundColor: "rgba(200,146,26,0.08)", color: "rgba(200,146,26,0.7)", cursor: "pointer", flexShrink: 0 }}>
            Hoy
          </button>

          {/* Fecha seleccionada — label */}
          <div style={{ flexShrink: 0, textAlign: "right" }}>
            <p style={{ fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(184,168,138,0.3)", marginBottom: "2px" }}>Viendo</p>
            <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#c8921a" }}>
              {new Date(fechaSeleccionada + "T12:00:00").toLocaleDateString("es-EC", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
        </div>
      </div>

      {/* ── Columnas ── */}
      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "24px 20px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", alignItems: "start" }}>
        {BARBEROS.map(barb => {
          const items = itemsDe(barb.name);
          return (
            <div key={barb.name} style={{ border: `1px solid rgba(${barb.rgb},0.2)`, backgroundColor: "#0a0806", overflow: "hidden" }}>

              {/* Cabecera */}
              <div style={{ padding: "20px 22px 16px", background: `linear-gradient(160deg, rgba(${barb.rgb},0.1) 0%, transparent 70%)`, borderBottom: `1px solid rgba(${barb.rgb},0.15)` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontSize: "1.7rem", color: barb.col }}>{barb.rune}</span>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                    <span style={{ fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: barb.col, border: `1px solid ${barb.col}45`, padding: "3px 9px" }}>
                      {items.filter(i => i.tipo === "reserva").length} cita{items.filter(i => i.tipo === "reserva").length !== 1 ? "s" : ""}
                    </span>
                    {/* Botón pausa */}
                    <button onClick={() => abrirPausa(barb.name)} title="Agregar pausa"
                      style={{ padding: "5px 10px", border: "1px solid rgba(251,146,60,0.45)", backgroundColor: "rgba(251,146,60,0.08)", color: "rgba(251,146,60,0.8)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
                      ⏸ Pausa
                    </button>
                    {/* Botón nueva cita */}
                    <button onClick={() => abrirNueva(barb.name)}
                      style={{ width: "28px", height: "28px", border: `1px solid ${barb.col}50`, backgroundColor: `rgba(${barb.rgb},0.1)`, color: barb.col, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      +
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: "1.05rem", fontWeight: 800, color: "#f0e6c8", marginBottom: "2px" }}>{barb.name}</p>
                <p style={{ fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(184,168,138,0.35)" }}>{barb.specialty}</p>
              </div>

              {/* Items */}
              <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "8px", minHeight: "280px" }}>
                {items.length === 0 ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", padding: "36px 0", opacity: 0.35 }}>
                    <p style={{ fontSize: "0.62rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)" }}>Sin actividad</p>
                    <button onClick={() => abrirNueva(barb.name)}
                      style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", padding: "7px 18px", border: `1px dashed ${barb.col}50`, backgroundColor: "transparent", color: barb.col, cursor: "pointer" }}>
                      + Agregar cita
                    </button>
                  </div>
                ) : (
                  items.map((item, idx) => {
                    if (item.tipo === "pausa") {
                      const p = item.data as Pausa;
                      return (
                        <div key={`pausa-${p.id}`} style={{ backgroundColor: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.25)", borderLeft: "4px solid rgba(251,146,60,0.7)", padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                              <span style={{ fontSize: "0.7rem" }}>⏸</span>
                              <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "rgba(251,146,60,0.9)" }}>{p.horaInicio} – {p.horaFin}</span>
                            </div>
                            <p style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(251,146,60,0.55)" }}>{p.motivo}</p>
                            <p style={{ fontSize: "0.62rem", color: "rgba(184,168,138,0.35)", marginTop: "2px" }}>{p.fecha}</p>
                          </div>
                          <button onClick={() => { deletePausa(p.id); reloadAll(); }}
                            style={{ background: "none", border: "1px solid rgba(239,68,68,0.25)", color: "rgba(239,68,68,0.5)", cursor: "pointer", padding: "4px 8px", fontSize: "0.7rem" }}>
                            ✕
                          </button>
                        </div>
                      );
                    }

                    const r = item.data as Reservation;
                    const estado = r.estado ?? "pendiente";
                    return (
                      <div key={`res-${r.id}-${idx}`} style={{ backgroundColor: "#0f0c08", border: `1px solid rgba(${barb.rgb},0.12)`, borderLeft: `4px solid ${ESTADO_COLOR[estado]}`, padding: "14px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontSize: "1.4rem", fontWeight: 900, color: barb.col, lineHeight: 1 }}>{r.hora}</span>
                          <span style={{ fontSize: "0.52rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: ESTADO_COLOR[estado], border: `1px solid ${ESTADO_COLOR[estado]}40`, padding: "3px 8px" }}>{estado}</span>
                        </div>
                        <p style={{ fontSize: "0.65rem", color: "rgba(184,168,138,0.38)", marginBottom: "8px" }}>{r.fecha}</p>
                        <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "2px" }}>{r.clienteNombre ?? "Cliente"}</p>
                        <p style={{ fontSize: "0.65rem", color: "rgba(184,168,138,0.35)", marginBottom: "10px" }}>
                          {r.clienteEmail?.startsWith("tel:") ? `📞 ${r.clienteEmail.replace("tel:","")}` : r.clienteEmail}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: estado === "pendiente" ? "12px" : "0", paddingTop: "8px", borderTop: "1px solid rgba(92,58,30,0.2)" }}>
                          <span style={{ fontSize: "0.72rem", color: "rgba(184,168,138,0.5)", fontWeight: 600 }}>{r.servicio}</span>
                          <span style={{ fontSize: "1rem", fontWeight: 900, color: "#f0c040" }}>{r.precio}</span>
                        </div>
                        {estado === "pendiente" && (
                          <div style={{ display: "flex", gap: "7px" }}>
                            <button onClick={() => abrirCompletar(r)}
                              style={{ flex: 1, padding: "8px", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", background: `linear-gradient(135deg, rgba(${barb.rgb},0.8), rgba(${barb.rgb},1))`, border: "none", color: "#060504", cursor: "pointer" }}>
                              ✓ Completar
                            </button>
                            <button onClick={async () => { await fetch(`/api/reservations/${r.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ estado: "cancelada" }) }); reloadAll(); }}
                              style={{ padding: "8px 11px", fontSize: "0.7rem", fontWeight: 700, backgroundColor: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "rgba(239,68,68,0.55)", cursor: "pointer" }}>
                              ✕
                            </button>
                          </div>
                        )}
                        {estado === "completada" && r.facturaId && (
                          <p style={{ fontSize: "0.56rem", letterSpacing: "0.18em", color: "rgba(74,222,128,0.45)", marginTop: "6px" }}>{r.facturaId}</p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════════ MODAL PAUSA ══════════ */}
      {modalPausa && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(6,5,4,0.95)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#0e0b07", border: "1px solid rgba(251,146,60,0.4)", width: "100%", maxWidth: "480px", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 0 60px rgba(251,146,60,0.1)" }}>
            <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", padding: "20px 26px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "0.58rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(251,146,60,0.6)", marginBottom: "4px" }}>⏸ Bloquear Tiempo</p>
                <p style={{ fontSize: "0.92rem", fontWeight: 800, color: "#f0e6c8" }}>{pausaBarbero.split(" ")[0]} — Pausa / Descanso</p>
              </div>
              <button onClick={() => setModalPausa(false)} style={{ background: "none", border: "none", color: "rgba(184,168,138,0.4)", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
            </div>

            <div style={{ padding: "26px", display: "flex", flexDirection: "column", gap: "22px" }}>

              {/* Fecha */}
              <div>
                <label style={{ display: "block", fontSize: "0.58rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(251,146,60,0.65)", marginBottom: "8px" }}>Fecha</label>
                <input type="date" value={pausaFecha} onChange={e => setPausaFecha(e.target.value)}
                  style={{ width: "100%", padding: "11px 14px", backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.45)", color: "#f0e6c8", fontSize: "0.88rem", outline: "none", boxSizing: "border-box", colorScheme: "dark" }} />
              </div>

              {/* Hora inicio */}
              <div>
                <label style={{ display: "block", fontSize: "0.58rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(251,146,60,0.65)", marginBottom: "10px" }}>
                  Hora de inicio {pausaInicio && <span style={{ color: "rgba(251,146,60,0.9)", fontWeight: 800 }}>— {pausaInicio}</span>}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "5px" }}>
                  {HORAS.map(h => (
                    <button key={h} onClick={() => { setPausaInicio(h); if (pausaFin && pausaFin <= h) setPausaFin(""); }}
                      style={{ padding: "8px 4px", fontSize: "0.68rem", fontWeight: 700, border: `1px solid ${pausaInicio === h ? "rgba(251,146,60,0.8)" : "rgba(92,58,30,0.3)"}`, backgroundColor: pausaInicio === h ? "rgba(251,146,60,0.18)" : "transparent", color: pausaInicio === h ? "rgba(251,146,60,1)" : "rgba(184,168,138,0.5)", cursor: "pointer", textAlign: "center" }}>
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hora fin */}
              <div>
                <label style={{ display: "block", fontSize: "0.58rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(251,146,60,0.65)", marginBottom: "10px" }}>
                  Hora de fin {pausaFin && <span style={{ color: "rgba(251,146,60,0.9)", fontWeight: 800 }}>— {pausaFin}</span>}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "5px" }}>
                  {horasFin.map(h => (
                    <button key={h} onClick={() => setPausaFin(h)}
                      style={{ padding: "8px 4px", fontSize: "0.68rem", fontWeight: 700, border: `1px solid ${pausaFin === h ? "rgba(251,146,60,0.8)" : "rgba(92,58,30,0.25)"}`, backgroundColor: pausaFin === h ? "rgba(251,146,60,0.18)" : "transparent", color: pausaFin === h ? "rgba(251,146,60,1)" : "rgba(184,168,138,0.4)", cursor: pausaInicio ? "pointer" : "not-allowed", opacity: pausaInicio ? 1 : 0.4, textAlign: "center" }}>
                      {h}
                    </button>
                  ))}
                  {!pausaInicio && <p style={{ gridColumn: "1/-1", fontSize: "0.68rem", color: "rgba(184,168,138,0.35)", textAlign: "center", padding: "8px 0" }}>Selecciona primero la hora de inicio</p>}
                </div>
              </div>

              {/* Preview rango */}
              {pausaInicio && pausaFin && (
                <div style={{ border: "1px solid rgba(251,146,60,0.3)", backgroundColor: "rgba(251,146,60,0.06)", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.4rem" }}>⏸</span>
                  <div>
                    <p style={{ fontSize: "1rem", fontWeight: 900, color: "rgba(251,146,60,0.9)" }}>{pausaInicio} – {pausaFin}</p>
                    <p style={{ fontSize: "0.65rem", color: "rgba(251,146,60,0.5)", letterSpacing: "0.15em" }}>{pausaBarbero} · {pausaMotivo}</p>
                  </div>
                </div>
              )}

              {/* Motivo */}
              <div>
                <label style={{ display: "block", fontSize: "0.58rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(251,146,60,0.65)", marginBottom: "10px" }}>Motivo</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                  {MOTIVOS.map(m => (
                    <button key={m} onClick={() => setPausaMotivo(m)}
                      style={{ padding: "8px 16px", border: `1px solid ${pausaMotivo === m ? "rgba(251,146,60,0.7)" : "rgba(92,58,30,0.3)"}`, backgroundColor: pausaMotivo === m ? "rgba(251,146,60,0.12)" : "transparent", color: pausaMotivo === m ? "rgba(251,146,60,0.9)" : "rgba(184,168,138,0.45)", cursor: "pointer", fontSize: "0.72rem", fontWeight: 600 }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {errorPausa && <p style={{ fontSize: "0.75rem", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", padding: "10px 14px" }}>{errorPausa}</p>}

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setModalPausa(false)}
                  style={{ flex: 1, padding: "13px", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.4)", color: "rgba(184,168,138,0.4)", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={guardarPausa}
                  style={{ flex: 2, padding: "13px", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", background: "linear-gradient(135deg,#a06010,#fb923c,#fbbf24,#fb923c,#a06010)", border: "none", color: "#060504", cursor: "pointer", boxShadow: "0 0 20px rgba(251,146,60,0.4)" }}>
                  Bloquear Tiempo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ MODAL NUEVA RESERVA ══════════ */}
      {modalNueva && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(6,5,4,0.94)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#0e0b07", border: "1px solid rgba(200,146,26,0.45)", width: "100%", maxWidth: "560px", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 0 80px rgba(200,146,26,0.12)" }}>
            <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(200,146,26,0.55)", marginBottom: "4px" }}>Nueva Reserva</p>
                <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f0e6c8" }}>Agendar Cita</p>
              </div>
              <button onClick={() => setModalNueva(false)} style={{ background: "none", border: "none", color: "rgba(184,168,138,0.45)", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
            </div>
            <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Barbero */}
              <div>
                <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "10px" }}>Barbero</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
                  {BARBEROS.map(b => (
                    <button key={b.name} onClick={() => setNuevaBarbero(b.name)}
                      style={{ padding: "12px 8px", border: `1px solid ${nuevaBarbero===b.name ? b.col : "rgba(92,58,30,0.35)"}`, backgroundColor: nuevaBarbero===b.name ? `rgba(${b.rgb},0.1)` : "transparent", color: nuevaBarbero===b.name ? b.col : "rgba(184,168,138,0.5)", cursor: "pointer", fontSize: "0.7rem", fontWeight: 700, textAlign: "center", lineHeight: 1.4 }}>
                      <span style={{ display: "block", fontSize: "1.1rem", marginBottom: "4px" }}>{b.rune}</span>
                      {b.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>
              {/* Cliente */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "8px" }}>Nombre *</label>
                  <input value={nuevaNombre} onChange={e => setNuevaNombre(e.target.value)} placeholder="Ej: Juan Pérez"
                    style={{ width: "100%", padding: "12px 14px", backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.45)", color: "#f0e6c8", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "8px" }}>Teléfono</label>
                  <input value={nuevaTel} onChange={e => setNuevaTel(e.target.value)} placeholder="0998765432"
                    style={{ width: "100%", padding: "12px 14px", backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.45)", color: "#f0e6c8", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
              {/* Servicio */}
              <div>
                <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "10px" }}>Servicio</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "7px" }}>
                  {SERVICIOS.map(s => (
                    <button key={s.nombre} onClick={() => { setNuevaServicio(s.nombre); setNuevaPrecio(s.precio); }}
                      style={{ padding: "10px 12px", border: `1px solid ${nuevaServicio===s.nombre ? "#c8921a" : "rgba(92,58,30,0.35)"}`, backgroundColor: nuevaServicio===s.nombre ? "rgba(200,146,26,0.1)" : "transparent", color: nuevaServicio===s.nombre ? "#c8921a" : "rgba(184,168,138,0.5)", cursor: "pointer", textAlign: "left", fontSize: "0.73rem", fontWeight: 600 }}>
                      <span style={{ display: "block", marginBottom: "2px" }}>{s.nombre}</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: 900, color: nuevaServicio===s.nombre ? "#f0c040" : "rgba(184,168,138,0.3)" }}>{s.precio}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Fecha y hora */}
              <div>
                <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "8px" }}>Fecha *</label>
                <input type="date" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.45)", color: "#f0e6c8", fontSize: "0.88rem", outline: "none", boxSizing: "border-box", colorScheme: "dark" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "10px" }}>
                  Hora * {nuevaHora && <span style={{ color: "#f0c040", fontWeight: 800 }}>— {nuevaHora}</span>}
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "5px" }}>
                  {HORAS.map(h => {
                    const ocupada = horasOcupadasModal.includes(h);
                    return (
                      <button key={h} onClick={() => !ocupada && setNuevaHora(h)} disabled={ocupada}
                        title={ocupada ? "Hora ocupada" : h}
                        style={{ padding: "8px 4px", fontSize: "0.66rem", fontWeight: 700, textAlign: "center", cursor: ocupada ? "not-allowed" : "pointer",
                          border: `1px solid ${ocupada ? "rgba(239,68,68,0.25)" : nuevaHora === h ? "rgba(200,146,26,0.8)" : "rgba(92,58,30,0.3)"}`,
                          backgroundColor: ocupada ? "rgba(239,68,68,0.06)" : nuevaHora === h ? "rgba(200,146,26,0.15)" : "transparent",
                          color: ocupada ? "rgba(239,68,68,0.4)" : nuevaHora === h ? "#f0c040" : "rgba(184,168,138,0.5)",
                          textDecoration: ocupada ? "line-through" : "none",
                        }}>
                        {h}
                      </button>
                    );
                  })}
                </div>
              </div>
              {errorNueva && <p style={{ fontSize: "0.75rem", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", padding: "10px 14px" }}>{errorNueva}</p>}
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setModalNueva(false)}
                  style={{ flex: 1, padding: "14px", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.4)", color: "rgba(184,168,138,0.4)", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={crearReserva}
                  style={{ flex: 2, padding: "14px", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", border: "none", color: "#060504", cursor: "pointer", boxShadow: "0 0 25px rgba(200,146,26,0.4)" }}>
                  Confirmar Cita
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ MODAL COMPLETAR ══════════ */}
      {modalCompletar && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(6,5,4,0.94)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#0e0b07", border: "1px solid rgba(200,146,26,0.45)", width: "100%", maxWidth: "600px", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 0 80px rgba(200,146,26,0.12)" }}>
            <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(200,146,26,0.55)", marginBottom: "4px" }}>Completar Servicio</p>
                <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f0e6c8" }}>{modalCompletar.clienteNombre ?? "Cliente"}</p>
              </div>
              <button onClick={() => setModalCompletar(null)} style={{ background: "none", border: "none", color: "rgba(184,168,138,0.45)", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
            </div>
            <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "22px" }}>
              <div style={{ border: "1px solid rgba(92,58,30,0.35)", padding: "14px 18px", backgroundColor: "#141209", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#c8921a", marginBottom: "2px" }}>{modalCompletar.servicio}</p>
                  <p style={{ fontSize: "0.7rem", color: "rgba(184,168,138,0.5)" }}>{modalCompletar.barbero} · {modalCompletar.fecha} {modalCompletar.hora}</p>
                </div>
                <p style={{ fontSize: "1.3rem", fontWeight: 900, color: "#f0c040" }}>{modalCompletar.precio}</p>
              </div>
              <div>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "10px" }}>Método de Pago</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "7px" }}>
                  {(["efectivo","tarjeta","transferencia","otro"] as MetodoPago[]).map(m => (
                    <button key={m} onClick={() => setMetodoPago(m)}
                      style={{ padding: "11px 5px", border: `1px solid ${metodoPago===m ? "#c8921a" : "rgba(92,58,30,0.35)"}`, backgroundColor: metodoPago===m ? "rgba(200,146,26,0.12)" : "transparent", color: metodoPago===m ? "#c8921a" : "rgba(184,168,138,0.4)", cursor: "pointer", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "10px" }}>Agregar Productos (opcional)</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(155px,1fr))", gap: "6px", maxHeight: "180px", overflowY: "auto" }}>
                  {productosDisp.map(p => (
                    <button key={p.id} onClick={() => agregarProducto(p)}
                      style={{ padding: "9px 11px", border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#141209", color: "rgba(184,168,138,0.65)", cursor: "pointer", textAlign: "left", fontSize: "0.68rem" }}>
                      <span style={{ display: "block", fontWeight: 700, color: "#f0e6c8", marginBottom: "2px" }}>{p.nombre}</span>
                      <span style={{ color: "#c8921a", fontWeight: 700 }}>${p.precio}</span>
                    </button>
                  ))}
                </div>
              </div>
              {productosEnFactura.length > 0 && (
                <div style={{ border: "1px solid rgba(92,58,30,0.3)", padding: "13px 15px", backgroundColor: "#141209" }}>
                  {productosEnFactura.map(p => (
                    <div key={p.nombre} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                      <span style={{ fontSize: "0.77rem", color: "#f0e6c8" }}>{p.nombre} ×{p.cantidad}</span>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ fontSize: "0.77rem", color: "#4ade80", fontWeight: 700 }}>${p.precio * p.cantidad}</span>
                        <button onClick={() => setProductosEnFactura(prev => prev.filter(x => x.nombre !== p.nombre))} style={{ background: "none", border: "none", color: "rgba(239,68,68,0.55)", cursor: "pointer" }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ borderTop: "1px solid rgba(92,58,30,0.4)", paddingTop: "14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.45)" }}>Total a cobrar</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "#f0c040" }}>
                  ${(parseFloat(modalCompletar.precio?.replace(/[^0-9.]/g,"")) || 0) + productosEnFactura.reduce((s,p) => s + p.precio*p.cantidad, 0)}
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setModalCompletar(null)}
                  style={{ flex: 1, padding: "14px", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.4)", color: "rgba(184,168,138,0.4)", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={completarServicio} disabled={guardando}
                  style={{ flex: 2, padding: "14px", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", border: "none", color: "#060504", cursor: "pointer", boxShadow: "0 0 25px rgba(200,146,26,0.4)", opacity: guardando ? 0.7 : 1 }}>
                  {guardando ? "Guardando..." : "Confirmar y Facturar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
