"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, type Reservation } from "@/lib/auth";
import Link from "next/link";

export default function MisReservas() {
  const router = useRouter();
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    getSession().then(async (s) => {
      if (!s) { router.push("/login"); return; }
      if (s.role === "owner") { router.push("/admin/dashboard"); return; }
      if (s.role === "employee") { router.push("/mi-agenda"); return; }
      setNombre(s.name);
      try {
        const res = await fetch(`/api/reservations?email=${encodeURIComponent(s.email)}`);
        if (res.ok) setReservas(await res.json());
      } catch (_) {}
      finally { setLoading(false); }
    }).catch(() => { router.push("/login"); });
  }, [router]);

  const pendientes   = reservas.filter(r => !r.estado || r.estado === "pendiente");
  const completadas  = reservas.filter(r => r.estado === "completada");
  const canceladas   = reservas.filter(r => r.estado === "cancelada");

  async function cancelarReserva(id: string) {
    if (!confirm("¿Cancelar esta cita?")) return;
    setCancellingId(id);
    try {
      await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: "cancelada", facturaId: null }),
      });
      setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: "cancelada" } : r));
    } catch (_) {}
    finally { setCancellingId(null); }
  }

  function statusColor(estado?: string) {
    if (estado === "completada") return "#4ade80";
    if (estado === "cancelada")  return "rgba(239,68,68,0.6)";
    return "#c8921a";
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080604", paddingTop: "100px" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(200,146,26,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "rgba(200,146,26,0.5)", marginBottom: "12px" }}>— Tu Historial —</p>
        <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.6rem,5vw,2.8rem)", color: "#f0e6c8", fontWeight: 900, marginBottom: "6px" }}>Mis Reservas</h1>
        {nombre && <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.82rem", color: "rgba(184,168,138,0.4)", marginBottom: "40px" }}>{nombre}</p>}

        {loading ? (
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", letterSpacing: "0.3em", color: "rgba(184,168,138,0.3)" }}>CARGANDO...</p>
        ) : reservas.length === 0 ? (
          <div style={{ border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0e0b07", padding: "60px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.3)", marginBottom: "20px" }}>Sin reservas todavía</p>
            <Link href="/reservar" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", padding: "12px 28px", background: "linear-gradient(135deg,#a06010,#c8921a)", border: "none", color: "#080604", cursor: "pointer", textDecoration: "none", display: "inline-block" }}>
              Reservar Ahora
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {[...pendientes, ...completadas, ...canceladas].map(r => (
              <div key={r.id} style={{ border: "1px solid rgba(92,58,30,0.35)", backgroundColor: "#0e0b07", padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.95rem", fontWeight: 700, color: "#f0e6c8" }}>{r.servicio}</p>
                    <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.55rem", letterSpacing: "0.25em", textTransform: "uppercase", color: statusColor(r.estado), border: `1px solid ${statusColor(r.estado)}40`, padding: "2px 8px" }}>
                      {r.estado ?? "pendiente"}
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.45)" }}>
                    {r.fecha} · {r.hora} · {r.barbero}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "1rem", fontWeight: 900, color: "#c8921a" }}>{r.precio}</span>
                  {(!r.estado || r.estado === "pendiente") && (
                    <button
                      onClick={() => cancelarReserva(r.id)}
                      disabled={cancellingId === r.id}
                      style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(239,68,68,0.6)", border: "1px solid rgba(239,68,68,0.25)", backgroundColor: "transparent", padding: "4px 10px", cursor: "pointer" }}
                    >
                      {cancellingId === r.id ? "..." : "Cancelar"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "40px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link href="/reservar" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#c8921a", border: "1px solid rgba(200,146,26,0.4)", padding: "12px 24px", textDecoration: "none", display: "inline-block" }}>
            + Nueva Reserva
          </Link>
          <Link href="/" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", border: "1px solid rgba(92,58,30,0.3)", padding: "12px 24px", textDecoration: "none", display: "inline-block" }}>
            ← Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
