"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/adminAuth";

const ADMIN_EMAIL = "admin@invictus.com";

type Portal = "cliente" | "empleado" | "admin";
type Tab    = "entrar" | "registrar";

interface Barbershop { id: string; name: string; slug: string; }

export default function LoginPage() {
  const router = useRouter();
  const [portal, setPortal] = useState<Portal | null>(null);
  const [tab, setTab] = useState<Tab>("entrar");

  // Barbershops para registro de clientes
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);

  // Login
  const [loginEmail, setLoginEmail]     = useState("");
  const [loginPass, setLoginPass]       = useState("");
  const [loginError, setLoginError]     = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Registro
  const [regName, setRegName]             = useState("");
  const [regEmail, setRegEmail]           = useState("");
  const [regPass, setRegPass]             = useState("");
  const [regBarbershop, setRegBarbershop] = useState("");
  const [regError, setRegError]           = useState("");
  const [regOk, setRegOk]                 = useState(false);
  const [regLoading, setRegLoading]       = useState(false);

  // Admin
  const [adminPass, setAdminPass]     = useState("");
  const [adminError, setAdminError]   = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  useEffect(() => {
    fetch("/api/barbershops").then(r => r.json()).then(setBarbershops).catch(() => {});
  }, []);

  // ── Login cliente / empleado ──────────────────────────────
  async function handleLogin(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    // Acceso admin legacy por email
    if (loginEmail.toLowerCase() === ADMIN_EMAIL) {
      if (adminLogin(loginPass)) {
        localStorage.setItem("inv_session", JSON.stringify({ name: "Admin", email: ADMIN_EMAIL, role: "owner" }));
        router.push("/admin/dashboard");
      } else {
        setLoginError("Contraseña incorrecta.");
        setLoginLoading(false);
      }
      return;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPass }),
    });
    const data = await res.json();
    setLoginLoading(false);
    if (!res.ok) { setLoginError(data.error ?? "Error al iniciar sesión."); return; }

    // Verificar que el portal coincide con el rol
    if (portal === "empleado" && data.role !== "employee" && data.role !== "owner") {
      setLoginError("Esta cuenta no tiene acceso de empleado.");
      return;
    }
    if (portal === "cliente" && (data.role === "employee" || data.role === "owner")) {
      setLoginError("Esta cuenta es de empleado. Usa el acceso de empleados.");
      return;
    }

    localStorage.setItem("inv_session", JSON.stringify({
      name: data.name,
      email: data.email,
      role: data.role ?? "client",
      barberName: data.barberName ?? null,
      barbershopId: data.barbershopId ?? null,
      barbershopName: data.barbershopName ?? null,
    }));

    if (data.role === "owner")    { router.push("/admin/dashboard"); return; }
    if (data.role === "employee") { router.push("/mi-agenda"); return; }
    router.push("/reservar");
  }

  // ── Registro cliente ──────────────────────────────────────
  async function handleRegister(e: React.FormEvent<HTMLElement>) {
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

  // ── Login admin ───────────────────────────────────────────
  async function handleAdminLogin(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();
    setAdminError("");
    setAdminLoading(true);

    // Intentar primero como owner en DB
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: adminPass.includes("@") ? adminPass : ADMIN_EMAIL, password: adminPass }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.role === "owner") {
        localStorage.setItem("inv_session", JSON.stringify({
          name: data.name, email: data.email, role: "owner",
          barbershopId: data.barbershopId, barbershopName: data.barbershopName,
        }));
        router.push("/admin/dashboard");
        return;
      }
    }

    // Fallback: contraseña legacy
    if (adminLogin(adminPass)) {
      localStorage.setItem("inv_session", JSON.stringify({ name: "Admin", email: ADMIN_EMAIL, role: "owner" }));
      router.push("/admin/dashboard");
    } else {
      setAdminError("Credenciales incorrectas.");
      setAdminLoading(false);
    }
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

  // ── PANTALLA INICIAL — 3 portales ─────────────────────────
  if (!portal) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#080604", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
        className="relative overflow-hidden">
        <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(200,146,26,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />

        <div style={{ width: "100%", maxWidth: "820px", position: "relative" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(2.5rem,8vw,4.5rem)", fontWeight: 900, color: "#c8921a", letterSpacing: "0.15em", textShadow: "0 0 60px rgba(200,146,26,0.4)" }}>
                INVICTUS
              </p>
            </Link>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", marginTop: "6px" }}>
              ¿Cómo quieres entrar?
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "16px" }}>
              <div style={{ height: "1px", width: "60px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.5))" }} />
              <span style={{ color: "#c8921a" }}>᛭</span>
              <div style={{ height: "1px", width: "60px", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.5))" }} />
            </div>
          </div>

          {/* 3 portales */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>

            {/* Cliente */}
            <button onClick={() => setPortal("cliente")} style={{
              background: "none", border: "1px solid rgba(200,146,26,0.35)", cursor: "pointer",
              padding: "36px 24px", textAlign: "center", position: "relative", overflow: "hidden",
              backgroundColor: "#0e0b07", transition: "all 0.3s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,146,26,0.7)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 40px rgba(200,146,26,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(200,146,26,0.35)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #c8921a, transparent)" }} />
              <p style={{ fontSize: "2.5rem", marginBottom: "16px" }}>✂️</p>
              <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1rem", color: "#f0e6c8", marginBottom: "8px", letterSpacing: "0.05em" }}>
                Soy Cliente
              </p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.5)", letterSpacing: "0.1em", lineHeight: 1.6 }}>
                Reserva tu cita o crea tu cuenta
              </p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c8921a", marginTop: "20px" }}>
                Entrar →
              </p>
            </button>

            {/* Empleado */}
            <button onClick={() => setPortal("empleado")} style={{
              background: "none", border: "1px solid rgba(92,58,30,0.4)", cursor: "pointer",
              padding: "36px 24px", textAlign: "center", position: "relative", overflow: "hidden",
              backgroundColor: "#0e0b07", transition: "all 0.3s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(167,139,250,0.4)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 40px rgba(167,139,250,0.06)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(92,58,30,0.4)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(167,139,250,0.6), transparent)" }} />
              <p style={{ fontSize: "2.5rem", marginBottom: "16px" }}>⚔️</p>
              <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1rem", color: "#f0e6c8", marginBottom: "8px" }}>
                Soy Empleado
              </p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.5)", letterSpacing: "0.1em", lineHeight: 1.6 }}>
                Accede a tu agenda semanal
              </p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(167,139,250,0.7)", marginTop: "20px" }}>
                Entrar →
              </p>
            </button>

            {/* Admin */}
            <button onClick={() => setPortal("admin")} style={{
              background: "none", border: "1px solid rgba(92,58,30,0.3)", cursor: "pointer",
              padding: "36px 24px", textAlign: "center", position: "relative", overflow: "hidden",
              backgroundColor: "#0e0b07", transition: "all 0.3s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(96,165,250,0.35)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 40px rgba(96,165,250,0.06)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(92,58,30,0.3)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(96,165,250,0.5), transparent)" }} />
              <p style={{ fontSize: "2.5rem", marginBottom: "16px" }}>🛡️</p>
              <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1rem", color: "#f0e6c8", marginBottom: "8px" }}>
                Soy Dueño
              </p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.5)", letterSpacing: "0.1em", lineHeight: 1.6 }}>
                Gestiona tu barbería completa
              </p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(96,165,250,0.7)", marginTop: "20px" }}>
                Entrar →
              </p>
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: "32px" }}>
            <Link href="/" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.3)", textDecoration: "none" }}>
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    );
  }

  // ── PORTAL ADMIN ──────────────────────────────────────────
  if (portal === "admin") {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#080604", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(96,165,250,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ width: "100%", maxWidth: "420px", position: "relative" }}>
          <button onClick={() => setPortal(null)} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.35)", marginBottom: "32px" }}>
            ← Volver
          </button>

          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <p style={{ fontSize: "2rem", marginBottom: "12px" }}>🛡️</p>
            <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.6rem", color: "#c8921a", marginBottom: "4px" }}>INVICTUS</p>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.68rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(96,165,250,0.5)" }}>
              Acceso de Dueño
            </p>
          </div>

          <form onSubmit={handleAdminLogin} style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "36px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(96,165,250,0.5), transparent)" }} />

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Correo electrónico</label>
              <input type="email" required placeholder="tu@correo.com" value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)} style={inputStyle} />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Contraseña</label>
              <input type="password" required placeholder="••••••••" value={adminPass}
                onChange={e => setAdminPass(e.target.value)} style={inputStyle} />
            </div>

            {adminError && <p style={{ color: "#f87171", fontFamily: "var(--font-barlow)", fontSize: "0.78rem", marginBottom: "16px" }}>⚠ {adminError}</p>}

            <button type="submit" disabled={adminLoading} style={{ ...btnGold, background: "linear-gradient(135deg, #1e3a5f, #2563eb, #60a5fa, #2563eb, #1e3a5f)", color: "#f0e6c8", boxShadow: "0 0 24px rgba(96,165,250,0.3)", opacity: adminLoading ? 0.7 : 1 }}>
              {adminLoading ? "Verificando..." : "Entrar al Panel"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── PORTAL EMPLEADO / CLIENTE ─────────────────────────────
  const accentColor = portal === "empleado" ? "rgba(167,139,250,0.6)" : "#c8921a";
  const accentRgb   = portal === "empleado" ? "167,139,250" : "200,146,26";
  const portalLabel = portal === "empleado" ? "Acceso Empleados" : "Acceso Clientes";
  const portalIcon  = portal === "empleado" ? "⚔️" : "✂️";

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080604", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px" }}>
      <div style={{ position: "fixed", inset: 0, background: `radial-gradient(ellipse 70% 55% at 50% 45%, rgba(${accentRgb},0.12) 0%, transparent 65%)`, pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "500px", position: "relative" }}>
        <button onClick={() => { setPortal(null); setLoginError(""); setRegError(""); }} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.35)", marginBottom: "28px" }}>
          ← Volver
        </button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <p style={{ fontSize: "2rem", marginBottom: "8px" }}>{portalIcon}</p>
          <Link href="/" style={{ textDecoration: "none" }}>
            <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "2.2rem", fontWeight: 900, color: "#c8921a", letterSpacing: "0.1em" }}>INVICTUS</p>
          </Link>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", color: `rgba(${accentRgb},0.5)`, marginTop: "6px" }}>
            {portalLabel}
          </p>
        </div>

        {/* Card */}
        <div style={{ border: `1px solid rgba(${accentRgb},0.25)`, backgroundColor: "#0e0b07", padding: "36px", position: "relative", boxShadow: `0 0 60px rgba(${accentRgb},0.06)` }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${accentColor}, transparent)` }} />

          {/* Tabs (solo clientes tienen registro) */}
          {portal === "cliente" && (
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
          )}

          {/* Form Entrar */}
          {(portal === "empleado" || tab === "entrar") && (
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
                {loginLoading ? "Verificando..." : portal === "empleado" ? "Entrar a mi Agenda" : "Entrar"}
              </button>
            </form>
          )}

          {/* Form Registro (solo clientes) */}
          {portal === "cliente" && tab === "registrar" && (
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
                    style={{ ...inputStyle, appearance: "none", backgroundImage: "none" }}>
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
