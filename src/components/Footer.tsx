export default function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-[#5c3a1e]/40" style={{ backgroundColor: "#0f0d0a" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8921a]/60 to-transparent" />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div>
          <h3 className="text-[#c8921a] text-xl font-black tracking-[0.2em]" style={{ fontFamily: "var(--font-cinzel-decorative)" }}>
            BarberOS
          </h3>
          <p className="text-[#b8a882]/40 text-[9px] tracking-[0.5em] uppercase mt-1" style={{ fontFamily: "var(--font-barlow)" }}>
            by Narvek System
          </p>
        </div>

        {/* Lema */}
        <p className="text-[#b8a882]/30 text-xs italic text-center" style={{ fontFamily: "var(--font-lato)" }}>
          Honor · Fuerza · Oficio
        </p>

        {/* Links */}
        <div className="flex items-center gap-6">
          <a href="/reservar" className="text-[#b8a882]/30 hover:text-[#c8921a]/60 text-[9px] tracking-[0.3em] uppercase transition-colors" style={{ fontFamily: "var(--font-barlow)" }}>
            Reservar
          </a>
          <a href="/login" className="text-[#b8a882]/30 hover:text-[#c8921a]/60 text-[9px] tracking-[0.35em] uppercase transition-colors" style={{ fontFamily: "var(--font-barlow)" }}>
            Acceso
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[#5c3a1e]/20 text-center">
        <p className="text-[#b8a882]/20 text-[9px] tracking-widest uppercase" style={{ fontFamily: "var(--font-barlow)" }}>
          © {new Date().getFullYear()} BarberOS by Narvek System — narveksystem@gmail.com
        </p>
      </div>
    </footer>
  );
}
