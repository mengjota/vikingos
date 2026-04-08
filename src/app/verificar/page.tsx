"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function VerificarContent() {
  const params = useSearchParams();
  const estado = params.get("estado");
  const error  = params.get("error");

  const ok         = estado === "ok";
  const yaVerif    = estado === "ya_verificado";
  const invalido   = error  === "token_invalido";

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#080604", padding: "24px" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,146,26,0.12) 0%, transparent 65%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", width: "100%", maxWidth: "480px", backgroundColor: "#0e0b07", border: "1px solid #5c3a1e", textAlign: "center", overflow: "hidden" }}>
        <div style={{ height: "4px", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)" }} />

        <div style={{ padding: "52px 40px" }}>
          {/* Ícono */}
          <div style={{ fontSize: "3.5rem", marginBottom: "24px" }}>
            {ok ? "✅" : yaVerif ? "⚡" : "❌"}
          </div>

          <p style={{ fontSize: "0.65rem", letterSpacing: "0.5em", textTransform: "uppercase", color: "rgba(200,146,26,0.6)", marginBottom: "8px", fontFamily: "sans-serif" }}>
            Invictus Barbería
          </p>

          <h1 style={{ fontSize: "1.6rem", fontWeight: 900, color: "#f5ead0", marginBottom: "16px", letterSpacing: "0.05em", fontFamily: "sans-serif" }}>
            {ok      ? "¡Cuenta Confirmada!" :
             yaVerif ? "Ya estás verificado"  :
                       "Enlace inválido"}
          </h1>

          <p style={{ fontSize: "0.95rem", color: "#b8a882", lineHeight: 1.7, marginBottom: "36px", fontFamily: "sans-serif" }}>
            {ok      ? "Tu cuenta ha sido activada. Ya puedes iniciar sesión y reservar tu cita." :
             yaVerif ? "Tu correo ya fue verificado anteriormente. Puedes iniciar sesión." :
                       "Este enlace no es válido o ya fue usado. Intenta registrarte de nuevo."}
          </p>

          <Link href="/login"
            style={{ display: "inline-block", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", color: "#080604", fontSize: "0.75rem", fontWeight: 900, letterSpacing: "0.4em", textTransform: "uppercase", textDecoration: "none", padding: "16px 36px" }}>
            {invalido ? "Volver al inicio" : "Iniciar Sesión →"}
          </Link>
        </div>

        <div style={{ height: "2px", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)" }} />
      </div>
    </div>
  );
}

export default function VerificarPage() {
  return (
    <Suspense>
      <VerificarContent />
    </Suspense>
  );
}
