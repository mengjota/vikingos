export default function Footer() {
  return (
    <footer
      className="relative py-16 px-6 border-t border-[#5c3a1e]/40"
      style={{ backgroundColor: "#0f0d0a" }}
    >
      {/* Línea dorada superior */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8921a]/60 to-transparent" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo y lema */}
          <div>
            <h3
              className="text-[#c8921a] text-2xl font-black tracking-[0.2em] mb-2"
              style={{ fontFamily: "var(--font-cinzel-decorative)" }}
            >
              BarberOS
            </h3>
            <p
              className="text-[#b8a882]/60 text-[9px] tracking-[0.5em] uppercase mb-4"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              by Narvek System
            </p>
            <p
              className="text-[#b8a882]/50 text-sm italic leading-relaxed"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              Donde el acero se afila con honor<br />
              y el oficio se lleva en la sangre.
            </p>
          </div>

          {/* Horarios */}
          <div>
            <h4
              className="text-[#c8921a] text-[10px] tracking-[0.4em] uppercase mb-5"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              Horario del Salón
            </h4>
            <div className="space-y-2">
              {[
                { dia: "Lunes – Viernes", hora: "08:00 – 19:00" },
                { dia: "Sábado", hora: "08:00 – 17:00" },
                { dia: "Domingo", hora: "Cerrado" },
              ].map((h) => (
                <div key={h.dia} className="flex justify-between">
                  <span className="text-[#b8a882]/60 text-xs" style={{ fontFamily: "var(--font-barlow)" }}>
                    {h.dia}
                  </span>
                  <span
                    className={`text-xs ${h.hora === "Cerrado" ? "text-[#8b1a1a]" : "text-[#c8921a]"}`}
                    style={{ fontFamily: "var(--font-barlow)" }}
                  >
                    {h.hora}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h4
              className="text-[#c8921a] text-[10px] tracking-[0.4em] uppercase mb-5"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              Ubicación
            </h4>
            <div className="space-y-3 text-[#b8a882]/60 text-sm" style={{ fontFamily: "var(--font-lato)" }}>
              <p>📍 Barcelona, España</p>
              <p>📞 +34 000 000 000</p>
              <p>📧 narveksystem@gmail.com</p>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-[#5c3a1e]/40" />
          <span className="text-[#c8921a]/40 text-sm">᛭</span>
          <div className="flex-1 h-px bg-[#5c3a1e]/40" />
        </div>

        {/* Pie */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-[#b8a882]/30 text-[10px] tracking-widest uppercase"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            © 2025 BarberOS by Narvek System
          </p>
          <div className="flex items-center gap-6">
            <p
              className="text-[#b8a882]/20 text-[10px] italic"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              Honor · Fuerza · Oficio
            </p>
            <a
              href="/login"
              className="text-[#b8a882]/20 hover:text-[#c8921a]/50 text-[9px] tracking-[0.35em] uppercase transition-colors duration-300"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              Acceso Empleados
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
