"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn, getStaff, saveEmpleado, deleteEmpleado, type Empleado } from "@/lib/adminAuth";

const COLORES = ["#c8921a", "#a78bfa", "#60a5fa", "#4ade80", "#fb923c", "#f472b6", "#f0c040"];
const RUNAS   = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ", "ᛁ", "ᛇ", "ᛈ", "ᛉ", "ᛊ", "ᛏ", "ᛒ", "ᛖ", "ᛗ", "ᛚ", "ᛜ", "ᛞ", "ᛟ", "᛭"];

const VACIO: Omit<Empleado, "id"> = { nombre: "", especialidad: "", runa: "ᚠ", color: "#c8921a", activo: true };

export default function AdminStaff() {
  const router = useRouter();
  const [staff, setStaff]     = useState<Empleado[]>([]);
  const [modal, setModal]     = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [form, setForm]       = useState<Omit<Empleado, "id">>(VACIO);
  const [error, setError]     = useState("");
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin"); return; }
    setStaff(getStaff());
  }, [router]);

  function reload() { setStaff(getStaff()); }

  function abrirNuevo() {
    setEditando(null); setForm(VACIO); setError(""); setModal(true);
  }

  function abrirEditar(e: Empleado) {
    setEditando(e.id);
    setForm({ nombre: e.nombre, especialidad: e.especialidad, runa: e.runa, color: e.color, activo: e.activo });
    setError(""); setModal(true);
  }

  function guardar() {
    if (!form.nombre.trim()) { setError("El nombre es obligatorio."); return; }
    if (!form.especialidad.trim()) { setError("La especialidad es obligatoria."); return; }
    saveEmpleado(form, editando ?? undefined);
    reload(); setModal(false);
  }

  function eliminar(id: string) {
    deleteEmpleado(id); reload(); setConfirmDel(null);
  }

  const activos   = staff.filter(e => e.activo);
  const inactivos = staff.filter(e => !e.activo);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060504", fontFamily: "var(--font-barlow)" }}>

      {/* Header */}
      <div style={{ backgroundColor: "#0a0806", borderBottom: "1px solid rgba(92,58,30,0.45)", padding: "0 28px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a href="/admin/dashboard" style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ color: "rgba(92,58,30,0.5)" }}>|</span>
            <span style={{ fontSize: "1rem", fontWeight: 800, color: "#f0e6c8", letterSpacing: "0.05em" }}>Staff</span>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", color: "#c8921a", border: "1px solid rgba(200,146,26,0.35)", padding: "2px 10px" }}>{activos.length} activo{activos.length !== 1 ? "s" : ""}</span>
          </div>
          <button onClick={abrirNuevo}
            style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", padding: "9px 22px", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", border: "none", color: "#060504", cursor: "pointer", boxShadow: "0 0 20px rgba(200,146,26,0.35)" }}>
            + Nuevo Empleado
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 24px" }}>

        {/* Activos */}
        <div style={{ marginBottom: "48px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#c8921a" }}>Empleados Activos</p>
            <div style={{ flex: 1, height: "1px", background: "rgba(92,58,30,0.4)" }} />
          </div>

          {activos.length === 0 ? (
            <div style={{ border: "1px dashed rgba(92,58,30,0.35)", padding: "48px", textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.25)" }}>Sin empleados activos</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
              {activos.map(emp => (
                <div key={emp.id} style={{ border: `1px solid rgba(${colorToRgb(emp.color)},0.25)`, backgroundColor: "#0a0806", padding: "24px", position: "relative", overflow: "hidden" }}>
                  {/* Línea top */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${emp.color}80, transparent)` }} />

                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                    {/* Runa + info */}
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "52px", height: "52px", border: `1px solid ${emp.color}50`, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: `${emp.color}10`, flexShrink: 0 }}>
                        <span style={{ fontSize: "1.6rem", color: emp.color, lineHeight: 1 }}>{emp.runa}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: "1rem", fontWeight: 800, color: "#f0e6c8", marginBottom: "3px" }}>{emp.nombre}</p>
                        <p style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(184,168,138,0.45)" }}>{emp.especialidad}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)", padding: "3px 9px", flexShrink: 0 }}>Activo</span>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => abrirEditar(emp)}
                      style={{ flex: 1, padding: "9px", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", backgroundColor: "transparent", border: `1px solid ${emp.color}40`, color: emp.color, cursor: "pointer" }}>
                      Editar
                    </button>
                    <button onClick={() => { saveEmpleado({ ...emp, activo: false }, emp.id); reload(); }}
                      style={{ padding: "9px 14px", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(251,146,60,0.35)", color: "rgba(251,146,60,0.65)", cursor: "pointer" }}>
                      Pausar
                    </button>
                    <button onClick={() => setConfirmDel(emp.id)}
                      style={{ padding: "9px 14px", fontSize: "0.62rem", fontWeight: 700, backgroundColor: "transparent", border: "1px solid rgba(239,68,68,0.3)", color: "rgba(239,68,68,0.55)", cursor: "pointer" }}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inactivos */}
        {inactivos.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
              <p style={{ fontSize: "0.6rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(184,168,138,0.35)" }}>Empleados Pausados</p>
              <div style={{ flex: 1, height: "1px", background: "rgba(92,58,30,0.25)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
              {inactivos.map(emp => (
                <div key={emp.id} style={{ border: "1px solid rgba(92,58,30,0.2)", backgroundColor: "#080604", padding: "20px", opacity: 0.6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                    <span style={{ fontSize: "1.4rem", color: emp.color }}>{emp.runa}</span>
                    <div>
                      <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8" }}>{emp.nombre}</p>
                      <p style={{ fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(184,168,138,0.35)" }}>{emp.especialidad}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button onClick={() => { saveEmpleado({ ...emp, activo: true }, emp.id); reload(); }}
                      style={{ flex: 1, padding: "8px", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(74,222,128,0.35)", color: "rgba(74,222,128,0.65)", cursor: "pointer" }}>
                      Reactivar
                    </button>
                    <button onClick={() => setConfirmDel(emp.id)}
                      style={{ padding: "8px 12px", fontSize: "0.62rem", backgroundColor: "transparent", border: "1px solid rgba(239,68,68,0.25)", color: "rgba(239,68,68,0.45)", cursor: "pointer" }}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Modal Nuevo / Editar ── */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(6,5,4,0.94)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#0e0b07", border: "1px solid rgba(200,146,26,0.45)", width: "100%", maxWidth: "500px", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 0 80px rgba(200,146,26,0.12)" }}>

            <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f0e6c8" }}>{editando ? "Editar Empleado" : "Nuevo Empleado"}</p>
              <button onClick={() => setModal(false)} style={{ background: "none", border: "none", color: "rgba(184,168,138,0.45)", cursor: "pointer", fontSize: "1.1rem" }}>✕</button>
            </div>

            <div style={{ padding: "28px", display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Nombre */}
              <div>
                <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "8px" }}>Nombre completo *</label>
                <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} placeholder="Ej: Carlos Mendoza"
                  style={{ width: "100%", padding: "12px 14px", backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.45)", color: "#f0e6c8", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
              </div>

              {/* Especialidad */}
              <div>
                <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "8px" }}>Especialidad *</label>
                <input value={form.especialidad} onChange={e => setForm(f => ({ ...f, especialidad: e.target.value }))} placeholder="Ej: Navaja Clásica"
                  style={{ width: "100%", padding: "12px 14px", backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.45)", color: "#f0e6c8", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
              </div>

              {/* Color */}
              <div>
                <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "10px" }}>Color identificador</label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {COLORES.map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                      style={{ width: "36px", height: "36px", backgroundColor: c, border: form.color === c ? `3px solid #f0e6c8` : "2px solid transparent", cursor: "pointer", boxShadow: form.color === c ? `0 0 14px ${c}` : "none" }} />
                  ))}
                </div>
              </div>

              {/* Runa */}
              <div>
                <label style={{ display: "block", fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(200,146,26,0.65)", marginBottom: "10px" }}>Símbolo / Runa</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {RUNAS.map(r => (
                    <button key={r} onClick={() => setForm(f => ({ ...f, runa: r }))}
                      style={{ width: "36px", height: "36px", fontSize: "1.1rem", border: `1px solid ${form.runa === r ? form.color : "rgba(92,58,30,0.35)"}`, backgroundColor: form.runa === r ? `${form.color}18` : "transparent", color: form.runa === r ? form.color : "rgba(184,168,138,0.5)", cursor: "pointer" }}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div style={{ border: `1px solid ${form.color}30`, backgroundColor: "#141209", padding: "18px 20px", display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", border: `1px solid ${form.color}50`, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: `${form.color}10` }}>
                  <span style={{ fontSize: "1.5rem", color: form.color }}>{form.runa}</span>
                </div>
                <div>
                  <p style={{ fontSize: "0.95rem", fontWeight: 800, color: "#f0e6c8" }}>{form.nombre || "Nombre del empleado"}</p>
                  <p style={{ fontSize: "0.68rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(184,168,138,0.45)" }}>{form.especialidad || "Especialidad"}</p>
                </div>
              </div>

              {error && <p style={{ fontSize: "0.75rem", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", padding: "10px 14px" }}>{error}</p>}

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setModal(false)}
                  style={{ flex: 1, padding: "13px", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.4)", color: "rgba(184,168,138,0.4)", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button onClick={guardar}
                  style={{ flex: 2, padding: "13px", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", border: "none", color: "#060504", cursor: "pointer", boxShadow: "0 0 20px rgba(200,146,26,0.3)" }}>
                  {editando ? "Guardar Cambios" : "Añadir Empleado"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Confirmar eliminar ── */}
      {confirmDel && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(6,5,4,0.94)", zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ backgroundColor: "#0e0b07", border: "1px solid rgba(239,68,68,0.4)", padding: "40px", maxWidth: "380px", width: "100%", textAlign: "center" }}>
            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "8px" }}>¿Eliminar empleado?</p>
            <p style={{ fontSize: "0.75rem", color: "rgba(184,168,138,0.45)", marginBottom: "28px" }}>Esta acción no se puede deshacer.</p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setConfirmDel(null)}
                style={{ flex: 1, padding: "12px", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "transparent", border: "1px solid rgba(92,58,30,0.4)", color: "rgba(184,168,138,0.45)", cursor: "pointer" }}>
                Cancelar
              </button>
              <button onClick={() => eliminar(confirmDel)}
                style={{ flex: 1, padding: "12px", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", backgroundColor: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.5)", color: "#ef4444", cursor: "pointer" }}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Convierte hex color a rgb string para usar en rgba()
function colorToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}
