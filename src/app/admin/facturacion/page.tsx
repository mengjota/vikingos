"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

export interface Factura {
  id: string;
  reservaId: string;
  clienteEmail: string;
  clienteNombre: string;
  servicio: string;
  barbero: string;
  fecha: string;
  hora: string;
  precioServicio: number;
  metodoPago: "efectivo" | "tarjeta" | "transferencia" | "otro" | string;
  productosAdicionales: { nombre: string; precio: number; cantidad: number }[];
  subtotalProductos: number;
  total: number;
  completadaEl: string;
}
export default function AdminFacturacion() {
  const router = useRouter();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [detalle, setDetalle] = useState<Factura | null>(null);
  const [filtroBarbero, setFiltroBarbero] = useState("todos");
  const [filtroMetodo, setFiltroMetodo] = useState("todos");

  useEffect(() => {
    getSession().then((s) => {
      if (!s || s.role !== "owner") {
        router.push("/admin");
        return;
      }
      fetch("/api/admin/invoices").then(r => r.json()).then(setFacturas);
    });
  }, [router]);

  const barberos = ["todos", ...Array.from(new Set(facturas.map((f) => f.barbero)))];
  const metodos = ["todos", "efectivo", "tarjeta", "transferencia", "otro"];

  const filtradas = facturas
    .filter((f) => filtroBarbero === "todos" || f.barbero === filtroBarbero)
    .filter((f) => filtroMetodo === "todos" || f.metodoPago === filtroMetodo);

  const totalGeneral = filtradas.reduce((s, f) => s + f.total, 0);
  const totalServicios = filtradas.reduce((s, f) => s + f.precioServicio, 0);
  const totalProductos = filtradas.reduce((s, f) => s + f.subtotalProductos, 0);

  const metodoColor: Record<string, string> = {
    efectivo: "#4ade80", tarjeta: "#60a5fa", transferencia: "#a78bfa", otro: "#fb923c",
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080604" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "0 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/admin/dashboard" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8", letterSpacing: "0.1em" }}>Facturación</span>
          </div>
          <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", letterSpacing: "0.2em", color: "#c8921a" }}>{filtradas.length} registro{filtradas.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Resumen */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "32px" }}>
          {[
            { label: "Ingresos Totales", value: `$${totalGeneral}`, color: "#f0c040" },
            { label: "Por Servicios", value: `$${totalServicios}`, color: "#c8921a" },
            { label: "Por Productos", value: `$${totalProductos}`, color: "#4ade80" },
            { label: "Transacciones", value: filtradas.length, color: "#60a5fa" },
          ].map((s, i) => (
            <div key={i} style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${s.color}70, transparent)` }} />
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(184,168,138,0.45)", marginBottom: "10px" }}>{s.label}</p>
              <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.6rem", fontWeight: 900, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
          <select value={filtroBarbero} onChange={(e) => setFiltroBarbero(e.target.value)}
            style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", letterSpacing: "0.2em", padding: "8px 14px", border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", color: "rgba(184,168,138,0.7)", cursor: "pointer" }}>
            {barberos.map((b) => <option key={b} value={b}>{b === "todos" ? "Todos los barberos" : b}</option>)}
          </select>
          <select value={filtroMetodo} onChange={(e) => setFiltroMetodo(e.target.value)}
            style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", letterSpacing: "0.2em", padding: "8px 14px", border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", color: "rgba(184,168,138,0.7)", cursor: "pointer" }}>
            {metodos.map((m) => <option key={m} value={m}>{m === "todos" ? "Todos los métodos" : m}</option>)}
          </select>
        </div>

        {/* Lista */}
        {filtradas.length === 0 ? (
          <div style={{ border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0e0b07", padding: "80px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.3)" }}>Sin registros aún</p>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.2)", marginTop: "8px" }}>Las facturas aparecerán aquí cuando completes servicios desde Reservas</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filtradas.map((f) => (
              <div key={f.id} onClick={() => setDetalle(f)}
                style={{ border: "1px solid rgba(92,58,30,0.35)", backgroundColor: "#0e0b07", padding: "18px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", cursor: "pointer", transition: "all 0.2s", position: "relative" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(200,146,26,0.4)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(92,58,30,0.35)"; }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.25), transparent)" }} />

                <div style={{ flex: 1, minWidth: "160px" }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "#c8921a", marginBottom: "2px" }}>{f.id}</p>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.88rem", fontWeight: 700, color: "#f0e6c8" }}>{f.clienteNombre}</p>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", color: "rgba(184,168,138,0.45)" }}>{f.clienteEmail}</p>
                </div>
                <div style={{ flex: 1, minWidth: "160px" }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.82rem", color: "#f0e6c8", fontWeight: 600 }}>{f.servicio}</p>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.5)" }}>{f.barbero}</p>
                </div>
                <div style={{ minWidth: "120px" }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "#f0e6c8" }}>{f.fecha} {f.hora}</p>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", color: "rgba(184,168,138,0.4)" }}>Creado: {f.completadaEl}</p>
                </div>
                <div>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: metodoColor[f.metodoPago] ?? "#c8921a", border: `1px solid ${(metodoColor[f.metodoPago] ?? "#c8921a")}40`, padding: "3px 10px" }}>{f.metodoPago}</span>
                </div>
                <div style={{ textAlign: "right", minWidth: "80px" }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1.2rem", fontWeight: 900, color: "#f0c040" }}>${f.total}</p>
                  {f.subtotalProductos > 0 && (
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "#4ade80" }}>+${f.subtotalProductos} prod.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal detalle factura */}
      {detalle && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(8,6,4,0.93)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ backgroundColor: "#0e0b07", border: "1px solid rgba(200,146,26,0.4)", width: "100%", maxWidth: "500px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 0 80px rgba(200,146,26,0.12)" }}>
            <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#c8921a", marginBottom: "2px" }}>{detalle.id}</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8" }}>Detalle de Factura</p>
              </div>
              <button onClick={() => setDetalle(null)} style={{ background: "none", border: "none", color: "rgba(184,168,138,0.5)", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
            </div>

            <div style={{ padding: "28px" }}>
              {/* Cliente */}
              <div style={{ marginBottom: "20px" }}>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", marginBottom: "8px" }}>Cliente</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8" }}>{detalle.clienteNombre}</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.5)" }}>{detalle.clienteEmail}</p>
              </div>

              {/* Servicio */}
              <div style={{ border: "1px solid rgba(92,58,30,0.35)", padding: "16px", marginBottom: "16px", backgroundColor: "#141209" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.82rem", color: "#f0e6c8" }}>{detalle.servicio}</span>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.82rem", fontWeight: 700, color: "#c8921a" }}>${detalle.precioServicio}</span>
                </div>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", color: "rgba(184,168,138,0.45)" }}>{detalle.barbero} · {detalle.fecha} {detalle.hora}</p>
              </div>

              {/* Productos */}
              {detalle.productosAdicionales.length > 0 && (
                <div style={{ border: "1px solid rgba(92,58,30,0.35)", padding: "16px", marginBottom: "16px", backgroundColor: "#141209" }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", marginBottom: "12px" }}>Productos vendidos</p>
                  {detalle.productosAdicionales.map((p) => (
                    <div key={p.nombre} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "#f0e6c8" }}>{p.nombre} x{p.cantidad}</span>
                      <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "#4ade80" }}>${p.precio * p.cantidad}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Totales */}
              <div style={{ borderTop: "1px solid rgba(92,58,30,0.4)", paddingTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.5)" }}>Subtotal servicio</span>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "#f0e6c8" }}>${detalle.precioServicio}</span>
                </div>
                {detalle.subtotalProductos > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.5)" }}>Subtotal productos</span>
                    <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "#4ade80" }}>${detalle.subtotalProductos}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", borderTop: "1px solid rgba(92,58,30,0.4)", paddingTop: "12px" }}>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 700, color: "#f0e6c8", letterSpacing: "0.2em", textTransform: "uppercase" }}>Total</span>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "1.3rem", fontWeight: 900, color: "#f0c040" }}>${detalle.total}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: metodoColor[detalle.metodoPago] ?? "#c8921a", border: `1px solid ${(metodoColor[detalle.metodoPago] ?? "#c8921a")}40`, padding: "4px 12px" }}>{detalle.metodoPago}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
