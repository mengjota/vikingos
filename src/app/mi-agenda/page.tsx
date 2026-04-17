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

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

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

function formatLabel(date: Date): string {
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
}

function formatRango(lunes: Date): string {
  const domingo = addDays(lunes, 6);
  return `${formatLabel(lunes)} — ${formatLabel(domingo)}`;
}

const estadoConfig = {
  pendiente:  { label: "Pendiente",  color: "#f0c040", bg: "rgba(240,192,64,0.08)",  border: "rgba(240,192,64,0.3)"  },
  completada: { label: "Completada", color: "#4ade80", bg: "rgba(74,222,128,0.08)", border: "rgba(74,222,128,0.3)" },
  cancelada:  { label: "Cancelada",  color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.3)" },
};

export default function MiAgenda() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);
  const [lunes, setLunes] = useState<Date>(getLunesDeEstaSemana());
  const [citas, setCitas] = useState<Cita[]>([]);
  const [barberName, setBarberName] = useState("");
  const [loading, setLoading] = useState(true);

  const cargarAgenda = useCallback(async (email: string, weekStart: string) => {
    setLoading(true);
    const res = await fetch(`/api/mi-agenda?email=${encodeURIComponent(email)}&weekStart=${weekStart}`);
    if (res.ok) {
      const data = await res.json();
      setCitas(data.reservations ?? []);
      setBarberName(data.barberName ?? "");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const s = getSession();
    if (!s || s.role !== "employee") {
      router.push("/login");
      return;
    }
    setSession(s);
    cargarAgenda(s.email, formatFecha(lunes));
  }, [router, lunes, cargarAgenda]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  function semanaAnterior() { setLunes(prev => addDays(prev, -7)); }
  function semanaSiguiente() { setLunes(prev => addDays(prev, 7)); }
  function semanaActual() { setLunes(getLunesDeEstaSemana()); }

  const esEstaSemana = formatFecha(lunes) === formatFecha(getLunesDeEstaSemana());

  const citasPorDia: Record<string, Cita[]> = {};
  for (let i = 0; i < 7; i++) {
    const fecha = formatFecha(addDays(lunes, i));
    citasPorDia[fecha] = citas.filter(c => c.fecha === fecha);
  }

  const totalSemana = citas.filter(c => c.estado !== "cancelada").length;
  const hoy = formatFecha(new Date());

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060504", fontFamily: "var(--font-barlow)" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(200,146,26,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ backgroundColor: "#0a0806", borderBottom: "1px solid rgba(92,58,30,0.45)", padding: "0 24px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a href="/" style={{ textDecoration: "none" }}>
              <span style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.2rem", color: "#c8921a" }}>BarberOS</span>
            </a>
            <span style={{ color: "rgba(92,58,30,0.5)" }}>|</span>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)" }}>
              Mi Agenda
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {session && (
              <span style={{ fontSize: "0.72rem", letterSpacing: "0.2em", color: "rgba(184,168,138,0.5)" }}>
                {session.name}
              </span>
            )}
            <button onClick={handleLogout}
              style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(239,68,68,0.5)", background: "none", border: "none", cursor: "pointer" }}>
              Salir
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Titulo + barbero */}
        <div style={{ marginBottom: "36px" }}>
          <p style={{ fontSize: "0.68rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(200,146,26,0.6)", marginBottom: "6px" }}>
            Barbero
          </p>
          <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.5rem,4vw,2.2rem)", color: "#f0e6c8", fontWeight: 900, marginBottom: "4px" }}>
            {barberName || session?.name || "—"}
          </h1>
        </div>

        {/* Navegación de semana */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: "32px", flexWrap: "wrap", gap: "12px",
          padding: "16px 24px", border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0a0806",
        }}>
          <button onClick={semanaAnterior} style={{
            padding: "10px 20px", border: "1px solid rgba(92,58,30,0.5)",
            backgroundColor: "transparent", color: "rgba(184,168,138,0.6)",
            cursor: "pointer", fontFamily: "var(--font-barlow)",
            fontSize: "0.72rem", letterSpacing: "0.3em", textTransform: "uppercase",
          }}>
            ← Anterior
          </button>

          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(184,168,138,0.35)", marginBottom: "4px" }}>
              {esEstaSemana ? "• Semana actual •" : "Semana"}
            </p>
            <p style={{ fontSize: "1rem", color: "#f0e6c8", letterSpacing: "0.08em", fontWeight: 600 }}>
              {formatRango(lunes)}
            </p>
            <p style={{ fontSize: "0.68rem", color: "rgba(200,146,26,0.5)", letterSpacing: "0.15em", marginTop: "4px" }}>
              {totalSemana} {totalSemana === 1 ? "cita" : "citas"} activas
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            {!esEstaSemana && (
              <button onClick={semanaActual} style={{
                padding: "10px 16px", border: "1px solid rgba(200,146,26,0.4)",
                backgroundColor: "rgba(200,146,26,0.06)", color: "rgba(200,146,26,0.7)",
                cursor: "pointer", fontFamily: "var(--font-barlow)",
                fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase",
              }}>
                Hoy
              </button>
            )}
            <button onClick={semanaSiguiente} style={{
              padding: "10px 20px", border: "1px solid rgba(92,58,30,0.5)",
              backgroundColor: "transparent", color: "rgba(184,168,138,0.6)",
              cursor: "pointer", fontFamily: "var(--font-barlow)",
              fontSize: "0.72rem", letterSpacing: "0.3em", textTransform: "uppercase",
            }}>
              Siguiente →
            </button>
          </div>
        </div>

        {/* Grid de dias */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(184,168,138,0.3)", letterSpacing: "0.3em", fontSize: "0.75rem" }}>
            CARGANDO AGENDA...
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
            {Array.from({ length: 7 }, (_, i) => {
              const fecha = formatFecha(addDays(lunes, i));
              const diaLabel = DIAS[i];
              const citasDelDia = citasPorDia[fecha] ?? [];
              const esHoy = fecha === hoy;

              return (
                <div key={fecha} style={{
                  border: esHoy ? "1px solid rgba(200,146,26,0.5)" : "1px solid rgba(92,58,30,0.35)",
                  backgroundColor: esHoy ? "rgba(200,146,26,0.04)" : "#0a0806",
                  overflow: "hidden",
                  position: "relative",
                }}>
                  {esHoy && (
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #c8921a, transparent)" }} />
                  )}

                  {/* Cabecera del dia */}
                  <div style={{
                    padding: "14px 18px",
                    borderBottom: "1px solid rgba(92,58,30,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div>
                      <p style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: esHoy ? "#c8921a" : "#f0e6c8", marginBottom: "2px" }}>
                        {diaLabel}
                      </p>
                      <p style={{ fontSize: "0.68rem", color: "rgba(184,168,138,0.45)", letterSpacing: "0.1em" }}>
                        {formatLabel(addDays(lunes, i))}
                        {esHoy && <span style={{ color: "#c8921a", marginLeft: "8px", fontSize: "0.62rem" }}>HOY</span>}
                      </p>
                    </div>
                    {citasDelDia.length > 0 && (
                      <span style={{
                        width: "28px", height: "28px", borderRadius: "50%",
                        backgroundColor: "rgba(200,146,26,0.15)", border: "1px solid rgba(200,146,26,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem", fontWeight: 700, color: "#c8921a",
                      }}>
                        {citasDelDia.filter(c => c.estado !== "cancelada").length}
                      </span>
                    )}
                  </div>

                  {/* Citas del dia */}
                  <div style={{ padding: citasDelDia.length ? "12px" : "24px 18px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {citasDelDia.length === 0 ? (
                      <p style={{ fontSize: "0.68rem", color: "rgba(184,168,138,0.2)", letterSpacing: "0.2em", textAlign: "center" }}>
                        Sin citas
                      </p>
                    ) : (
                      citasDelDia.map(cita => {
                        const cfg = estadoConfig[cita.estado] ?? estadoConfig.pendiente;
                        return (
                          <div key={cita.id} style={{
                            padding: "12px 14px",
                            border: `1px solid ${cfg.border}`,
                            backgroundColor: cfg.bg,
                            position: "relative",
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f0e6c8", letterSpacing: "0.03em" }}>
                                {cita.hora}
                              </p>
                              <span style={{
                                fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase",
                                color: cfg.color, border: `1px solid ${cfg.border}`,
                                padding: "2px 8px",
                              }}>
                                {cfg.label}
                              </span>
                            </div>
                            <p style={{ fontSize: "0.82rem", color: "#f0e6c8", marginBottom: "3px", fontWeight: 600 }}>
                              {cita.clienteNombre}
                            </p>
                            <p style={{ fontSize: "0.72rem", color: "rgba(184,168,138,0.55)", letterSpacing: "0.05em" }}>
                              {cita.servicio}
                            </p>
                            <p style={{ fontSize: "0.7rem", color: "rgba(200,146,26,0.6)", marginTop: "2px", fontWeight: 600 }}>
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

        {!loading && citas.length === 0 && (
          <div style={{ textAlign: "center", marginTop: "16px", padding: "20px", color: "rgba(184,168,138,0.3)", fontSize: "0.75rem", letterSpacing: "0.2em" }}>
            No hay citas registradas para esta semana
          </div>
        )}
      </div>
    </div>
  );
}
