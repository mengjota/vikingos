"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn, adminLogout } from "@/lib/adminAuth";
import { getSession } from "@/lib/auth";

export default function AdminConfiguracion() {
  const router = useRouter();
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);

  const [barbershopName, setBarbershopName] = useState("");
  const [inputName, setInputName] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin"); return; }
    const s = getSession();
    if (!s) { router.push("/admin"); return; }
    setSession(s);

    // Cargar nombre actual de la barbería
    fetch("/api/admin/mi-barberia", {
      headers: { "x-caller-email": s.email },
    })
      .then(r => r.json())
      .then(data => {
        setBarbershopName(data.name ?? "");
        setInputName(data.name ?? "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  async function handleSave(e: React.FormEvent<HTMLElement>) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    if (!inputName.trim()) { setErrorMsg("El nombre no puede estar vacío."); return; }
    setSaving(true);

    const s = getSession();
    if (!s) return;

    const res = await fetch("/api/admin/mi-barberia", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-caller-email": s.email },
      body: JSON.stringify({ name: inputName.trim() }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setErrorMsg(data.error ?? "Error al guardar."); return; }

    setBarbershopName(data.name);
    setInputName(data.name);

    // Actualizar sesión local con el nuevo nombre
    const updated = { ...s, barbershopName: data.name };
    localStorage.setItem("inv_session", JSON.stringify(updated));

    setSuccessMsg("¡Nombre actualizado correctamente!");
    setTimeout(() => setSuccessMsg(""), 3500);
  }

  function handleLogout() { adminLogout(); router.push("/admin"); }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "14px 16px", backgroundColor: "#0a0806",
    border: "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8",
    fontFamily: "var(--font-barlow)", fontSize: "1rem",
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-barlow)", fontSize: "0.7rem",
    letterSpacing: "0.35em", textTransform: "uppercase",
    color: "rgba(200,146,26,0.8)", display: "block", marginBottom: "8px",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060504", fontFamily: "var(--font-barlow)" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 35% at 50% 0%, rgba(200,146,26,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ backgroundColor: "#0a0806", borderBottom: "1px solid rgba(92,58,30,0.45)", padding: "0 28px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a href="/admin/dashboard" style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", textDecoration: "none" }}>
              ← Dashboard
            </a>
            <span style={{ color: "rgba(92,58,30,0.5)" }}>|</span>
            <span style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.1rem", color: "#c8921a" }}>INVICTUS</span>
            <span style={{ fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(184,168,138,0.3)" }}>
              Configuración
            </span>
          </div>
          <button onClick={handleLogout} style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(239,68,68,0.5)", background: "none", border: "none", cursor: "pointer" }}>
            Salir
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Título */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.4rem,4vw,2rem)", color: "#f0e6c8", fontWeight: 900, marginBottom: "8px" }}>
            Configuración
          </h1>
          <p style={{ fontSize: "0.78rem", letterSpacing: "0.12em", color: "rgba(184,168,138,0.45)" }}>
            Ajustes de tu barbería
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(184,168,138,0.3)", letterSpacing: "0.3em", fontSize: "0.75rem" }}>
            CARGANDO...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "520px" }}>

            {/* Nombre de la barbería */}
            <div style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0a0806", padding: "32px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #c8921a, transparent)" }} />

              <h2 style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#f0e6c8", marginBottom: "6px" }}>
                Nombre de tu Barbería
              </h2>
              <p style={{ fontSize: "0.72rem", color: "rgba(184,168,138,0.4)", letterSpacing: "0.1em", marginBottom: "28px" }}>
                Así aparecerá cuando los clientes elijan dónde reservar
              </p>

              {/* Nombre actual */}
              <div style={{ marginBottom: "24px", padding: "14px 16px", border: "1px solid rgba(200,146,26,0.2)", backgroundColor: "rgba(200,146,26,0.04)" }}>
                <p style={{ fontSize: "0.62rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.5)", marginBottom: "4px" }}>
                  Nombre actual
                </p>
                <p style={{ fontSize: "1rem", fontWeight: 700, color: "#f0e6c8", letterSpacing: "0.05em" }}>
                  {barbershopName || "—"}
                </p>
              </div>

              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={labelStyle}>Nuevo nombre</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Barbería del Norte"
                    value={inputName}
                    onChange={e => setInputName(e.target.value)}
                    style={inputStyle}
                    maxLength={60}
                  />
                  <p style={{ fontSize: "0.65rem", color: "rgba(184,168,138,0.3)", marginTop: "6px", letterSpacing: "0.08em" }}>
                    Máximo 60 caracteres
                  </p>
                </div>

                {errorMsg && (
                  <p style={{ color: "#f87171", fontSize: "0.78rem", letterSpacing: "0.08em" }}>⚠ {errorMsg}</p>
                )}
                {successMsg && (
                  <p style={{ color: "#4ade80", fontSize: "0.78rem", letterSpacing: "0.08em" }}>✓ {successMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={saving || inputName.trim() === barbershopName}
                  style={{
                    padding: "14px 28px",
                    background: saving || inputName.trim() === barbershopName
                      ? "rgba(92,58,30,0.3)"
                      : "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)",
                    border: "none",
                    cursor: saving || inputName.trim() === barbershopName ? "not-allowed" : "pointer",
                    fontFamily: "var(--font-barlow)", fontSize: "0.75rem", fontWeight: 800,
                    letterSpacing: "0.4em", textTransform: "uppercase",
                    color: saving || inputName.trim() === barbershopName ? "rgba(184,168,138,0.3)" : "#080604",
                    transition: "all 0.2s",
                  }}
                >
                  {saving ? "Guardando..." : "Guardar Nombre"}
                </button>
              </form>
            </div>

            {/* Info del dueño */}
            <div style={{ border: "1px solid rgba(92,58,30,0.25)", backgroundColor: "rgba(200,146,26,0.02)", padding: "20px 24px" }}>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.4)", marginBottom: "12px" }}>
                Tu cuenta
              </p>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f0e6c8", marginBottom: "4px" }}>
                {session?.name}
              </p>
              <p style={{ fontSize: "0.75rem", color: "rgba(184,168,138,0.4)", letterSpacing: "0.05em" }}>
                {session?.email}
              </p>
              <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(200,146,26,0.45)", marginTop: "8px" }}>
                Rol: Dueño ⚔
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
