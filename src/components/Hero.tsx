"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  // Efecto parallax suave en el scroll
  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Fondo con parallax */}
      <div
        ref={bgRef}
        className="absolute inset-0 scale-110"
        style={{
          background: `
            linear-gradient(to bottom, rgba(15,13,10,0.3) 0%, rgba(15,13,10,0.7) 60%, rgba(15,13,10,1) 100%),
            radial-gradient(ellipse at 50% 40%, #2d1f0e 0%, #0f0d0a 70%)
          `,
        }}
      />

      {/* Patrón rúnico de fondo */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c8921a' fill-opacity='1'%3E%3Cpath d='M40 0 L40 80 M0 40 L80 40 M10 10 L70 70 M70 10 L10 70' stroke='%23c8921a' stroke-width='0.5' fill='none'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Líneas decorativas laterales */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-32 bg-gradient-to-b from-transparent to-[#c8921a]" />
        <span
          className="text-[#c8921a]/50 text-[10px] tracking-[0.4em] uppercase rotate-90 whitespace-nowrap"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Est. MMXXV
        </span>
        <div className="w-px h-32 bg-gradient-to-t from-transparent to-[#c8921a]" />
      </div>

      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-32 bg-gradient-to-b from-transparent to-[#c8921a]" />
        <span
          className="text-[#c8921a]/50 text-[10px] tracking-[0.4em] uppercase -rotate-90 whitespace-nowrap"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Honor · Fuerza · Oficio
        </span>
        <div className="w-px h-32 bg-gradient-to-t from-transparent to-[#c8921a]" />
      </div>

      {/* Contenido central */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Símbolo vikingo superior */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-[#c8921a]/60" />
          <span className="text-[#c8921a] text-2xl">᛭</span>
          <div className="h-px w-16 bg-[#c8921a]/60" />
        </div>

        {/* Subtítulo superior */}
        <p
          className="text-[#c8921a] text-xs tracking-[0.6em] uppercase mb-4"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Barbería Artesanal
        </p>

        {/* Título principal */}
        <h1
          className="text-[#f0e6c8] text-7xl md:text-9xl font-black leading-none mb-6 tracking-tight"
          style={{ fontFamily: "var(--font-cinzel-decorative)" }}
        >
          INVICTUS
        </h1>

        {/* Lema */}
        <p
          className="text-[#b8a882] text-xl md:text-2xl italic mb-10 leading-relaxed"
          style={{ fontFamily: "var(--font-im-fell)" }}
        >
          &ldquo;Donde el acero se afila con honor<br />
          y el oficio se lleva en la sangre.&rdquo;
        </p>

        {/* Separador */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#c8921a]" />
          <span className="text-[#c8921a] text-lg">ᚢ</span>
          <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#c8921a]" />
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/reservar"
            className="bg-[#c8921a] text-[#0f0d0a] hover:bg-[#e8b84b] px-10 py-4 text-xs tracking-[0.4em] uppercase font-bold transition-all duration-300 hover:shadow-[0_0_30px_rgba(200,146,26,0.4)]"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Reservar Servicio
          </a>
          <a
            href="/nosotros"
            className="border border-[#c8921a]/50 text-[#c8921a] hover:border-[#c8921a] px-10 py-4 text-xs tracking-[0.4em] uppercase transition-all duration-300"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Nosotros Invictus
          </a>
        </div>
      </div>

      {/* Flecha de scroll */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span
          className="text-[#c8921a]/50 text-[9px] tracking-[0.4em] uppercase"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Descender
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-[#c8921a]/50 to-transparent" />
      </div>
    </section>
  );
}
