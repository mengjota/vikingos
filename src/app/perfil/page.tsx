"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSession, logout, getReservations, type Session, type Reservation } from "@/lib/auth";

export default function PerfilPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [reservas, setReservas] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.push("/login");
      return;
    }
    setSession(s);
    getReservations(s.email).then(setReservas).finally(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#080604" }}>
        <div className="text-[#c8921a] text-sm tracking-[0.4em] uppercase" style={{ fontFamily: "var(--font-barlow)" }}>
          Cargando...
        </div>
      </div>
    );
  }

  const inicial = session!.name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen relative overflow-hidden px-4" style={{ backgroundColor: "#080604", paddingTop: "100px", paddingBottom: "80px" }}>
      {/* Fondo glow */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 20%, rgba(200,146,26,0.12) 0%, transparent 70%)" }} />

      <div style={{ maxWidth: "760px", width: "100%", margin: "0 auto" }}>

        {/* Encabezado */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/"
            className="text-[#7a6a50] hover:text-[#c8921a] text-xs tracking-[0.4em] uppercase transition-colors"
            style={{ fontFamily: "var(--font-barlow)" }}>
            ← Inicio
          </Link>
          <button onClick={handleLogout}
            className="text-[#7a6a50] hover:text-red-400 text-xs tracking-[0.4em] uppercase transition-colors"
            style={{ fontFamily: "var(--font-barlow)" }}>
            Cerrar Sesión
          </button>
        </div>

        {/* Perfil hero */}
        <div className="text-center mb-14">
          {/* Avatar con inicial */}
          <div
            className="w-24 h-24 mx-auto mb-6 flex items-center justify-center border-2 border-[#c8921a]/60"
            style={{
              background: "linear-gradient(135deg, #1a1208, #2a1d0e)",
              boxShadow: "0 0 40px rgba(200,146,26,0.3), 0 0 80px rgba(200,146,26,0.1)",
              fontFamily: "var(--font-cinzel-decorative)",
              fontSize: "2.5rem",
              color: "#c8921a",
            }}
          >
            {inicial}
          </div>

          <h1
            className="text-[#f0e6c8] font-black mb-2"
            style={{
              fontFamily: "var(--font-cinzel-decorative)",
              fontSize: "clamp(1.8rem, 5vw, 2.8rem)",
              textShadow: "0 0 40px rgba(200,146,26,0.4)",
            }}
          >
            {session!.name}
          </h1>
          <p className="text-[#b8a882]/60 text-sm tracking-[0.3em] uppercase"
            style={{ fontFamily: "var(--font-barlow)" }}>
            {session!.email}
          </p>

          <div className="flex items-center justify-center gap-4 mt-5">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c8921a]/60" />
            <span className="text-[#c8921a]">᛭</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c8921a]/60" />
          </div>
        </div>

        {/* Tarjeta de info + acción rápida */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          <div className="border border-[#5c3a1e]/40 p-6"
            style={{ backgroundColor: "#0e0b07", boxShadow: "0 0 30px rgba(200,146,26,0.04)" }}>
            <p className="text-[#c8921a]/70 text-xs tracking-[0.4em] uppercase mb-2" style={{ fontFamily: "var(--font-barlow)" }}>
              Miembro
            </p>
            <p className="text-[#f0e6c8] text-lg font-semibold" style={{ fontFamily: "var(--font-barlow)" }}>
              El Gremio Invictus
            </p>
          </div>
          <div className="border border-[#5c3a1e]/40 p-6"
            style={{ backgroundColor: "#0e0b07", boxShadow: "0 0 30px rgba(200,146,26,0.04)" }}>
            <p className="text-[#c8921a]/70 text-xs tracking-[0.4em] uppercase mb-2" style={{ fontFamily: "var(--font-barlow)" }}>
              Reservas realizadas
            </p>
            <p className="text-[#f0e6c8] text-lg font-semibold" style={{ fontFamily: "var(--font-barlow)" }}>
              {reservas.length} {reservas.length === 1 ? "cita" : "citas"}
            </p>
          </div>
        </div>

        {/* Botón nueva reserva */}
        <div className="mb-12">
          <Link
            href="/reservar"
            className="w-full block text-center py-5 uppercase font-black tracking-[0.5em] transition-all duration-300 hover:scale-[1.01]"
            style={{
              fontFamily: "var(--font-barlow)",
              fontSize: "0.95rem",
              background: "linear-gradient(135deg, #a06010 0%, #c8921a 35%, #f0c040 60%, #c8921a 80%, #a06010 100%)",
              color: "#080604",
              boxShadow: "0 0 30px rgba(200,146,26,0.4), 0 0 60px rgba(200,146,26,0.15)",
            }}
          >
            + Nueva Reserva
          </Link>
        </div>

        {/* Historial de reservas */}
        <div>
          <h2
            className="text-[#f0e6c8] text-xl font-black tracking-[0.2em] uppercase mb-6"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            Mis Citas
          </h2>

          {reservas.length === 0 ? (
            <div
              className="border border-[#5c3a1e]/30 p-10 text-center"
              style={{ backgroundColor: "#0e0b07" }}
            >
              <p className="text-[#b8a882]/40 text-sm tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-barlow)" }}>
                Aún no tienes citas agendadas
              </p>
              <p className="text-[#7a6a50] text-xs mt-2" style={{ fontFamily: "var(--font-barlow)" }}>
                Reserva tu primera cita y aparecerá aquí
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservas.map((r) => (
                <div
                  key={r.id}
                  className="border border-[#5c3a1e]/40 p-6 relative overflow-hidden"
                  style={{ backgroundColor: "#0e0b07", boxShadow: "0 0 20px rgba(200,146,26,0.03)" }}
                >
                  {/* Acento superior */}
                  <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: "linear-gradient(to right, transparent, rgba(200,146,26,0.5) 40%, transparent)" }} />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p
                        className="text-[#c8921a] font-bold text-base mb-1"
                        style={{ fontFamily: "var(--font-barlow)" }}
                      >
                        {r.servicio}
                      </p>
                      <p className="text-[#b8a882]/70 text-sm" style={{ fontFamily: "var(--font-barlow)" }}>
                        {r.barbero} · {r.fecha} a las {r.hora}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-[#f0c040] font-black text-lg"
                        style={{ fontFamily: "var(--font-barlow)" }}
                      >
                        {r.precio}
                      </p>
                      <p className="text-[#7a6a50] text-xs" style={{ fontFamily: "var(--font-barlow)" }}>
                        Reservada el {r.creadaEl}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
