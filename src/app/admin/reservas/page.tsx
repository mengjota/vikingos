"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isAdminLoggedIn, getAllReservations, updateReservationEstado,
  saveFactura, getProductos, createAdminReservation,
  type Producto, type ProductoVendido,
} from "@/lib/adminAuth";
import type { Reservation } from "@/lib/auth";

type MetodoPago = "efectivo" | "tarjeta" | "transferencia" | "otro";

const BARBEROS = [
  { name: "Carlos Mendoza",   specialty: "Navaja Clásica",      rune: "ᚠ", col: "#c8921a", rgb: "200,146,26" },
  { name: "Andrés Vega",      specialty: "Degradados y Líneas", rune: "ᚢ", col: "#a78bfa", rgb: "167,139,250" },
  { name: "Sebastián Torres", specialty: "Estilo Moderno",      rune: "ᚦ", col: "#60a5fa", rgb: "96,165,250"  },
];

const SERVICIOS = [
  { nombre: "Corte Clásico",        precio: "$25" },
  { nombre: "Corte + Barba",        precio: "$35" },
  { nombre: "Afeitado con Navaja",  precio: "$30" },
  { nombre: "Limpieza Facial",      precio: "$40" },
  { nombre: "Corte Degradado",      precio: "$28" },
  { nombre: "Diseño de Barba",      precio: "$20" },
];

const HORAS = ["08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30","12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30","17:00","17:30","18:00","18:30","19:00","19:30","20:00"];

const ESTADO_COLOR: Record<string, string> = { pendiente: "#f0c040", completada: "#4ade80", cancelada: "#ef4444" };

export default function AdminReservas() {
  const router = useRouter();
  const [reservas, setReservas]   = useState<Reservation[]>([]);
  const [filtro, setFiltro]       = useState<"todas"|"pendiente"|"completada"|"cancelada">("todas");
  const [productosDisp, setProductosDisp] = useState<Producto[]>([]);

  // Modal completar
  const [modalCompletar, setModalCompletar] = useState<Reservation | null>(null);
  const [metodoPago, setMetodoPago]         = useState<MetodoPago>("efectivo");
  const [productosEnFactura, setProductosEnFactura] = useState<ProductoVendido[]>([]);
  const [guardando, setGuardando] = useState(false);

  // Modal nueva reserva
  const [modalNueva, setModalNueva]   = useState(false);
  const [nuevaBarbero, setNuevaBarbero] = useState(BARBEROS[0].name);
  const [nuevaNombre, setNuevaNombre]   = useState("");
  const [nuevaTel, setNuevaTel]         = useState("");
  const [errorNueva, setErrorNueva]     = useState("");
  const [nuevaServicio, setNuevaServicio] = useState(SERVICIOS[0].nombre);
  const [nuevaPrecio, setNuevaPrecio]   = useState(SERVICIOS[0].precio);
  const [nuevaFecha, setNuevaFecha]     = useState("");
  const [nuevaHora, setNuevaHora]       = useState("09:00");

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin"); return; }
    setReservas(getAllReservations());
    setProductosDisp(getProductos());
    // Fecha de hoy por defecto
    const hoy = new Date();
    setNuevaFecha(hoy.toISOString().split("T")[0]);
  }, [router]);

  function reload() { setReservas(getAllReservations()); }

  function abrirNueva(barberoName?: string) {
    if (barberoName) setNuevaBarbero(barberoName);
    setNuevaNombre(""); setNuevaTel(""); setNuevaServicio(SERVICIOS[0].nombre); setNuevaPrecio(SERVICIOS[0].precio);
    setErrorNueva("");
    setModalNueva(true);
  }

  function crearReserva() {
    setErrorNueva("");
    if (!nuevaNombre.trim()) { setErrorNueva("Ingresa el nombre del cliente para continuar."); return; }
    if (!nuevaFecha) { setErrorNueva("Selecciona una fecha."); return; }
    createAdminReservation({ clienteNombre: nuevaNombre, clienteTelefono: nuevaTel, servicio: nuevaServicio, precio: nuevaPrecio, barbero: nuevaBarbero, fecha: nuevaFecha, hora: nuevaHora });
    reload(); setModalNueva(false);
  }

  function abrirCompletar(r: Reservation) { setModalCompletar(r); setMetodoPago("efectivo"); setProductosEnFactura([]); }

  function agregarProducto(p: Producto) {
    setProductosEnFactura(prev => {
      const idx = prev.findIndex(x => x.nombre === p.nombre);
      if (idx !== -1) { const n = [...prev]; n[idx] = { ...n[idx], cantidad: n[idx].cantidad + 1 }; return n; }
      return [...prev, { nombre: p.nombre, precio: p.precio, cantidad: 1 }];
    });
  }

  function completarServicio() {
    if (!modalCompletar) return;
    setGuardando(true);
    const precioServicio = parseFloat(modalCompletar.precio?.replace(/[^0-9.]/g, "")) || 0;
    const subtotalProductos = productosEnFactura.reduce((s, p) => s + p.precio * p.cantidad, 0);
    const factura = saveFactura({ reservaId: modalCompletar.id, clienteEmail: modalCompletar.clienteEmail ?? "", clienteNombre: modalCompletar.clienteNombre ?? "Cliente", servicio: modalCompletar.servicio, barbero: modalCompletar.barbero, fecha: modalCompletar.fecha, hora: modalCompletar.hora, precioServicio, metodoPago, productosAdicionales: productosEnFactura, subtotalProductos, total: precioServicio + subtotalProductos });
    updateReservationEstado(modalCompletar.id, "completada", factura.id);
    reload(); setGuardando(false); setModalCompletar(null);
  }

  function reservasDe(nombre: string) {
    return reservas
      .filter(r => r.barbero === nombre)
      .filter(r => filtro === "todas" || (r.estado ?? "pendiente") === filtro)
      .sort((a, b) => (a.hora ?? "").localeCompare(b.hora ?? ""));
  }

  const pendientes = reservas.filter(r => (r.estado ?? "pendiente") === "pendiente").length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060504", fontFamily: "var(--font-barlow)" }}>

      {/* ── Header ── */}
      <div style={{ backgroundColor: "#0a0806", borderBottom: "1px solid rgba(92,58,30,0.45)", padding: "0 28px" }}>
        <div style={{ maxWidth: "1500px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a href="/admin/dashboard" style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ color: "rgba(92,58,30,0.5)" }}>|</span>
            <span style={{ fontSize: "1rem", fontWeight: 800, color: "#f0e6c8", letterSpacing: "0.05em" }}>Panel de Reservas</span>
            {pendientes > 0 && <span style={{ backgroundColor: "#c8921a", color: "#060504", fontSize: "0.68rem", fontWeight: 900, borderRadius: "20px", padding: "2px 10px" }}>{pendientes} pendiente{pendientes > 1 ? "s" : ""}</span>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {(["todas","pendiente","completada","cancelada"] as const).map(f => (
              <button key={f} onClick={() => setFiltro(f)}
                style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", padding: "6px 14px", border: `1px solid ${filtro===f ? "#c8921a" : "rgba(92,58,30,0.3)"}`, backgroundColor: filtro===f ? "rgba(200,146,26,0.12)" : "transparent", color: filtro===f ? "#c8921a" : "rgba(184,168,138,0.35)", cursor: "pointer" }}>
                {f}
              </button>
            ))}
            <button onClick={() => abrirNueva()}
              style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", padding: "8px 20px", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", border: "none", color: "#060504", cursor: "pointer", boxShadow: "0 0 20px rgba(200,146,26,0.4)", marginLeft: "8px" }}>
              + Nueva Cita
            </button>
          </div>
        </div>
      </div>

      {/* ── Columnas barberos ── */}
      <div style={{ maxWidth: "1500px", margin: "0 auto", padding: "24px 20px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "20px", alignItems: "start" }}>
        {BARBEROS.map(barb => {
          const citas = reservasDe(barb.name);
          return (
            <div key={barb.name} style={{ border: `1px solid rgba(${barb.rgb},0.2)`, backgroundColor: "#0a0806", borderRadius: "2px", overflow: "hidden" }}>

              {/* Cabecera */}
              <div style={{ padding: "22px 24px 18px", background: `linear-gradient(160deg, rgba(${barb.rgb},0.1) 0%, rgba(${barb.rgb},0.03) 60%, transparent 100%)`, borderBottom: `1px solid rgba(${barb.rgb},0.15)` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span style={{ fontSize: "1.8rem", color: barb.col, lineHeight: 1 }}>{barb.rune}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: barb.col, border: `1px solid ${barb.col}45`, padding: "3px 10px" }}>
                      {citas.length} cita{citas.length !== 1 ? "s" : ""}
                    </span>
                    <button onClick={() => abrirNueva(barb.name)}
                      style={{ width: "28px", height: "28px", border: `1px solid ${barb.col}50`, backgroundColor: `rgba(${barb.rgb},0.1)`, color: barb.col, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                      +
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: "1.15rem", fontWeight: 800, color: "#f0e6c8", letterSpacing: "0.03em", marginBottom: "3px" }}>{barb.name}</p>
                <p style={{ fontSize: "0.68rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(184,168,138,0.35)" }}>{barb.specialty}</p>
              </div>

              {/* Citas */}
              <div style={{ padding: "14px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "300px" }}>
                {citas.length === 0 ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "14px", padding: "40px 0", opacity: 0.35 }}>
                    <p style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(184,168,138,0.6)" }}>Sin citas</p>
                    <button onClick={() => abrirNueva(barb.name)}
                      style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", padding: "8px 20px", border: `1px dashed ${barb.col}50`, backgroundColor: "transparent", color: barb.col, cursor: "pointer" }}>
                      + Agregar cita
                    </button>
                  </div>
                ) : (
                  citas.map(r => {
                    const estado = r.estado ?? "pendiente";
                    return (
                      <div key={r.id} style={{ backgroundColor: "#0f0c08", border: `1px solid rgba(${barb.rgb},0.12)`, borderLeft: `4px solid ${ESTADO_COLOR[estado]}`, padding: "16px 18px", position: "relative" }}>

                        {/* Hora + estado */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <span style={{ fontSize: "1.5rem", fontWeight: 900, color: barb.col, letterSpacing: "0.02em", lineHeight: 1 }}>{r.hora}</span>
                          <span style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: ESTADO_COLOR[estado], border: `1px solid ${ESTADO_COLOR[estado]}40`, padding: "3px 9px" }}>{estado}</span>
                        </div>

                        {/* Fecha */}
                        <p style={{ fontSize: "0.7rem", color: "rgba(184,168,138,0.4)", marginBottom: "10px", letterSpacing: "0.05em" }}>{r.fecha}</p>

                        {/* Cliente */}
                        <div style={{ marginBottom: "10px" }}>
                          <p style={{ fontSize: "1rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "2px" }}>{r.clienteNombre ?? "Cliente"}</p>
                          <p style={{ fontSize: "0.68rem", color: "rgba(184,168,138,0.38)" }}>
                            {r.clienteEmail?.startsWith("tel:") ? `📞 ${r.clienteEmail.replace("tel:","")}` : r.clienteEmail}
                          </p>
                        </div>

                        {/* Servicio + precio */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: estado === "pendiente" ? "14px" : "0", paddingTop: "10px", borderTop: "1px solid rgba(92,58,30,0.2)" }}>
                          <span style={{ fontSize: "0.75rem", color: "rgba(184,168,138,0.55)", fontWeight: 600 }}>{r.servicio}</span>
                          <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#f0c040" }}>{r.precio}</span>
                        </div>

                        {/* Botones acción */}
                        {estado === "pendiente" && (
                          <div style={{ display: "flex", gap: "8px" }}>
                            <button onClick={() => abrirCompletar(r)}
                              style={{ flex: 1, padding: "9px", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.28em", textTransform: "uppercase", background: `linear-gradient(135deg, rgba(${barb.rgb},0.8), rgba(${barb.rgb},1))`, border: "none", color: "#060504", cursor: "pointer", boxShadow: `0 0 14px rgba(${barb.rgb},0.35)` }}>
                              ✓ Completar
                            </button>
                            <button onClick={() => { updateReservationEstado(r.id, "cancelada"); reload(); }}
                              style={{ padding: "9px 12px", fontSize: "0.7rem", fontWeight: 700, backgroundColor: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "rgba(239,68,68,0.55)", cursor: "pointer" }}>
                              ✕
                            </button>
                          </div>
                        )}
                        {estado === "completada" && r.facturaId && (
                          <p style={{ fontSize: "0.58rem", letterSpacing: "0.18em", color: "rgba(74,222,128,0.45)", marginTop: "6px" }}>{r.facturaId}</p>
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
                      style={{ padding: "12px 8px", border: `1px solid ${nuevaBarbero===b.name ? b.col : "rgba(92,58,30,0.35)"}`, backgroundColor: nuevaBarbero===b.name ? `rgba(${b.rgb},0.1)` : "transparent", color: nuevaBarbero===b.name ? b.col : "rgba(184,168,138,0.5)", cursor: "pointer", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em", textAlign: "center", lineHeight: 1.3 }}>
                      <span style={{ display: "block", fontSize: "1.1rem", marginBottom: "4px" }}>{b.rune}</span>
                      {b.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cliente */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "8px" }}>Nombre del cliente *</label>
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "8px" }}>
                  {SERVICIOS.map(s => (
                    <button key={s.nombre} onClick={() => { setNuevaServicio(s.nombre); setNuevaPrecio(s.precio); }}
                      style={{ padding: "11px 14px", border: `1px solid ${nuevaServicio===s.nombre ? "#c8921a" : "rgba(92,58,30,0.35)"}`, backgroundColor: nuevaServicio===s.nombre ? "rgba(200,146,26,0.1)" : "transparent", color: nuevaServicio===s.nombre ? "#c8921a" : "rgba(184,168,138,0.5)", cursor: "pointer", textAlign: "left", fontSize: "0.75rem", fontWeight: 600 }}>
                      <span style={{ display: "block", marginBottom: "2px" }}>{s.nombre}</span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 900, color: nuevaServicio===s.nombre ? "#f0c040" : "rgba(184,168,138,0.35)" }}>{s.precio}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fecha y hora */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "8px" }}>Fecha *</label>
                  <input type="date" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.45)", color: "#f0e6c8", fontSize: "0.88rem", outline: "none", boxSizing: "border-box", colorScheme: "dark" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "8px" }}>Hora *</label>
                  <select value={nuevaHora} onChange={e => setNuevaHora(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.45)", color: "#f0e6c8", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}>
                    {HORAS.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
              </div>

              {/* Error */}
              {errorNueva && (
                <p style={{ fontSize: "0.75rem", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", padding: "10px 14px", letterSpacing: "0.05em" }}>
                  {errorNueva}
                </p>
              )}

              {/* Botones */}
              <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
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

      {/* ══════════ MODAL COMPLETAR SERVICIO ══════════ */}
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
              {/* Resumen */}
              <div style={{ border: "1px solid rgba(92,58,30,0.35)", padding: "16px 20px", backgroundColor: "#141209", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "#c8921a", marginBottom: "3px" }}>{modalCompletar.servicio}</p>
                  <p style={{ fontSize: "0.72rem", color: "rgba(184,168,138,0.5)" }}>{modalCompletar.barbero} · {modalCompletar.fecha} {modalCompletar.hora}</p>
                </div>
                <p style={{ fontSize: "1.4rem", fontWeight: 900, color: "#f0c040" }}>{modalCompletar.precio}</p>
              </div>

              {/* Método de pago */}
              <div>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "10px" }}>Método de Pago</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px" }}>
                  {(["efectivo","tarjeta","transferencia","otro"] as MetodoPago[]).map(m => (
                    <button key={m} onClick={() => setMetodoPago(m)}
                      style={{ padding: "12px 6px", border: `1px solid ${metodoPago===m ? "#c8921a" : "rgba(92,58,30,0.35)"}`, backgroundColor: metodoPago===m ? "rgba(200,146,26,0.12)" : "transparent", color: metodoPago===m ? "#c8921a" : "rgba(184,168,138,0.4)", cursor: "pointer", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Productos */}
              <div>
                <p style={{ fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "10px" }}>Agregar Productos (opcional)</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "7px", maxHeight: "200px", overflowY: "auto" }}>
                  {productosDisp.map(p => (
                    <button key={p.id} onClick={() => agregarProducto(p)}
                      style={{ padding: "10px 12px", border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#141209", color: "rgba(184,168,138,0.65)", cursor: "pointer", textAlign: "left", fontSize: "0.7rem" }}>
                      <span style={{ display: "block", fontWeight: 700, color: "#f0e6c8", marginBottom: "2px" }}>{p.nombre}</span>
                      <span style={{ color: "#c8921a", fontWeight: 700 }}>${p.precio}</span>
                    </button>
                  ))}
                </div>
              </div>

              {productosEnFactura.length > 0 && (
                <div style={{ border: "1px solid rgba(92,58,30,0.3)", padding: "14px 16px", backgroundColor: "#141209" }}>
                  {productosEnFactura.map(p => (
                    <div key={p.nombre} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "0.78rem", color: "#f0e6c8" }}>{p.nombre} ×{p.cantidad}</span>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <span style={{ fontSize: "0.78rem", color: "#4ade80", fontWeight: 700 }}>${p.precio * p.cantidad}</span>
                        <button onClick={() => setProductosEnFactura(p2 => p2.filter(x => x.nombre !== p.nombre))} style={{ background: "none", border: "none", color: "rgba(239,68,68,0.55)", cursor: "pointer" }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div style={{ borderTop: "1px solid rgba(92,58,30,0.4)", paddingTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.45)" }}>Total a cobrar</span>
                <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "#f0c040" }}>
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
