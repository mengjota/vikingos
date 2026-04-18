"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

interface Empleado {
  id: number;
  name: string;
  email: string;
  barber_name: string;
  pin: string | null;
  created_at: string;
}

interface DaySchedule { day_of_week: number; is_working: boolean; start_time: string; end_time: string; }

const DIAS_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DIAS_ORDER  = [1, 2, 3, 4, 5, 6, 0];
const DEFAULT_SCHEDULE: DaySchedule[] = Array.from({ length: 7 }, (_, i) => ({
  day_of_week: i, is_working: i !== 0, start_time: "09:00", end_time: "20:00",
}));

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
  const [editEmp, setEditEmp] = useState<Empleado | null>(null);
  const [editForm, setEditForm] = useState({ name: "", barberName: "", pin: "" });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editSchedule, setEditSchedule] = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [editIsBarber, setEditIsBarber] = useState(true);
  const [editSpecialty, setEditSpecialty] = useState("");
  const [scheduleLoading, setScheduleLoading] = useState(false);

  const [session, setSession] = useState<Awaited<ReturnType<typeof getSession>>>(null);

  useEffect(() => {
    getSession().then((s) => {
      if (!s || s.role !== "owner") {
        router.push("/staff");
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

  async function abrirEditar(emp: Empleado) {
    setEditEmp(emp);
    setEditForm({ name: emp.name, barberName: emp.barber_name, pin: emp.pin ?? "" });
    setEditError("");
    setEditSchedule(DEFAULT_SCHEDULE);
    setEditIsBarber(true);
    setEditSpecialty("");
    setScheduleLoading(true);
    try {
      const res = await fetch("/api/admin/barber-schedules");
      if (res.ok) {
        const data = await res.json();
        const own = data.find((b: { userId: number }) => b.userId === emp.id);
        if (own) {
          setEditSchedule(own.schedule ?? DEFAULT_SCHEDULE);
          setEditIsBarber(own.isBarber !== false);
          setEditSpecialty(own.specialty ?? "");
        }
      }
    } catch (_) {}
    setScheduleLoading(false);
  }

  async function guardarEdicion() {
    if (!editEmp) return;
    if (editForm.pin && !/^\d{4}$/.test(editForm.pin)) { setEditError("El PIN debe ser exactamente 4 dígitos"); return; }
    setEditLoading(true);
    try {
      const res = await fetch("/api/admin/employees", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId: editEmp.id, name: editForm.name, barberName: editForm.barberName, pin: editForm.pin || null }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setEditError(d.error ?? `Error ${res.status}`); return; }
      await fetch("/api/admin/barber-schedules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: editEmp.id, barberName: editForm.barberName, specialty: editSpecialty, isBarber: editIsBarber, schedule: editSchedule }),
      });
      setSuccessMsg(`Datos de ${editForm.name} actualizados`);
      setTimeout(() => setSuccessMsg(""), 3000);
      setEditEmp(null);
      cargarEmpleados();
    } catch (_) {
      setEditError("Error de conexión");
    } finally {
      setEditLoading(false);
    }
  }

  function toggleEditDay(dow: number) {
    setEditSchedule(prev => prev.map(d => d.day_of_week === dow ? { ...d, is_working: !d.is_working } : d));
  }

  function updateEditTime(dow: number, field: "start_time" | "end_time", val: string) {
    setEditSchedule(prev => prev.map(d => d.day_of_week === dow ? { ...d, [field]: val } : d));
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
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  {emp.pin ? (
                    <span style={{ padding: "4px 10px", border: "1px solid rgba(200,146,26,0.3)", backgroundColor: "rgba(200,146,26,0.05)", color: "#c8921a", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>
                      PIN ••••
                    </span>
                  ) : (
                    <span style={{ padding: "4px 10px", border: "1px solid rgba(92,58,30,0.3)", color: "rgba(184,168,138,0.3)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                      Sin PIN
                    </span>
                  )}
                  <span style={{ padding: "4px 10px", border: "1px solid rgba(74,222,128,0.3)", backgroundColor: "rgba(74,222,128,0.05)", color: "#4ade80", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>
                    Activo
                  </span>
                  <button onClick={() => void abrirEditar(emp)}
                    style={{ padding: "8px 14px", border: "1px solid rgba(200,146,26,0.35)", backgroundColor: "transparent", color: "#c8921a", cursor: "pointer", fontFamily: "var(--font-barlow)", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>
                    Editar
                  </button>
                  <button onClick={() => setConfirmDel(emp)}
                    style={{ padding: "8px 14px", border: "1px solid rgba(239,68,68,0.3)", backgroundColor: "transparent", color: "rgba(239,68,68,0.6)", cursor: "pointer", fontFamily: "var(--font-barlow)", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>
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

      {/* Modal: Editar empleado */}
      {editEmp && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", zIndex: 100, backdropFilter: "blur(4px)" }}>
          <div style={{ width: "100%", maxWidth: "620px", maxHeight: "90vh", overflowY: "auto", backgroundColor: "#0e0b07", border: "1px solid rgba(200,146,26,0.4)", padding: "40px", boxShadow: "0 0 80px rgba(200,146,26,0.12)", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(to right, transparent, #c8921a, transparent)" }} />
            <h2 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.1rem", color: "#f0e6c8", marginBottom: "6px" }}>Editar Empleado</h2>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", color: "rgba(184,168,138,0.4)", marginBottom: "28px", letterSpacing: "0.1em" }}>{editEmp.email}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={labelStyle}>Nombre completo</label>
                <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Nombre en reservas</label>
                <input value={editForm.barberName} onChange={e => setEditForm(f => ({ ...f, barberName: e.target.value }))} style={inputStyle} />
                <p style={{ fontSize: "0.62rem", color: "rgba(200,146,26,0.4)", marginTop: "5px" }}>Debe coincidir con el nombre al crear citas</p>
              </div>
              <div>
                <label style={labelStyle}>Especialidad</label>
                <input value={editSpecialty} onChange={e => setEditSpecialty(e.target.value)}
                  placeholder="Ej: Barba y degradado clásico" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>PIN de fichaje (4 dígitos)</label>
                <input value={editForm.pin} onChange={e => setEditForm(f => ({ ...f, pin: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                  placeholder="Ej: 1234" maxLength={4} style={{ ...inputStyle, letterSpacing: "0.5em", fontSize: "1.2rem" }} />
                <p style={{ fontSize: "0.62rem", color: "rgba(184,168,138,0.35)", marginTop: "5px" }}>El empleado usará este PIN en <strong style={{ color: "rgba(200,146,26,0.5)" }}>/fichar</strong> para registrar entrada/salida</p>
              </div>

              {/* Toggle activo como barbero */}
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 16px", border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0a0806" }}>
                <button type="button" onClick={() => setEditIsBarber(v => !v)} style={{
                  width: "44px", height: "24px", borderRadius: "12px", border: "none", cursor: "pointer",
                  backgroundColor: editIsBarber ? "#c8921a" : "rgba(92,58,30,0.5)",
                  position: "relative", transition: "background 0.3s", flexShrink: 0,
                }}>
                  <span style={{ position: "absolute", top: "3px", left: editIsBarber ? "22px" : "3px", width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "#f0e6c8", transition: "left 0.3s" }} />
                </button>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "#f0e6c8" }}>
                  {editIsBarber ? "Aparece en reservas de clientes" : "No aparece en el sistema de reservas"}
                </p>
              </div>

              {/* Horario semanal */}
              <div style={{ border: "1px solid rgba(167,139,250,0.2)", backgroundColor: "#0a0806", padding: "20px", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(167,139,250,0.5), transparent)" }} />
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.62rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(167,139,250,0.6)", marginBottom: "14px" }}>
                  Horario Semanal
                </p>
                {scheduleLoading ? (
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", color: "rgba(184,168,138,0.3)", letterSpacing: "0.2em" }}>Cargando...</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {DIAS_ORDER.map(dow => {
                      const day = editSchedule.find(d => d.day_of_week === dow) ?? DEFAULT_SCHEDULE[dow];
                      return (
                        <div key={dow} style={{
                          display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap",
                          padding: "10px 12px",
                          border: `1px solid ${day.is_working ? "rgba(167,139,250,0.2)" : "rgba(92,58,30,0.15)"}`,
                          backgroundColor: day.is_working ? "rgba(167,139,250,0.03)" : "transparent",
                        }}>
                          <button type="button" onClick={() => toggleEditDay(dow)} style={{
                            width: "36px", height: "20px", borderRadius: "10px", border: "none", cursor: "pointer",
                            backgroundColor: day.is_working ? "rgba(167,139,250,0.8)" : "rgba(92,58,30,0.4)",
                            position: "relative", transition: "background 0.2s", flexShrink: 0,
                          }}>
                            <span style={{ position: "absolute", top: "2px", left: day.is_working ? "18px" : "2px", width: "16px", height: "16px", borderRadius: "50%", backgroundColor: "#f0e6c8", transition: "left 0.2s" }} />
                          </button>
                          <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: day.is_working ? "#f0e6c8" : "rgba(184,168,138,0.3)", width: "32px" }}>
                            {DIAS_LABELS[dow]}
                          </span>
                          {day.is_working && (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <input type="time" value={day.start_time} onChange={e => updateEditTime(dow, "start_time", e.target.value)}
                                style={{ backgroundColor: "#060504", border: "1px solid rgba(92,58,30,0.4)", color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "0.8rem", padding: "5px 8px", outline: "none", width: "100px" }} />
                              <span style={{ color: "rgba(184,168,138,0.4)", fontSize: "0.75rem" }}>—</span>
                              <input type="time" value={day.end_time} onChange={e => updateEditTime(dow, "end_time", e.target.value)}
                                style={{ backgroundColor: "#060504", border: "1px solid rgba(92,58,30,0.4)", color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "0.8rem", padding: "5px 8px", outline: "none", width: "100px" }} />
                            </div>
                          )}
                          {!day.is_working && (
                            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "rgba(184,168,138,0.2)", letterSpacing: "0.2em" }}>NO TRABAJA</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {editError && <p style={{ color: "#f87171", fontSize: "0.75rem" }}>⚠ {editError}</p>}
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => setEditEmp(null)} style={{ flex: 1, padding: "13px", border: "1px solid rgba(92,58,30,0.5)", backgroundColor: "transparent", color: "rgba(184,168,138,0.5)", cursor: "pointer", fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase" }}>Cancelar</button>
                <button onClick={guardarEdicion} disabled={editLoading} style={{ flex: 2, padding: "13px", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", border: "none", cursor: editLoading ? "not-allowed" : "pointer", fontFamily: "var(--font-barlow)", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.35em", textTransform: "uppercase", color: "#080604", opacity: editLoading ? 0.7 : 1 }}>
                  {editLoading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
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
