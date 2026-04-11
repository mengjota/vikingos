"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSession, logout, getReservations, type Session, type Reservation } from "@/lib/auth";

const ESTADO_CFG = {
  pendiente:  { label: "Pendiente",  color: "#f0c040", bg: "rgba(240,192,64,0.10)",  border: "rgba(240,192,64,0.35)"  },
  completada: { label: "Completada", color: "#4ade80", bg: "rgba(74,222,128,0.08)",  border: "rgba(74,222,128,0.3)"   },
  cancelada:  { label: "Cancelada",  color: "#f87171", bg: "rgba(248,113,113,0.08)", border: "rgba(248,113,113,0.3)"  },
};

function formatFechaLarga(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const fecha = new Date(Number(y), Number(m) - 1, Number(d));
  return fecha.toLocaleDateString("es-EC", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function PerfilPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelando, setCancelando] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<Reservation | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s || s.role === "employee") { router.push("/login"); return; }
    if (s.role === "owner") { router.push("/admin/dashboard"); return; }
    setSession(s);
    getReservations(s.email).then(setReservas).finally(() => setLoading(false));
  }, [router]);

  function handleLogout() { logout(); router.push("/"); }

  async function cancelarReserva(r: Reservation) {
    setCancelando(r.id);
    await fetch(`/api/reservations/${r.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: "cancelada" }),
    });
    setReservas(prev => prev.map(x => x.id === r.id ? { ...x, estado: "cancelada" } : x));
    setCancelando(null);
    setConfirmCancel(null);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#080604", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-barlow)", color: "#c8921a", fontSize: "0.75rem", letterSpacing: "0.4em" }}>CARGANDO...</span>
      </div>
    );
  }

  const inicial = session!.name.charAt(0).toUpperCase();
  const pendientes = reservas.filter(r => !r.estado || r.estado === "pendiente").length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080604", paddingTop: "100px", paddingBottom: "80px" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(200,146,26,0.10) 0%, transparent 70%)" }} />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 20px" }}>

        {/* Nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "48px" }}>
          <Link href="/" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(184,168,138,0.45)", textDecoration: "none" }}>
            ← Inicio
          </Link>
          <button onClick={handleLogout} style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(239,68,68,0.5)", background: "none", border: "none", cursor: "pointer" }}>
            Cerrar Sesión
          </button>
        </div>

        {/* Perfil hero */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{
            width: "88px", height: "88px", margin: "0 auto 20px",
            background: "linear-gradient(135deg, #1a1208, #2a1d0e)",
            border: "2px solid rgba(200,146,26,0.6)",
            boxShadow: "0 0 40px rgba(200,146,26,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-cinzel-decorative)", fontSize: "2.2rem", color: "#c8921a",
          }}>
            {inicial}
          </div>

          <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.6rem,5vw,2.6rem)", color: "#f0e6c8", fontWeight: 900, marginBottom: "6px" }}>
            {session!.name}
          </h1>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "rgba(184,168,138,0.45)", letterSpacing: "0.2em", marginBottom: "20px" }}>
            {session!.email}
          </p>
          {session!.barbershopName && (
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.5)" }}>
              {session!.barbershopName}
            </p>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "16px" }}>
            <div style={{ height: "1px", width: "60px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.5))" }} />
            <span style={{ color: "#c8921a" }}>᛭</span>
            <div style={{ height: "1px", width: "60px", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.5))" }} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
          <div style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "20px 24px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.4), transparent)" }} />
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.6)", marginBottom: "8px" }}>
              Total citas
            </p>
            <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "2rem", color: "#f0e6c8", fontWeight: 900 }}>
              {reservas.length}
            </p>
          </div>
          <div style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "20px 24px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(240,192,64,0.4), transparent)" }} />
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(240,192,64,0.6)", marginBottom: "8px" }}>
              Pendientes
            </p>
            <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "2rem", color: "#f0c040", fontWeight: 900 }}>
              {pendientes}
            </p>
          </div>
        </div>

        {/* Botón nueva reserva */}
        <Link href="/reservar" style={{
          display: "block", textAlign: "center", padding: "18px",
          background: "linear-gradient(135deg, #a06010, #c8921a, #f0c040, #c8921a, #a06010)",
          fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 900,
          letterSpacing: "0.5em", textTransform: "uppercase", color: "#080604",
          textDecoration: "none", marginBottom: "48px",
          boxShadow: "0 0 30px rgba(200,146,26,0.35)",
        }}>
          + Nueva Reserva
        </Link>

        {/* Mis Citas */}
        <div>
          <h2 style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(184,168,138,0.6)", marginBottom: "20px" }}>
            Mis Citas
          </h2>

          {reservas.length === 0 ? (
            <div style={{ border: "1px dashed rgba(92,58,30,0.35)", padding: "48px 24px", textAlign: "center", backgroundColor: "#0e0b07" }}>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.82rem", color: "rgba(184,168,138,0.35)", letterSpacing: "0.2em", marginBottom: "6px" }}>
                Aún no tienes citas agendadas
              </p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.2)" }}>
                Reserva tu primera cita y aparecerá aquí
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {reservas.map((r) => {
                const est = ESTADO_CFG[(r.estado ?? "pendiente") as keyof typeof ESTADO_CFG] ?? ESTADO_CFG.pendiente;
                const esPendiente = !r.estado || r.estado === "pendiente";
                return (
                  <div key={r.id} style={{
                    border: `1px solid ${est.border}`,
                    backgroundColor: est.bg,
                    padding: "20px 24px",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "3px", backgroundColor: est.color, opacity: 0.6 }} />

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap" }}>
                      {/* Info */}
                      <div style={{ paddingLeft: "8px", flex: 1 }}>
                        {/* Servicio + estado */}
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1rem", fontWeight: 700, color: "#f0e6c8" }}>
                            {r.servicio}
                          </p>
                          <span style={{
                            fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase",
                            color: est.color, border: `1px solid ${est.border}`,
                            padding: "2px 10px",
                          }}>
                            {est.label}
                          </span>
                        </div>

                        {/* Fecha y hora */}
                        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.82rem", color: "rgba(184,168,138,0.7)", marginBottom: "4px", textTransform: "capitalize" }}>
                          {formatFechaLarga(r.fecha)} — {r.hora}
                        </p>

                        {/* Barbero */}
                        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(200,146,26,0.6)", letterSpacing: "0.1em" }}>
                          Barbero: {r.barbero}
                        </p>
                      </div>

                      {/* Precio + acción */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.4rem", color: "#f0c040", fontWeight: 900, marginBottom: "8px" }}>
                          {r.precio}
                        </p>
                        {esPendiente && (
                          <button
                            onClick={() => setConfirmCancel(r)}
                            style={{
                              fontFamily: "var(--font-barlow)", fontSize: "0.62rem", letterSpacing: "0.25em",
                              textTransform: "uppercase", color: "rgba(239,68,68,0.55)",
                              border: "1px solid rgba(239,68,68,0.25)", backgroundColor: "transparent",
                              padding: "6px 12px", cursor: "pointer",
                            }}
                          >
                            Cancelar cita
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal confirmar cancelación */}
      {confirmCancel && (
        <div style={{
          position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "24px", zIndex: 100, backdropFilter: "blur(4px)",
        }}>
          <div style={{
            width: "100%", maxWidth: "380px", backgroundColor: "#0e0b07",
            border: "1px solid rgba(239,68,68,0.35)", padding: "36px",
            textAlign: "center", position: "relative",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(239,68,68,0.5), transparent)" }} />
            <p style={{ fontSize: "2rem", marginBottom: "16px" }}>⚠️</p>
            <h3 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1rem", color: "#f0e6c8", marginBottom: "12px" }}>
              ¿Cancelar esta cita?
            </h3>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.82rem", color: "#f0e6c8", marginBottom: "4px", fontWeight: 600 }}>
              {confirmCancel.servicio}
            </p>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.55)", marginBottom: "28px", textTransform: "capitalize" }}>
              {formatFechaLarga(confirmCancel.fecha)} — {confirmCancel.hora}
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setConfirmCancel(null)}
                style={{
                  flex: 1, padding: "13px", border: "1px solid rgba(92,58,30,0.5)",
                  backgroundColor: "transparent", color: "rgba(184,168,138,0.5)",
                  cursor: "pointer", fontFamily: "var(--font-barlow)",
                  fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase",
                }}
              >
                Volver
              </button>
              <button
                onClick={() => cancelarReserva(confirmCancel)}
                disabled={cancelando === confirmCancel.id}
                style={{
                  flex: 1, padding: "13px",
                  border: "1px solid rgba(239,68,68,0.4)",
                  backgroundColor: "rgba(239,68,68,0.08)",
                  color: "#f87171",
                  cursor: cancelando === confirmCancel.id ? "not-allowed" : "pointer",
                  fontFamily: "var(--font-barlow)", fontSize: "0.7rem", fontWeight: 700,
                  letterSpacing: "0.3em", textTransform: "uppercase",
                  opacity: cancelando === confirmCancel.id ? 0.6 : 1,
                }}
              >
                {cancelando === confirmCancel.id ? "Cancelando..." : "Sí, cancelar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
