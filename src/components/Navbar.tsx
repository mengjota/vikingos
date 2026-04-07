"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Vikingos Barberia", href: "#el-gremio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Reservar", href: "/reservar" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0f0d0a]/95 backdrop-blur-sm border-b border-[#c8921a]/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex flex-col leading-none">
          <span
            className="text-[#c8921a] text-2xl font-black tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-cinzel-decorative)" }}
          >
            INVICTUS
          </span>
          <span
            className="text-[#b8a882] text-[9px] tracking-[0.5em] uppercase"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Barberia
          </span>
        </a>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-[#b8a882] hover:text-[#c8921a] text-xs tracking-[0.3em] uppercase transition-colors duration-300"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA desktop */}
        <a
          href="/reservar"
          className="hidden md:block border border-[#c8921a] text-[#c8921a] hover:bg-[#c8921a] hover:text-[#0f0d0a] text-xs tracking-[0.3em] uppercase px-6 py-3 transition-all duration-300"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Reservar Servicio
        </a>

        {/* Menú hamburguesa mobile */}
        <button
          className="md:hidden text-[#c8921a] flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className={`block w-6 h-0.5 bg-current transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-current transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Menú mobile */}
      {menuOpen && (
        <div className="md:hidden bg-[#0f0d0a]/98 border-t border-[#c8921a]/20 px-6 py-6 flex flex-col gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-[#b8a882] hover:text-[#c8921a] text-sm tracking-[0.3em] uppercase transition-colors"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/reservar"
            onClick={() => setMenuOpen(false)}
            className="border border-[#c8921a] text-[#c8921a] text-xs tracking-[0.3em] uppercase px-6 py-3 text-center"
            style={{ fontFamily: "var(--font-cinzel)" }}
          >
            Reservar Servicio
          </a>
        </div>
      )}
    </nav>
  );
}
