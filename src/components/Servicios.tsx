"use client";

const servicios = [
  {
    id: 1,
    nombre: "Corte del Guerrero",
    descripcion: "Corte clásico con tijera y máquina. Lavado y secado incluidos.",
    precio: "Q80",
    duracion: "45 min",
    icono: "ᚱ",
    popular: false,
  },
  {
    id: 2,
    nombre: "Ritual de Navaja",
    descripcion: "Afeitado completo con navaja recta, toalla caliente y bálsamo de post-afeitado.",
    precio: "Q120",
    duracion: "60 min",
    icono: "ᛉ",
    popular: true,
  },
  {
    id: 3,
    nombre: "Corte & Barba",
    descripcion: "La combinación completa. Corte de cabello más escultura y arreglo de barba.",
    precio: "Q150",
    duracion: "75 min",
    icono: "ᛊ",
    popular: false,
  },
  {
    id: 4,
    nombre: "La Barba del Norte",
    descripcion: "Tratamiento completo de barba: lavado, acondicionado, escultura y aceite vikingo.",
    precio: "Q100",
    duracion: "45 min",
    icono: "ᚾ",
    popular: false,
  },
  {
    id: 5,
    nombre: "Corte de Niño Guerrero",
    descripcion: "Para los pequeños valientes. Corte suave y paciencia nórdica garantizada.",
    precio: "Q60",
    duracion: "30 min",
    icono: "ᚲ",
    popular: false,
  },
  {
    id: 6,
    nombre: "El Paquete del Jarl",
    descripcion: "Lo mejor del gremio: corte, navaja completa, tratamiento de barba y aceite premium.",
    precio: "Q220",
    duracion: "120 min",
    icono: "ᚷ",
    popular: false,
  },
];

export default function Servicios() {
  return (
    <section
      id="servicios"
      className="relative py-28 px-6 overflow-hidden"
      style={{ backgroundColor: "#1a1510" }}
    >
      {/* Línea decorativa superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8921a]/40 to-transparent" />

      {/* Encabezado */}
      <div className="relative text-center mb-20">
        <span
          className="text-[#c8921a] text-[10px] tracking-[0.6em] uppercase block mb-4"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          — Los Ritos del Filo —
        </span>
        <h2
          className="text-[#f0e6c8] text-5xl md:text-7xl font-black leading-none mb-6"
          style={{ fontFamily: "var(--font-cinzel-decorative)" }}
        >
          Servicios
        </h2>
        <p
          className="text-[#b8a882] italic text-lg max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-im-fell)" }}
        >
          Cada servicio es un ritual. Cada ritual, una obra de arte.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c8921a]" />
          <span className="text-[#c8921a]">᛭</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c8921a]" />
        </div>
      </div>

      {/* Grid de servicios */}
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicios.map((servicio) => (
          <ServicioCard key={servicio.id} servicio={servicio} />
        ))}
      </div>

      {/* Línea decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8921a]/40 to-transparent" />
    </section>
  );
}

function ServicioCard({ servicio }: { servicio: (typeof servicios)[0] }) {
  return (
    <div
      className={`relative group p-6 border transition-all duration-500 hover:border-[#c8921a]/60 cursor-pointer ${
        servicio.popular
          ? "border-[#c8921a]/60 bg-gradient-to-b from-[#2d1f0e] to-[#1a1510]"
          : "border-[#5c3a1e]/40 bg-[#0f0d0a]/50"
      }`}
    >
      {/* Badge popular */}
      {servicio.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className="bg-[#c8921a] text-[#0f0d0a] text-[9px] tracking-[0.3em] uppercase px-4 py-1 font-bold"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            El Más Pedido
          </span>
        </div>
      )}

      {/* Ícono rúnico */}
      <div className="mb-4">
        <span
          className={`text-4xl ${servicio.popular ? "text-[#c8921a]" : "text-[#c8921a]/50"} group-hover:text-[#c8921a] transition-colors duration-300`}
          style={{ fontFamily: "serif" }}
        >
          {servicio.icono}
        </span>
      </div>

      {/* Nombre */}
      <h3
        className="text-[#f0e6c8] text-base font-bold mb-2 leading-tight"
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        {servicio.nombre}
      </h3>

      {/* Descripción */}
      <p
        className="text-[#b8a882]/70 text-sm leading-relaxed italic mb-6 flex-1"
        style={{ fontFamily: "var(--font-im-fell)" }}
      >
        {servicio.descripcion}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-[#5c3a1e]/40">
        <div>
          <span
            className="text-[#c8921a] text-2xl font-black"
            style={{ fontFamily: "var(--font-cinzel-decorative)" }}
          >
            {servicio.precio}
          </span>
          <span
            className="text-[#b8a882]/40 text-[9px] ml-2 uppercase tracking-widest"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            {servicio.duracion}
          </span>
        </div>
        <a
          href="#reservar"
          className="border border-[#c8921a]/50 text-[#c8921a] hover:bg-[#c8921a] hover:text-[#0f0d0a] text-[9px] tracking-widest uppercase px-4 py-2 transition-all duration-300"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Reservar
        </a>
      </div>
    </div>
  );
}
