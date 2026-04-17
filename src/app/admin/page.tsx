"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (adminLogin(password)) {
      router.push("/admin/dashboard");
    } else {
      setError("Contraseña incorrecta");
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#080604", background: "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(200,146,26,0.09) 0%, #080604 65%)" }}>

      <div style={{ width: "100%", maxWidth: "400px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "2rem", fontWeight: 900, color: "#c8921a", letterSpacing: "0.2em", textShadow: "0 0 40px rgba(200,146,26,0.4)" }}>
            BarberOS
          </p>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)", marginTop: "6px" }}>
            Panel de Administración
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "20px" }}>
            <div style={{ height: "1px", width: "60px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.6))" }} />
            <span style={{ color: "#c8921a", fontSize: "1rem" }}>᛭</span>
            <div style={{ height: "1px", width: "60px", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.6))" }} />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}
          style={{ border: "1px solid rgba(92,58,30,0.45)", backgroundColor: "#0e0b07", padding: "40px", boxShadow: "0 0 60px rgba(200,146,26,0.06)" }}>

          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)", marginBottom: "28px", textAlign: "center" }}>
            Acceso Restringido
          </p>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.7)", marginBottom: "10px" }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="••••••••••••"
              style={{
                width: "100%", padding: "14px 16px",
                backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.5)",
                color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "0.9rem",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "#ef4444", marginBottom: "16px", letterSpacing: "0.05em" }}>
              {error}
            </p>
          )}

          <button type="submit"
            style={{
              width: "100%", padding: "16px",
              background: "linear-gradient(135deg, #a06010, #c8921a, #f0c040, #c8921a, #a06010)",
              border: "none", cursor: "pointer",
              fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 800,
              letterSpacing: "0.45em", textTransform: "uppercase", color: "#080604",
              boxShadow: "0 0 30px rgba(200,146,26,0.4)",
            }}>
            Entrar
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          <a href="/" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.35)" }}>
            ← Volver al sitio
          </a>
        </p>
      </div>
    </div>
  );
}
