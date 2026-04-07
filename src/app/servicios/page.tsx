export default function ServiciosPage() {
  const secciones = [
    {
      titulo: "Cortes de Cabello",
      descripcion: "El arte del corte — precisión, estilo y carácter en cada tijera.",
      slots: 4,
    },
    {
      titulo: "Lavado & Tratamiento",
      descripcion: "Ritual de limpieza profunda para cabello y cuero cabelludo.",
      slots: 3,
    },
    {
      titulo: "Limpieza Facial",
      descripcion: "Cuidado del rostro con productos premium. El caballero completo.",
      slots: 3,
    },
    {
      titulo: "Servicios de Barbería",
      descripcion: "Afeitado clásico, perfilado y escultura de barba.",
      slots: 4,
    },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080604", paddingTop: "100px" }}>

      {/* Glow de fondo */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% 25%, rgba(200,146,26,0.09) 0%, transparent 65%)",
        }}
      />

      <div style={{ maxWidth: "1100px", width: "100%", margin: "0 auto", padding: "60px 24px 100px" }}>

        {/* Hero de sección */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
          <p style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.65em",
            textTransform: "uppercase",
            color: "#c8921a",
            marginBottom: "20px",
          }}>
            — Lo Que Hacemos —
          </p>

          <h1 style={{
            fontFamily: "var(--font-cinzel-decorative)",
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            fontWeight: 900,
            color: "#f5ead0",
            textAlign: "center",
            lineHeight: 1.15,
            textShadow: "0 0 60px rgba(200,146,26,0.3), 0 2px 4px rgba(0,0,0,0.8)",
            letterSpacing: "0.04em",
            marginBottom: "28px",
          }}>
            Nuestros Servicios
          </h1>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "24px" }}>
            <div style={{ height: "1px", width: "80px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.8))" }} />
            <span style={{ color: "#c8921a", fontSize: "1.2rem" }}>᛭</span>
            <div style={{ height: "1px", width: "80px", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.8))" }} />
          </div>

          <p style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "clamp(0.9rem, 1.8vw, 1.1rem)",
            color: "rgba(184,168,138,0.6)",
            textAlign: "center",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.8,
          }}>
            El trabajo habla por sí solo. Aquí lo verás.
          </p>
        </div>

        {/* Secciones de fotos */}
        <div style={{ display: "flex", flexDirection: "column", gap: "72px" }}>
          {secciones.map((sec, i) => (
            <div key={i}>

              {/* Título de sección */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
                <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, rgba(200,146,26,0.4), transparent)" }} />
                <h2 style={{
                  fontFamily: "var(--font-barlow)",
                  fontSize: "clamp(0.9rem, 2vw, 1.1rem)",
                  fontWeight: 700,
                  letterSpacing: "0.4em",
                  textTransform: "uppercase",
                  color: "#c8921a",
                  whiteSpace: "nowrap",
                }}>
                  {sec.titulo}
                </h2>
                <div style={{ height: "1px", flex: 1, background: "linear-gradient(to left, rgba(200,146,26,0.4), transparent)" }} />
              </div>

              <p style={{
                fontFamily: "var(--font-barlow)",
                fontSize: "0.88rem",
                color: "rgba(184,168,138,0.5)",
                textAlign: "center",
                marginBottom: "28px",
                letterSpacing: "0.05em",
              }}>
                {sec.descripcion}
              </p>

              {/* Grid de fotos placeholder */}
              <div style={{
                display: "grid",
                gridTemplateColumns: `repeat(${sec.slots <= 3 ? sec.slots : 2}, 1fr)`,
                gap: "12px",
              }}
                className={sec.slots === 4 ? "grid-cols-2 sm:grid-cols-4" : ""}
              >
                {Array.from({ length: sec.slots }).map((_, j) => (
                  <div key={j} style={{
                    position: "relative",
                    aspectRatio: "4/3",
                    border: "1px solid rgba(92,58,30,0.35)",
                    background: "linear-gradient(135deg, #0e0b07 0%, #1a1208 50%, #0e0b07 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    overflow: "hidden",
                  }}>
                    {/* Línea dorada superior */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                      background: "linear-gradient(to right, transparent, rgba(200,146,26,0.4) 40%, rgba(200,146,26,0.4) 60%, transparent)",
                    }} />

                    {/* Ícono de imagen */}
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(200,146,26,0.25)" strokeWidth="1.2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>

                    <p style={{
                      fontFamily: "var(--font-barlow)",
                      fontSize: "0.65rem",
                      letterSpacing: "0.3em",
                      textTransform: "uppercase",
                      color: "rgba(200,146,26,0.25)",
                    }}>
                      Foto próximamente
                    </p>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
