"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/auth";

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  volumen: "50ml" | "100ml" | "100g" | "250ml" | string;
  categoria: string;
  destacado?: boolean;
}
const CATEGORIAS = ["Cuidado de Barba", "Cuidado del Cabello", "Ritual de Afeitado", "Accesorios"];

const CATEGORIAS = ["Cuidado de Barba", "Cuidado del Cabello", "Ritual de Afeitado", "Accesorios", "Otros"];
const VACIO = { name: "", description: "", price: 0, volume: "", category: CATEGORIAS[0], featured: false };

const S = {
  input: { width: "100%", padding: "12px 14px", backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" } as React.CSSProperties,
  label: { display: "block", fontFamily: "var(--font-barlow)", fontSize: "0.62rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.7)", marginBottom: "8px" } as React.CSSProperties,
};

export default function AdminProductos() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState(VACIO);
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState<number | null>(null);
  const [err, setErr] = useState("");



  async function load() {
    const res = await fetch("/api/admin/products", );
    if (res.ok) setProductos(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    getSession().then((s) => {
      if (!s || s.role !== "owner") {
        router.push("/admin");
        return;
      }
      reload();
    });
  }, [router]);

  async function reload() {
    const res = await fetch("/api/admin/products");
    if (res.ok) setProductos(await res.json());
  }

  function abrirNuevo() {
    setEditando(null);
    setForm(VACIO);
    setModal(true);
  }

  function abrirEditar(p: Producto) {
    setEditId(p.id);
    setForm({ name: p.name, description: p.description, price: p.price, volume: p.volume, category: p.category, featured: p.featured });
    setErr(""); setModal(true);
  }

  async function guardar() {
    if (!form.nombre.trim() || form.precio <= 0) return;
    const body = { ...form, id: editando ?? undefined };
    const res = await fetch("/api/admin/products", {
      method: editando ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      reload();
      setModal(false);
    }
  }

  async function eliminar(id: string) {
    const res = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      reload();
      setConfirmDelete(null);
    }
  }

  async function toggleActivo(p: Producto) {
    await fetch("/api/admin/products", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: p.id, active: !p.active }),
    });
    await load();
  }

  const grouped = CATEGORIAS.map(cat => ({ cat, items: productos.filter(p => p.category === cat) })).filter(g => g.items.length > 0);
  const others = productos.filter(p => !CATEGORIAS.includes(p.category));

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080604" }}>
      <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "0 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/admin/dashboard" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8" }}>Tienda / Productos</span>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button onClick={abrirNuevo}
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", padding: "10px 24px", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", border: "none", color: "#080604", cursor: "pointer", boxShadow: "0 0 20px rgba(200,146,26,0.35)" }}>
              + Nuevo Producto
            </button>
            <button onClick={() => () => logout()}
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(239,68,68,0.5)", background: "none", border: "none", cursor: "pointer" }}>
              Salir
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>
        {loading ? (
          <p style={{ color: "rgba(184,168,138,0.3)", letterSpacing: "0.3em", fontSize: "0.75rem" }}>CARGANDO...</p>
        ) : productos.length === 0 ? (
          <div style={{ border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0e0b07", padding: "80px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.3)", marginBottom: "20px" }}>Sin productos</p>
            <button onClick={abrirNuevo} style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", padding: "12px 28px", background: "linear-gradient(135deg,#a06010,#c8921a)", border: "none", color: "#080604", cursor: "pointer" }}>
              Agregar primer producto
            </button>
          </div>
        ) : (
          <>
            {[...grouped, ...(others.length > 0 ? [{ cat: "Otros", items: others }] : [])].map(({ cat, items }) => (
              <div key={cat} style={{ marginBottom: "40px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#c8921a" }}>{cat}</p>
                  <div style={{ flex: 1, height: "1px", background: "rgba(92,58,30,0.4)" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                  {items.map(p => (
                    <div key={p.id} style={{ border: "1px solid rgba(92,58,30,0.35)", backgroundColor: "#0e0b07", padding: "20px", position: "relative", opacity: p.active ? 1 : 0.5 }}>
                      <div style={{ display: "flex", gap: "6px", position: "absolute", top: "12px", right: "12px" }}>
                        {p.featured && <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#f0c040", border: "1px solid rgba(240,192,64,0.4)", padding: "2px 8px" }}>Destacado</span>}
                        {!p.active && <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(239,68,68,0.6)", border: "1px solid rgba(239,68,68,0.3)", padding: "2px 8px" }}>OFF</span>}
                      </div>
                      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.88rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "6px", paddingRight: "90px" }}>{p.name}</p>
                      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.5)", marginBottom: "12px", lineHeight: 1.5 }}>{p.description}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "1.1rem", fontWeight: 900, color: "#c8921a" }}>{p.price_display}</span>
                        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", color: "rgba(184,168,138,0.4)" }}>{p.volume}</span>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => toggleActivo(p)}
                          style={{ flex: 1, padding: "7px 6px", fontFamily: "var(--font-barlow)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", backgroundColor: "transparent", border: `1px solid ${p.active ? "rgba(239,68,68,0.3)" : "rgba(74,222,128,0.3)"}`, color: p.active ? "rgba(239,68,68,0.6)" : "rgba(74,222,128,0.7)", cursor: "pointer" }}>
                          {p.active ? "Desact." : "Activar"}
                        </button>
                        <button onClick={() => abrirEditar(p)}
                          style={{ flex: 1, padding: "7px 6px", fontFamily: "var(--font-barlow)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(200,146,26,0.35)", color: "#c8921a", cursor: "pointer" }}>
                          Editar
                        </button>
                        <button onClick={() => setConfirmDel(p.id)}
                          style={{ flex: 1, padding: "7px 6px", fontFamily: "var(--font-barlow)", fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "rgba(239,68,68,0.6)", cursor: "pointer" }}>
                          Borrar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {modal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(8,6,4,0.93)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ backgroundColor: "#0e0b07", border: "1px solid rgba(200,146,26,0.4)", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 0 80px rgba(200,146,26,0.12)" }}>
            <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", padding: "20px 26px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 700, color: "#f0e6c8" }}>{editId ? "Editar Producto" : "Nuevo Producto"}</p>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", color: "rgba(184,168,138,0.5)", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
            </div>
            <div style={{ padding: "24px 26px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={S.label}>Nombre *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: Aceite de Barba" style={S.input} />
              </div>
              <div>
                <label style={S.label}>Descripción</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción breve" rows={2} style={{ ...S.input, resize: "vertical" as const }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={S.label}>Precio (€) *</label>
                  <input type="number" min={0} step={0.01} value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} placeholder="25" style={S.input} />
                </div>
                <div>
                  <label style={S.label}>Volumen / Peso</label>
                  <input value={form.volume} onChange={e => setForm(f => ({ ...f, volume: e.target.value }))} placeholder="30ml" style={S.input} />
                </div>
              </div>
              <div>
                <label style={S.label}>Categoría</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...S.input, cursor: "pointer" }}>
                  {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} style={{ width: "16px", height: "16px", accentColor: "#c8921a" }} />
                <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.7)" }}>Marcar como producto destacado</span>
              </label>
              {err && <p style={{ color: "#f87171", fontSize: "0.75rem" }}>⚠ {err}</p>}
              <div style={{ display: "flex", gap: "10px", paddingTop: "4px" }}>
                <button onClick={() => setModal(false)} style={{ flex: 1, padding: "12px", fontFamily: "var(--font-barlow)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.4)", color: "rgba(184,168,138,0.5)", cursor: "pointer" }}>Cancelar</button>
                <button onClick={guardar} disabled={saving} style={{ flex: 2, padding: "12px", fontFamily: "var(--font-barlow)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", border: "none", color: "#080604", cursor: "pointer", boxShadow: "0 0 20px rgba(200,146,26,0.3)" }}>
                  {saving ? "Guardando..." : editId ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDel !== null && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(8,6,4,0.93)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ backgroundColor: "#0e0b07", border: "1px solid rgba(239,68,68,0.4)", padding: "36px", maxWidth: "360px", width: "100%", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "10px" }}>¿Eliminar producto?</p>
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
