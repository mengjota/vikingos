"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout, type Session } from "@/lib/auth";

const navLinks = [
  { label: "Nosotros Invictus", href: "/nosotros" },
  { label: "Servicios", href: "/servicios" },
  { label: "Productos", href: "/productos" },
];

export default function Navbar({ transparentOnTop = false }: { transparentOnTop?: boolean }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setSession(getSession());
  }, []);

  function handleLogout() {
    logout();
    setSession(null);
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !transparentOnTop
          ? "bg-[#0f0d0a]/95 backdrop-blur-sm border-b border-[#c8921a]/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <a href="/"
          className="flex flex-col leading-none transition-all duration-500"
          style={{ opacity: transparentOnTop && !scrolled ? 0 : 1, pointerEvents: transparentOnTop && !scrolled ? "none" : "auto" }}
        >
          <span
            className="text-[#c8921a] text-3xl font-black tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-cinzel-decorative)" }}
          >
            INVICTUS
          </span>
          <span
            className="text-[#b8a882] text-[10px] tracking-[0.5em] uppercase"
            style={{ fontFamily: "var(--font-barlow)" }}
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
                className="text-[#b8a882] hover:text-[#c8921a] text-sm tracking-[0.3em] uppercase transition-colors duration-300"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTAs desktop */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            /* --- LOGUEADO --- */
            <>
              <a
                href={session.email === "admin@invictus.com" ? "/admin/dashboard" : "/perfil"}
                className="flex items-center gap-2 text-[#c8921a] hover:text-[#f0c040] text-sm tracking-[0.2em] uppercase transition-colors duration-300 px-3 py-2"
                style={{ fontFamily: "var(--font-barlow)", fontWeight: 600 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {session.email === "admin@invictus.com" ? "Panel Admin" : session.name.split(" ")[0]}
              </a>
              <button
                onClick={handleLogout}
                className="text-[#b8a882]/60 hover:text-red-400 text-xs tracking-[0.3em] uppercase transition-colors duration-300 px-2 py-2"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                Salir
              </button>
            </>
          ) : (
            /* --- NO LOGUEADO --- */
            <a
              href="/login"
              className="flex items-center gap-2 text-[#b8a882] hover:text-[#c8921a] text-sm tracking-[0.3em] uppercase transition-colors duration-300 px-3 py-3"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3" />
              </svg>
              Iniciar Sesión
            </a>
          )}
          <a
            href="/reservar"
            className="btn-glow border border-[#c8921a] text-[#c8921a] hover:bg-[#c8921a] hover:text-[#0f0d0a] text-sm tracking-[0.3em] uppercase px-6 py-3 transition-colors duration-300"
            style={{
              fontFamily: "var(--font-barlow)",
              boxShadow: "0 0 10px rgba(200,146,26,0.45), 0 0 24px rgba(200,146,26,0.15), 0 4px 12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(200,146,26,0.18)",
            }}
          >
            Reservar Servicio
          </a>
        </div>

        {/* Hamburguesa mobile */}
        <button
          className="md:hidden text-[#c8921a] flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
        >
          <span className={`block w-7 h-0.5 bg-current transition-transform duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-7 h-0.5 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-7 h-0.5 bg-current transition-transform duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
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
              className="text-[#b8a882] hover:text-[#c8921a] text-base tracking-[0.3em] uppercase transition-colors"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              {link.label}
            </a>
          ))}

          {session ? (
            <>
              <a
                href={session.email === "admin@invictus.com" ? "/admin/dashboard" : "/perfil"}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-[#c8921a] text-base tracking-[0.3em] uppercase"
                style={{ fontFamily: "var(--font-barlow)", fontWeight: 600 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {session.email === "admin@invictus.com" ? "Panel Admin" : `Mi Cuenta — ${session.name.split(" ")[0]}`}
              </a>
              <button
                onClick={handleLogout}
                className="text-left text-red-400/70 text-base tracking-[0.3em] uppercase transition-colors"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <a
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 text-[#b8a882] hover:text-[#c8921a] text-base tracking-[0.3em] uppercase transition-colors"
              style={{ fontFamily: "var(--font-barlow)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3" />
              </svg>
              Iniciar Sesión
            </a>
          )}

          <a
            href="/reservar"
            onClick={() => setMenuOpen(false)}
            className="border border-[#c8921a] text-[#c8921a] text-sm tracking-[0.3em] uppercase px-6 py-3 text-center"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            Reservar Servicio
          </a>
        </div>
      )}
    </nav>
  );
}
