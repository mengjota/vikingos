"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Tab = "entrar" | "registrar";

interface Barbershop { id: string; name: string; slug: string; }

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("entrar");
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);

  const [loginEmail, setLoginEmail]     = useState("");
  const [loginPass, setLoginPass]       = useState("");
  const [loginError, setLoginError]     = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [regName, setRegName]             = useState("");
  const [regEmail, setRegEmail]           = useState("");
  const [regPass, setRegPass]             = useState("");
  const [regBarbershop, setRegBarbershop] = useState("");
  const [regError, setRegError]           = useState("");
  const [regOk, setRegOk]                 = useState(false);
  const [regLoading, setRegLoading]       = useState(false);

  useEffect(() => {
    fetch("/api/barbershops").then(r => r.json()).then(setBarbershops).catch(() => {});
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPass }),
    });
    const data = await res.json();
    setLoginLoading(false);

    if (!res.ok) { setLoginError(data.error ?? "Error al iniciar sesión."); return; }

    if (data.role === "employee" || data.role === "owner") {
      setLoginError("Esta cuenta es del equipo. Usa el acceso de staff en /staff.");
      return;
    }

    router.push("/reservar");
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegError("");
    if (!regBarbershop) { setRegError("Selecciona tu barbería."); return; }
    setRegLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: regName, email: regEmail, password: regPass, barbershopId: regBarbershop }),
    });
    const data = await res.json();
    setRegLoading(false);
    if (!res.ok) { setRegError(data.error ?? "Error al crear la cuenta."); return; }
    setRegOk(true);
    setTimeout(() => { setTab("entrar"); setLoginEmail(regEmail); setRegOk(false); }, 2000);
  }

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
  const btnGold: React.CSSProperties = {
    width: "100%", padding: "16px",
    background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)",
    border: "none", cursor: "pointer",
    fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 800,
    letterSpacing: "0.45em", textTransform: "uppercase", color: "#080604",
    boxShadow: "0 0 30px rgba(200,146,26,0.4)",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080604", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(200,146,26,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "500px", position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ fontSize: "2rem", marginBottom: "8px" }}>✂️</p>
          <Link href="/" style={{ textDecoration: "none" }}>
            <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "2.2rem", fontWeight: 900, color: "#c8921a", letterSpacing: "0.1em" }}>BarberOS</p>
          </Link>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(200,146,26,0.5)", marginTop: "6px" }}>
            Acceso Clientes
          </p>
        </div>

        {/* Card */}
        <div style={{ border: "1px solid rgba(200,146,26,0.25)", backgroundColor: "#0e0b07", padding: "36px", position: "relative", boxShadow: "0 0 60px rgba(200,146,26,0.06)" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #c8921a, transparent)" }} />

          {/* Tabs */}
          <div style={{ display: "flex", marginBottom: "32px", borderBottom: "1px solid rgba(92,58,30,0.3)" }}>
            {(["entrar", "registrar"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, paddingBottom: "16px", background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--font-barlow)", fontSize: "0.82rem", letterSpacing: "0.3em",
                textTransform: "uppercase", fontWeight: tab === t ? 700 : 400,
                color: tab === t ? "#c8921a" : "rgba(184,168,138,0.4)",
                borderBottom: tab === t ? "2px solid #c8921a" : "2px solid transparent",
                marginBottom: "-1px", transition: "all 0.2s",
              }}>
                {t === "entrar" ? "Iniciar Sesión" : "Crear Cuenta"}
              </button>
            ))}
          </div>

          {/* Login */}
          {tab === "entrar" && (
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              <div>
                <label style={labelStyle}>Correo electrónico</label>
                <input type="email" required placeholder="tu@correo.com" value={loginEmail}
                  onChange={e => { setLoginEmail(e.target.value); setLoginError(""); }} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Contraseña</label>
                <input type="password" required placeholder="••••••••" value={loginPass}
                  onChange={e => { setLoginPass(e.target.value); setLoginError(""); }} style={inputStyle} />
              </div>
              {loginError && <p style={{ color: "#f87171", fontFamily: "var(--font-barlow)", fontSize: "0.78rem" }}>⚠ {loginError}</p>}
              <button type="submit" disabled={loginLoading} style={{ ...btnGold, marginTop: "8px", opacity: loginLoading ? 0.7 : 1, cursor: loginLoading ? "not-allowed" : "pointer" }}>
                {loginLoading ? "Verificando..." : "Entrar"}
              </button>
              <p style={{ textAlign: "center", fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "rgba(184,168,138,0.3)", letterSpacing: "0.1em" }}>
                ¿Eres del equipo?{" "}
                <Link href="/staff" style={{ color: "rgba(200,146,26,0.5)", textDecoration: "none" }}>Accede aquí →</Link>
              </p>
            </form>
          )}

          {/* Registro */}
          {tab === "registrar" && (
            regOk ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <p style={{ fontSize: "3rem", marginBottom: "16px" }}>⚔️</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1rem", fontWeight: 800, color: "#f0e6c8", marginBottom: "8px" }}>¡Bienvenido al gremio!</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", color: "#b8a882" }}>Redirigiendo...</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Tu nombre</label>
                  <input type="text" required placeholder="Carlos García" value={regName}
                    onChange={e => setRegName(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Tu barbería</label>
                  <select required value={regBarbershop} onChange={e => setRegBarbershop(e.target.value)}
                    style={{ ...inputStyle, appearance: "none" }}>
                    <option value="">— Elige tu barbería —</option>
                    {barbershops.map(bs => (
                      <option key={bs.id} value={bs.id}>{bs.name}</option>
                    ))}
                  </select>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.62rem", color: "rgba(200,146,26,0.4)", marginTop: "6px", letterSpacing: "0.1em" }}>
                    Tus reservas quedarán vinculadas a esta barbería
                  </p>
                </div>
                <div>
                  <label style={labelStyle}>Correo electrónico</label>
                  <input type="email" required placeholder="tu@correo.com" value={regEmail}
                    onChange={e => setRegEmail(e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Contraseña</label>
                  <input type="password" required placeholder="Mínimo 6 caracteres" value={regPass}
                    onChange={e => setRegPass(e.target.value)} style={inputStyle} />
                </div>
                {regError && <p style={{ color: "#f87171", fontFamily: "var(--font-barlow)", fontSize: "0.78rem" }}>⚠ {regError}</p>}
                <button type="submit" disabled={regLoading} style={{ ...btnGold, marginTop: "8px", opacity: regLoading ? 0.7 : 1, cursor: regLoading ? "not-allowed" : "pointer" }}>
                  {regLoading ? "Creando cuenta..." : "Crear mi Cuenta"}
                </button>
              </form>
            )
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          <Link href="/" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.25)", textDecoration: "none" }}>
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
