"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/auth";

interface Venta {
  id: number; empleado_nombre: string; empleado_email: string;
  servicio: string; metodo_pago: string;
  precio_total: string; precio_base: string; iva_pct: string; iva_importe: string;
  notas: string; created_at: string;
}
interface BarbershopInfo {
  name: string; cif: string; razon_social: string; nombre_comercial: string;
  direccion_fiscal: string; codigo_postal: string; ciudad_fiscal: string;
  email_fiscal: string; phone: string; address: string; iva_pct: number;
}

const MCOLOR: Record<string, string> = {
  efectivo: "#4ade80", tarjeta: "#60a5fa", bizum: "#a78bfa", transferencia: "#fb923c",
};

function mesActual() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function fmtEur(v: string | number) {
  return `${parseFloat(String(v)).toFixed(2)} €`;
}

function fmtFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function fmtHora(iso: string) {
  return new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function nombreMes(mes: string) {
  const [y, m] = mes.split("-");
  return new Date(+y, +m - 1).toLocaleDateString("es-ES", { month: "long", year: "numeric" });
}

export default function AdminFacturacion() {
  const router = useRouter();
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [barbershop, setBarbershop] = useState<BarbershopInfo | null>(null);
  const [mes, setMes] = useState(mesActual());
  const [filtroEmpleado, setFiltroEmpleado] = useState("todos");
  const [filtroMetodo, setFiltroMetodo] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);

  const cargar = useCallback(async (m: string) => {
    setLoading(true);
    try {
      const [vRes, bRes] = await Promise.all([
        fetch(`/api/admin/ventas?mes=${m}`),
        fetch("/api/admin/mi-barberia"),
      ]);
      if (vRes.ok) setVentas(await vRes.json());
      if (bRes.ok) setBarbershop(await bRes.json());
    } catch (_) {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    getSession().then((s) => {
      if (!s || s.role !== "owner") { router.push("/staff"); return; }
      cargar(mes);
    });
  }, [router, mes, cargar]);

  const empleados = ["todos", ...Array.from(new Set(ventas.map(v => v.empleado_nombre || v.empleado_email)))];
  const metodos   = ["todos", "efectivo", "tarjeta", "bizum", "transferencia"];

  const filtradas = ventas
    .filter(v => filtroEmpleado === "todos" || (v.empleado_nombre || v.empleado_email) === filtroEmpleado)
    .filter(v => filtroMetodo === "todos" || v.metodo_pago === filtroMetodo);

  const totalBruto = filtradas.reduce((s, v) => s + parseFloat(v.precio_total), 0);
  const totalBase  = filtradas.reduce((s, v) => s + parseFloat(v.precio_base), 0);
  const totalIva   = filtradas.reduce((s, v) => s + parseFloat(v.iva_importe), 0);

  // Generar PDF (nueva pestaña, listo para imprimir)
  function generarPDF() {
    setPdfLoading(true);
    const b = barbershop;
    const filas = filtradas.map(v => `
      <tr>
        <td>${fmtFecha(v.created_at)} ${fmtHora(v.created_at)}</td>
        <td>${v.empleado_nombre || v.empleado_email}</td>
        <td>${v.servicio}</td>
        <td>${v.metodo_pago}</td>
        <td style="text-align:right">${fmtEur(v.precio_base)}</td>
        <td style="text-align:right">${v.iva_pct}%</td>
        <td style="text-align:right">${fmtEur(v.iva_importe)}</td>
        <td style="text-align:right;font-weight:700">${fmtEur(v.precio_total)}</td>
      </tr>
    `).join("");

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Liquidación ${nombreMes(mes)} — ${b?.nombre_comercial || b?.name || "Barbería"}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 11px; color: #111; padding: 32px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 28px; }
    .logo { font-size: 18px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
    .fiscal { font-size: 10px; color: #555; line-height: 1.6; }
    h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
    .periodo { font-size: 11px; color: #555; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #111; color: #fff; padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 7px 10px; border-bottom: 1px solid #e5e5e5; font-size: 10px; }
    tr:nth-child(even) td { background: #f9f9f9; }
    .totales { margin-left: auto; width: 280px; border: 1px solid #ddd; }
    .totales td { padding: 8px 12px; }
    .totales .label { color: #555; }
    .totales .final td { font-weight: 900; font-size: 13px; background: #111; color: #fff; }
    .pie { margin-top: 32px; font-size: 9px; color: #999; border-top: 1px solid #eee; padding-top: 12px; }
    @media print { body { padding: 16px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">${b?.nombre_comercial || b?.name || "Barbería"}</div>
      ${b?.razon_social ? `<div class="fiscal">${b.razon_social}</div>` : ""}
      ${b?.cif ? `<div class="fiscal">CIF/NIF: ${b.cif}</div>` : ""}
      ${b?.direccion_fiscal ? `<div class="fiscal">${b.direccion_fiscal}</div>` : ""}
      ${b?.codigo_postal || b?.ciudad_fiscal ? `<div class="fiscal">${[b?.codigo_postal, b?.ciudad_fiscal].filter(Boolean).join(" — ")}</div>` : ""}
      ${b?.phone ? `<div class="fiscal">Tel: ${b.phone}</div>` : ""}
      ${b?.email_fiscal ? `<div class="fiscal">${b.email_fiscal}</div>` : ""}
    </div>
    <div style="text-align:right">
      <h2>Liquidación de Ventas</h2>
      <div class="periodo" style="margin-bottom:4px">${nombreMes(mes).toUpperCase()}</div>
      <div class="fiscal">Generado: ${new Date().toLocaleDateString("es-ES")}</div>
      <div class="fiscal">${filtradas.length} transacciones</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Fecha / Hora</th>
        <th>Empleado</th>
        <th>Servicio</th>
        <th>Pago</th>
        <th style="text-align:right">Base Imp.</th>
        <th style="text-align:right">IVA</th>
        <th style="text-align:right">Cuota IVA</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${filas || '<tr><td colspan="8" style="text-align:center;padding:20px;color:#999">Sin ventas en este período</td></tr>'}
    </tbody>
  </table>

  <table class="totales">
    <tbody>
      <tr><td class="label">Base imponible</td><td style="text-align:right">${fmtEur(totalBase)}</td></tr>
      <tr><td class="label">IVA ${b?.iva_pct ?? 21}%</td><td style="text-align:right">${fmtEur(totalIva)}</td></tr>
      <tr class="final"><td>TOTAL</td><td style="text-align:right">${fmtEur(totalBruto)}</td></tr>
    </tbody>
  </table>

  <div class="pie">
    Documento generado automáticamente por BarberOS · No es una factura oficial · ${b?.cif ? `NIF/CIF: ${b.cif}` : "Completa los datos fiscales en Configuración para mayor validez"}
  </div>

  <script>window.onload = () => window.print();<\/script>
</body>
</html>`;

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url  = URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    setPdfLoading(false);
  }

  const S = {
    sel: { fontFamily: "var(--font-barlow)", fontSize: "0.68rem", letterSpacing: "0.2em", padding: "8px 14px", border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", color: "rgba(184,168,138,0.7)", cursor: "pointer" } as React.CSSProperties,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080604" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "0 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/admin/dashboard" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8", letterSpacing: "0.1em" }}>Facturación</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", letterSpacing: "0.2em", color: "#c8921a" }}>{filtradas.length} venta{filtradas.length !== 1 ? "s" : ""}</span>
            <button onClick={() => logout("/staff")} style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(239,68,68,0.5)", background: "none", border: "none", cursor: "pointer" }}>Salir</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Resumen con IVA */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "28px" }}>
          {[
            { label: "Total Facturado", value: fmtEur(totalBruto), color: "#f0c040" },
            { label: "Base Imponible", value: fmtEur(totalBase),  color: "#c8921a" },
            { label: `IVA ${barbershop?.iva_pct ?? 21}%`, value: fmtEur(totalIva), color: "#60a5fa" },
            { label: "Transacciones",  value: filtradas.length.toString(), color: "#4ade80" },
          ].map((s, i) => (
            <div key={i} style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${s.color}70, transparent)` }} />
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(184,168,138,0.45)", marginBottom: "10px" }}>{s.label}</p>
              <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.4rem", fontWeight: 900, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filtros + PDF */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px", alignItems: "center" }}>
          <input type="month" value={mes} onChange={e => setMes(e.target.value)} style={{ ...S.sel, cursor: "pointer" }} />
          <select value={filtroEmpleado} onChange={e => setFiltroEmpleado(e.target.value)} style={S.sel}>
            {empleados.map(b => <option key={b} value={b}>{b === "todos" ? "Todos los empleados" : b}</option>)}
          </select>
          <select value={filtroMetodo} onChange={e => setFiltroMetodo(e.target.value)} style={S.sel}>
            {metodos.map(m => <option key={m} value={m}>{m === "todos" ? "Todos los métodos" : m}</option>)}
          </select>
          <div style={{ flex: 1 }} />
          <button onClick={generarPDF} disabled={pdfLoading || filtradas.length === 0}
            style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", padding: "10px 20px", background: filtradas.length === 0 ? "rgba(92,58,30,0.2)" : "linear-gradient(135deg,#a06010,#c8921a)", border: "none", color: filtradas.length === 0 ? "rgba(184,168,138,0.3)" : "#080604", cursor: filtradas.length === 0 ? "not-allowed" : "pointer", boxShadow: filtradas.length > 0 ? "0 0 20px rgba(200,146,26,0.3)" : "none" }}>
            {pdfLoading ? "Generando..." : "⬇ Descargar PDF"}
          </button>
        </div>

        {/* Aviso datos fiscales */}
        {barbershop && !barbershop.cif && (
          <div style={{ border: "1px solid rgba(200,146,26,0.3)", backgroundColor: "rgba(200,146,26,0.05)", padding: "12px 16px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ color: "#c8921a" }}>⚠</span>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(200,146,26,0.7)" }}>
              Completa los <a href="/admin/configuracion" style={{ color: "#c8921a", textDecoration: "underline" }}>datos fiscales</a> (CIF, razón social...) para que aparezcan en el PDF.
            </p>
          </div>
        )}

        {/* Lista de ventas */}
        {loading ? (
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", letterSpacing: "0.3em", color: "rgba(184,168,138,0.3)" }}>CARGANDO...</p>
        ) : filtradas.length === 0 ? (
          <div style={{ border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0e0b07", padding: "80px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.3)" }}>Sin ventas en {nombreMes(mes)}</p>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.2)", marginTop: "8px" }}>Los empleados registran ventas desde su Caja (Mi Agenda → Registrar Venta)</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {filtradas.map(v => (
              <div key={v.id}
                style={{ border: "1px solid rgba(92,58,30,0.35)", backgroundColor: "#0e0b07", padding: "14px 20px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}>
                {/* Fecha */}
                <div style={{ minWidth: "100px" }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.6)" }}>{fmtFecha(v.created_at)}</p>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "rgba(184,168,138,0.35)" }}>{fmtHora(v.created_at)}</p>
                </div>
                {/* Empleado */}
                <div style={{ minWidth: "100px" }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", fontWeight: 600, color: "#c8921a" }}>{v.empleado_nombre || v.empleado_email}</p>
                </div>
                {/* Servicio */}
                <div style={{ flex: 1, minWidth: "120px" }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 600, color: "#f0e6c8" }}>{v.servicio}</p>
                  {v.notas && <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "rgba(184,168,138,0.35)" }}>{v.notas}</p>}
                </div>
                {/* Método */}
                <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "capitalize", color: MCOLOR[v.metodo_pago] ?? "#c8921a", border: `1px solid ${(MCOLOR[v.metodo_pago] ?? "#c8921a")}40`, padding: "2px 8px" }}>
                  {v.metodo_pago}
                </span>
                {/* IVA desglose */}
                <div style={{ textAlign: "right", minWidth: "140px" }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "rgba(184,168,138,0.35)" }}>Base: {fmtEur(v.precio_base)}</p>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "rgba(96,165,250,0.6)" }}>IVA {v.iva_pct}%: {fmtEur(v.iva_importe)}</p>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1rem", fontWeight: 900, color: "#f0c040" }}>{fmtEur(v.precio_total)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
