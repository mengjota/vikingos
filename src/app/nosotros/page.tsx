export default function NosotrosPage() {
  const staff = [
    { rune: "ᚠ", cargo: "Maestro Barbero · Fundador" },
    { rune: "ᚢ", cargo: "Maestro Barbero" },
    { rune: "ᚦ", cargo: "Maestro Barbero" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080604", paddingTop: "100px" }}>

      {/* Glow de fondo */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(200,146,26,0.1) 0%, transparent 65%)",
        }}
      />

      <div style={{ maxWidth: "860px", width: "100%", margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Eyebrow */}
        <p style={{
          fontFamily: "var(--font-barlow)",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.65em",
          textTransform: "uppercase",
          color: "#c8921a",
          textAlign: "center",
          marginBottom: "24px",
        }}>
          — Nuestra Historia —
        </p>

        {/* Título principal */}
        <h1 style={{
          fontFamily: "var(--font-cinzel-decorative)",
          fontSize: "clamp(2.2rem, 5vw, 4rem)",
          fontWeight: 900,
          color: "#f5ead0",
          textAlign: "center",
          lineHeight: 1.15,
          textShadow: "0 0 60px rgba(200,146,26,0.35), 0 2px 4px rgba(0,0,0,0.8)",
          letterSpacing: "0.04em",
          marginBottom: "32px",
        }}>
          Nuestro Oficio
        </h1>

        {/* Separador */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "32px" }}>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.8))" }} />
          <span style={{ color: "#c8921a", fontSize: "1.2rem" }}>᛭</span>
          <div style={{ height: "1px", width: "80px", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.8))" }} />
        </div>

        {/* Subtítulo */}
        <p style={{
          fontFamily: "var(--font-barlow)",
          fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)",
          fontWeight: 600,
          color: "#f0e6c8",
          textAlign: "center",
          lineHeight: 1.6,
          letterSpacing: "0.04em",
          marginBottom: "20px",
        }}>
          Una barbería acoplada a la elegancia de los hombres
        </p>

        <p style={{
          fontFamily: "var(--font-barlow)",
          fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
          color: "rgba(184,168,138,0.55)",
          textAlign: "center",
          lineHeight: 1.8,
          letterSpacing: "0.02em",
          marginBottom: "72px",
        }}>
          Donde cada corte es un ritual y cada cliente merece lo mejor.
        </p>

        {/* Línea divisora */}
        <div style={{
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(200,146,26,0.3) 30%, rgba(200,146,26,0.3) 70%, transparent)",
          marginBottom: "72px",
        }} />

        {/* Sección Staff — eyebrow */}
        <p style={{
          fontFamily: "var(--font-barlow)",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.65em",
          textTransform: "uppercase",
          color: "#c8921a",
          textAlign: "center",
          marginBottom: "16px",
        }}>
          — El Equipo —
        </p>

        {/* Sección Staff — título */}
        <h2 style={{
          fontFamily: "var(--font-cinzel-decorative)",
          fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
          fontWeight: 900,
          color: "#f5ead0",
          textAlign: "center",
          textShadow: "0 0 40px rgba(200,146,26,0.25)",
          marginBottom: "56px",
        }}>
          Maestros del Oficio
        </h2>

        {/* Cards de staff */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "24px",
        }}>
          {staff.map((miembro, i) => (
            <div key={i} style={{
              position: "relative",
              border: "1px solid rgba(92,58,30,0.4)",
              padding: "32px 24px",
              backgroundColor: "#0e0b07",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
              boxShadow: "0 0 30px rgba(200,146,26,0.04)",
            }}>
              {/* Línea dorada superior */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "2px",
                background: "linear-gradient(to right, transparent, #c8921a 40%, #c8921a 60%, transparent)",
              }} />

              {/* Avatar placeholder */}
              <div style={{
                width: "80px", height: "80px",
                border: "1px solid rgba(92,58,30,0.6)",
                background: "linear-gradient(135deg, #1a1208, #2a1d0e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.8rem",
                color: "rgba(200,146,26,0.4)",
              }}>
                {miembro.rune}
              </div>

              {/* Nombre placeholder */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "70%", height: "14px", background: "linear-gradient(to right, #2a1d0e, #3a2810, #2a1d0e)" }} />
                <div style={{ width: "50%", height: "10px", background: "linear-gradient(to right, #1e1508, #2a1d0e, #1e1508)" }} />
              </div>

              {/* Cargo */}
              <p style={{
                fontFamily: "var(--font-barlow)",
                fontSize: "0.62rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(200,146,26,0.5)",
                textAlign: "center",
              }}>
                {miembro.cargo}
              </p>

              {/* Bio placeholder */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "6px", alignItems: "center" }}>
                {[90, 100, 80, 95, 60].map((w, j) => (
                  <div key={j} style={{
                    width: `${w}%`, height: "7px",
                    background: "linear-gradient(to right, #1a1208, #221808, #1a1208)",
                  }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ height: "80px" }} />
      </div>
    </div>
  );
}
