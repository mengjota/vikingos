"use client";

import { useEffect, useState } from "react";
import { requestPushPermission } from "./PwaManager";

interface Props {
  barbershopId?: string;
  userEmail?: string;
  /** "staff" shows a subtle inline banner; "client" shows after booking */
  variant?: "staff" | "client";
}

export default function PushPrompt({ barbershopId, userEmail, variant = "staff" }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!("Notification" in window) || !("PushManager" in window)) return;
    if (Notification.permission !== "default") return;
    const key = `push-prompt-${variant}`;
    if (localStorage.getItem(key)) return;
    // Small delay so it doesn't pop immediately on page load
    const t = setTimeout(() => setShow(true), variant === "staff" ? 4000 : 1500);
    return () => clearTimeout(t);
  }, [variant]);

  async function handleAccept() {
    setShow(false);
    localStorage.setItem(`push-prompt-${variant}`, "1");
    await requestPushPermission({ barbershopId, userEmail });
  }

  function handleDismiss() {
    setShow(false);
    localStorage.setItem(`push-prompt-${variant}`, "1");
  }

  if (!show) return null;

  if (variant === "client") {
    return (
      <div style={{ marginTop: "20px", padding: "16px 20px", border: "1px solid rgba(200,146,26,0.25)", backgroundColor: "rgba(200,146,26,0.04)", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "180px" }}>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "2px" }}>
            🔔 ¿Activar notificaciones?
          </p>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", color: "rgba(184,168,138,0.45)" }}>
            Te avisamos si hay cambios en tu cita
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={handleAccept}
            style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#080604", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040)", border: "none", padding: "8px 16px", cursor: "pointer" }}>
            Activar
          </button>
          <button onClick={handleDismiss}
            style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "rgba(184,168,138,0.4)", background: "none", border: "none", cursor: "pointer", padding: "8px" }}>
            No gracias
          </button>
        </div>
      </div>
    );
  }

  // Staff variant — very subtle top bar
  return (
    <div style={{ backgroundColor: "rgba(200,146,26,0.06)", borderBottom: "1px solid rgba(200,146,26,0.15)", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.6)" }}>
        🔔 Activa las notificaciones para recibir avisos de nuevas citas
      </p>
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={handleAccept}
          style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#c8921a", background: "none", border: "1px solid rgba(200,146,26,0.4)", padding: "6px 14px", cursor: "pointer" }}>
          Activar
        </button>
        <button onClick={handleDismiss}
          style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "rgba(92,58,30,0.6)", background: "none", border: "none", cursor: "pointer" }}>
          ✕
        </button>
      </div>
    </div>
  );
}
