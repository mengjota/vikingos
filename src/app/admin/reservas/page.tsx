"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isAdminLoggedIn, getAllReservations, updateReservationEstado,
  saveFactura, getProductos, type Producto, type ProductoVendido,
} from "@/lib/adminAuth";
import type { Reservation } from "@/lib/auth";

type MetodoPago = "efectivo" | "tarjeta" | "transferencia" | "otro";

const BARBEROS = [
  { name: "Carlos Mendoza",   specialty: "Navaja Clásica",       rune: "ᚠ", color: "#c8921a" },
  { name: "Andrés Vega",      specialty: "Degradados y Líneas",  rune: "ᚢ", color: "#a78bfa" },
  { name: "Sebastián Torres", specialty: "Estilo Moderno",       rune: "ᚦ", color: "#60a5fa" },
];

const ESTADO_COLOR: Record<string, string> = {
  pendiente: "#f0c040", completada: "#4ade80", cancelada: "#ef4444",
};

export default function AdminReservas() {
  const router = useRouter();
  const [reservas, setReservas]         = useState<Reservation[]>([]);
  const [modalReserva, setModalReserva] = useState<Reservation | null>(null);
  const [metodoPago, setMetodoPago]     = useState<MetodoPago>("efectivo");
  const [productosDisp, setProductosDisp]           = useState<Producto[]>([]);
  const [productosEnFactura, setProductosEnFactura] = useState<ProductoVendido[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<"todas" | "pendiente" | "completada" | "cancelada">("todas");

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin"); return; }
    setReservas(getAllReservations());
    setProductosDisp(getProductos());
  }, [router]);

  function reload() { setReservas(getAllReservations()); }

  function abrirModal(r: Reservation) {
    setModalReserva(r);
    setMetodoPago("efectivo");
    setProductosEnFactura([]);
  }

  function agregarProducto(p: Producto) {
    setProductosEnFactura((prev) => {
      const idx = prev.findIndex((x) => x.nombre === p.nombre);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], cantidad: next[idx].cantidad + 1 };
        return next;
      }
      return [...prev, { nombre: p.nombre, precio: p.precio, cantidad: 1 }];
    });
  }

  function quitarProducto(nombre: string) {
    setProductosEnFactura((prev) => prev.filter((x) => x.nombre !== nombre));
  }

  function completarServicio() {
    if (!modalReserva) return;
    setGuardando(true);
    const precioServicio = parseFloat(modalReserva.precio?.replace(/[^0-9.]/g, "")) || 0;
    const subtotalProductos = productosEnFactura.reduce((s, p) => s + p.precio * p.cantidad, 0);
    const factura = saveFactura({
      reservaId: modalReserva.id,
      clienteEmail: modalReserva.clienteEmail ?? "",
      clienteNombre: modalReserva.clienteNombre ?? "Cliente",
      servicio: modalReserva.servicio,
      barbero: modalReserva.barbero,
      fecha: modalReserva.fecha,
      hora: modalReserva.hora,
      precioServicio,
      metodoPago,
      productosAdicionales: productosEnFactura,
      subtotalProductos,
      total: precioServicio + subtotalProductos,
    });
    updateReservationEstado(modalReserva.id, "completada", factura.id);
    reload();
    setGuardando(false);
    setModalReserva(null);
  }

  function cancelarReserva(id: string) {
    updateReservationEstado(id, "cancelada");
    reload();
  }

  // Reservas por barbero con filtro
  function reservasDe(nombreBarbero: string) {
    return reservas
      .filter((r) => r.barbero === nombreBarbero || (nombreBarbero === "El que más pronto me pueda atender" && r.barbero === nombreBarbero))
      .filter((r) => filtroEstado === "todas" || (r.estado ?? "pendiente") === filtroEstado)
      .sort((a, b) => {
        const horaA = a.hora ?? "00:00";
        const horaB = b.hora ?? "00:00";
        return horaA.localeCompare(horaB);
      });
  }

  const totalPendientes = reservas.filter((r) => (r.estado ?? "pendiente") === "pendiente").length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080604" }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "0 24px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/admin/dashboard" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ color: "rgba(92,58,30,0.6)" }}>|</span>
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8", letterSpacing: "0.08em" }}>Panel de Reservas</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {(["todas", "pendiente", "completada", "cancelada"] as const).map((f) => (
              <button key={f} onClick={() => setFiltroEstado(f)}
                style={{ fontFamily: "var(--font-barlow)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", padding: "6px 14px", border: `1px solid ${filtroEstado === f ? "#c8921a" : "rgba(92,58,30,0.35)"}`, backgroundColor: filtroEstado === f ? "rgba(200,146,26,0.1)" : "transparent", color: filtroEstado === f ? "#c8921a" : "rgba(184,168,138,0.45)", cursor: "pointer" }}>
                {f}
              </button>
            ))}
            {totalPendientes > 0 && (
              <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", fontWeight: 700, backgroundColor: "#c8921a", color: "#080604", borderRadius: "50%", width: "22px", height: "22px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                {totalPendientes}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Columnas de barberos */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "24px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>

        {BARBEROS.map((barbero) => {
          const citas = reservasDe(barbero.name);
          return (
            <div key={barbero.name} style={{ border: "1px solid rgba(92,58,30,0.35)", backgroundColor: "#0a0806", display: "flex", flexDirection: "column", minHeight: "70vh" }}>

              {/* Cabecera barbero */}
              <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", padding: "20px 20px 16px", background: `linear-gradient(to bottom, rgba(${barbero.color === "#c8921a" ? "200,146,26" : barbero.color === "#a78bfa" ? "167,139,250" : "96,165,250"},0.07) 0%, transparent 100%)` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "1.4rem", color: barbero.color }}>{barbero.rune}</span>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: barbero.color, border: `1px solid ${barbero.color}40`, padding: "3px 10px" }}>
                    {citas.length} cita{citas.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1rem", fontWeight: 800, color: "#f0e6c8", letterSpacing: "0.05em", marginBottom: "2px" }}>{barbero.name}</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)" }}>{barbero.specialty}</p>
              </div>

              {/* Lista de citas */}
              <div style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto" }}>
                {citas.length === 0 ? (
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.3 }}>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)", textAlign: "center" }}>
                      Sin citas
                    </p>
                  </div>
                ) : (
                  citas.map((r) => {
                    const estado = r.estado ?? "pendiente";
                    return (
                      <div key={r.id} style={{ border: `1px solid ${ESTADO_COLOR[estado]}25`, backgroundColor: "#0e0b07", padding: "14px 16px", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", backgroundColor: ESTADO_COLOR[estado] }} />

                        {/* Hora + estado */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontFamily: "var(--font-barlow)", fontSize: "1rem", fontWeight: 900, color: barbero.color, letterSpacing: "0.05em" }}>{r.hora}</span>
                          <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: ESTADO_COLOR[estado], border: `1px solid ${ESTADO_COLOR[estado]}40`, padding: "2px 8px" }}>{estado}</span>
                        </div>

                        {/* Fecha */}
                        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", color: "rgba(184,168,138,0.45)", marginBottom: "8px" }}>{r.fecha}</p>

                        {/* Cliente */}
                        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "2px" }}>{r.clienteNombre ?? "Cliente"}</p>
                        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", color: "rgba(184,168,138,0.4)", marginBottom: "10px" }}>{r.clienteEmail}</p>

                        {/* Servicio + precio */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: estado === "pendiente" ? "12px" : "0" }}>
                          <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.6)" }}>{r.servicio}</span>
                          <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 900, color: "#f0c040" }}>{r.precio}</span>
                        </div>

                        {/* Acciones */}
                        {estado === "pendiente" && (
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button onClick={() => abrirModal(r)}
                              style={{ flex: 1, padding: "7px", fontFamily: "var(--font-barlow)", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.25em", textTransform: "uppercase", background: "linear-gradient(135deg, #a06010, #c8921a)", border: "none", color: "#080604", cursor: "pointer" }}>
                              Completar
                            </button>
                            <button onClick={() => cancelarReserva(r.id)}
                              style={{ padding: "7px 10px", fontFamily: "var(--font-barlow)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(239,68,68,0.35)", color: "rgba(239,68,68,0.6)", cursor: "pointer" }}>
                              ✕
                            </button>
                          </div>
                        )}
                        {estado === "completada" && r.facturaId && (
                          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.58rem", letterSpacing: "0.2em", color: "rgba(74,222,128,0.5)", marginTop: "6px" }}>{r.facturaId}</p>
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

      {/* Modal completar servicio */}
      {modalReserva && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(8,6,4,0.93)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ backgroundColor: "#0e0b07", border: "1px solid rgba(200,146,26,0.4)", width: "100%", maxWidth: "620px", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 0 80px rgba(200,146,26,0.15)" }}>

            <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", marginBottom: "4px" }}>Completar Servicio</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.95rem", fontWeight: 700, color: "#f0e6c8" }}>{modalReserva.clienteNombre ?? "Cliente"}</p>
              </div>
              <button onClick={() => setModalReserva(null)} style={{ background: "none", border: "none", color: "rgba(184,168,138,0.5)", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
            </div>

            <div style={{ padding: "28px" }}>
              {/* Resumen reserva */}
              <div style={{ border: "1px solid rgba(92,58,30,0.35)", padding: "16px 20px", marginBottom: "24px", backgroundColor: "#141209", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.82rem", fontWeight: 700, color: "#c8921a" }}>{modalReserva.servicio}</p>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.5)" }}>{modalReserva.barbero} · {modalReserva.fecha} {modalReserva.hora}</p>
                </div>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1.2rem", fontWeight: 900, color: "#f0c040" }}>{modalReserva.precio}</p>
              </div>

              {/* Método de pago */}
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.62rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(200,146,26,0.7)", marginBottom: "12px" }}>Método de Pago</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "28px" }}>
                {(["efectivo", "tarjeta", "transferencia", "otro"] as MetodoPago[]).map((m) => (
                  <button key={m} onClick={() => setMetodoPago(m)}
                    style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", padding: "11px 6px", border: `1px solid ${metodoPago === m ? "#c8921a" : "rgba(92,58,30,0.4)"}`, backgroundColor: metodoPago === m ? "rgba(200,146,26,0.12)" : "transparent", color: metodoPago === m ? "#c8921a" : "rgba(184,168,138,0.45)", cursor: "pointer" }}>
                    {m}
                  </button>
                ))}
              </div>

              {/* Productos adicionales */}
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.62rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(200,146,26,0.7)", marginBottom: "12px" }}>Agregar Productos (opcional)</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "7px", marginBottom: "20px", maxHeight: "180px", overflowY: "auto" }}>
                {productosDisp.map((p) => (
                  <button key={p.id} onClick={() => agregarProducto(p)}
                    style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", padding: "10px 12px", border: "1px solid rgba(92,58,30,0.35)", backgroundColor: "#141209", color: "rgba(184,168,138,0.7)", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ display: "block", fontWeight: 600, color: "#f0e6c8", marginBottom: "2px", fontSize: "0.72rem" }}>{p.nombre}</span>
                    <span style={{ color: "#c8921a" }}>${p.precio}</span>
                  </button>
                ))}
              </div>

              {/* Productos en factura */}
              {productosEnFactura.length > 0 && (
                <div style={{ border: "1px solid rgba(92,58,30,0.35)", padding: "14px 16px", marginBottom: "20px", backgroundColor: "#141209" }}>
                  {productosEnFactura.map((p) => (
                    <div key={p.nombre} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "#f0e6c8" }}>{p.nombre} ×{p.cantidad}</span>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "#4ade80" }}>${p.precio * p.cantidad}</span>
                        <button onClick={() => quitarProducto(p.nombre)} style={{ background: "none", border: "none", color: "rgba(239,68,68,0.6)", cursor: "pointer" }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div style={{ borderTop: "1px solid rgba(92,58,30,0.4)", paddingTop: "16px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)" }}>Total a cobrar</span>
                <span style={{ fontFamily: "var(--font-barlow)", fontSize: "1.5rem", fontWeight: 900, color: "#f0c040" }}>
                  ${(parseFloat(modalReserva.precio?.replace(/[^0-9.]/g, "")) || 0) + productosEnFactura.reduce((s, p) => s + p.precio * p.cantidad, 0)}
                </span>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setModalReserva(null)}
                  style={{ flex: 1, padding: "14px", fontFamily: "var(--font-barlow)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.4)", color: "rgba(184,168,138,0.45)", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={completarServicio} disabled={guardando}
                  style={{ flex: 2, padding: "14px", fontFamily: "var(--font-barlow)", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", background: "linear-gradient(135deg, #a06010, #c8921a, #f0c040, #c8921a, #a06010)", border: "none", color: "#080604", cursor: "pointer", boxShadow: "0 0 25px rgba(200,146,26,0.4)", opacity: guardando ? 0.7 : 1 }}>
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
