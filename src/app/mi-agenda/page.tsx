"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/auth";

interface Cita {
  id: string;
  clienteNombre: string;
  servicio: string;
  precio: string;
  fecha: string;
  hora: string;
  estado: "pendiente" | "completada" | "cancelada";
}

const DIAS_CORTO = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];
const DIAS_LARGO = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function getLunesDeEstaSemana(): Date {
  const hoy = new Date();
  const dia = hoy.getDay();
  const diff = dia === 0 ? -6 : 1 - dia;
  const lunes = new Date(hoy);
  lunes.setDate(hoy.getDate() + diff);
  lunes.setHours(0, 0, 0, 0);
  return lunes;
}

function formatFecha(date: Date): string {
  return date.toISOString().split("T")[0];
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

const ESTADO = {
  pendiente:  { label: "Pendiente",  dot: "#f59e0b", text: "#92400e", bg: "#fef3c7" },
  completada: { label: "Completada", dot: "#10b981", text: "#065f46", bg: "#d1fae5" },
  cancelada:  { label: "Cancelada",  dot: "#ef4444", text: "#991b1b", bg: "#fee2e2" },
};

export default function MiAgenda() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [barberName, setBarberName] = useState("");
  const [lunes, setLunes] = useState<Date>(getLunesDeEstaSemana());
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarAgenda = useCallback(async (email: string, weekStart: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/mi-agenda?email=${encodeURIComponent(email)}&weekStart=${weekStart}`);
      if (res.ok) {
        const data = await res.json();
        setCitas(data.reservations ?? []);
        setBarberName(data.barberName ?? "");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== "employee") { router.push("/login"); return; }
    setSession(s);
    cargarAgenda(s.email, formatFecha(lunes));
  }, [router, lunes, cargarAgenda]);

  function handleLogout() { logout(); router.push("/login"); }

  const hoy         = formatFecha(new Date());
  const esEstaSemana = formatFecha(lunes) === formatFecha(getLunesDeEstaSemana());
  const domingo     = addDays(lunes, 6);

  // Totales de la semana
  const citasActivas    = citas.filter(c => c.estado !== "cancelada").length;
  const citasCompletadas = citas.filter(c => c.estado === "completada").length;
  const citasPendientes  = citas.filter(c => c.estado === "pendiente").length;

  // Mes(es) de la semana para el header
  const mesLabel = (() => {
    const opsMes: Intl.DateTimeFormatOptions = { month: "long" };
    const mesL = lunes.toLocaleDateString("es-EC", opsMes);
    const mesD = domingo.toLocaleDateString("es-EC", opsMes);
    const año  = lunes.getFullYear();
    if (mesL === mesD) return `${mesL.charAt(0).toUpperCase() + mesL.slice(1)} ${año}`;
    return `${mesL.charAt(0).toUpperCase() + mesL.slice(1)} – ${mesD.charAt(0).toUpperCase() + mesD.slice(1)} ${año}`;
  })();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc", fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif" }}>

      {/* Barra superior */}
      <header style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

          {/* Nombre del barbero */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "#f8fafc", fontWeight: 700, fontSize: "0.9rem" }}>
                {(barberName || session?.name || "?").charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a", lineHeight: 1.2 }}>
                {barberName || session?.name}
              </p>
              <p style={{ fontSize: "0.72rem", color: "#64748b", lineHeight: 1.2 }}>
                Barbero
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "7px 16px", border: "1px solid #e2e8f0", borderRadius: "8px",
              backgroundColor: "transparent", color: "#64748b", cursor: "pointer",
              fontSize: "0.8rem", fontWeight: 500, fontFamily: "inherit",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 24px" }}>

        {/* Navegación de semana */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>

          <div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#0f172a", marginBottom: "2px" }}>
              Mi Agenda
            </h1>
            <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
              {mesLabel}
              {esEstaSemana && (
                <span style={{ marginLeft: "10px", backgroundColor: "#dbeafe", color: "#1d4ed8", fontSize: "0.72rem", fontWeight: 600, padding: "2px 10px", borderRadius: "99px" }}>
                  Esta semana
                </span>
              )}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {!esEstaSemana && (
              <button
                onClick={() => setLunes(getLunesDeEstaSemana())}
                style={{ padding: "8px 14px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#fff", color: "#1d4ed8", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
              >
                Hoy
              </button>
            )}
            <button
              onClick={() => setLunes(prev => addDays(prev, -7))}
              style={{ width: "36px", height: "36px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#fff", color: "#475569", fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ‹
            </button>
            <div style={{ padding: "0 12px", minWidth: "160px", textAlign: "center" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>
                {lunes.getDate()} {lunes.toLocaleDateString("es-EC", { month: "short" })}
                {" — "}
                {domingo.getDate()} {domingo.toLocaleDateString("es-EC", { month: "short" })}
              </p>
            </div>
            <button
              onClick={() => setLunes(prev => addDays(prev, 7))}
              style={{ width: "36px", height: "36px", border: "1px solid #e2e8f0", borderRadius: "8px", backgroundColor: "#fff", color: "#475569", fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              ›
            </button>
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Citas totales",    value: citasActivas,    color: "#0f172a", bg: "#f1f5f9" },
            { label: "Pendientes",       value: citasPendientes, color: "#92400e", bg: "#fef3c7" },
            { label: "Completadas",      value: citasCompletadas, color: "#065f46", bg: "#d1fae5" },
          ].map((s) => (
            <div key={s.label} style={{ backgroundColor: s.bg, borderRadius: "12px", padding: "16px 20px" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, color: s.color, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px", opacity: 0.7 }}>
                {s.label}
              </p>
              <p style={{ fontSize: "1.8rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>
                {loading ? "—" : s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Grid de días */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8", fontSize: "0.9rem" }}>
            Cargando agenda...
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "10px", overflowX: "auto" }}>
            {Array.from({ length: 7 }, (_, i) => {
              const fecha      = formatFecha(addDays(lunes, i));
              const citasDia   = citas.filter(c => c.fecha === fecha);
              const esHoy      = fecha === hoy;
              const diaNum     = addDays(lunes, i).getDate();
              const activas    = citasDia.filter(c => c.estado !== "cancelada").length;

              return (
                <div
                  key={fecha}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    border: esHoy ? "2px solid #2563eb" : "1px solid #e2e8f0",
                    overflow: "hidden",
                    minWidth: "160px",
                  }}
                >
                  {/* Cabecera del día */}
                  <div style={{
                    padding: "12px 14px",
                    backgroundColor: esHoy ? "#2563eb" : "#f8fafc",
                    borderBottom: "1px solid " + (esHoy ? "#2563eb" : "#e2e8f0"),
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div>
                      <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: esHoy ? "#bfdbfe" : "#94a3b8", marginBottom: "2px" }}>
                        {DIAS_CORTO[i]}
                      </p>
                      <p style={{ fontSize: "1.3rem", fontWeight: 800, color: esHoy ? "#ffffff" : "#0f172a", lineHeight: 1 }}>
                        {diaNum}
                      </p>
                    </div>
                    {activas > 0 && (
                      <span style={{
                        width: "26px", height: "26px", borderRadius: "50%",
                        backgroundColor: esHoy ? "rgba(255,255,255,0.25)" : "#e2e8f0",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.8rem", fontWeight: 700,
                        color: esHoy ? "#ffffff" : "#475569",
                      }}>
                        {activas}
                      </span>
                    )}
                  </div>

                  {/* Citas */}
                  <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "6px", minHeight: "80px" }}>
                    {citasDia.length === 0 ? (
                      <p style={{ fontSize: "0.72rem", color: "#cbd5e1", textAlign: "center", paddingTop: "16px" }}>
                        Sin citas
                      </p>
                    ) : (
                      citasDia.map(cita => {
                        const est = ESTADO[cita.estado] ?? ESTADO.pendiente;
                        return (
                          <div
                            key={cita.id}
                            style={{
                              padding: "10px 12px",
                              backgroundColor: "#f8fafc",
                              borderRadius: "8px",
                              borderLeft: `3px solid ${est.dot}`,
                            }}
                          >
                            {/* Hora + badge */}
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
                              <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a" }}>
                                {cita.hora}
                              </span>
                              <span style={{
                                fontSize: "0.6rem", fontWeight: 600, padding: "2px 7px",
                                borderRadius: "99px", backgroundColor: est.bg, color: est.text,
                                textTransform: "uppercase", letterSpacing: "0.04em",
                              }}>
                                {est.label}
                              </span>
                            </div>

                            {/* Cliente */}
                            <p style={{ fontSize: "0.82rem", fontWeight: 600, color: "#1e293b", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {cita.clienteNombre}
                            </p>

                            {/* Servicio */}
                            <p style={{ fontSize: "0.72rem", color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {cita.servicio}
                            </p>

                            {/* Precio */}
                            <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#059669", marginTop: "4px" }}>
                              {cita.precio}
                            </p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sem sin citas */}
        {!loading && citas.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 24px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", marginTop: "8px" }}>
            <p style={{ fontSize: "2rem", marginBottom: "12px" }}>📅</p>
            <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
              Sin citas esta semana
            </p>
            <p style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
              Navega a otra semana o espera nuevas reservas
            </p>
          </div>
        )}

        {/* Leyenda días */}
        <div style={{ marginTop: "20px", display: "none" }}>
          {DIAS_LARGO.map(d => <span key={d}>{d}</span>)}
        </div>

      </main>
    </div>
  );
}
