"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/auth";

interface BarbershopData {
  id: string; name: string; slug: string;
  address: string; phone: string; description: string;
}
interface SessionData { name: string; email: string; role: string; }

const EMPTY: BarbershopData = { id: "", name: "", slug: "", address: "", phone: "", description: "" };

const S = {
  input: { width: "100%", padding: "13px 16px", backgroundColor: "#0a0806", border: "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" } as React.CSSProperties,
  label: { fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.8)", display: "block", marginBottom: "8px" } as React.CSSProperties,
};

export default function AdminConfiguracion() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [data, setData] = useState<BarbershopData>(EMPTY);
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
        .then((d: BarbershopData) => { setData(d); setForm(d); setLoading(false); })
        .catch(() => setLoading(false));
    });
  }, [router]);

  function set(key: keyof BarbershopData, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setSaving(true);

    const res = await fetch("/api/admin/mi-barberia", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, address: form.address, phone: form.phone, description: form.description }),
    });
    const json = await res.json();
    setSaving(false);

    if (!res.ok) { setMsg({ type: "err", text: json.error ?? "Error al guardar." }); return; }

    const updated = { ...data, name: json.name, address: json.address, phone: json.phone, description: json.description };
    setData(updated); setForm(updated);
    setMsg({ type: "ok", text: "¡Datos guardados correctamente!" });
    setTimeout(() => setMsg(null), 3500);
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060504" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(200,146,26,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ backgroundColor: "#0a0806", borderBottom: "1px solid rgba(92,58,30,0.45)", padding: "0 28px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a href="/admin/dashboard" style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.1rem", color: "#c8921a" }}>Mi Barbería</span>
          </div>
          <button onClick={() => logout()}
            style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(239,68,68,0.5)", background: "none", border: "none", cursor: "pointer" }}>
            Salir
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px" }}>
        <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.4rem,4vw,2rem)", color: "#f0e6c8", fontWeight: 900, marginBottom: "8px" }}>
          Configuración de la Barbería
        </h1>
        <p style={{ fontSize: "0.78rem", letterSpacing: "0.12em", color: "rgba(184,168,138,0.45)", marginBottom: "40px" }}>
          Esta información aparece en tu página pública y en el sistema.
        </p>

        {loading ? (
          <p style={{ color: "rgba(184,168,138,0.3)", letterSpacing: "0.3em", fontSize: "0.75rem" }}>CARGANDO...</p>
        ) : (
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0a0806", padding: "28px 32px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #c8921a, transparent)" }} />
              <h2 style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f0e6c8", marginBottom: "24px" }}>
                Datos de la Barbería
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
                <div>
                  <label style={S.label}>Nombre de la barbería *</label>
                  <input required value={form.name} onChange={e => set("name", e.target.value)} placeholder="Ej: Barbería del Norte" maxLength={60} style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Teléfono de contacto</label>
                  <input value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+34 612 345 678" maxLength={30} style={S.input} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={S.label}>Dirección</label>
                  <input value={form.address} onChange={e => set("address", e.target.value)} placeholder="Carrer de Mallorca 123, Barcelona" maxLength={120} style={S.input} />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={S.label}>Descripción breve</label>
                  <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Una descripción para tus clientes..." maxLength={300} rows={3} style={{ ...S.input, resize: "vertical" as const }} />
                  <p style={{ fontSize: "0.62rem", color: "rgba(184,168,138,0.3)", marginTop: "6px" }}>{form.description.length}/300</p>
                </div>
              </div>
            </div>

            <div style={{ border: "1px solid rgba(92,58,30,0.25)", backgroundColor: "rgba(200,146,26,0.02)", padding: "20px 24px" }}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.4)", marginBottom: "12px" }}>Tu cuenta</p>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f0e6c8", marginBottom: "4px" }}>{session?.name}</p>
              <p style={{ fontSize: "0.75rem", color: "rgba(184,168,138,0.4)" }}>{session?.email}</p>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,146,26,0.45)", marginTop: "8px" }}>Rol: Dueño ⚔</p>
              {data.slug && <p style={{ fontSize: "0.65rem", color: "rgba(184,168,138,0.25)", marginTop: "6px" }}>ID: <code style={{ color: "rgba(200,146,26,0.35)" }}>{data.slug}</code></p>}
            </div>

            {msg && <p style={{ color: msg.type === "ok" ? "#4ade80" : "#f87171", fontSize: "0.78rem", letterSpacing: "0.08em" }}>{msg.type === "ok" ? "✓" : "⚠"} {msg.text}</p>}

            <button type="submit" disabled={saving} style={{ padding: "14px 36px", alignSelf: "flex-start", background: saving ? "rgba(92,58,30,0.3)" : "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", border: "none", cursor: saving ? "not-allowed" : "pointer", fontFamily: "var(--font-barlow)", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.4em", textTransform: "uppercase", color: saving ? "rgba(184,168,138,0.3)" : "#080604", boxShadow: saving ? "none" : "0 0 25px rgba(200,146,26,0.35)" }}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
