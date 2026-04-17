"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

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

const VACIO: Omit<Producto, "id"> = {
  nombre: "", descripcion: "", precio: 0, volumen: "", categoria: CATEGORIAS[0], destacado: false,
};

export default function AdminProductos() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Producto, "id">>(VACIO);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

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
    setEditando(p.id);
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, volumen: p.volumen, categoria: p.categoria, destacado: p.destacado });
    setModal(true);
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

  const categorias = CATEGORIAS;
  const grouped = categorias.map((cat) => ({ cat, items: productos.filter((p) => p.categoria === cat) })).filter((g) => g.items.length > 0);
  const sinCat = productos.filter((p) => !CATEGORIAS.includes(p.categoria));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080604" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "0 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/admin/dashboard" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8", letterSpacing: "0.1em" }}>Tienda / Productos</span>
          </div>
          <button onClick={abrirNuevo}
            style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", padding: "10px 24px", background: "linear-gradient(135deg, #a06010, #c8921a, #f0c040, #c8921a, #a06010)", border: "none", color: "#080604", cursor: "pointer", boxShadow: "0 0 20px rgba(200,146,26,0.35)" }}>
            + Nuevo Producto
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }}>

        {productos.length === 0 ? (
          <div style={{ border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0e0b07", padding: "80px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.3)", marginBottom: "20px" }}>Sin productos</p>
            <button onClick={abrirNuevo} style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", padding: "12px 28px", background: "linear-gradient(135deg, #a06010, #c8921a)", border: "none", color: "#080604", cursor: "pointer" }}>Agregar primer producto</button>
          </div>
        ) : (
          <>
            {[...grouped, ...(sinCat.length > 0 ? [{ cat: "Otros", items: sinCat }] : [])].map(({ cat, items }) => (
              <div key={cat} style={{ marginBottom: "40px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#c8921a" }}>{cat}</p>
                  <div style={{ flex: 1, height: "1px", background: "rgba(92,58,30,0.4)" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
                  {items.map((p) => (
                    <div key={p.id} style={{ border: "1px solid rgba(92,58,30,0.35)", backgroundColor: "#0e0b07", padding: "20px", position: "relative" }}>
                      {p.destacado && (
                        <span style={{ position: "absolute", top: "12px", right: "12px", fontFamily: "var(--font-barlow)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#f0c040", border: "1px solid rgba(240,192,64,0.4)", padding: "2px 8px" }}>Destacado</span>
                      )}
                      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.88rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "6px", paddingRight: p.destacado ? "80px" : "0" }}>{p.nombre}</p>
                      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.5)", marginBottom: "12px", lineHeight: 1.5 }}>{p.descripcion}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "1.1rem", fontWeight: 900, color: "#c8921a" }}>${p.precio}</span>
                        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", color: "rgba(184,168,138,0.4)" }}>{p.volumen}</span>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => abrirEditar(p)}
                          style={{ flex: 1, padding: "8px", fontFamily: "var(--font-barlow)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(200,146,26,0.35)", color: "#c8921a", cursor: "pointer" }}>
                          Editar
                        </button>
                        <button onClick={() => setConfirmDelete(p.id)}
                          style={{ flex: 1, padding: "8px", fontFamily: "var(--font-barlow)", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "rgba(239,68,68,0.6)", cursor: "pointer" }}>
                          Eliminar
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

      {/* Modal crear/editar */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(8,6,4,0.93)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ backgroundColor: "#0e0b07", border: "1px solid rgba(200,146,26,0.4)", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 0 80px rgba(200,146,26,0.12)" }}>
            <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 700, color: "#f0e6c8", letterSpacing: "0.1em" }}>{editando ? "Editar Producto" : "Nuevo Producto"}</p>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", color: "rgba(184,168,138,0.5)", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
            </div>

            <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "18px" }}>
              {[
                { label: "Nombre", key: "nombre", type: "text", placeholder: "Ej: Aceite de Barba Viking" },
                { label: "Descripción", key: "descripcion", type: "text", placeholder: "Descripción breve del producto" },
                { label: "Precio ($)", key: "precio", type: "number", placeholder: "85" },
                { label: "Volumen / Peso", key: "volumen", type: "text", placeholder: "Ej: 30ml, 100g" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display: "block", fontFamily: "var(--font-barlow)", fontSize: "0.62rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.7)", marginBottom: "8px" }}>{label}</label>
                  <input type={type} placeholder={placeholder}
                    value={String(form[key as keyof typeof form])}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: type === "number" ? parseFloat(e.target.value) || 0 : e.target.value }))}
                    style={{ width: "100%", padding: "12px 14px", backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              ))}

              <div>
                <label style={{ display: "block", fontFamily: "var(--font-barlow)", fontSize: "0.62rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.7)", marginBottom: "8px" }}>Categoría</label>
                <select value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                  style={{ width: "100%", padding: "12px 14px", backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "0.85rem", outline: "none" }}>
                  {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                <input type="checkbox" checked={form.destacado} onChange={(e) => setForm((f) => ({ ...f, destacado: e.target.checked }))}
                  style={{ width: "16px", height: "16px", accentColor: "#c8921a" }} />
                <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.7)" }}>Marcar como producto destacado</span>
              </label>

              <div style={{ display: "flex", gap: "10px", paddingTop: "8px" }}>
                <button onClick={() => setModal(false)}
                  style={{ flex: 1, padding: "13px", fontFamily: "var(--font-barlow)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.4)", color: "rgba(184,168,138,0.5)", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={guardar}
                  style={{ flex: 2, padding: "13px", fontFamily: "var(--font-barlow)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", background: "linear-gradient(135deg, #a06010, #c8921a, #f0c040, #c8921a, #a06010)", border: "none", color: "#080604", cursor: "pointer", boxShadow: "0 0 20px rgba(200,146,26,0.3)" }}>
                  {editando ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmar eliminar */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(8,6,4,0.93)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ backgroundColor: "#0e0b07", border: "1px solid rgba(239,68,68,0.4)", padding: "36px", maxWidth: "380px", width: "100%", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "10px" }}>¿Eliminar producto?</p>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.5)", marginBottom: "28px" }}>Esta acción no se puede deshacer.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setConfirmDelete(null)}
                style={{ flex: 1, padding: "12px", fontFamily: "var(--font-barlow)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.4)", color: "rgba(184,168,138,0.5)", cursor: "pointer" }}>
                Cancelar
              </button>
              <button onClick={() => eliminar(confirmDelete)}
                style={{ flex: 1, padding: "12px", fontFamily: "var(--font-barlow)", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.5)", color: "#ef4444", cursor: "pointer" }}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
