"use client";

import { useState } from "react";
import Link from "next/link";

const servicios = [
  { id: 1, nombre: "Corte del Guerrero", descripcion: "Corte clásico con tijera y máquina. Lavado y secado incluidos.", precio: "Q80", duracion: "45 min", icono: "ᚱ" },
  { id: 2, nombre: "Ritual de Navaja", descripcion: "Afeitado completo con navaja recta, toalla caliente y bálsamo.", precio: "Q120", duracion: "60 min", icono: "ᛉ", popular: true },
  { id: 3, nombre: "Corte & Barba", descripcion: "La combinación completa. Corte de cabello más escultura de barba.", precio: "Q150", duracion: "75 min", icono: "ᛊ" },
  { id: 4, nombre: "La Barba del Norte", descripcion: "Tratamiento completo de barba: lavado, acondicionado y aceite vikingo.", precio: "Q100", duracion: "45 min", icono: "ᚾ" },
  { id: 5, nombre: "Corte de Niño Guerrero", descripcion: "Para los pequeños valientes. Corte suave y paciencia garantizada.", precio: "Q60", duracion: "30 min", icono: "ᚲ" },
  { id: 6, nombre: "El Paquete del Jarl", descripcion: "Corte, navaja completa, tratamiento de barba y aceite premium.", precio: "Q220", duracion: "120 min", icono: "ᚷ" },
];

const barberos = [
  { id: 0, name: "Sin preferencia", specialty: "Cualquier maestro disponible", rune: "᛭" },
  { id: 1, name: "Björn el Anciano", specialty: "Navaja Clásica", rune: "ᚠ" },
  { id: 2, name: "Erik Manos de Hierro", specialty: "Degradados y Líneas", rune: "ᚢ" },
  { id: 3, name: "Ragnar el Joven", specialty: "Estilo Moderno", rune: "ᚦ" },
];

const horas = ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function ReservarPage() {
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [servicioId, setServicioId] = useState<number | null>(null);
  const [barberoId, setBarberoId] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  const servicio = servicios.find((s) => s.id === servicioId);
  const barbero = barberos.find((b) => b.id === barberoId);

  if (confirmado) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "#0f0d0a" }}>
        <div className="text-center max-w-lg">
          <span className="text-[#c8921a] text-7xl block mb-6">ᚢ</span>
          <h2
            className="text-[#f0e6c8] text-4xl font-black mb-4"
            style={{ fontFamily: "var(--font-cinzel-decorative)" }}
          >
            ¡Pacto Sellado!
          </h2>
          <p className="text-[#b8a882] italic text-lg mb-8" style={{ fontFamily: "var(--font-im-fell)" }}>
            Tu silla en Invictus Barberia te espera.
          </p>
          <div className="border border-[#c8921a]/40 p-8 text-left space-y-4 mb-8" style={{ backgroundColor: "#1a1510" }}>
            <Row label="Servicio" value={`${servicio?.nombre} — ${servicio?.precio}`} />
            <Row label="Maestro" value={barbero?.name ?? ""} />
            <Row label="Fecha" value={`${fecha} a las ${hora}`} />
            <Row label="Nombre" value={nombre} />
            <Row label="Teléfono" value={telefono} />
          </div>
          <p className="text-[#b8a882]/40 text-xs mb-6" style={{ fontFamily: "var(--font-cinzel)" }}>
            Te contactaremos para confirmar tu cita.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setConfirmado(false); setPaso(1); setServicioId(null); setBarberoId(null); setFecha(""); setHora(""); setNombre(""); setTelefono(""); }}
              className="border border-[#c8921a]/50 text-[#c8921a] text-xs tracking-widest uppercase px-8 py-3 hover:bg-[#c8921a] hover:text-[#0f0d0a] transition-all"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Nueva Reserva
            </button>
            <Link
              href="/"
              className="border border-[#5c3a1e] text-[#b8a882] text-xs tracking-widest uppercase px-8 py-3 hover:border-[#c8921a]/50 transition-all"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0f0d0a" }}>
      {/* Header de la página */}
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
            Reservar Servicio
          </h1>
          <div className="w-20" />
        </div>
      </div>

      {/* Indicador de pasos */}
      <div className="border-b border-[#5c3a1e]/30 px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-0">
          {[
            { num: 1, label: "Elige Servicio" },
            { num: 2, label: "Elige Maestro" },
            { num: 3, label: "Fecha & Confirmar" },
          ].map((p, i) => (
            <div key={p.num} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 flex items-center justify-center border-2 text-sm font-bold transition-all duration-300 ${
                    paso === p.num ? "border-[#c8921a] bg-[#c8921a] text-[#0f0d0a]"
                    : paso > p.num ? "border-[#c8921a] text-[#c8921a]"
                    : "border-[#5c3a1e] text-[#5c3a1e]"
                  }`}
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {p.num}
                </div>
                <span
                  className={`text-[9px] tracking-widest uppercase whitespace-nowrap ${paso >= p.num ? "text-[#c8921a]" : "text-[#5c3a1e]"}`}
                  style={{ fontFamily: "var(--font-cinzel)" }}
                >
                  {p.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-16 md:w-28 h-px mb-5 mx-2 transition-colors duration-300 ${paso > p.num ? "bg-[#c8921a]" : "bg-[#5c3a1e]"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* PASO 1 — Servicios */}
        {paso === 1 && (
          <div>
            <p className="text-[#b8a882]/60 text-center text-sm italic mb-10" style={{ fontFamily: "var(--font-im-fell)" }}>
              Elige el rito que deseas recibir hoy.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {servicios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setServicioId(s.id)}
                  className={`relative p-6 border text-left transition-all duration-300 group ${
                    servicioId === s.id
                      ? "border-[#c8921a] bg-[#2d1f0e]"
                      : "border-[#5c3a1e]/50 hover:border-[#c8921a]/50 bg-[#1a1510]"
                  }`}
                >
                  {s.popular && (
                    <span className="absolute -top-3 left-4 bg-[#c8921a] text-[#0f0d0a] text-[9px] tracking-widest uppercase px-3 py-0.5 font-bold" style={{ fontFamily: "var(--font-cinzel)" }}>
                      El Más Pedido
                    </span>
                  )}
                  {/* Check de selección */}
                  {servicioId === s.id && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-[#c8921a] flex items-center justify-center">
                      <span className="text-[#0f0d0a] text-xs font-black">✓</span>
                    </div>
                  )}
                  <span className={`text-3xl block mb-3 ${servicioId === s.id ? "text-[#c8921a]" : "text-[#c8921a]/40 group-hover:text-[#c8921a]/70"} transition-colors`}>
                    {s.icono}
                  </span>
                  <h3 className="text-[#f0e6c8] text-sm font-bold mb-1" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {s.nombre}
                  </h3>
                  <p className="text-[#b8a882]/60 text-xs italic leading-relaxed mb-4" style={{ fontFamily: "var(--font-im-fell)" }}>
                    {s.descripcion}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-[#5c3a1e]/40">
                    <span className="text-[#c8921a] font-black text-lg" style={{ fontFamily: "var(--font-cinzel-decorative)" }}>
                      {s.precio}
                    </span>
                    <span className="text-[#b8a882]/40 text-[9px] uppercase tracking-widest" style={{ fontFamily: "var(--font-cinzel)" }}>
                      {s.duracion}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => servicioId && setPaso(2)}
                disabled={!servicioId}
                className="bg-[#c8921a] text-[#0f0d0a] px-12 py-4 text-xs tracking-widest uppercase font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e8b84b] transition-all duration-300"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* PASO 2 — Barbero */}
        {paso === 2 && (
          <div>
            <p className="text-[#b8a882]/60 text-center text-sm italic mb-10" style={{ fontFamily: "var(--font-im-fell)" }}>
              Elige tu maestro o deja que el destino decida.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {barberos.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBarberoId(b.id)}
                  className={`p-6 border text-center transition-all duration-300 ${
                    barberoId === b.id
                      ? "border-[#c8921a] bg-[#2d1f0e]"
                      : "border-[#5c3a1e]/50 hover:border-[#c8921a]/50 bg-[#1a1510]"
                  }`}
                >
                  <span className={`text-4xl block mb-3 ${barberoId === b.id ? "text-[#c8921a]" : "text-[#5c3a1e]"} transition-colors`}>
                    {b.rune}
                  </span>
                  <p className="text-[#f0e6c8] text-sm font-bold mb-1" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {b.name}
                  </p>
                  <p className="text-[#b8a882]/50 text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-cinzel)" }}>
                    {b.specialty}
                  </p>
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button onClick={() => setPaso(1)} className="border border-[#5c3a1e] text-[#b8a882] px-8 py-3 text-xs tracking-widest uppercase hover:border-[#c8921a]/50 transition-all" style={{ fontFamily: "var(--font-cinzel)" }}>
                ← Atrás
              </button>
              <button
                onClick={() => barberoId !== null && setPaso(3)}
                disabled={barberoId === null}
                className="bg-[#c8921a] text-[#0f0d0a] px-12 py-4 text-xs tracking-widest uppercase font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e8b84b] transition-all"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* PASO 3 — Fecha y confirmación */}
        {paso === 3 && (
          <div>
            {/* Resumen */}
            <div className="border border-[#5c3a1e]/50 p-5 mb-8 flex flex-wrap gap-6" style={{ backgroundColor: "#1a1510" }}>
              <div>
                <span className="text-[#c8921a] text-[9px] uppercase tracking-widest block mb-1" style={{ fontFamily: "var(--font-cinzel)" }}>Servicio</span>
                <span className="text-[#f0e6c8] text-sm" style={{ fontFamily: "var(--font-cinzel)" }}>{servicio?.nombre} — {servicio?.precio}</span>
              </div>
              <div>
                <span className="text-[#c8921a] text-[9px] uppercase tracking-widest block mb-1" style={{ fontFamily: "var(--font-cinzel)" }}>Maestro</span>
                <span className="text-[#f0e6c8] text-sm" style={{ fontFamily: "var(--font-cinzel)" }}>{barbero?.name}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-[#1a1510] border border-[#5c3a1e] text-[#f0e6c8] px-4 py-3 focus:border-[#c8921a] focus:outline-none transition-colors"
                  style={{ fontFamily: "var(--font-cinzel)", colorScheme: "dark" }}
                />
              </div>
              <div>
                <label className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>Hora</label>
                <div className="grid grid-cols-3 gap-2">
                  {horas.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHora(h)}
                      className={`py-2 text-xs border transition-all duration-200 ${hora === h ? "border-[#c8921a] bg-[#c8921a] text-[#0f0d0a] font-bold" : "border-[#5c3a1e] text-[#b8a882] hover:border-[#c8921a]/50"}`}
                      style={{ fontFamily: "var(--font-cinzel)" }}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>Tu Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre del guerrero"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-[#1a1510] border border-[#5c3a1e] text-[#f0e6c8] px-4 py-3 focus:border-[#c8921a] focus:outline-none transition-colors placeholder:text-[#5c3a1e]"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                />
              </div>
              <div>
                <label className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2" style={{ fontFamily: "var(--font-cinzel)" }}>Teléfono</label>
                <input
                  type="tel"
                  placeholder="Número de contacto"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-[#1a1510] border border-[#5c3a1e] text-[#f0e6c8] px-4 py-3 focus:border-[#c8921a] focus:outline-none transition-colors placeholder:text-[#5c3a1e]"
                  style={{ fontFamily: "var(--font-cinzel)" }}
                />
              </div>
            </div>

            <p className="text-[#b8a882]/40 text-xs text-center italic mb-8" style={{ fontFamily: "var(--font-im-fell)" }}>
              Sin registro. Sin contraseña. Solo tu nombre y número.
            </p>

            <div className="flex justify-between">
              <button onClick={() => setPaso(2)} className="border border-[#5c3a1e] text-[#b8a882] px-8 py-3 text-xs tracking-widest uppercase hover:border-[#c8921a]/50 transition-all" style={{ fontFamily: "var(--font-cinzel)" }}>
                ← Atrás
              </button>
              <button
                onClick={() => { if (fecha && hora && nombre && telefono) setConfirmado(true); }}
                disabled={!fecha || !hora || !nombre || !telefono}
                className="bg-[#c8921a] text-[#0f0d0a] px-12 py-4 text-xs tracking-widest uppercase font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e8b84b] transition-all hover:shadow-[0_0_20px_rgba(200,146,26,0.4)]"
                style={{ fontFamily: "var(--font-cinzel)" }}
              >
                Sellar el Pacto ᚢ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[#c8921a] text-[9px] uppercase tracking-widest block mb-0.5" style={{ fontFamily: "var(--font-cinzel)" }}>{label}</span>
      <span className="text-[#f0e6c8] text-sm" style={{ fontFamily: "var(--font-cinzel)" }}>{value}</span>
    </div>
  );
}
