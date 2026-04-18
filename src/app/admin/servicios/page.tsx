"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/auth";



interface Servicio {
  id: number; name: string; price: string; duration_min: number; description: string; active: boolean;
}

const VACIO = { name: "", price: "", duration_min: 30, description: "", active: true };

const S = {
  input: { width: "100%", padding: "12px 14px", backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" } as React.CSSProperties,
  label: { display: "block", fontFamily: "var(--font-barlow)", fontSize: "0.62rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.7)", marginBottom: "8px" } as React.CSSProperties,
};

export default function AdminServicios() {
  const router = useRouter();
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(VACIO);
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState<number | null>(null);
  const [err, setErr] = useState("");



  async function load() {
    try {
      const res = await fetch("/api/admin/services");
      if (res.ok) setServicios(await res.json());
    } catch (_) {}
    setLoading(false);
  }

  useEffect(() => {
    getSession().then(s => { if (!s || s.role !== "owner") { router.push("/login"); return; } load(); }).catch(() => setLoading(false));
  }, [router]);

  function abrirNuevo() { setEditId(null); setForm(VACIO); setErr(""); setModal(true); }
  function abrirEditar(s: Servicio) {
    setEditId(s.id);
    setForm({ name: s.name, price: s.price, duration_min: s.duration_min, description: s.description, active: s.active });
    setErr(""); setModal(true);
  }

  async function guardar() {
    if (!form.name.trim() || !form.price.trim()) { setErr("Nombre y precio son obligatorios."); return; }
    setSaving(true); setErr("");
    try {
      const method = editId ? "PUT" : "POST";
      const body = editId ? { id: editId, ...form } : form;
      const res = await fetch("/api/admin/services", {
        method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setErr(d.error ?? `Error ${res.status} al guardar.`);
        return;
      }
      await load();
      setModal(false);
    } catch (e) {
      setErr("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  async function eliminar(id: number) {
    try {
      await fetch("/api/admin/services", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (_) {}
    await load();
    setConfirmDel(null);
  }

  async function toggleActivo(s: Servicio) {
    try {
      await fetch("/api/admin/services", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: s.id, active: !s.active }),
      });
    } catch (_) {}
    await load();
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080604" }}>
      <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "0 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/admin/dashboard" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8" }}>Mis Servicios</span>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button onClick={abrirNuevo}
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", padding: "10px 24px", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", border: "none", color: "#080604", cursor: "pointer", boxShadow: "0 0 20px rgba(200,146,26,0.35)" }}>
              + Nuevo
            </button>
            <button onClick={() => logout()}
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(239,68,68,0.5)", background: "none", border: "none", cursor: "pointer" }}>
              Salir
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.35)", letterSpacing: "0.1em", marginBottom: "28px" }}>
          Los servicios activos aparecen en tu página de reservas para los clientes.
        </p>

        {loading ? (
          <p style={{ color: "rgba(184,168,138,0.3)", letterSpacing: "0.3em", fontSize: "0.75rem" }}>CARGANDO...</p>
        ) : servicios.length === 0 ? (
          <div style={{ border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0e0b07", padding: "80px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.3)", marginBottom: "20px" }}>Sin servicios</p>
            <button onClick={abrirNuevo} style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", padding: "12px 28px", background: "linear-gradient(135deg,#a06010,#c8921a)", border: "none", color: "#080604", cursor: "pointer" }}>
              Agregar primer servicio
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {servicios.map(s => (
              <div key={s.id} style={{ border: `1px solid ${s.active ? "rgba(92,58,30,0.4)" : "rgba(92,58,30,0.2)"}`, backgroundColor: "#0e0b07", padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px", opacity: s.active ? 1 : 0.5 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.95rem", fontWeight: 700, color: "#f0e6c8" }}>{s.name}</p>
                    {!s.active && <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.55rem", letterSpacing: "0.3em", color: "rgba(239,68,68,0.6)", border: "1px solid rgba(239,68,68,0.3)", padding: "2px 8px" }}>INACTIVO</span>}
                  </div>
                  {s.description && <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.4)", marginBottom: "6px" }}>{s.description}</p>}
                  <div style={{ display: "flex", gap: "16px" }}>
                    <span style={{ fontFamily: "var(--font-barlow)", fontSize: "1rem", fontWeight: 900, color: "#c8921a" }}>{s.price}</span>
                    <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.4)", alignSelf: "center" }}>{s.duration_min} min</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button onClick={() => toggleActivo(s)}
                    style={{ padding: "7px 14px", fontFamily: "var(--font-barlow)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", backgroundColor: "transparent", border: `1px solid ${s.active ? "rgba(239,68,68,0.3)" : "rgba(74,222,128,0.3)"}`, color: s.active ? "rgba(239,68,68,0.6)" : "rgba(74,222,128,0.7)", cursor: "pointer" }}>
                    {s.active ? "Desactivar" : "Activar"}
                  </button>
                  <button onClick={() => abrirEditar(s)}
                    style={{ padding: "7px 14px", fontFamily: "var(--font-barlow)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(200,146,26,0.35)", color: "#c8921a", cursor: "pointer" }}>
                    Editar
                  </button>
                  <button onClick={() => setConfirmDel(s.id)}
                    style={{ padding: "7px 14px", fontFamily: "var(--font-barlow)", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "rgba(239,68,68,0.6)", cursor: "pointer" }}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal crear/editar */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(8,6,4,0.93)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ backgroundColor: "#0e0b07", border: "1px solid rgba(200,146,26,0.4)", width: "100%", maxWidth: "500px", boxShadow: "0 0 80px rgba(200,146,26,0.12)" }}>
            <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", padding: "20px 26px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 700, color: "#f0e6c8" }}>{editId ? "Editar Servicio" : "Nuevo Servicio"}</p>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", color: "rgba(184,168,138,0.5)", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
            </div>
            <div style={{ padding: "24px 26px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={S.label}>Nombre del servicio *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Ej: Corte Clásico" style={S.input} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={S.label}>Precio (ej: €25) *</label>
                  <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="€25" style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Duración (min)</label>
                  <input type="number" value={form.duration_min} onChange={e => setForm(f => ({ ...f, duration_min: parseInt(e.target.value) || 30 }))}
                    min={5} max={240} style={S.input} />
                </div>
              </div>
              <div>
                <label style={S.label}>Descripción</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Descripción breve del servicio" rows={2}
                  style={{ ...S.input, resize: "vertical" as const }} />
              </div>
              {err && <p style={{ color: "#f87171", fontSize: "0.75rem" }}>⚠ {err}</p>}
              <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
                <button onClick={() => setModal(false)}
                  style={{ flex: 1, padding: "12px", fontFamily: "var(--font-barlow)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.4)", color: "rgba(184,168,138,0.5)", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={guardar} disabled={saving}
                  style={{ flex: 2, padding: "12px", fontFamily: "var(--font-barlow)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", border: "none", color: "#080604", cursor: "pointer", boxShadow: "0 0 20px rgba(200,146,26,0.3)" }}>
                  {saving ? "Guardando..." : editId ? "Guardar" : "Crear"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDel !== null && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(8,6,4,0.93)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ backgroundColor: "#0e0b07", border: "1px solid rgba(239,68,68,0.4)", padding: "36px", maxWidth: "360px", width: "100%", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "10px" }}>¿Eliminar servicio?</p>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.5)", marginBottom: "28px" }}>Esta acción no se puede deshacer.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setConfirmDel(null)} style={{ flex: 1, padding: "12px", fontFamily: "var(--font-barlow)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.4)", color: "rgba(184,168,138,0.5)", cursor: "pointer" }}>Cancelar</button>
              <button onClick={() => eliminar(confirmDel!)} style={{ flex: 1, padding: "12px", fontFamily: "var(--font-barlow)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.5)", color: "#ef4444", cursor: "pointer" }}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
