import Link from "next/link";

const staff = [
  {
    nombre: "Björn el Anciano",
    cargo: "Barbero Profesional · Fundador",
    años: 24,
    rune: "ᚠ",
    bio: "Con más de dos décadas de oficio, Björn es el alma de Invictus. Formado en la tradición del afeitado clásico con navaja recta, ha perfeccionado cada técnica hasta convertirla en ritual. Su filosofía: la silla de un barbero es el trono del cliente.",
    especialidad: "Navaja Clásica · Afeitado Ritual · Barba Nórdica",
  },
  {
    nombre: "Erik Manos de Hierro",
    cargo: "Barbero Profesional",
    años: 13,
    rune: "ᚢ",
    bio: "Erik llegó al gremio forjado en las calles. Sus degradados son tan precisos como una espada bien templada. Especialista en líneas geométricas y skin fade, representa la fusión entre tradición y precisión moderna.",
    especialidad: "Skin Fade · Líneas · Diseños Geométricos",
  },
  {
    nombre: "Ragnar el Joven",
    cargo: "Barbero Profesional",
    años: 7,
    rune: "ᚦ",
    bio: "El más joven del gremio pero no el menos hábil. Ragnar trae vientos frescos del norte: estilos modernos ejecutados con la disciplina y respeto que exige Invictus. Su especialidad es leer al cliente antes de tocar la tijera.",
    especialidad: "Estilos Modernos · Texturas · Barba Escultural",
  },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f0d0a" }}>

      {/* Header */}
      <div className="relative border-b border-[#5c3a1e]/40 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex flex-col leading-none">
            <span className="text-[#c8921a] text-xl font-black tracking-[0.2em]" style={{ fontFamily: "var(--font-cinzel-decorative)" }}>
              INVICTUS
            </span>
            <span className="text-[#b8a882] text-[9px] tracking-[0.4em] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
              Barberia
            </span>
          </Link>
          <h1 className="text-[#f0e6c8] text-lg tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-cinzel)" }}>
            Nosotros Invictus
          </h1>
          <Link
            href="/"
            className="text-[#b8a882]/50 hover:text-[#c8921a] text-[10px] tracking-widest uppercase transition-colors"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            ← Volver
          </Link>
        </div>
      </div>

      {/* Separador dorado */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#c8921a]/40 to-transparent" />

      <div className="max-w-5xl mx-auto px-6 py-20">

        {/* SECCIÓN: Por qué INVICTUS */}
        <div className="mb-28">
          <div className="text-center mb-14">
            <span
              className="text-[#c8921a] text-[10px] tracking-[0.6em] uppercase block mb-4"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              — El Origen del Nombre —
            </span>
            <h2
              className="text-[#f0e6c8] text-5xl md:text-6xl font-black leading-none mb-6"
              style={{ fontFamily: "var(--font-cinzel-decorative)" }}
            >
              ¿Por qué INVICTUS?
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c8921a]" />
              <span className="text-[#c8921a]">᛭</span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c8921a]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Texto */}
            <div className="space-y-6">
              <p
                className="text-[#f0e6c8] text-xl italic leading-relaxed"
                style={{ fontFamily: "var(--font-im-fell)" }}
              >
                &ldquo;Invictus&rdquo; viene del latín: <span className="text-[#c8921a]">invencible, no conquistado, inquebrantable.</span>
              </p>
              <p
                className="text-[#b8a882]/80 text-base leading-relaxed"
                style={{ fontFamily: "var(--font-im-fell)" }}
              >
                Cuando el fundador buscó un nombre para su barbería, no quería algo que simplemente describiera el negocio. Quería un nombre que fuera una declaración de principios.
              </p>
              <p
                className="text-[#b8a882]/80 text-base leading-relaxed"
                style={{ fontFamily: "var(--font-im-fell)" }}
              >
                En un mundo donde las barberías se multiplican y se olvidan, Invictus nació para permanecer. Para ser el lugar al que los hombres vuelven no porque es el más cercano, sino porque es el mejor.
              </p>
              <p
                className="text-[#b8a882]/80 text-base leading-relaxed"
                style={{ fontFamily: "var(--font-im-fell)" }}
              >
                El espíritu vikingo que acompaña nuestra estética no es decorativo. Representa la misma filosofía: <span className="text-[#c8921a] italic">honor en el trabajo, fuerza en el oficio, lealtad al cliente.</span>
              </p>
            </div>

            {/* Cita destacada */}
            <div
              className="relative p-10 border border-[#c8921a]/30"
              style={{ backgroundColor: "#1a1510" }}
            >
              <span
                className="absolute -top-5 left-8 text-[#c8921a] text-6xl"
                style={{ fontFamily: "serif" }}
              >
                ᚢ
              </span>
              <blockquote
                className="text-[#f0e6c8] text-2xl italic leading-relaxed mb-6"
                style={{ fontFamily: "var(--font-im-fell)" }}
              >
                &ldquo;Out of the night that covers me,<br />
                black as the pit from pole to pole,<br />
                I am the master of my fate,<br />
                I am the captain of my soul.&rdquo;
              </blockquote>
              <p
                className="text-[#c8921a] text-[10px] tracking-widest uppercase"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                — William Ernest Henley, Invictus (1875)
              </p>
              <p
                className="text-[#b8a882]/50 text-xs mt-3 italic"
                style={{ fontFamily: "var(--font-im-fell)" }}
              >
                El poema que inspiró el nombre.
              </p>
            </div>
          </div>
        </div>

        {/* SECCIÓN: El Jefe */}
        <div className="mb-28">
          <div className="text-center mb-14">
            <span
              className="text-[#c8921a] text-[10px] tracking-[0.6em] uppercase block mb-4"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              — El Hombre Detrás del Acero —
            </span>
            <h2
              className="text-[#f0e6c8] text-5xl md:text-6xl font-black leading-none mb-6"
              style={{ fontFamily: "var(--font-cinzel-decorative)" }}
            >
              El Fundador
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c8921a]" />
              <span className="text-[#c8921a]">᛭</span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c8921a]" />
            </div>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#5c3a1e]/60 overflow-hidden"
          >
            {/* Foto placeholder */}
            <div
              className="relative h-80 md:h-auto flex items-end p-6"
              style={{ backgroundColor: "#2d1f0e", minHeight: "320px" }}
            >
              <span
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[140px] text-[#c8921a]/10 select-none"
                style={{ fontFamily: "serif" }}
              >
                ᚠ
              </span>
              <div className="relative z-10">
                <span
                  className="text-[#c8921a] text-5xl font-black leading-none block"
                  style={{ fontFamily: "var(--font-cinzel-decorative)" }}
                >
                  24
                </span>
                <span
                  className="text-[#b8a882]/60 text-[9px] tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  años de oficio
                </span>
              </div>
            </div>

            {/* Contenido del jefe */}
            <div className="md:col-span-2 p-10" style={{ backgroundColor: "#1a1510" }}>
              <span
                className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Barbero Profesional · Fundador
              </span>
              <h3
                className="text-[#f0e6c8] text-3xl font-black mb-1"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Björn el Anciano
              </h3>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-[#5c3a1e]" />
                <span className="text-[#c8921a]">ᚠ</span>
                <div className="flex-1 h-px bg-[#5c3a1e]" />
              </div>
              <div className="space-y-4 text-[#b8a882]/80 text-base leading-relaxed" style={{ fontFamily: "var(--font-im-fell)" }}>
                <p>
                  Björn empezó en este oficio a los 16 años, aprendiendo de un maestro barbero que ya no existe. No hubo academia, no hubo título enmarcado en la pared. Hubo años de práctica, de errores corregidos, de manos que aprendieron a leer cada tipo de cabello y cada forma de rostro.
                </p>
                <p>
                  Después de más de dos décadas, decidió crear Invictus no como un negocio, sino como un legado. Un espacio donde el oficio se respeta, donde el cliente no es un número en una agenda sino un hombre que merece lo mejor.
                </p>
                <p className="text-[#f0e6c8] italic">
                  &ldquo;Un corte bien hecho le da al hombre más que un buen aspecto. Le devuelve la confianza.&rdquo;
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {["Navaja Clásica", "Afeitado Ritual", "Barba Nórdica", "Fundador"].map((tag) => (
                  <span
                    key={tag}
                    className="border border-[#5c3a1e] text-[#b8a882]/50 text-[9px] tracking-widest uppercase px-3 py-1"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN: Staff */}
        <div>
          <div className="text-center mb-14">
            <span
              className="text-[#c8921a] text-[10px] tracking-[0.6em] uppercase block mb-4"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              — Cada uno, un maestro —
            </span>
            <h2
              className="text-[#f0e6c8] text-5xl md:text-6xl font-black leading-none mb-6"
              style={{ fontFamily: "var(--font-cinzel-decorative)" }}
            >
              El Staff
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c8921a]" />
              <span className="text-[#c8921a]">᛭</span>
              <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c8921a]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staff.map((miembro) => (
              <div
                key={miembro.nombre}
                className="border border-[#5c3a1e]/60 hover:border-[#c8921a]/40 transition-all duration-500 overflow-hidden"
                style={{ backgroundColor: "#1a1510" }}
              >
                {/* Zona de foto */}
                <div
                  className="relative h-52 flex items-end p-5"
                  style={{ backgroundColor: "#2d1f0e" }}
                >
                  <span
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] text-[#c8921a]/10 select-none"
                    style={{ fontFamily: "serif" }}
                  >
                    {miembro.rune}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a1510] to-transparent" />
                  <div className="relative z-10">
                    <span
                      className="text-[#c8921a] text-4xl font-black leading-none block"
                      style={{ fontFamily: "var(--font-cinzel-decorative)" }}
                    >
                      {miembro.años}
                    </span>
                    <span
                      className="text-[#b8a882]/50 text-[9px] tracking-widest uppercase"
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      años de oficio
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <p
                    className="text-[#c8921a] text-[9px] tracking-widest uppercase mb-1"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {miembro.cargo}
                  </p>
                  <h3
                    className="text-[#f0e6c8] text-lg font-bold mb-3"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {miembro.nombre}
                  </h3>
                  <p
                    className="text-[#b8a882]/60 text-sm leading-relaxed italic mb-4"
                    style={{ fontFamily: "var(--font-im-fell)" }}
                  >
                    {miembro.bio}
                  </p>
                  <p
                    className="text-[#c8921a]/60 text-[9px] tracking-wider uppercase border-t border-[#5c3a1e]/40 pt-4"
                    style={{ fontFamily: "var(--font-cinzel)" }}
                  >
                    {miembro.especialidad}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA final */}
        <div className="text-center mt-20 pt-16 border-t border-[#5c3a1e]/40">
          <p
            className="text-[#b8a882] italic text-lg mb-8"
            style={{ fontFamily: "var(--font-im-fell)" }}
          >
            Ahora que nos conoces, ven a conocernos en persona.
          </p>
          <Link
            href="/reservar"
            className="btn-glow bg-[#c8921a] text-[#0f0d0a] hover:bg-[#e8b84b] px-12 py-4 text-xs tracking-[0.4em] uppercase font-bold"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Reservar Mi Servicio
          </Link>
        </div>
      </div>
    </div>
  );
}
