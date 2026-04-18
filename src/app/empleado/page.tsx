"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout, type Session } from "@/lib/auth";

export default function EmpleadoHub() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    getSession().then(s => {
      if (!s || (s.role !== "employee" && s.role !== "owner")) {
        router.replace("/staff");
        return;
      }
      setSession(s);
    });
  }, [router]);

  async function handleLogout() {
    await logout("/staff");
  }

  if (!session) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#080604", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.5em", color: "rgba(184,168,138,0.3)" }}>CARGANDO...</p>
      </div>
    );
  }

  const nombre = (session.barberName ?? session.name).split(" ")[0];
  const isOwner = session.role === "owner";

  const cards = [
    {
      icon: "📅",
      title: "Mi Agenda",
      desc: "Consulta tus citas de la semana y gestiona tu disponibilidad.",
      href: "/mi-agenda",
      accent: "167,139,250",
    },
    {
      icon: "🧾",
      title: "Caja",
      desc: "Registra servicios y productos vendidos. Consulta tus ventas del día.",
      href: "/caja",
      accent: "200,146,26",
    },
    ...(isOwner ? [{
      icon: "🛡️",
      title: "Panel Admin",
      desc: "Gestiona la barbería, empleados, servicios y facturación.",
      href: "/admin/dashboard",
      accent: "96,165,250",
    }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080604", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(200,146,26,0.06) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "680px", position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(200,146,26,0.5)", marginBottom: "10px" }}>
            {isOwner ? "Jefe de Barbería" : "Barbero"}
          </p>
          <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(2rem,8vw,3.5rem)", fontWeight: 900, color: "#c8921a", letterSpacing: "0.1em", textShadow: "0 0 60px rgba(200,146,26,0.3)", marginBottom: "8px" }}>
            {nombre}
          </h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "12px" }}>
            <div style={{ height: "1px", width: "50px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.5))" }} />
            <span style={{ color: "#c8921a", fontSize: "1rem" }}>᛭</span>
            <div style={{ height: "1px", width: "50px", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.5))" }} />
          </div>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: isOwner ? "repeat(auto-fit, minmax(200px, 1fr))" : "1fr 1fr", gap: "16px", marginBottom: "40px" }}>
          {cards.map(card => (
            <a key={card.href} href={card.href} style={{ textDecoration: "none" }}>
              <div style={{
                border: `1px solid rgba(${card.accent},0.25)`,
                backgroundColor: "#0e0b07",
                padding: "32px 24px",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(${card.accent},0.5)`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 40px rgba(${card.accent},0.1)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `rgba(${card.accent},0.25)`;
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, rgba(${card.accent},0.6), transparent)` }} />
                <p style={{ fontSize: "2.2rem", marginBottom: "14px" }}>{card.icon}</p>
                <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1rem", color: "#f0e6c8", marginBottom: "10px" }}>{card.title}</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.5)", letterSpacing: "0.05em", lineHeight: 1.6 }}>{card.desc}</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.35em", textTransform: "uppercase", color: `rgba(${card.accent},0.7)`, marginTop: "18px" }}>
                  Entrar →
                </p>
              </div>
            </a>
          ))}
        </div>

        {/* Logout */}
        <div style={{ textAlign: "center" }}>
          <button onClick={handleLogout} style={{
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "var(--font-barlow)", fontSize: "0.6rem",
            letterSpacing: "0.35em", textTransform: "uppercase",
            color: "rgba(184,168,138,0.25)",
          }}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
