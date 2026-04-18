import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080604", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 40%, rgba(200,146,26,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />
      <div style={{ textAlign: "center", maxWidth: "480px", position: "relative" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.7em", textTransform: "uppercase", color: "rgba(200,146,26,0.4)", marginBottom: "24px" }}>
          Error 404
        </p>
        <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(3rem,10vw,6rem)", fontWeight: 900, color: "rgba(200,146,26,0.2)", letterSpacing: "0.05em", marginBottom: "24px" }}>
          ᚺ
        </h1>
        <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 900, color: "#f0e6c8", marginBottom: "12px" }}>
          Página no encontrada
        </p>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.85rem", color: "rgba(184,168,138,0.4)", fontStyle: "italic", marginBottom: "40px", lineHeight: 1.7 }}>
          El camino que buscas no existe en este reino.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{
            fontFamily: "var(--font-barlow)", fontSize: "0.75rem", fontWeight: 700,
            letterSpacing: "0.35em", textTransform: "uppercase",
            padding: "14px 28px", textDecoration: "none",
            background: "linear-gradient(135deg,#a06010,#c8921a)", color: "#080604",
            boxShadow: "0 0 30px rgba(200,146,26,0.3)",
          }}>
            Volver al Inicio
          </Link>
          <Link href="/reservar" style={{
            fontFamily: "var(--font-barlow)", fontSize: "0.75rem", fontWeight: 700,
            letterSpacing: "0.35em", textTransform: "uppercase",
            padding: "14px 28px", textDecoration: "none",
            border: "1px solid rgba(200,146,26,0.4)", color: "#c8921a",
          }}>
            Reservar Cita
          </Link>
        </div>
      </div>
    </div>
  );
}
