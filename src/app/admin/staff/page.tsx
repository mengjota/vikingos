"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

interface Empleado {
  id: number;
  name: string;
  email: string;
  barber_name: string;
  created_at: string;
}

const VACIO = { name: "", email: "", password: "", barberName: "" };

export default function AdminStaff() {
  const router = useRouter();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [confirmDel, setConfirmDel] = useState<Empleado | null>(null);
  const [delLoading, setDelLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [session, setSession] = useState<Awaited<ReturnType<typeof getSession>>>(null);

  useEffect(() => {
    getSession().then((s) => {
      if (!s || s.role !== "owner") {
        router.push("/admin");
        return;
      }
      setSession(s);
      cargarEmpleados();
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function cargarEmpleados() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/employees");
      if (res.ok) setEmpleados(await res.json());
    } catch (_) {}
    finally { setLoading(false); }
  }

  async function crearEmpleado(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      const res = await fetch("/api/admin/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, barberName: form.barberName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setFormError(data.error ?? `Error ${res.status} al crear empleado`); return; }
      setModal(false);
      setForm(VACIO);
      setSuccessMsg(`Cuenta creada para ${form.name}`);
      setTimeout(() => setSuccessMsg(""), 3000);
      cargarEmpleados();
    } catch (_) {
      setFormError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setFormLoading(false);
    }
  }

  async function eliminarEmpleado() {
    if (!confirmDel) return;
    setDelLoading(true);
    try {
      const res = await fetch("/api/admin/employees", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: confirmDel.id }),
      });
      if (res.ok) {
        setSuccessMsg(`Cuenta de ${confirmDel.name} eliminada`);
        setTimeout(() => setSuccessMsg(""), 3000);
        setConfirmDel(null);
        cargarEmpleados();
      }
    } catch (_) {}
    finally { setDelLoading(false); }
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-barlow)", fontSize: "0.7rem",
    letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.8)",
    display: "block", marginBottom: "8px",
  };
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "13px 16px", backgroundColor: "#0a0806",
    border: "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8",
    fontFamily: "var(--font-barlow)", fontSize: "0.95rem",
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060504", fontFamily: "var(--font-barlow)" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(200,146,26,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ backgroundColor: "#0a0806", borderBottom: "1px solid rgba(92,58,30,0.45)", padding: "0 28px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a href="/admin/dashboard" style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", textDecoration: "none" }}>
              ← Dashboard
            </a>
            <span style={{ color: "rgba(92,58,30,0.5)" }}>|</span>
            <span style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.1rem", color: "#c8921a" }}>BarberOS</span>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(184,168,138,0.3)" }}>
              Gestión de Empleados
            </span>
          </div>
          {session && (
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.25em", color: "rgba(184,168,138,0.35)" }}>
              {session.name}
            </span>
          )}
        </div>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Título */}
        <div style={{ marginBottom: "40px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.4rem,4vw,2rem)", color: "#f0e6c8", fontWeight: 900, marginBottom: "8px" }}>
              Cuentas de Empleados
            </h1>
            <p style={{ fontSize: "0.78rem", letterSpacing: "0.12em", color: "rgba(184,168,138,0.45)" }}>
              Crea y administra el acceso de tus barberos al sistema
            </p>
          </div>
          <button
            onClick={() => { setForm(VACIO); setFormError(""); setModal(true); }}
            style={{
              padding: "13px 28px", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)",
              border: "none", cursor: "pointer", fontFamily: "var(--font-barlow)",
              fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.4em", textTransform: "uppercase", color: "#080604",
              boxShadow: "0 0 24px rgba(200,146,26,0.35)",
            }}
          >
            + Nuevo Empleado
          </button>
        </div>

        {/* Mensaje de éxito */}
        {successMsg && (
          <div style={{ marginBottom: "24px", padding: "14px 20px", border: "1px solid rgba(74,222,128,0.3)", backgroundColor: "rgba(74,222,128,0.05)", color: "#4ade80", fontSize: "0.82rem", letterSpacing: "0.1em" }}>
            ✓ {successMsg}
          </div>
        )}

        {/* Lista de empleados */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(184,168,138,0.3)", letterSpacing: "0.3em", fontSize: "0.75rem" }}>
            CARGANDO...
          </div>
        ) : empleados.length === 0 ? (
          <div style={{
            border: "1px dashed rgba(92,58,30,0.4)", padding: "64px 40px",
            textAlign: "center", backgroundColor: "#0a0806",
          }}>
            <p style={{ fontSize: "2.5rem", marginBottom: "20px" }}>✂️</p>
            <p style={{ color: "rgba(184,168,138,0.5)", fontSize: "0.85rem", letterSpacing: "0.2em", marginBottom: "8px" }}>
              No hay empleados registrados
            </p>
            <p style={{ color: "rgba(184,168,138,0.25)", fontSize: "0.75rem", letterSpacing: "0.15em" }}>
              Crea la primera cuenta con el botón de arriba
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {empleados.map((emp) => (
              <div key={emp.id} style={{
                border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0a0806",
                padding: "20px 24px", display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: "16px", flexWrap: "wrap",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, width: "3px", height: "100%", background: "linear-gradient(to bottom, #c8921a, rgba(200,146,26,0.2))" }} />
                <div style={{ paddingLeft: "12px" }}>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "4px", letterSpacing: "0.05em" }}>
                    {emp.name}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "rgba(184,168,138,0.5)", letterSpacing: "0.1em", marginBottom: "2px" }}>
                    {emp.email}
                  </p>
                  <p style={{ fontSize: "0.7rem", color: "rgba(200,146,26,0.6)", letterSpacing: "0.15em" }}>
                    Barbero: {emp.barber_name}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{
                    padding: "4px 12px", border: "1px solid rgba(74,222,128,0.3)",
                    backgroundColor: "rgba(74,222,128,0.05)", color: "#4ade80",
                    fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase",
                  }}>
                    Activo
                  </span>
                  <button
                    onClick={() => setConfirmDel(emp)}
                    style={{
                      padding: "8px 18px", border: "1px solid rgba(239,68,68,0.3)",
                      backgroundColor: "transparent", color: "rgba(239,68,68,0.6)",
                      cursor: "pointer", fontFamily: "var(--font-barlow)",
                      fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase",
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div style={{ marginTop: "40px", padding: "20px 24px", border: "1px solid rgba(92,58,30,0.25)", backgroundColor: "rgba(200,146,26,0.03)" }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.15em", color: "rgba(184,168,138,0.35)", lineHeight: 1.8 }}>
            ⚔ Los empleados inician sesión en <strong style={{ color: "rgba(200,146,26,0.5)" }}>/staff</strong> con su correo y contraseña. Solo pueden ver su propia agenda semanal. El campo "Nombre en reservas" debe coincidir exactamente con el nombre del barbero al crear citas.
          </p>
        </div>
      </div>

      {/* Modal: Crear empleado */}
      {modal && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px", zIndex: 100, backdropFilter: "blur(4px)",
        }}>
          <div style={{
            width: "100%", maxWidth: "480px", backgroundColor: "#0e0b07",
            border: "1px solid rgba(92,58,30,0.5)", padding: "40px",
            boxShadow: "0 0 80px rgba(200,146,26,0.12)",
            position: "relative",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(to right, transparent, #c8921a, transparent)" }} />

            <h2 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.2rem", color: "#f0e6c8", marginBottom: "8px" }}>
              Nuevo Empleado
            </h2>
            <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "rgba(184,168,138,0.4)", marginBottom: "32px" }}>
              Se creará una cuenta de acceso al sistema
            </p>

            <form onSubmit={crearEmpleado} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={labelStyle}>Nombre completo</label>
                <input type="text" required placeholder="Carlos Mendoza" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Correo electrónico</label>
                <input type="email" required placeholder="carlos@correo.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Contraseña temporal</label>
                <input type="password" required placeholder="Mínimo 6 caracteres" value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nombre en reservas</label>
                <input type="text" required placeholder="Ej: Carlos Mendoza" value={form.barberName}
                  onChange={(e) => setForm({ ...form, barberName: e.target.value })}
                  style={inputStyle} />
                <p style={{ fontSize: "0.65rem", color: "rgba(200,146,26,0.45)", marginTop: "6px", letterSpacing: "0.1em" }}>
                  Debe coincidir exactamente con el nombre del barbero en el sistema de citas
                </p>
              </div>

              {formError && (
                <p style={{ color: "#f87171", fontSize: "0.78rem", letterSpacing: "0.08em" }}>⚠ {formError}</p>
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                <button type="button" onClick={() => setModal(false)}
                  style={{
                    flex: 1, padding: "14px", border: "1px solid rgba(92,58,30,0.5)",
                    backgroundColor: "transparent", color: "rgba(184,168,138,0.5)",
                    cursor: "pointer", fontFamily: "var(--font-barlow)",
                    fontSize: "0.72rem", letterSpacing: "0.35em", textTransform: "uppercase",
                  }}>
                  Cancelar
                </button>
                <button type="submit" disabled={formLoading}
                  style={{
                    flex: 2, padding: "14px",
                    background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)",
                    border: "none", cursor: formLoading ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-barlow)", fontSize: "0.72rem", fontWeight: 800,
                    letterSpacing: "0.4em", textTransform: "uppercase", color: "#080604",
                    opacity: formLoading ? 0.7 : 1,
                  }}>
                  {formLoading ? "Creando..." : "Crear Cuenta"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmar eliminación */}
      {confirmDel && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px", zIndex: 100, backdropFilter: "blur(4px)",
        }}>
          <div style={{
            width: "100%", maxWidth: "400px", backgroundColor: "#0e0b07",
            border: "1px solid rgba(239,68,68,0.3)", padding: "40px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "2.5rem", marginBottom: "20px" }}>⚠️</p>
            <h3 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1rem", color: "#f0e6c8", marginBottom: "12px" }}>
              ¿Eliminar cuenta?
            </h3>
            <p style={{ fontSize: "0.82rem", color: "rgba(184,168,138,0.6)", marginBottom: "8px" }}>
              {confirmDel.name}
            </p>
            <p style={{ fontSize: "0.72rem", color: "rgba(239,68,68,0.5)", marginBottom: "32px", letterSpacing: "0.1em" }}>
              {confirmDel.email}
            </p>
            <p style={{ fontSize: "0.72rem", color: "rgba(184,168,138,0.35)", marginBottom: "32px" }}>
              El empleado perderá acceso al sistema inmediatamente.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <button onClick={() => setConfirmDel(null)} style={{
                flex: 1, padding: "13px", border: "1px solid rgba(92,58,30,0.5)",
                backgroundColor: "transparent", color: "rgba(184,168,138,0.5)",
                cursor: "pointer", fontFamily: "var(--font-barlow)",
                fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase",
              }}>
                Cancelar
              </button>
              <button onClick={eliminarEmpleado} disabled={delLoading} style={{
                flex: 1, padding: "13px", border: "1px solid rgba(239,68,68,0.4)",
                backgroundColor: "rgba(239,68,68,0.08)", color: "#f87171",
                cursor: delLoading ? "not-allowed" : "pointer", fontFamily: "var(--font-barlow)",
                fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase",
                opacity: delLoading ? 0.6 : 1,
              }}>
                {delLoading ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
