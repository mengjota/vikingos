"use client";

// SVG icons relacionados a barbería
const IconScissors = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="20" y1="4" x2="8.12" y2="15.88" />
    <line x1="14.47" y1="14.48" x2="20" y2="20" />
    <line x1="8.12" y1="8.12" x2="12" y2="12" />
  </svg>
);

const IconRazorBlade = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <rect x="2" y="8" width="20" height="8" rx="1" />
    <line x1="6" y1="8" x2="6" y2="16" />
    <line x1="18" y1="8" x2="18" y2="16" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <path d="M9 8V5l3-2 3 2v3" />
  </svg>
);

const IconBeard = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <circle cx="12" cy="8" r="4" />
    <path d="M6 12c0 0-2 2-2 5s3 5 8 5 8-2 8-5-2-5-2-5" />
    <path d="M9 14c1 1 2 2 3 2s2-1 3-2" />
  </svg>
);

const IconComb = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <rect x="2" y="10" width="20" height="4" rx="1" />
    <line x1="5" y1="10" x2="5" y2="5" />
    <line x1="8" y1="10" x2="8" y2="5" />
    <line x1="11" y1="10" x2="11" y2="5" />
    <line x1="14" y1="10" x2="14" y2="5" />
    <line x1="17" y1="10" x2="17" y2="5" />
    <line x1="20" y1="10" x2="20" y2="5" />
  </svg>
);

const IconCrown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <path d="M2 19h20v2H2z" />
    <path d="M2 19l3-9 5 5 2-9 2 9 5-5 3 9" />
    <circle cx="7" cy="7" r="1" fill="currentColor" />
    <circle cx="12" cy="4" r="1" fill="currentColor" />
    <circle cx="17" cy="7" r="1" fill="currentColor" />
  </svg>
);

const servicios = [
  {
    id: 1,
    nombre: "Corte del Guerrero",
    descripcion: "Corte clásico con tijera y máquina. Lavado y secado incluidos.",
    precio: "€80",
    duracion: "45 min",
    Icon: IconScissors,
    popular: false,
    btnLabel: "Afilar el Acero",
  },
  {
    id: 2,
    nombre: "Ritual de Navaja",
    descripcion: "Afeitado completo con navaja recta, toalla caliente y bálsamo de post-afeitado.",
    precio: "€120",
    duracion: "60 min",
    Icon: IconRazorBlade,
    popular: true,
    btnLabel: "Tomar la Navaja",
  },
  {
    id: 3,
    nombre: "Corte & Barba",
    descripcion: "La combinación completa. Corte de cabello más escultura y arreglo de barba.",
    precio: "€150",
    duracion: "75 min",
    Icon: IconComb,
    popular: false,
    btnLabel: "El Combo Completo",
  },
  {
    id: 4,
    nombre: "La Barba del Norte",
    descripcion: "Tratamiento completo de barba: lavado, acondicionado, escultura y aceite vikingo.",
    precio: "€100",
    duracion: "45 min",
    Icon: IconBeard,
    popular: false,
    btnLabel: "Forjar la Barba",
  },
  {
    id: 5,
    nombre: "Corte de Niño Guerrero",
    descripcion: "Para los pequeños valientes. Corte suave y paciencia nórdica garantizada.",
    precio: "€60",
    duracion: "30 min",
    Icon: IconScissors,
    popular: false,
    btnLabel: "El Primer Corte",
  },
  {
    id: 6,
    nombre: "El Paquete del Jarl",
    descripcion: "Lo mejor del gremio: corte, navaja completa, tratamiento de barba y aceite premium.",
    precio: "€220",
    duracion: "120 min",
    Icon: IconCrown,
    popular: false,
    btnLabel: "Reclamar el Trono",
  },
];

export default function Servicios() {
  return (
    <section
      id="servicios"
      className="relative py-28 px-6 overflow-hidden"
      style={{ backgroundColor: "#1a1510" }}
    >
      {/* Línea brillante superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8921a] to-transparent" />

      {/* Resplandor de fondo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 pointer-events-none"
        style={{ background: "radial-gradient(circle, #c8921a 0%, transparent 70%)" }}
      />

      {/* Encabezado */}
      <div className="relative text-center mb-20">
        <span
          className="text-[#c8921a] text-[10px] tracking-[0.6em] uppercase block mb-4"
          style={{ fontFamily: "var(--font-barlow)" }}
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
          style={{ fontFamily: "var(--font-lato)" }}
        >
          Cada servicio es un ritual. Cada ritual, una obra de arte.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c8921a]" />
          <span className="text-[#c8921a]">᛭</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c8921a]" />
        </div>
      </div>

      {/* Grid */}
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicios.map((servicio) => (
          <ServicioCard key={servicio.id} servicio={servicio} />
        ))}
      </div>

      {/* Línea brillante inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8921a] to-transparent" />
    </section>
  );
}

function ServicioCard({ servicio }: { servicio: (typeof servicios)[0] }) {
  const { Icon } = servicio;
  return (
    <div
      className={`relative group flex flex-col p-6 border transition-all duration-500
        hover:border-[#c8921a] hover:shadow-[0_0_30px_rgba(200,146,26,0.15)] hover:-translate-y-1
        ${servicio.popular
          ? "border-[#c8921a]/70 bg-gradient-to-b from-[#2d1f0e] to-[#1a1510] shadow-[0_0_20px_rgba(200,146,26,0.1)]"
          : "border-[#5c3a1e]/40 bg-[#0f0d0a]/60"
        }`}
    >
      {/* Badge popular */}
      {servicio.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span
            className="badge-pulse bg-[#c8921a] text-[#0f0d0a] text-[9px] tracking-[0.3em] uppercase px-4 py-1 font-bold"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            El Más Pedido
          </span>
        </div>
      )}

      {/* Ícono SVG */}
      <div
        className={`mb-5 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(200,146,26,0.8)]
          ${servicio.popular ? "text-[#c8921a]" : "text-[#c8921a]/50 group-hover:text-[#c8921a]"}`}
      >
        <Icon />
      </div>

      {/* Nombre */}
      <h3
        className="text-[#f0e6c8] text-base font-bold mb-2 leading-tight"
        style={{ fontFamily: "var(--font-oswald)" }}
      >
        {servicio.nombre}
      </h3>

      {/* Descripción */}
      <p
        className="text-[#b8a882]/70 text-sm leading-relaxed italic mb-6 flex-1"
        style={{ fontFamily: "var(--font-lato)" }}
      >
        {servicio.descripcion}
      </p>

      {/* Precio */}
      <div className="flex items-baseline gap-2 mb-4">
        <span
          className="text-[#c8921a] text-2xl font-black"
          style={{ fontFamily: "var(--font-cinzel-decorative)" }}
        >
          {servicio.precio}
        </span>
        <span
          className="text-[#b8a882]/40 text-[9px] uppercase tracking-widest"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          {servicio.duracion}
        </span>
      </div>

      {/* Botón animado */}
      <a
        href="/reservar"
        className="relative overflow-hidden group/btn flex items-center justify-center gap-2 w-full py-3 border border-[#c8921a]/60 text-[#c8921a] text-[10px] tracking-widest uppercase font-bold transition-all duration-300
          hover:border-[#c8921a] hover:text-[#0f0d0a] hover:shadow-[0_0_20px_rgba(200,146,26,0.5)]"
        style={{ fontFamily: "var(--font-barlow)" }}
      >
        {/* Fondo que se llena al hover */}
        <span className="absolute inset-0 bg-[#c8921a] translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-300 ease-in-out" />
        {/* Destello */}
        <span className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
          style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)" }}
        />
        <span className="relative z-10">{servicio.btnLabel}</span>
        <svg className="relative z-10 w-3 h-3 transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}
