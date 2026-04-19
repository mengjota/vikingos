"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Reserva {
  id: number;
  client_name: string;
  service: string;
  barber: string;
  date: string;
  time: string;
  status: string;
}

function CancelarContent() {
  const params = useSearchParams();
  const token  = params.get("token") ?? "";

  const [reserva, setReserva]   = useState<Reserva | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [confirming, setConfirming] = useState(false);
  const [done, setDone]         = useState(false);

  useEffect(() => {
    if (!token) { setError("Enlace no válido."); setLoading(false); return; }
    fetch(`/api/cancelar?token=${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setReserva(d);
      })
      .catch(() => setError("Error al cargar la cita."))
      .finally(() => setLoading(false));
  }, [token]);

  async function cancelar() {
    setConfirming(true);
    try {
      const res = await fetch(`/api/cancelar?token=${token}`, { method: "POST" });
      const d   = await res.json();
      if (!res.ok) { setError(d.error ?? "Error al cancelar."); return; }
      setDone(true);
    } catch (_) {
      setError("Error de conexión.");
    } finally {
      setConfirming(false);
    }
  }

  const gold: React.CSSProperties = { color: "#c8921a" };

  if (loading) return (
    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.3em", color: "rgba(184,168,138,0.3)" }}>
      CARGANDO...
    </p>
  );

  if (done) return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "3rem", marginBottom: "16px" }}>✓</div>
      <h2 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.4rem,4vw,2.2rem)", color: "#f0e6c8", fontWeight: 900, marginBottom: "12px" }}>
        Cita Cancelada
      </h2>
      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", color: "rgba(184,168,138,0.5)", marginBottom: "32px" }}>
        Tu cita ha sido cancelada correctamente. Si cambias de idea, puedes reservar de nuevo.
      </p>
      <Link href="/reservar"
        style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#080604", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", padding: "14px 32px", display: "inline-block", textDecoration: "none", boxShadow: "0 0 30px rgba(200,146,26,0.4)" }}>
        Nueva Reserva
      </Link>
    </div>
  );

  if (error || !reserva) return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", color: "rgba(239,68,68,0.7)", marginBottom: "24px" }}>
        ⚠ {error || "Enlace no válido."}
      </p>
      <Link href="/"
        style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", border: "1px solid rgba(92,58,30,0.3)", padding: "12px 24px", display: "inline-block", textDecoration: "none" }}>
        ← Volver al inicio
      </Link>
    </div>
  );

  if (reserva.status === "cancelada") return (
    <div style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", color: "rgba(184,168,138,0.5)", marginBottom: "24px" }}>
        Esta cita ya fue cancelada anteriormente.
      </p>
      <Link href="/reservar"
        style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#c8921a", border: "1px solid rgba(200,146,26,0.4)", padding: "12px 24px", display: "inline-block", textDecoration: "none" }}>
        Reservar de nuevo
      </Link>
    </div>
  );

  const fechaFmt = new Date(reserva.date + "T12:00:00").toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div style={{ maxWidth: "480px", width: "100%" }}>
      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", ...gold, marginBottom: "16px", textAlign: "center" }}>
        — Cancelar Reserva —
      </p>
      <h2 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.4rem,4vw,2rem)", color: "#f0e6c8", fontWeight: 900, marginBottom: "24px", textAlign: "center" }}>
        ¿Estás seguro?
      </h2>

      {/* Detalles de la cita */}
      <div style={{ border: "1px solid rgba(200,146,26,0.3)", backgroundColor: "#0e0b07", padding: "24px", marginBottom: "28px", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #c8921a, transparent)" }} />
        {[
          ["Nombre",   reserva.client_name],
          ["Servicio", reserva.service],
          ["Barbero",  reserva.barber],
          ["Fecha",    `${fechaFmt} a las ${reserva.time}`],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "16px", marginBottom: "10px" }}>
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(200,146,26,0.6)" }}>{label}</span>
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", color: "#f0e6c8", textAlign: "right" }}>{val}</span>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.4)", textAlign: "center", marginBottom: "24px" }}>
        Esta acción no se puede deshacer.
      </p>

      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <Link href="/"
          style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)", border: "1px solid rgba(92,58,30,0.4)", padding: "14px 28px", display: "inline-block", textDecoration: "none" }}>
          No, mantener
        </Link>
        <button onClick={cancelar} disabled={confirming}
          style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: "#f0e6c8", backgroundColor: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)", padding: "14px 28px", cursor: confirming ? "not-allowed" : "pointer" }}>
          {confirming ? "Cancelando..." : "Sí, cancelar cita"}
        </button>
      </div>
    </div>
  );
}

export default function CancelarPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080604", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 30%, rgba(200,146,26,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />
      <Suspense fallback={<p style={{ fontFamily: "var(--font-barlow)", color: "rgba(184,168,138,0.3)", letterSpacing: "0.3em" }}>CARGANDO...</p>}>
        <CancelarContent />
      </Suspense>
    </div>
  );
}
