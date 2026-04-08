"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/adminAuth";

const ADMIN_EMAIL = "admin@invictus.com";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"entrar" | "registrar">("entrar");

  // Entrar
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Registrar
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regError, setRegError] = useState("");
  const [regOk, setRegOk] = useState(false);
  const [regLoading, setRegLoading] = useState(false);

  async function handleLogin(e: { preventDefault(): void }) {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    // Acceso admin
    if (loginEmail.toLowerCase() === ADMIN_EMAIL) {
      if (adminLogin(loginPass)) {
        localStorage.setItem("inv_session", JSON.stringify({ name: "Admin", email: ADMIN_EMAIL }));
        router.push("/admin/dashboard");
      } else {
        setLoginError("Contraseña incorrecta.");
        setLoginLoading(false);
      }
      return;
    }

    // Acceso cliente — valida contra la DB
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail, password: loginPass }),
    });
    const data = await res.json();
    setLoginLoading(false);
    if (!res.ok) {
      setLoginError(data.error ?? "Error al iniciar sesión.");
      return;
    }
    localStorage.setItem("inv_session", JSON.stringify({ name: data.name, email: data.email }));
    router.push("/");
  }

  async function handleRegister(e: { preventDefault(): void }) {
    e.preventDefault();
    setRegError("");
    setRegLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: regName, email: regEmail, password: regPass }),
    });
    const data = await res.json();
    setRegLoading(false);
    if (!res.ok) {
      setRegError(data.error ?? "Error al crear la cuenta.");
      return;
    }
    setRegOk(true); // muestra pantalla "revisa tu correo"
  }

  const inputClass =
    "w-full bg-[#080604] border-b-2 border-[#5c3a1e]/70 text-[#f0e6c8] px-2 py-4 outline-none focus:border-[#c8921a] transition-colors placeholder:text-[#3a2a18]";
  const inputStyle = { fontFamily: "var(--font-barlow)", fontSize: "1.1rem" };
  const labelStyle = { fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.35em", fontWeight: 600 } as React.CSSProperties;
  const btnStyle: React.CSSProperties = {
    fontFamily: "var(--font-barlow)",
    fontSize: "1rem",
    background: "linear-gradient(135deg, #a06010 0%, #c8921a 35%, #f0c040 60%, #c8921a 80%, #a06010 100%)",
    color: "#080604",
    boxShadow: "0 0 40px rgba(200,146,26,0.5), 0 0 80px rgba(200,146,26,0.2), 0 6px 24px rgba(0,0,0,0.6)",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ backgroundColor: "#080604" }}
    >
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(200,146,26,0.18) 0%, rgba(140,80,5,0.08) 45%, transparent 70%)" }} />
      <div className="fixed top-0 left-0 w-64 h-64 pointer-events-none"
        style={{ background: "radial-gradient(circle at top left, rgba(200,146,26,0.12), transparent 70%)" }} />
      <div className="fixed bottom-0 right-0 w-64 h-64 pointer-events-none"
        style={{ background: "radial-gradient(circle at bottom right, rgba(200,146,26,0.12), transparent 70%)" }} />

      <div className="relative w-full max-w-2xl">

        {/* Logo */}
        <div className="text-center mb-14">
          <Link href="/" className="inline-block">
            <p className="text-[#c8921a] tracking-[0.7em] uppercase mb-3"
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 600 }}>
              Barbería
            </p>
            <h1 className="text-[#f5ead0] font-black leading-none"
              style={{
                fontFamily: "var(--font-cinzel-decorative)",
                fontSize: "clamp(3.5rem, 10vw, 6rem)",
                textShadow: "0 0 80px rgba(200,146,26,0.6), 0 0 30px rgba(200,146,26,0.3), 0 2px 4px rgba(0,0,0,0.8)",
                letterSpacing: "0.06em",
              }}>
              INVICTUS
            </h1>
          </Link>
          <div className="flex items-center justify-center gap-5 mt-6">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#c8921a]/80" />
            <span className="text-[#c8921a] text-xl">᛭</span>
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#c8921a]/80" />
          </div>
          <p className="text-[#b8a882]/70 tracking-[0.4em] uppercase mt-5"
            style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem" }}>
            Accede a tu cuenta
          </p>
        </div>

        {/* Card */}
        <div
          className="relative border border-[#5c3a1e]/60 px-10 py-12 sm:px-16 sm:py-14"
          style={{
            backgroundColor: "#0e0b07",
            boxShadow: "0 0 100px rgba(200,146,26,0.1), 0 0 40px rgba(200,146,26,0.05), inset 0 0 80px rgba(200,146,26,0.03)",
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-[3px]"
            style={{ background: "linear-gradient(to right, transparent, #c8921a 30%, #e8b84b 50%, #c8921a 70%, transparent)" }} />

          {/* Tabs */}
          <div className="flex mb-12 border-b-2 border-[#5c3a1e]/30">
            {(["entrar", "registrar"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 pb-5 uppercase transition-all duration-300"
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontSize: "1rem",
                  letterSpacing: "0.35em",
                  fontWeight: tab === t ? 700 : 400,
                  color: tab === t ? "#c8921a" : "#7a6a50",
                  borderBottom: tab === t ? "3px solid #c8921a" : "3px solid transparent",
                  marginBottom: "-2px",
                }}
              >
                {t === "entrar" ? "Entrar" : "Crear Cuenta"}
              </button>
            ))}
          </div>

          {/* Form Entrar */}
          {tab === "entrar" && (
            <form onSubmit={handleLogin} className="space-y-7">
              <div>
                <label className="block text-[#c8921a] uppercase mb-3" style={labelStyle}>Correo electrónico</label>
                <input type="email" required placeholder="tu@email.com" value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="block text-[#c8921a] uppercase mb-3" style={labelStyle}>Contraseña</label>
                <input type="password" required placeholder="••••••••" value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className={inputClass} style={inputStyle} />
              </div>
              {loginError && (
                <p className="text-sm tracking-wide" style={{ fontFamily: "var(--font-barlow)", color: loginError.includes("Confirma") ? "#f0c040" : "#f87171" }}>
                  {loginError.includes("Confirma") ? "📧 " : "⚠ "}{loginError}
                </p>
              )}
              <div className="pt-4">
                <button type="submit" disabled={loginLoading}
                  className="w-full py-6 uppercase font-black tracking-[0.6em] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                  style={{ ...btnStyle, opacity: loginLoading ? 0.7 : 1, cursor: loginLoading ? "not-allowed" : "pointer" }}>
                  {loginLoading ? "Verificando..." : "Entrar al Gremio"}
                </button>
              </div>
            </form>
          )}

          {/* Form Registrar */}
          {tab === "registrar" && (
            <form onSubmit={handleRegister} className="space-y-7">
              {regOk ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: "3.5rem", marginBottom: "20px" }}>📧</div>
                  <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f0e6c8", marginBottom: "14px", fontFamily: "var(--font-barlow)" }}>
                    ¡Revisa tu correo!
                  </p>
                  <p style={{ fontSize: "0.9rem", color: "#b8a882", lineHeight: 1.8, fontFamily: "var(--font-barlow)" }}>
                    Te enviamos un enlace de confirmación a<br />
                    <strong style={{ color: "#c8921a" }}>{regEmail}</strong>
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "rgba(184,168,138,0.45)", marginTop: "16px", fontFamily: "var(--font-barlow)" }}>
                    Haz clic en el enlace del correo para activar tu cuenta.<br />
                    Revisa también la carpeta de spam.
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[#c8921a] uppercase mb-3" style={labelStyle}>Nombre completo</label>
                    <input type="text" required placeholder="Tu nombre" value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[#c8921a] uppercase mb-3" style={labelStyle}>Correo electrónico</label>
                    <input type="email" required placeholder="tu@email.com" value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-[#c8921a] uppercase mb-3" style={labelStyle}>Contraseña</label>
                    <input type="password" required placeholder="Mínimo 6 caracteres" value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      className={inputClass} style={inputStyle} />
                  </div>
                  {regError && (
                    <p className="text-red-400 text-sm tracking-wide" style={{ fontFamily: "var(--font-barlow)" }}>
                      ⚠ {regError}
                    </p>
                  )}
                  <div className="pt-4">
                    <button type="submit" disabled={regLoading}
                      className="w-full py-6 uppercase font-black tracking-[0.6em] transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                      style={{ ...btnStyle, opacity: regLoading ? 0.7 : 1, cursor: regLoading ? "not-allowed" : "pointer" }}>
                      {regLoading ? "Enviando correo..." : "Crear mi Cuenta"}
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          <div className="mt-10 text-center">
            <Link href="/"
              className="text-[#7a6a50] hover:text-[#c8921a] uppercase tracking-[0.35em] transition-colors duration-300"
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem" }}>
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
