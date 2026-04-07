"use client";

const barbers = [
  {
    id: 1,
    name: "Carlos Mendoza",
    alias: "Barbero Profesional",
    years: 24,
    specialty: "Especialista en Navaja Clásica",
    badge: "FUNDADOR",
    bio: "Sus manos han trazado más de 50,000 siluetas. La navaja recta es su herramienta de precisión.",
    skills: ["Navaja Clásica", "Afeitado Ritual", "Barba Nórdica"],
    days: "Lun – Vie",
    runeSymbol: "ᚠ",
  },
  {
    id: 2,
    name: "Andrés Vega",
    alias: "Barbero Profesional",
    years: 13,
    specialty: "Especialista en Degradados y Líneas",
    badge: "TOP RATED",
    bio: "Precisión milimétrica en cada degradado. Sus líneas geométricas son una firma que los clientes reconocen.",
    skills: ["Skin Fade", "Líneas Afiladas", "Diseños Tribales"],
    days: "Mar – Sáb",
    runeSymbol: "ᚢ",
  },
  {
    id: 3,
    name: "Sebastián Torres",
    alias: "Barbero Profesional",
    years: 7,
    specialty: "Especialista en Estilos Modernos",
    badge: "RISING TALENT",
    bio: "Domina los estilos contemporáneos con la disciplina que exige el oficio. Lee al cliente antes de tocar la tijera.",
    skills: ["Texturas", "Corte Moderno", "Barba Escultural"],
    days: "Miér – Dom",
    runeSymbol: "ᚦ",
  },
];

export default function ElGremio() {
  return (
    <section
      id="el-gremio"
      className="relative py-28 px-6 overflow-hidden"
      style={{ backgroundColor: "#0f0d0a" }}
    >
      {/* Patrón de fondo */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #c8921a 0px,
            #c8921a 1px,
            transparent 1px,
            transparent 40px
          )`,
        }}
      />

      {/* Encabezado */}
      <div className="relative text-center mb-20">
        <span
          className="text-[#c8921a] text-[10px] tracking-[0.6em] uppercase block mb-4"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          — Nuestro Equipo —
        </span>
        <a
          href="/nosotros"
          className="text-[#f0e6c8] hover:text-[#c8921a] text-5xl md:text-7xl font-black leading-none mb-6 block transition-colors duration-300"
          style={{ fontFamily: "var(--font-cinzel-decorative)" }}
        >
          NOSOTROS INVICTUS
        </a>
        <p
          className="text-[#b8a882] italic text-lg max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-lato)" }}
        >
          Cada barbero lleva consigo años de oficio y una especialidad única.
          Elige a tu maestro.
        </p>
        {/* Separador */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c8921a]" />
          <span className="text-[#c8921a]">᛭</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c8921a]" />
        </div>
      </div>

      {/* Fichas de barberos */}
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {barbers.map((barber) => (
          <BarberCard key={barber.id} barber={barber} />
        ))}
      </div>
    </section>
  );
}

function BarberCard({ barber }: { barber: (typeof barbers)[0] }) {
  return (
    <div
      className="card-glow group relative flex flex-col border border-[#5c3a1e]/60 hover:border-[#c8921a]/60"
      style={{ backgroundColor: "#1a1510" }}
    >
      {/* Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span
          className="bg-[#c8921a] text-[#0f0d0a] text-[9px] tracking-[0.2em] uppercase px-3 py-1 font-bold"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          {barber.badge}
        </span>
      </div>

      {/* Zona de foto */}
      <div className="relative overflow-hidden h-64 flex items-end"
        style={{ backgroundColor: "#2d1f0e" }}
      >
        {/* Runa decorativa de fondo */}
        <span
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] text-[#c8921a]/10 select-none"
          style={{ fontFamily: "serif" }}
        >
          {barber.runeSymbol}
        </span>

        {/* Gradiente sobre la foto */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510] via-transparent to-transparent z-10" />

        {/* Años de experiencia */}
        <div className="absolute bottom-4 left-5 z-20">
          <span
            className="text-[#c8921a] text-5xl font-black leading-none"
            style={{ fontFamily: "var(--font-cinzel-decorative)" }}
          >
            {barber.years}
          </span>
          <span
            className="block text-[#b8a882]/70 text-[9px] tracking-[0.3em] uppercase mt-1"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            años de oficio
          </span>
        </div>

        {/* Indicador hover */}
        <div className="absolute inset-0 bg-[#c8921a]/0 group-hover:bg-[#c8921a]/5 transition-all duration-500 z-10" />
      </div>

      {/* Contenido */}
      <div className="flex flex-col flex-1 p-6">
        <p
          className="text-[#c8921a]/80 text-[10px] tracking-[0.4em] uppercase mb-1"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          {barber.alias}
        </p>
        <h3
          className="text-[#f0e6c8] text-xl font-bold mb-1"
          style={{ fontFamily: "var(--font-oswald)" }}
        >
          {barber.name}
        </h3>

        {/* Línea divisoria */}
        <div className="flex items-center gap-2 my-3">
          <div className="flex-1 h-px bg-[#5c3a1e]" />
          <span className="text-[#c8921a] text-xs">{barber.runeSymbol}</span>
          <div className="flex-1 h-px bg-[#5c3a1e]" />
        </div>

        {/* Especialidad */}
        <p
          className="text-[#c8921a] text-[10px] uppercase tracking-widest mb-3"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          {barber.specialty}
        </p>

        {/* Bio */}
        <p
          className="text-[#b8a882]/70 text-sm leading-relaxed italic mb-4 flex-1"
          style={{ fontFamily: "var(--font-lato)" }}
        >
          &ldquo;{barber.bio}&rdquo;
        </p>

        {/* Habilidades */}
        <div className="flex flex-wrap gap-2 mb-5">
          {barber.skills.map((skill) => (
            <span
              key={skill}
              className="border border-[#5c3a1e] text-[#b8a882]/60 text-[9px] tracking-widest uppercase px-2 py-1"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Footer de tarjeta */}
        <div className="flex items-center justify-between pt-4 border-t border-[#5c3a1e]/40">
          <span
            className="text-[#b8a882]/40 text-[9px] uppercase tracking-widest"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            {barber.days}
          </span>
          <a
            href="#reservar"
            className="border border-[#c8921a]/60 text-[#c8921a] hover:bg-[#c8921a] hover:text-[#0f0d0a] text-[9px] tracking-widest uppercase px-4 py-2 transition-all duration-300"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            Elegir
          </a>
        </div>
      </div>
    </div>
  );
}
