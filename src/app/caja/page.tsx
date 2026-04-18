"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/auth";

interface Service { id: number; name: string; price: string; }
interface Venta {
  id: number; servicio: string; metodo_pago: string;
  precio_total: string; precio_base: string; iva_importe: string; iva_pct: string;
  empleado_nombre: string; notas: string; created_at: string;
}

const METODOS = ["efectivo", "tarjeta", "bizum", "transferencia"];
const IVA = 21;

const S = {
  input: {
    width: "100%", padding: "13px 16px", backgroundColor: "#0a0806",
    border: "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8",
    fontFamily: "var(--font-barlow)", fontSize: "0.95rem", outline: "none",
    boxSizing: "border-box",
  } as React.CSSProperties,
  label: {
    fontFamily: "var(--font-barlow)", fontSize: "0.62rem", letterSpacing: "0.35em",
    textTransform: "uppercase", color: "rgba(200,146,26,0.8)", display: "block", marginBottom: "8px",
  } as React.CSSProperties,
};

function calcIva(total: number) {
  const base = total / (1 + IVA / 100);
  const iva  = total - base;
  return { base: base.toFixed(2), iva: iva.toFixed(2) };
}

function horaCorta(iso: string) {
  return new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function metodoBadge(m: string) {
  const colors: Record<string, string> = { efectivo: "#4ade80", tarjeta: "#60a5fa", bizum: "#a78bfa", transferencia: "#fb923c" };
  return colors[m] ?? "#c8921a";
}

export default function CajaPage() {
  const router = useRouter();
  const [session, setSession] = useState<Awaited<ReturnType<typeof getSession>>>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [ventas, setVentas] = useState<Venta[]>([]);

  const [servicio, setServicio]   = useState("");
  const [precio, setPrecio]       = useState("");
  const [metodo, setMetodo]       = useState("efectivo");
  const [notas, setNotas]         = useState("");
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState("");
  const [ok, setOk]               = useState(false);

  const hoyStr = new Date().toISOString().split("T")[0];
  const [filtroDesde, setFiltroDesde] = useState(hoyStr);
  const [filtroHasta, setFiltroHasta] = useState(hoyStr);

  const total = parseFloat(precio) || 0;
  const { base, iva } = calcIva(total);

  const cargarVentas = useCallback(async (desde?: string, hasta?: string) => {
    const d = desde ?? new Date().toISOString().split("T")[0];
    const h = hasta ?? d;
    const res = await fetch(`/api/ventas?desde=${d}&hasta=${h}`);
    if (res.ok) setVentas(await res.json());
  }, []);

  useEffect(() => {
    getSession().then((s) => {
      if (!s || (s.role !== "employee" && s.role !== "owner")) {
        router.push("/staff"); return;
      }
      setSession(s);
      const bid = s.barbershopId ?? "narvek";
      fetch(`/api/services?barbershopId=${bid}`)
        .then(r => r.json()).then(setServices).catch(() => {});
      cargarVentas(hoyStr, hoyStr);
    });
  }, [router, cargarVentas]);

  function selectService(svc: Service) {
    setServicio(svc.name);
    const num = parseFloat(svc.price.replace(/[^\d.,]/g, "").replace(",", "."));
    if (!isNaN(num)) setPrecio(num.toFixed(2));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setOk(false);
    if (!servicio.trim()) { setError("Indica el servicio."); return; }
    if (!total || total <= 0) { setError("Precio inválido."); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/ventas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicio, metodo_pago: metodo, precio_total: total, notas }),
      });
      const d = await res.json();
      if (!res.ok) { setError(d.error ?? `Error ${res.status}`); return; }
      setOk(true);
      setServicio(""); setPrecio(""); setNotas(""); setMetodo("efectivo");
      cargarVentas(filtroDesde, filtroHasta);
      setTimeout(() => setOk(false), 2500);
    } catch (_) {
      setError("Error de conexión.");
    } finally {
      setSaving(false);
    }
  }

  const totalHoy = ventas.reduce((s, v) => s + parseFloat(v.precio_total), 0);
  const baseHoy  = ventas.reduce((s, v) => s + parseFloat(v.precio_base), 0);
  const ivaHoy   = ventas.reduce((s, v) => s + parseFloat(v.iva_importe), 0);

  const esSoloHoy = filtroDesde === filtroHasta && filtroDesde === new Date().toISOString().split("T")[0];
  const periodoLabel = esSoloHoy ? new Date().toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }) : `${filtroDesde} — ${filtroHasta}`;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060504" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(200,146,26,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ backgroundColor: "#0a0806", borderBottom: "1px solid rgba(92,58,30,0.45)", padding: "0 24px" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a href="/empleado" style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", textDecoration: "none", fontFamily: "var(--font-barlow)" }}>← Hub</a>
            <span style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1rem", color: "#c8921a" }}>Caja · Registro de Ventas</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/mi-agenda" style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(167,139,250,0.8)", border: "1px solid rgba(167,139,250,0.3)", padding: "6px 14px", textDecoration: "none", fontFamily: "var(--font-barlow)" }}>Agenda →</a>
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.5)", letterSpacing: "0.1em" }}>{session?.barberName ?? session?.name}</span>
            <button onClick={() => logout("/staff")} style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(239,68,68,0.5)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-barlow)" }}>Salir</button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "32px 24px" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "capitalize" as const, color: "rgba(200,146,26,0.5)", marginBottom: "4px" }}>{periodoLabel}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px", marginTop: "24px" }}>

          {/* ── FORMULARIO ── */}
          <div>
            <div style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0a0806", padding: "28px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #c8921a, transparent)" }} />
              <h2 style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f0e6c8", marginBottom: "20px" }}>
                Nueva Venta
              </h2>

              {/* Accesos rápidos de servicios */}
              {services.length > 0 && (
                <div style={{ marginBottom: "20px" }}>
                  <p style={S.label}>Acceso rápido</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {services.slice(0, 8).map(s => (
                      <button key={s.id} onClick={() => selectService(s)}
                        style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.15em", padding: "6px 12px", border: "1px solid rgba(92,58,30,0.5)", backgroundColor: servicio === s.name ? "rgba(200,146,26,0.15)" : "transparent", color: servicio === s.name ? "#c8921a" : "rgba(184,168,138,0.6)", cursor: "pointer", transition: "all 0.15s" }}>
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={S.label}>Servicio *</label>
                  <input value={servicio} onChange={e => setServicio(e.target.value)} placeholder="Corte, arreglo de barba..." style={S.input} />
                </div>

                <div>
                  <label style={S.label}>Precio total (IVA incl.) *</label>
                  <input type="number" min="0" step="0.01" value={precio} onChange={e => setPrecio(e.target.value)} placeholder="20.00" style={{ ...S.input, fontFamily: "monospace", fontSize: "1.1rem" }} />
                </div>

                {/* Preview IVA */}
                {total > 0 && (
                  <div style={{ border: "1px solid rgba(200,146,26,0.2)", backgroundColor: "rgba(200,146,26,0.04)", padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.6)", marginBottom: "6px" }}>
                      <span>Base imponible ({100 - IVA}/{100 + IVA} × {precio})</span>
                      <span>{base} €</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.6)", marginBottom: "6px" }}>
                      <span>IVA {IVA}%</span>
                      <span>{iva} €</span>
                    </div>
                    <div style={{ borderTop: "1px solid rgba(200,146,26,0.2)", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#c8921a" }}>
                      <span>Total</span>
                      <span>{total.toFixed(2)} €</span>
                    </div>
                  </div>
                )}

                <div>
                  <label style={S.label}>Método de pago</label>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {METODOS.map(m => (
                      <button key={m} type="button" onClick={() => setMetodo(m)}
                        style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "capitalize", padding: "8px 14px", border: `1px solid ${metodo === m ? metodoBadge(m) : "rgba(92,58,30,0.4)"}`, backgroundColor: metodo === m ? `${metodoBadge(m)}18` : "transparent", color: metodo === m ? metodoBadge(m) : "rgba(184,168,138,0.5)", cursor: "pointer" }}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={S.label}>Notas (opcional)</label>
                  <input value={notas} onChange={e => setNotas(e.target.value)} placeholder="Observaciones..." maxLength={200} style={S.input} />
                </div>

                {error && <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "#f87171" }}>⚠ {error}</p>}
                {ok    && <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "#4ade80" }}>✓ Venta registrada correctamente</p>}

                <button type="submit" disabled={saving}
                  style={{ padding: "14px", background: saving ? "rgba(92,58,30,0.3)" : "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", border: "none", cursor: saving ? "not-allowed" : "pointer", fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.4em", textTransform: "uppercase", color: saving ? "rgba(184,168,138,0.3)" : "#080604", boxShadow: saving ? "none" : "0 0 25px rgba(200,146,26,0.35)" }}>
                  {saving ? "Registrando..." : "Registrar Venta"}
                </button>
              </form>
            </div>
          </div>

          {/* ── RESUMEN / HISTORIAL ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Filtro de fechas */}
            <div style={{ border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0a0806", padding: "16px 20px", display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap" }}>
              <div>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,146,26,0.6)", marginBottom: "6px" }}>Desde</p>
                <input type="date" value={filtroDesde} onChange={e => setFiltroDesde(e.target.value)}
                  style={{ backgroundColor: "#060504", border: "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "0.85rem", padding: "8px 10px", outline: "none" }} />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,146,26,0.6)", marginBottom: "6px" }}>Hasta</p>
                <input type="date" value={filtroHasta} onChange={e => setFiltroHasta(e.target.value)}
                  style={{ backgroundColor: "#060504", border: "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "0.85rem", padding: "8px 10px", outline: "none" }} />
              </div>
              <button onClick={() => cargarVentas(filtroDesde, filtroHasta)} style={{
                padding: "8px 16px", border: "1px solid rgba(200,146,26,0.4)", backgroundColor: "rgba(200,146,26,0.08)",
                color: "#c8921a", fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em",
                textTransform: "uppercase", cursor: "pointer",
              }}>
                Buscar
              </button>
            </div>

            {/* Totales del período */}
            <div style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0a0806", padding: "24px", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #4ade8080, transparent)" }} />
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(184,168,138,0.45)", marginBottom: "16px" }}>Resumen {esSoloHoy ? "de hoy" : "del período"}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  { l: "Ventas", v: ventas.length.toString(), c: "#c8921a" },
                  { l: "Total", v: `${totalHoy.toFixed(2)} €`, c: "#f0c040" },
                  { l: "Base imponible", v: `${baseHoy.toFixed(2)} €`, c: "rgba(184,168,138,0.6)" },
                  { l: `IVA ${IVA}%`, v: `${ivaHoy.toFixed(2)} €`, c: "rgba(184,168,138,0.6)" },
                ].map((s, i) => (
                  <div key={i}>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.35)", marginBottom: "4px" }}>{s.l}</p>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1rem", fontWeight: 700, color: s.c }}>{s.v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lista de ventas */}
            <div style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0a0806", padding: "20px", flex: 1 }}>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(184,168,138,0.45)", marginBottom: "16px" }}>{esSoloHoy ? "Ventas de hoy" : `${ventas.length} ventas en el período`}</p>
              {ventas.length === 0 ? (
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.2)", letterSpacing: "0.2em" }}>Sin ventas aún</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "400px", overflowY: "auto" }}>
                  {ventas.map(v => (
                    <div key={v.id} style={{ padding: "12px 14px", border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#060504" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 600, color: "#f0e6c8" }}>{v.servicio}</p>
                        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#c8921a" }}>{parseFloat(v.precio_total).toFixed(2)} €</span>
                      </div>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", color: "rgba(184,168,138,0.35)" }}>{horaCorta(v.created_at)}</span>
                        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "capitalize", color: metodoBadge(v.metodo_pago), border: `1px solid ${metodoBadge(v.metodo_pago)}40`, padding: "1px 6px" }}>{v.metodo_pago}</span>
                        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", color: "rgba(184,168,138,0.3)" }}>IVA: {parseFloat(v.iva_importe).toFixed(2)} €</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
