import Link from "next/link";

const categorias = [
  {
    id: "cuidado-barba",
    nombre: "Cuidado de Barba",
    icono: "ᚾ",
    productos: [
      {
        nombre: "Aceite de Barba Vikingo",
        descripcion: "Mezcla artesanal de aceite de argán, jojoba y cedro. Hidrata, suaviza y da brillo a la barba.",
        precio: "$85",
        volumen: "30ml",
        destacado: true,
      },
      {
        nombre: "Bálsamo de Barba Nórdico",
        descripcion: "Manteca de karité y cera de abejas. Fija, moldea y nutre sin dejar residuo graso.",
        precio: "$75",
        volumen: "60ml",
        destacado: false,
      },
      {
        nombre: "Champú de Barba",
        descripcion: "Limpieza profunda con extracto de pino y menta. Elimina impurezas sin resecar.",
        precio: "$65",
        volumen: "200ml",
        destacado: false,
      },
    ],
  },
  {
    id: "cuidado-cabello",
    nombre: "Cuidado del Cabello",
    icono: "ᚱ",
    productos: [
      {
        nombre: "Pomada Mate Invictus",
        descripcion: "Fijación fuerte, acabado mate. Control total sin apelmazar. Para estilos con carácter.",
        precio: "$90",
        volumen: "100g",
        destacado: true,
      },
      {
        nombre: "Cera de Peinado Clásica",
        descripcion: "Fijación media, brillo natural. La favorita para cortes clásicos y peinados hacia atrás.",
        precio: "$80",
        volumen: "100g",
        destacado: false,
      },
      {
        nombre: "Arcilla Moldeadora",
        descripcion: "Textura y movimiento natural. Ideal para estilos desestructurados y acabado opaco.",
        precio: "$85",
        volumen: "100g",
        destacado: false,
      },
    ],
  },
  {
    id: "afeitado",
    nombre: "Ritual de Afeitado",
    icono: "ᛉ",
    productos: [
      {
        nombre: "Crema de Afeitado Premium",
        descripcion: "Base de manteca de cacao y aloe vera. Deslizamiento perfecto para la navaja. Sin irritación.",
        precio: "$70",
        volumen: "150ml",
        destacado: false,
      },
      {
        nombre: "Bálsamo Post-Afeitado",
        descripcion: "Calma, hidrata y protege después de la navaja. Aroma amaderado seco. La firma de Invictus.",
        precio: "$80",
        volumen: "100ml",
        destacado: true,
      },
      {
        nombre: "Alum Block (Piedra de Alumbre)",
        descripcion: "Cierra poros, detiene pequeños cortes y desinfecta. Herramienta clásica del afeitado tradicional.",
        precio: "$45",
        volumen: "75g",
        destacado: false,
      },
    ],
  },
];

export default function ProductosPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f0d0a", paddingTop: "100px" }}>

      <div style={{ maxWidth: "1000px", width: "100%", margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Encabezado */}
        <div className="text-center mb-16">
          <span
            className="text-[#c8921a] text-[10px] tracking-[0.6em] uppercase block mb-4"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            — Los Arsenales del Guerrero —
          </span>
          <h2
            className="text-[#f0e6c8] text-5xl md:text-6xl font-black leading-none mb-6"
            style={{ fontFamily: "var(--font-cinzel-decorative)" }}
          >
            Nuestros Productos
          </h2>
          <p
            className="text-[#b8a882]/70 italic text-lg max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Los mismos productos que usamos en el salón, disponibles para que lleves el ritual a casa.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c8921a]" />
            <span className="text-[#c8921a]">᛭</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c8921a]" />
          </div>
        </div>

        {/* Categorías */}
        <div className="space-y-20">
          {categorias.map((cat) => (
            <div key={cat.id} id={cat.id}>
              {/* Título de categoría */}
              <div className="flex items-center gap-4 mb-8">
                <span className="text-[#c8921a] text-2xl">{cat.icono}</span>
                <h3
                  className="text-[#f0e6c8] text-2xl font-bold tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  {cat.nombre}
                </h3>
                <div className="flex-1 h-px bg-[#5c3a1e]/60" />
              </div>

              {/* Grid de productos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {cat.productos.map((prod) => (
                  <div
                    key={prod.nombre}
                    className={`relative p-6 border transition-all duration-300 hover:border-[#c8921a]/50 ${
                      prod.destacado
                        ? "border-[#c8921a]/50 bg-gradient-to-b from-[#2d1f0e] to-[#1a1510]"
                        : "border-[#5c3a1e]/40 bg-[#1a1510]"
                    }`}
                  >
                    {prod.destacado && (
                      <div className="absolute -top-3 left-4">
                        <span
                          className="bg-[#c8921a] text-[#0f0d0a] text-[9px] tracking-widest uppercase px-3 py-0.5 font-bold"
                          style={{ fontFamily: "var(--font-barlow)" }}
                        >
                          Favorito del Salón
                        </span>
                      </div>
                    )}

                    <h4
                      className="text-[#f0e6c8] text-sm font-bold mb-2 leading-tight"
                      style={{ fontFamily: "var(--font-oswald)" }}
                    >
                      {prod.nombre}
                    </h4>
                    <p
                      className="text-[#b8a882]/60 text-sm italic leading-relaxed mb-5 flex-1"
                      style={{ fontFamily: "var(--font-lato)" }}
                    >
                      {prod.descripcion}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-[#5c3a1e]/40">
                      <div>
                        <span
                          className="text-[#c8921a] text-xl font-black"
                          style={{ fontFamily: "var(--font-cinzel-decorative)" }}
                        >
                          {prod.precio}
                        </span>
                        <span
                          className="text-[#b8a882]/40 text-[9px] ml-2 uppercase tracking-widest"
                          style={{ fontFamily: "var(--font-barlow)" }}
                        >
                          {prod.volumen}
                        </span>
                      </div>
                      <span
                        className="text-[#b8a882]/30 text-[9px] uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-barlow)" }}
                      >
                        Disponible en salón
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Nota */}
        <div
          className="mt-20 p-8 border border-[#5c3a1e]/40 text-center"
          style={{ backgroundColor: "#1a1510" }}
        >
          <span className="text-[#c8921a] text-2xl block mb-4">ᚠ</span>
          <p
            className="text-[#b8a882]/70 italic text-base leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Todos nuestros productos están disponibles directamente en el salón.
            Si tienes alguna consulta sobre cuál es el indicado para ti, pregúntale a tu barbero en la próxima visita.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/reservar"
            className="btn-glow bg-[#c8921a] text-[#0f0d0a] hover:bg-[#e8b84b] px-12 py-4 text-xs tracking-[0.4em] uppercase font-bold"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            Reservar Mi Servicio
          </Link>
        </div>
      </div>
    </div>
  );
}
