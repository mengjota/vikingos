"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/auth";

interface BarbershopData {
  id: string; name: string; slug: string;
  address: string; phone: string; description: string;
  cif: string; razon_social: string; nombre_comercial: string;
  direccion_fiscal: string; codigo_postal: string; ciudad_fiscal: string;
  email_fiscal: string; iva_pct: number;
}

const EMPTY: BarbershopData = {
  id: "", name: "", slug: "", address: "", phone: "", description: "",
  cif: "", razon_social: "", nombre_comercial: "",
  direccion_fiscal: "", codigo_postal: "", ciudad_fiscal: "",
  email_fiscal: "", iva_pct: 21,
};

const inp: React.CSSProperties = {
  width: "100%", padding: "13px 16px", backgroundColor: "#0a0806",
  border: "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8",
  fontFamily: "var(--font-barlow)", fontSize: "0.95rem",
  outline: "none", boxSizing: "border-box",
};
const lbl: React.CSSProperties = {
  fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.35em",
  textTransform: "uppercase", color: "rgba(200,146,26,0.8)", display: "block", marginBottom: "8px",
};
const hint: React.CSSProperties = {
  fontFamily: "var(--font-barlow)", fontSize: "0.6rem",
  color: "rgba(184,168,138,0.25)", marginTop: "4px",
};

export default function AdminConfiguracion() {
  const router = useRouter();
  const [session, setSession] = useState<{ name: string; email: string } | null>(null);
  const [form, setForm] = useState<BarbershopData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((s) => {
      if (!s || s.role !== "owner") { router.push("/staff"); return; }
      setSession(s);
      fetch("/api/admin/mi-barberia")
        .then(r => r.json())
        .then((d: BarbershopData) => { setForm(d); setLoading(false); })
        .catch(() => setLoading(false));
    });
  }, [router]);

  const set = (key: keyof BarbershopData, val: string | number) =>
    setForm(f => ({ ...f, [key]: val }));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setMsg(null); setSaving(true);
    try {
      const res = await fetch("/api/admin/mi-barberia", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setMsg({ type: "err", text: json.error ?? `Error ${res.status}` }); return; }
      setForm(f => ({ ...f, ...json }));
      setMsg({ type: "ok", text: "¡Datos guardados correctamente!" });
      setTimeout(() => setMsg(null), 3500);
    } catch (_) {
      setMsg({ type: "err", text: "Error de conexión." });
    } finally { setSaving(false); }
  }

  const Bar = () => (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #c8921a, transparent)" }} />
  );
  const sectionStyle: React.CSSProperties = {
    border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0a0806",
    padding: "28px 32px", position: "relative", overflow: "hidden",
  };
  const grid: React.CSSProperties = {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060504" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(200,146,26,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ backgroundColor: "#0a0806", borderBottom: "1px solid rgba(92,58,30,0.45)", padding: "0 28px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a href="/admin/dashboard" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.1rem", color: "#c8921a" }}>Mi Barbería</span>
          </div>
          <button onClick={() => logout("/staff")} style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(239,68,68,0.5)", background: "none", border: "none", cursor: "pointer" }}>Salir</button>
        </div>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.4rem,4vw,2rem)", color: "#f0e6c8", fontWeight: 900, marginBottom: "8px" }}>Configuración</h1>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", letterSpacing: "0.12em", color: "rgba(184,168,138,0.45)", marginBottom: "40px" }}>Datos públicos, contacto y datos fiscales para facturas.</p>

        {loading ? (
          <p style={{ fontFamily: "var(--font-barlow)", color: "rgba(184,168,138,0.3)", letterSpacing: "0.3em", fontSize: "0.75rem" }}>CARGANDO...</p>
        ) : (
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* ── Datos del local ── */}
            <div style={sectionStyle}>
              <Bar />
              <h2 style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f0e6c8", marginBottom: "24px" }}>Datos del Local</h2>
              <div style={grid}>
                <div>
                  <label style={lbl}>Nombre del local *</label>
                  <input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Barbería los Inmortales" maxLength={60} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Teléfono</label>
                  <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+34 612 345 678" maxLength={30} style={inp} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lbl}>Dirección del local</label>
                  <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="Carrer de Mallorca 123, Barcelona" maxLength={120} style={inp} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lbl}>Descripción para clientes</label>
                  <textarea value={form.description} onChange={e => set("description", e.target.value)} maxLength={300} rows={3} style={{ ...inp, resize: "vertical" as const }} />
                  <p style={hint}>{form.description.length}/300</p>
                </div>
              </div>
            </div>

            {/* ── Datos fiscales ── */}
            <div style={sectionStyle}>
              <Bar />
              <h2 style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f0e6c8", marginBottom: "8px" }}>Datos Fiscales</h2>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.4)", marginBottom: "24px" }}>
                Aparecen en facturas y liquidaciones. Deben coincidir con los datos de la AEAT.
              </p>
              <div style={grid}>
                <div>
                  <label style={lbl}>NIF / CIF</label>
                  <input value={form.cif} onChange={e => set("cif", e.target.value)} placeholder="B12345678  ·  autónomo: 12345678A" maxLength={20} style={inp} />
                  <p style={hint}>NIF para autónomos · CIF para empresas (empieza por letra)</p>
                </div>
                <div>
                  <label style={lbl}>Razón Social / Nombre fiscal</label>
                  <input value={form.razon_social} onChange={e => set("razon_social", e.target.value)} placeholder="BARBERÍA LOS INMORTALES SL" maxLength={120} style={inp} />
                  <p style={hint}>Nombre exacto en Registro Mercantil o AEAT</p>
                </div>
                <div>
                  <label style={lbl}>Nombre Comercial</label>
                  <input value={form.nombre_comercial} onChange={e => set("nombre_comercial", e.target.value)} placeholder="Barbería los Inmortales" maxLength={120} style={inp} />
                  <p style={hint}>Nombre del rótulo (puede ser igual a la razón social)</p>
                </div>
                <div>
                  <label style={lbl}>Email fiscal</label>
                  <input type="email" value={form.email_fiscal} onChange={e => set("email_fiscal", e.target.value)} placeholder="fiscal@mibarberia.es" maxLength={120} style={inp} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={lbl}>Domicilio fiscal</label>
                  <input value={form.direccion_fiscal} onChange={e => set("direccion_fiscal", e.target.value)} placeholder="Carrer de Mallorca 123, Piso 2" maxLength={150} style={inp} />
                  <p style={hint}>Dirección registrada en Hacienda (puede diferir del local)</p>
                </div>
                <div>
                  <label style={lbl}>Código Postal</label>
                  <input value={form.codigo_postal} onChange={e => set("codigo_postal", e.target.value)} placeholder="08013" maxLength={10} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Municipio / Ciudad</label>
                  <input value={form.ciudad_fiscal} onChange={e => set("ciudad_fiscal", e.target.value)} placeholder="Barcelona" maxLength={80} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Tipo IVA (%)</label>
                  <input type="number" min="0" max="100" step="0.01" value={form.iva_pct} onChange={e => set("iva_pct", parseFloat(e.target.value) || 21)} style={{ ...inp, fontFamily: "monospace" }} />
                  <p style={hint}>Servicios de barbería en España → 21% (Régimen General)</p>
                </div>
              </div>
            </div>

            {/* ── Tu cuenta ── */}
            <div style={{ border: "1px solid rgba(92,58,30,0.25)", backgroundColor: "rgba(200,146,26,0.02)", padding: "20px 24px" }}>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.4)", marginBottom: "12px" }}>Tu cuenta</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 600, color: "#f0e6c8", marginBottom: "4px" }}>{session?.name}</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.4)" }}>{session?.email}</p>
              {form.slug && <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "rgba(184,168,138,0.25)", marginTop: "8px" }}>ID: <code style={{ color: "rgba(200,146,26,0.35)" }}>{form.slug}</code></p>}
            </div>

            {msg && (
              <p style={{ fontFamily: "var(--font-barlow)", color: msg.type === "ok" ? "#4ade80" : "#f87171", fontSize: "0.78rem" }}>
                {msg.type === "ok" ? "✓" : "⚠"} {msg.text}
              </p>
            )}

            <button type="submit" disabled={saving}
              style={{ padding: "14px 36px", alignSelf: "flex-start", background: saving ? "rgba(92,58,30,0.3)" : "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", border: "none", cursor: saving ? "not-allowed" : "pointer", fontFamily: "var(--font-barlow)", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.4em", textTransform: "uppercase", color: saving ? "rgba(184,168,138,0.3)" : "#080604", boxShadow: saving ? "none" : "0 0 25px rgba(200,146,26,0.35)" }}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
