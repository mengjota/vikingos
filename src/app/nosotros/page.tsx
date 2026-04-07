export default function NosotrosPage() {
  const staff = [
    { rune: "ᚠ", cargo: "Maestro Barbero · Fundador" },
    { rune: "ᚢ", cargo: "Maestro Barbero" },
    { rune: "ᚦ", cargo: "Maestro Barbero" },
  ];

  return (
    <div className="min-h-screen pt-24" style={{ backgroundColor: "#080604" }}>

      {/* Glow de fondo */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(200,146,26,0.1) 0%, transparent 65%)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">

        {/* Eyebrow */}
        <p
          className="text-[#c8921a] tracking-[0.7em] uppercase mb-6"
          style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 600 }}
        >
          — Nuestra Historia —
        </p>

        {/* Título principal */}
        <h1
          className="text-[#f5ead0] font-black leading-tight mb-8"
          style={{
            fontFamily: "var(--font-cinzel-decorative)",
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            textShadow: "0 0 60px rgba(200,146,26,0.35), 0 2px 4px rgba(0,0,0,0.8)",
            letterSpacing: "0.04em",
          }}
        >
          Somos Invictus
        </h1>

        {/* Separador */}
        <div className="flex items-center justify-center gap-5 mb-10">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c8921a]/80" />
          <span className="text-[#c8921a] text-xl">᛭</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c8921a]/80" />
        </div>

        {/* Subtítulo */}
        <p
          className="text-[#f0e6c8] mx-auto mb-6"
          style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
            letterSpacing: "0.05em",
            maxWidth: "680px",
            lineHeight: 1.6,
            fontWeight: 500,
          }}
        >
          Una barbería acoplada a la elegancia de los hombres
        </p>

        <p
          className="text-[#b8a882]/60 mx-auto mb-20"
          style={{
            fontFamily: "var(--font-barlow)",
            fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
            maxWidth: "520px",
            lineHeight: 1.8,
            letterSpacing: "0.02em",
          }}
        >
          Donde cada corte es un ritual y cada cliente merece lo mejor.
        </p>

        {/* Línea divisora */}
        <div className="h-px w-full mb-20"
          style={{ background: "linear-gradient(to right, transparent, rgba(200,146,26,0.3) 30%, rgba(200,146,26,0.3) 70%, transparent)" }} />

        {/* Sección Staff */}
        <p
          className="text-[#c8921a] tracking-[0.7em] uppercase mb-4"
          style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 600 }}
        >
          — El Equipo —
        </p>

        <h2
          className="text-[#f5ead0] font-black mb-14"
          style={{
            fontFamily: "var(--font-cinzel-decorative)",
            fontSize: "clamp(1.6rem, 4vw, 2.8rem)",
            textShadow: "0 0 40px rgba(200,146,26,0.25)",
          }}
        >
          Maestros del Oficio
        </h2>

        {/* Cards de staff */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {staff.map((miembro, i) => (
            <div
              key={i}
              className="relative border border-[#5c3a1e]/40 p-8 flex flex-col items-center gap-5"
              style={{
                backgroundColor: "#0e0b07",
                boxShadow: "0 0 30px rgba(200,146,26,0.04)",
              }}
            >
              {/* Línea dorada superior */}
              <div className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: "linear-gradient(to right, transparent, #c8921a 40%, #c8921a 60%, transparent)" }} />

              {/* Avatar placeholder */}
              <div
                className="w-20 h-20 border border-[#5c3a1e]/60 flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #1a1208, #2a1d0e)",
                  fontSize: "1.8rem",
                  color: "rgba(200,146,26,0.4)",
                }}
              >
                {miembro.rune}
              </div>

              {/* Nombre placeholder */}
              <div className="space-y-2 w-full">
                <div
                  className="h-4 mx-auto rounded-none"
                  style={{
                    width: "70%",
                    background: "linear-gradient(to right, #2a1d0e, #3a2810, #2a1d0e)",
                  }}
                />
                <div
                  className="h-3 mx-auto rounded-none"
                  style={{
                    width: "50%",
                    background: "linear-gradient(to right, #1e1508, #2a1d0e, #1e1508)",
                  }}
                />
              </div>

              {/* Cargo */}
              <p
                className="text-[#c8921a]/50 tracking-[0.3em] uppercase text-center"
                style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem" }}
              >
                {miembro.cargo}
              </p>

              {/* Bio placeholder */}
              <div className="space-y-1.5 w-full">
                {[90, 100, 80, 95, 60].map((w, j) => (
                  <div key={j}
                    className="h-2 rounded-none"
                    style={{
                      width: `${w}%`,
                      background: "linear-gradient(to right, #1a1208, #221808, #1a1208)",
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Espacio final */}
        <div className="mt-24" />

      </div>
    </div>
  );
}
