"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Portal = "empleado" | "admin";

export default function StaffPage() {
  const router = useRouter();
  const [portal, setPortal] = useState<Portal | null>(null);

  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px",
    backgroundColor: "#080604", border: "1px solid rgba(92,58,30,0.5)",
    color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "1rem",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontFamily: "var(--font-barlow)", fontSize: "0.7rem",
    letterSpacing: "0.35em", textTransform: "uppercase",
    color: "rgba(200,146,26,0.8)", marginBottom: "8px",
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) { setError(data.error ?? "Error al iniciar sesión."); return; }

    if (portal === "empleado" && data.role !== "employee" && data.role !== "owner") {
      setError("Esta cuenta no tiene acceso de empleado.");
      return;
    }
    if (portal === "admin" && data.role !== "owner") {
      setError("Esta cuenta no tiene permisos de jefe de barbería.");
      return;
    }
    if (data.role === "client") {
      setError("Esta cuenta es de cliente. Usa el acceso de clientes en /login.");
      return;
    }

    if (data.role === "owner")    { router.push("/empleado"); return; }
    if (data.role === "employee") { router.push("/empleado"); return; }
    router.push("/");
  }

  const accentColor = portal === "admin" ? "rgba(96,165,250,0.6)" : "rgba(167,139,250,0.6)";
  const accentRgb   = portal === "admin" ? "96,165,250" : "167,139,250";
  const portalLabel = portal === "admin" ? "Acceso Jefe de Barbería" : "Acceso Barberos";
  const portalIcon  = portal === "admin" ? "🛡️" : "⚔️";
  const btnBg       = portal === "admin"
    ? "linear-gradient(135deg, #1e3a5f, #2563eb, #60a5fa, #2563eb, #1e3a5f)"
    : "linear-gradient(135deg, #2d1b69, #7c3aed, #a78bfa, #7c3aed, #2d1b69)";

  // ── SELECTOR DE PORTAL ────────────────────────────────────
  if (!portal) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#080604", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(92,58,30,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: "600px", position: "relative" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(2rem,7vw,3.5rem)", fontWeight: 900, color: "#c8921a", letterSpacing: "0.15em", textShadow: "0 0 60px rgba(200,146,26,0.4)" }}>
                BarberOS
              </p>
            </Link>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", marginTop: "6px" }}>
              Acceso para el equipo
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "16px" }}>
              <div style={{ height: "1px", width: "60px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.5))" }} />
              <span style={{ color: "#c8921a" }}>᛭</span>
              <div style={{ height: "1px", width: "60px", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.5))" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {/* Barbero */}
            <button onClick={() => setPortal("empleado")} style={{
              background: "none", border: "1px solid rgba(92,58,30,0.4)", cursor: "pointer",
              padding: "36px 24px", textAlign: "center", position: "relative", overflow: "hidden",
              backgroundColor: "#0e0b07", transition: "all 0.3s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(167,139,250,0.4)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 40px rgba(167,139,250,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(92,58,30,0.4)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(167,139,250,0.6), transparent)" }} />
              <p style={{ fontSize: "2.5rem", marginBottom: "16px" }}>⚔️</p>
              <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1rem", color: "#f0e6c8", marginBottom: "8px" }}>Como Barbero</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.5)", letterSpacing: "0.1em", lineHeight: 1.6 }}>
                Accede a tu agenda semanal
              </p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(167,139,250,0.7)", marginTop: "20px" }}>
                Entrar →
              </p>
            </button>

            {/* Jefe */}
            <button onClick={() => setPortal("admin")} style={{
              background: "none", border: "1px solid rgba(92,58,30,0.3)", cursor: "pointer",
              padding: "36px 24px", textAlign: "center", position: "relative", overflow: "hidden",
              backgroundColor: "#0e0b07", transition: "all 0.3s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(96,165,250,0.35)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 40px rgba(96,165,250,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(92,58,30,0.3)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(96,165,250,0.5), transparent)" }} />
              <p style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🛡️</p>
              <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1rem", color: "#f0e6c8", marginBottom: "8px" }}>Jefe de Barbería</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.5)", letterSpacing: "0.1em", lineHeight: 1.6 }}>
                Gestiona tu barbería completa
              </p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(96,165,250,0.7)", marginTop: "20px" }}>
                Entrar →
              </p>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ── FORMULARIO LOGIN ──────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080604", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ position: "fixed", inset: 0, background: `radial-gradient(ellipse 70% 55% at 50% 45%, rgba(${accentRgb},0.08) 0%, transparent 65%)`, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative" }}>
        <button onClick={() => { setPortal(null); setError(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.35)", marginBottom: "32px" }}>
          ← Volver
        </button>

        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ fontSize: "2rem", marginBottom: "12px" }}>{portalIcon}</p>
          <Link href="/" style={{ textDecoration: "none" }}>
            <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "2rem", fontWeight: 900, color: "#c8921a", letterSpacing: "0.1em" }}>BarberOS</p>
          </Link>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", color: `rgba(${accentRgb},0.5)`, marginTop: "6px" }}>
            {portalLabel}
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ border: `1px solid rgba(${accentRgb},0.2)`, backgroundColor: "#0e0b07", padding: "36px", position: "relative", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }} />
          <div>
            <label style={labelStyle}>Correo electrónico</label>
            <input type="email" required placeholder="tu@correo.com" value={email}
              onChange={e => { setEmail(e.target.value); setError(""); }} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Contraseña</label>
            <input type="password" required placeholder="••••••••" value={pass}
              onChange={e => { setPass(e.target.value); setError(""); }} style={inputStyle} />
          </div>
          {error && <p style={{ color: "#f87171", fontFamily: "var(--font-barlow)", fontSize: "0.78rem" }}>⚠ {error}</p>}
          <button type="submit" disabled={loading} style={{
            padding: "16px", border: "none", cursor: loading ? "not-allowed" : "pointer",
            background: btnBg, color: "#f0e6c8",
            fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 800,
            letterSpacing: "0.45em", textTransform: "uppercase",
            boxShadow: `0 0 30px rgba(${accentRgb},0.3)`,
            opacity: loading ? 0.7 : 1, marginTop: "8px",
          }}>
            {loading ? "Verificando..." : portal === "admin" ? "Entrar al Panel" : "Entrar a mi Agenda"}
          </button>
        </form>

      </div>
    </div>
  );
}
