"use client";

import { useState, useEffect } from "react";

type FeedbackState = { type: "in" | "out" | "error"; name?: string; barberName?: string; duration?: string; msg?: string } | null;

export default function FicharPage() {
  const [pin, setPin]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [time, setTime]         = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setTime(now.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Auto-limpiar feedback tras 4s
  useEffect(() => {
    if (!feedback) return;
    const id = setTimeout(() => { setFeedback(null); setPin(""); }, 4000);
    return () => clearTimeout(id);
  }, [feedback]);

  function press(digit: string) {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    if (next.length === 4) submit(next);
  }

  function borrar() { setPin(p => p.slice(0, -1)); }

  async function submit(code: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/employee/clock-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: code }),
      });
      const d = await res.json();
      if (!res.ok) {
        setFeedback({ type: "error", msg: d.error ?? "PIN incorrecto" });
      } else {
        setFeedback({ type: d.action, name: d.name, barberName: d.barberName, duration: d.duration });
      }
    } catch (_) {
      setFeedback({ type: "error", msg: "Error de conexión" });
    } finally {
      setLoading(false);
    }
  }

  const dots = [0, 1, 2, 3];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080604", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(200,146,26,0.08) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, borderBottom: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0a0806", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1rem", color: "#c8921a" }}>BarberOS</span>
        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "1.4rem", fontWeight: 700, color: "#f0e6c8", letterSpacing: "0.1em" }}>{time}</span>
        <a href="/" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.3)", textDecoration: "none" }}>Inicio</a>
      </div>

      {/* Feedback */}
      {feedback && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: feedback.type === "error" ? "rgba(239,68,68,0.12)" : "rgba(200,146,26,0.1)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, backdropFilter: "blur(2px)" }}>
          <div style={{ textAlign: "center", maxWidth: "400px", padding: "48px 40px", border: `1px solid ${feedback.type === "error" ? "rgba(239,68,68,0.4)" : "rgba(200,146,26,0.5)"}`, backgroundColor: "#0e0b07" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>
              {feedback.type === "in" ? "🟢" : feedback.type === "out" ? "🔴" : "⚠️"}
            </div>
            {feedback.type === "error" ? (
              <>
                <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.3rem", color: "#ef4444", marginBottom: "8px" }}>PIN Incorrecto</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", color: "rgba(239,68,68,0.6)" }}>{feedback.msg}</p>
              </>
            ) : (
              <>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(200,146,26,0.6)", marginBottom: "12px" }}>
                  {feedback.type === "in" ? "Entrada Registrada" : "Salida Registrada"}
                </p>
                <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.8rem", color: "#f0e6c8", fontWeight: 900, marginBottom: "8px" }}>{feedback.name}</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", color: "rgba(200,146,26,0.7)", marginBottom: feedback.duration ? "16px" : "0" }}>{feedback.barberName}</p>
                {feedback.duration && (
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "rgba(184,168,138,0.5)" }}>Tiempo trabajado: <strong style={{ color: "#c8921a" }}>{feedback.duration}</strong></p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Panel central */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "380px", width: "100%" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(200,146,26,0.5)", marginBottom: "12px" }}>— Control de Fichaje —</p>
        <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.6rem,5vw,2.4rem)", color: "#f0e6c8", fontWeight: 900, marginBottom: "8px" }}>Introduce tu PIN</h1>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.35)", marginBottom: "40px", letterSpacing: "0.1em" }}>4 dígitos para registrar entrada o salida</p>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "40px" }}>
          {dots.map(i => (
            <div key={i} style={{ width: "20px", height: "20px", borderRadius: "50%", backgroundColor: i < pin.length ? "#c8921a" : "transparent", border: `2px solid ${i < pin.length ? "#c8921a" : "rgba(92,58,30,0.5)"}`, boxShadow: i < pin.length ? "0 0 12px rgba(200,146,26,0.6)" : "none", transition: "all 0.15s" }} />
          ))}
        </div>

        {/* Teclado */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", maxWidth: "300px", margin: "0 auto" }}>
          {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k, i) => (
            <button key={i} onClick={() => k === "⌫" ? borrar() : k ? press(k) : undefined}
              disabled={loading || !k && k !== "0"}
              style={{
                height: "72px", fontFamily: "var(--font-barlow)", fontSize: k === "⌫" ? "1.4rem" : "1.6rem", fontWeight: 700,
                border: "1px solid rgba(92,58,30,0.4)", backgroundColor: k ? "#0e0b07" : "transparent",
                color: k === "⌫" ? "rgba(239,68,68,0.6)" : "#f0e6c8",
                cursor: k ? "pointer" : "default",
                transition: "all 0.1s",
                boxShadow: "none",
                visibility: !k ? "hidden" : "visible",
              }}
              onMouseEnter={e => { if (k) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1a1208"; }}
              onMouseLeave={e => { if (k) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0e0b07"; }}
            >
              {k}
            </button>
          ))}
        </div>

        {loading && (
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "rgba(200,146,26,0.5)", marginTop: "24px", textTransform: "uppercase" }}>Verificando...</p>
        )}
      </div>
    </div>
  );
}
