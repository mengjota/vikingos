"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn, getAllReservations, updateReservationEstado, saveFactura, getProductos, type Producto, type ProductoVendido } from "@/lib/adminAuth";
import type { Reservation } from "@/lib/auth";

type MetodoPago = "efectivo" | "tarjeta" | "transferencia" | "otro";

export default function AdminReservas() {
  const router = useRouter();
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [filtro, setFiltro] = useState<"todas" | "pendiente" | "completada" | "cancelada">("todas");
  const [filtroBarbero, setFiltroBarbero] = useState("todos");
  const [modalReserva, setModalReserva] = useState<Reservation | null>(null);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("efectivo");
  const [productosDisp, setProductosDisp] = useState<Producto[]>([]);
  const [productosEnFactura, setProductosEnFactura] = useState<ProductoVendido[]>([]);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin"); return; }
    setReservas(getAllReservations());
    setProductosDisp(getProductos());
  }, [router]);

  function reload() { setReservas(getAllReservations()); }

  const barberos = ["todos", ...Array.from(new Set(reservas.map((r) => r.barbero)))];
  const reservasFiltradas = reservas
    .filter((r) => filtro === "todas" || (r.estado ?? "pendiente") === filtro)
    .filter((r) => filtroBarbero === "todos" || r.barbero === filtroBarbero);

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
    const precioServicio = parseFloat(modalReserva.precio.replace("$", "")) || 0;
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

  const estadoColor: Record<string, string> = {
    pendiente: "#f0c040", completada: "#4ade80", cancelada: "#ef4444",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080604" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "0 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/admin/dashboard" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8", letterSpacing: "0.1em" }}>Reservas</span>
          </div>
          <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.2em", color: "#c8921a" }}>{reservasFiltradas.length} reserva{reservasFiltradas.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Filtros */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "28px" }}>
          {(["todas", "pendiente", "completada", "cancelada"] as const).map((f) => (
            <button key={f} onClick={() => setFiltro(f)}
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", padding: "8px 20px", border: `1px solid ${filtro === f ? "#c8921a" : "rgba(92,58,30,0.4)"}`, backgroundColor: filtro === f ? "rgba(200,146,26,0.12)" : "transparent", color: filtro === f ? "#c8921a" : "rgba(184,168,138,0.5)", cursor: "pointer" }}>
              {f}
            </button>
          ))}
          <select value={filtroBarbero} onChange={(e) => setFiltroBarbero(e.target.value)}
            style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", letterSpacing: "0.2em", padding: "8px 16px", border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", color: "rgba(184,168,138,0.7)", cursor: "pointer" }}>
            {barberos.map((b) => <option key={b} value={b}>{b === "todos" ? "Todos los barberos" : b}</option>)}
          </select>
        </div>

        {/* Lista */}
        {reservasFiltradas.length === 0 ? (
          <div style={{ border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0e0b07", padding: "60px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.3)" }}>Sin reservas</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {reservasFiltradas.map((r) => {
              const estado = r.estado ?? "pendiente";
              return (
                <div key={r.id} style={{ border: "1px solid rgba(92,58,30,0.35)", backgroundColor: "#0e0b07", padding: "20px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", position: "relative" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(to right, transparent, ${estadoColor[estado]}40, transparent)` }} />

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "4px" }}>{r.clienteNombre ?? "Cliente"}</p>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.55)" }}>{r.clienteEmail}</p>
                  </div>
                  <div style={{ flex: 1, minWidth: "180px" }}>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.82rem", color: "#c8921a", fontWeight: 600 }}>{r.servicio}</p>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.55)" }}>{r.barbero}</p>
                  </div>
                  <div style={{ minWidth: "140px" }}>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", color: "#f0e6c8" }}>{r.fecha}</p>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.55)" }}>{r.hora}</p>
                  </div>
                  <div style={{ minWidth: "80px" }}>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1.1rem", fontWeight: 900, color: "#f0c040" }}>{r.precio}</p>
                  </div>
                  <div>
                    <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: estadoColor[estado], border: `1px solid ${estadoColor[estado]}50`, padding: "3px 10px" }}>{estado}</span>
                  </div>

                  {/* Acciones */}
                  {estado === "pendiente" && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button onClick={() => abrirModal(r)}
                        style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", padding: "8px 16px", background: "linear-gradient(135deg, #a06010, #c8921a)", border: "none", color: "#080604", cursor: "pointer" }}>
                        Completar
                      </button>
                      <button onClick={() => cancelarReserva(r.id)}
                        style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", padding: "8px 16px", backgroundColor: "transparent", border: "1px solid rgba(239,68,68,0.4)", color: "rgba(239,68,68,0.7)", cursor: "pointer" }}>
                        Cancelar
                      </button>
                    </div>
                  )}
                  {estado === "completada" && r.facturaId && (
                    <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.2em", color: "rgba(74,222,128,0.6)" }}>{r.facturaId}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal completar servicio */}
      {modalReserva && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(8,6,4,0.92)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ backgroundColor: "#0e0b07", border: "1px solid rgba(200,146,26,0.4)", width: "100%", maxWidth: "640px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 0 80px rgba(200,146,26,0.15)" }}>

            {/* Header modal */}
            <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8", letterSpacing: "0.1em" }}>Completar Servicio</p>
              <button onClick={() => setModalReserva(null)} style={{ background: "none", border: "none", color: "rgba(184,168,138,0.5)", cursor: "pointer", fontSize: "1.2rem" }}>✕</button>
            </div>

            <div style={{ padding: "28px" }}>
              {/* Resumen */}
              <div style={{ border: "1px solid rgba(92,58,30,0.35)", padding: "16px 20px", marginBottom: "24px", backgroundColor: "#141209" }}>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 700, color: "#c8921a", marginBottom: "4px" }}>{modalReserva.clienteNombre ?? "Cliente"}</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.6)" }}>{modalReserva.servicio} · {modalReserva.barbero} · {modalReserva.fecha} {modalReserva.hora}</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1rem", fontWeight: 900, color: "#f0c040", marginTop: "8px" }}>Servicio: {modalReserva.precio}</p>
              </div>

              {/* Método de pago */}
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.7)", marginBottom: "12px" }}>Método de Pago</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", marginBottom: "28px" }}>
                {(["efectivo", "tarjeta", "transferencia", "otro"] as MetodoPago[]).map((m) => (
                  <button key={m} onClick={() => setMetodoPago(m)}
                    style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", padding: "12px", border: `1px solid ${metodoPago === m ? "#c8921a" : "rgba(92,58,30,0.4)"}`, backgroundColor: metodoPago === m ? "rgba(200,146,26,0.12)" : "transparent", color: metodoPago === m ? "#c8921a" : "rgba(184,168,138,0.5)", cursor: "pointer" }}>
                    {m}
                  </button>
                ))}
              </div>

              {/* Agregar productos */}
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.7)", marginBottom: "12px" }}>Productos Adicionales (opcional)</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "8px", marginBottom: "20px" }}>
                {productosDisp.map((p) => (
                  <button key={p.id} onClick={() => agregarProducto(p)}
                    style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", padding: "10px 12px", border: "1px solid rgba(92,58,30,0.35)", backgroundColor: "#141209", color: "rgba(184,168,138,0.7)", cursor: "pointer", textAlign: "left" }}>
                    <span style={{ display: "block", fontWeight: 600, color: "#f0e6c8", marginBottom: "2px" }}>{p.nombre}</span>
                    <span style={{ color: "#c8921a" }}>${p.precio}</span>
                  </button>
                ))}
              </div>

              {/* Productos en factura */}
              {productosEnFactura.length > 0 && (
                <div style={{ border: "1px solid rgba(92,58,30,0.35)", padding: "16px", marginBottom: "24px", backgroundColor: "#141209" }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", marginBottom: "12px" }}>En esta venta:</p>
                  {productosEnFactura.map((p) => (
                    <div key={p.nombre} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "#f0e6c8" }}>{p.nombre} x{p.cantidad}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "#c8921a" }}>${p.precio * p.cantidad}</span>
                        <button onClick={() => quitarProducto(p.nombre)} style={{ background: "none", border: "none", color: "rgba(239,68,68,0.6)", cursor: "pointer", fontSize: "0.8rem" }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div style={{ borderTop: "1px solid rgba(92,58,30,0.4)", paddingTop: "16px", marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", color: "rgba(184,168,138,0.6)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Total</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1.4rem", fontWeight: 900, color: "#f0c040" }}>
                  ${(parseFloat(modalReserva.precio.replace("$", "")) || 0) + productosEnFactura.reduce((s, p) => s + p.precio * p.cantidad, 0)}
                </p>
              </div>

              {/* Botones */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button onClick={() => setModalReserva(null)}
                  style={{ flex: 1, padding: "14px", fontFamily: "var(--font-barlow)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.4)", color: "rgba(184,168,138,0.5)", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={completarServicio} disabled={guardando}
                  style={{ flex: 2, padding: "14px", fontFamily: "var(--font-barlow)", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", background: "linear-gradient(135deg, #a06010, #c8921a, #f0c040, #c8921a, #a06010)", border: "none", color: "#080604", cursor: "pointer", boxShadow: "0 0 25px rgba(200,146,26,0.4)" }}>
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
