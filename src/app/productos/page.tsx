"use client";

import type { MouseEvent } from "react";

const categorias = [
  {
    id: "cuidado-barba",
    nombre: "Cuidado de Barba",
    productos: [
      { nombre: "Aceite de Barba Vikingo", descripcion: "Mezcla artesanal de aceite de argán, jojoba y cedro. Hidrata, suaviza y da brillo.", precio: "$85", volumen: "30ml", destacado: true },
      { nombre: "Bálsamo de Barba Nórdico", descripcion: "Manteca de karité y cera de abejas. Fija, moldea y nutre sin residuo graso.", precio: "$75", volumen: "60ml", destacado: false },
      { nombre: "Champú de Barba", descripcion: "Limpieza profunda con extracto de pino y menta. Sin resecar.", precio: "$65", volumen: "200ml", destacado: false },
    ],
  },
  {
    id: "cuidado-cabello",
    nombre: "Cuidado del Cabello",
    productos: [
      { nombre: "Pomada Mate Invictus", descripcion: "Fijación fuerte, acabado mate. Control total sin apelmazar.", precio: "$90", volumen: "100g", destacado: true },
      { nombre: "Cera de Peinado Clásica", descripcion: "Fijación media, brillo natural. La favorita para cortes clásicos.", precio: "$80", volumen: "100g", destacado: false },
      { nombre: "Arcilla Moldeadora", descripcion: "Textura y movimiento natural. Ideal para estilos desestructurados.", precio: "$85", volumen: "100g", destacado: false },
    ],
  },
  {
    id: "afeitado",
    nombre: "Ritual de Afeitado",
    productos: [
      { nombre: "Crema de Afeitado Premium", descripcion: "Base de manteca de cacao y aloe vera. Deslizamiento perfecto para la navaja.", precio: "$70", volumen: "150ml", destacado: false },
      { nombre: "Bálsamo Post-Afeitado", descripcion: "Calma, hidrata y protege después de la navaja. Aroma amaderado seco.", precio: "$80", volumen: "100ml", destacado: true },
      { nombre: "Alum Block", descripcion: "Cierra poros y desinfecta. Herramienta clásica del afeitado tradicional.", precio: "$45", volumen: "75g", destacado: false },
    ],
  },
];

export default function ProductosPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080604", paddingTop: "100px" }}>

      {/* Glow fondo */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 65% 40% at 50% 20%, rgba(200,146,26,0.09) 0%, transparent 65%)" }} />

      <div style={{ maxWidth: "1100px", width: "100%", margin: "0 auto", padding: "60px 24px 100px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.65em", textTransform: "uppercase", color: "#c8921a", marginBottom: "20px" }}>
            — Los Arsenales del Guerrero —
          </p>
          <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(2rem, 5vw, 3.8rem)", fontWeight: 900, color: "#f5ead0", textAlign: "center", lineHeight: 1.15, textShadow: "0 0 60px rgba(200,146,26,0.3)", letterSpacing: "0.04em", marginBottom: "24px" }}>
            Tienda Invictus
          </h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", marginBottom: "20px" }}>
            <div style={{ height: "1px", width: "80px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.8))" }} />
            <span style={{ color: "#c8921a", fontSize: "1.2rem" }}>᛭</span>
            <div style={{ height: "1px", width: "80px", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.8))" }} />
          </div>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "clamp(0.88rem, 1.6vw, 1rem)", color: "rgba(184,168,138,0.55)", textAlign: "center", maxWidth: "480px", margin: "0 auto", lineHeight: 1.8 }}>
            Los mismos productos que usamos en el salón, disponibles para llevar el ritual a casa.
          </p>
        </div>

        {/* Categorías */}
        <div style={{ display: "flex", flexDirection: "column", gap: "72px" }}>
          {categorias.map((cat) => (
            <div key={cat.id}>

              {/* Título categoría */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, rgba(200,146,26,0.5), transparent)" }} />
                <h2 style={{ fontFamily: "var(--font-barlow)", fontSize: "clamp(0.8rem, 1.8vw, 1rem)", fontWeight: 700, letterSpacing: "0.45em", textTransform: "uppercase", color: "#c8921a", whiteSpace: "nowrap" }}>
                  {cat.nombre}
                </h2>
                <div style={{ height: "1px", flex: 1, background: "linear-gradient(to left, rgba(200,146,26,0.5), transparent)" }} />
              </div>

              {/* Grid de productos */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                {cat.productos.map((p, i) => (
                  <div key={i} style={{
                    position: "relative",
                    border: p.destacado ? "1px solid rgba(200,146,26,0.45)" : "1px solid rgba(92,58,30,0.35)",
                    backgroundColor: "#0e0b07",
                    boxShadow: p.destacado ? "0 0 30px rgba(200,146,26,0.07)" : "none",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}>

                    {/* Badge destacado */}
                    {p.destacado && (
                      <div style={{
                        position: "absolute", top: "12px", right: "12px", zIndex: 2,
                        fontFamily: "var(--font-barlow)", fontSize: "0.6rem", fontWeight: 700,
                        letterSpacing: "0.3em", textTransform: "uppercase",
                        color: "#080604", backgroundColor: "#c8921a",
                        padding: "3px 10px",
                      }}>
                        Favorito del Salón
                      </div>
                    )}

                    {/* Imagen placeholder */}
                    <div style={{
                      width: "100%", aspectRatio: "1/1",
                      background: "linear-gradient(135deg, #0e0b07 0%, #1a1208 50%, #0e0b07 100%)",
                      borderBottom: "1px solid rgba(92,58,30,0.3)",
                      display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", gap: "10px",
                    }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(200,146,26,0.2)" strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,146,26,0.2)" }}>
                        Foto próximamente
                      </span>
                    </div>

                    {/* Info del producto */}
                    <div style={{ padding: "20px" }}>
                      <h3 style={{ fontFamily: "var(--font-barlow)", fontSize: "0.95rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "8px", letterSpacing: "0.02em" }}>
                        {p.nombre}
                      </h3>
                      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", color: "rgba(184,168,138,0.55)", lineHeight: 1.6, marginBottom: "16px" }}>
                        {p.descripcion}
                      </p>

                      {/* Precio + volumen */}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "1.4rem", fontWeight: 900, color: "#c8921a" }}>
                          {p.precio}
                        </span>
                        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(184,168,138,0.35)", border: "1px solid rgba(92,58,30,0.4)", padding: "3px 8px" }}>
                          {p.volumen}
                        </span>
                      </div>

                      {/* Botón agregar */}
                      <button style={{
                        marginTop: "14px", width: "100%",
                        padding: "12px 0",
                        fontFamily: "var(--font-barlow)", fontSize: "0.72rem", fontWeight: 700,
                        letterSpacing: "0.4em", textTransform: "uppercase",
                        color: "#c8921a", backgroundColor: "transparent",
                        border: "1px solid rgba(200,146,26,0.35)",
                        cursor: "pointer", transition: "all 0.25s",
                      }}
                        onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
                          e.currentTarget.style.backgroundColor = "#c8921a";
                          e.currentTarget.style.color = "#080604";
                        }}
                        onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.color = "#c8921a";
                        }}
                      >
                        Agregar al carrito
                      </button>
                    </div>

                    {/* Línea dorada inferior al hacer hover — acento */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.6) 40%, rgba(200,146,26,0.6) 60%, transparent)" }} />
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
