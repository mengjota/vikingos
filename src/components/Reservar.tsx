"use client";

import { useState } from "react";

const barberos = [
  { id: 1, name: "Björn el Anciano", specialty: "Navaja Clásica", rune: "ᚠ" },
  { id: 2, name: "Erik Manos de Hierro", specialty: "Degradados", rune: "ᚢ" },
  { id: 3, name: "Ragnar el Joven", specialty: "Estilo Moderno", rune: "ᚦ" },
];

const serviciosList = [
  { id: 1, nombre: "Corte del Guerrero", precio: "Q80", duracion: "45 min" },
  { id: 2, nombre: "Ritual de Navaja", precio: "Q120", duracion: "60 min" },
  { id: 3, nombre: "Corte & Barba", precio: "Q150", duracion: "75 min" },
  { id: 4, nombre: "La Barba del Norte", precio: "Q100", duracion: "45 min" },
  { id: 5, nombre: "Corte de Niño Guerrero", precio: "Q60", duracion: "30 min" },
  { id: 6, nombre: "El Paquete del Jarl", precio: "Q220", duracion: "120 min" },
];

const horasDisponibles = [
  "08:00", "09:00", "10:00", "11:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
];

type Paso = 1 | 2 | 3;

export default function Reservar() {
  const [paso, setPaso] = useState<Paso>(1);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState<number | null>(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<number | null>(null);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [confirmado, setConfirmado] = useState(false);

  const puedeAvanzarPaso1 = barberoSeleccionado !== null;
  const puedeAvanzarPaso2 = servicioSeleccionado !== null;
  const puedeConfirmar = fecha && hora && nombre && telefono;

  function confirmar() {
    if (puedeConfirmar) setConfirmado(true);
  }

  const pasos = [
    { num: 1, label: "Elige tu Maestro" },
    { num: 2, label: "Elige el Rito" },
    { num: 3, label: "Sella el Pacto" },
  ];

  if (confirmado) {
    const barbero = barberos.find((b) => b.id === barberoSeleccionado);
    const servicio = serviciosList.find((s) => s.id === servicioSeleccionado);
    return (
      <section id="reservar" className="py-28 px-6" style={{ backgroundColor: "#0f0d0a" }}>
        <div className="max-w-xl mx-auto text-center">
          <span className="text-[#c8921a] text-6xl block mb-6">ᚢ</span>
          <h3
            className="text-[#f0e6c8] text-3xl font-black mb-4"
            style={{ fontFamily: "var(--font-cinzel-decorative)" }}
          >
            ¡El Pacto está Sellado!
          </h3>
          <p
            className="text-[#b8a882] italic text-lg mb-8"
            style={{ fontFamily: "var(--font-lato)" }}
          >
            Tu silla te espera, guerrero.
          </p>
          <div className="border border-[#c8921a]/40 p-8 text-left space-y-3" style={{ backgroundColor: "#1a1510" }}>
            <p className="text-[#b8a882] text-sm" style={{ fontFamily: "var(--font-barlow)" }}>
              <span className="text-[#c8921a]">Maestro:</span> {barbero?.name}
            </p>
            <p className="text-[#b8a882] text-sm" style={{ fontFamily: "var(--font-barlow)" }}>
              <span className="text-[#c8921a]">Servicio:</span> {servicio?.nombre} — {servicio?.precio}
            </p>
            <p className="text-[#b8a882] text-sm" style={{ fontFamily: "var(--font-barlow)" }}>
              <span className="text-[#c8921a]">Fecha:</span> {fecha} a las {hora}
            </p>
            <p className="text-[#b8a882] text-sm" style={{ fontFamily: "var(--font-barlow)" }}>
              <span className="text-[#c8921a]">Nombre:</span> {nombre}
            </p>
          </div>
          <p
            className="text-[#b8a882]/50 text-xs mt-6"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            Te contactaremos al {telefono} para confirmar.
          </p>
          <button
            onClick={() => {
              setConfirmado(false);
              setPaso(1);
              setBarberoSeleccionado(null);
              setServicioSeleccionado(null);
              setFecha(""); setHora(""); setNombre(""); setTelefono("");
            }}
            className="mt-8 border border-[#c8921a]/50 text-[#c8921a] text-xs tracking-widest uppercase px-8 py-3 hover:bg-[#c8921a] hover:text-[#0f0d0a] transition-all duration-300"
            style={{ fontFamily: "var(--font-barlow)" }}
          >
            Nueva Reserva
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="reservar"
      className="relative py-28 px-6 overflow-hidden"
      style={{ backgroundColor: "#0f0d0a" }}
    >
      {/* Encabezado */}
      <div className="text-center mb-16">
        <span
          className="text-[#c8921a] text-[10px] tracking-[0.6em] uppercase block mb-4"
          style={{ fontFamily: "var(--font-barlow)" }}
        >
          — Reclama tu lugar —
        </span>
        <h2
          className="text-[#f0e6c8] text-5xl md:text-7xl font-black leading-none mb-6"
          style={{ fontFamily: "var(--font-cinzel-decorative)" }}
        >
          Reservar Silla
        </h2>
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-[#c8921a]" />
          <span className="text-[#c8921a]">᛭</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-[#c8921a]" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Indicador de pasos */}
        <div className="flex items-center justify-center mb-12">
          {pasos.map((p, i) => (
            <div key={p.num} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 flex items-center justify-center border-2 transition-all duration-300 ${
                    paso === p.num
                      ? "border-[#c8921a] bg-[#c8921a] text-[#0f0d0a]"
                      : paso > p.num
                      ? "border-[#c8921a] bg-[#c8921a]/20 text-[#c8921a]"
                      : "border-[#5c3a1e] text-[#5c3a1e]"
                  }`}
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  <span className="text-sm font-bold">{p.num}</span>
                </div>
                <span
                  className={`text-[9px] tracking-widest uppercase whitespace-nowrap ${
                    paso >= p.num ? "text-[#c8921a]" : "text-[#5c3a1e]"
                  }`}
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  {p.label}
                </span>
              </div>
              {i < pasos.length - 1 && (
                <div
                  className={`w-16 md:w-24 h-px mx-3 mb-6 transition-colors duration-300 ${
                    paso > p.num ? "bg-[#c8921a]" : "bg-[#5c3a1e]"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* PASO 1: Elegir barbero */}
        {paso === 1 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {barberos.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBarberoSeleccionado(b.id)}
                  className={`p-6 border text-center transition-all duration-300 ${
                    barberoSeleccionado === b.id
                      ? "border-[#c8921a] bg-[#2d1f0e]"
                      : "border-[#5c3a1e]/50 hover:border-[#c8921a]/50"
                  }`}
                  style={{ backgroundColor: barberoSeleccionado === b.id ? "#2d1f0e" : "#1a1510" }}
                >
                  <span className="text-4xl block mb-3" style={{ color: barberoSeleccionado === b.id ? "#c8921a" : "#5c3a1e" }}>
                    {b.rune}
                  </span>
                  <p className="text-[#f0e6c8] text-sm font-bold mb-1" style={{ fontFamily: "var(--font-barlow)" }}>
                    {b.name}
                  </p>
                  <p className="text-[#b8a882]/60 text-[10px] uppercase tracking-widest" style={{ fontFamily: "var(--font-barlow)" }}>
                    {b.specialty}
                  </p>
                </button>
              ))}
            </div>
            <div className="text-right">
              <button
                onClick={() => puedeAvanzarPaso1 && setPaso(2)}
                disabled={!puedeAvanzarPaso1}
                className="bg-[#c8921a] text-[#0f0d0a] px-10 py-3 text-xs tracking-widest uppercase font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e8b84b] transition-all duration-300"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* PASO 2: Elegir servicio */}
        {paso === 2 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {serviciosList.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setServicioSeleccionado(s.id)}
                  className={`p-5 border text-left transition-all duration-300 ${
                    servicioSeleccionado === s.id
                      ? "border-[#c8921a] bg-[#2d1f0e]"
                      : "border-[#5c3a1e]/50 hover:border-[#c8921a]/50"
                  }`}
                  style={{ backgroundColor: servicioSeleccionado === s.id ? "#2d1f0e" : "#1a1510" }}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-[#f0e6c8] text-sm font-bold" style={{ fontFamily: "var(--font-barlow)" }}>
                      {s.nombre}
                    </p>
                    <span className="text-[#c8921a] font-black text-sm" style={{ fontFamily: "var(--font-cinzel-decorative)" }}>
                      {s.precio}
                    </span>
                  </div>
                  <p className="text-[#b8a882]/50 text-[10px] uppercase tracking-widest mt-1" style={{ fontFamily: "var(--font-barlow)" }}>
                    {s.duracion}
                  </p>
                </button>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setPaso(1)}
                className="border border-[#5c3a1e] text-[#b8a882] px-8 py-3 text-xs tracking-widest uppercase hover:border-[#c8921a]/50 transition-all duration-300"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                ← Atrás
              </button>
              <button
                onClick={() => puedeAvanzarPaso2 && setPaso(3)}
                disabled={!puedeAvanzarPaso2}
                className="bg-[#c8921a] text-[#0f0d0a] px-10 py-3 text-xs tracking-widest uppercase font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e8b84b] transition-all duration-300"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: Fecha, hora y datos */}
        {paso === 3 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Fecha */}
              <div>
                <label
                  className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  Fecha
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-[#1a1510] border border-[#5c3a1e] text-[#f0e6c8] px-4 py-3 focus:border-[#c8921a] focus:outline-none transition-colors"
                  style={{ fontFamily: "var(--font-barlow)", colorScheme: "dark" }}
                />
              </div>

              {/* Hora */}
              <div>
                <label
                  className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  Hora
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {horasDisponibles.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHora(h)}
                      className={`py-2 text-xs border transition-all duration-200 ${
                        hora === h
                          ? "border-[#c8921a] bg-[#c8921a] text-[#0f0d0a] font-bold"
                          : "border-[#5c3a1e] text-[#b8a882] hover:border-[#c8921a]/50"
                      }`}
                      style={{ fontFamily: "var(--font-barlow)" }}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nombre */}
              <div>
                <label
                  className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  Tu Nombre
                </label>
                <input
                  type="text"
                  placeholder="Nombre del guerrero"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-[#1a1510] border border-[#5c3a1e] text-[#f0e6c8] px-4 py-3 focus:border-[#c8921a] focus:outline-none transition-colors placeholder:text-[#5c3a1e]"
                  style={{ fontFamily: "var(--font-barlow)" }}
                />
              </div>

              {/* Teléfono */}
              <div>
                <label
                  className="text-[#c8921a] text-[10px] tracking-widest uppercase block mb-2"
                  style={{ fontFamily: "var(--font-barlow)" }}
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  placeholder="Número de contacto"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  className="w-full bg-[#1a1510] border border-[#5c3a1e] text-[#f0e6c8] px-4 py-3 focus:border-[#c8921a] focus:outline-none transition-colors placeholder:text-[#5c3a1e]"
                  style={{ fontFamily: "var(--font-barlow)" }}
                />
              </div>
            </div>

            <p
              className="text-[#b8a882]/40 text-xs mb-6 text-center italic"
              style={{ fontFamily: "var(--font-lato)" }}
            >
              Sin registro. Sin contraseña. Solo tu nombre y número.
            </p>

            <div className="flex justify-between">
              <button
                onClick={() => setPaso(2)}
                className="border border-[#5c3a1e] text-[#b8a882] px-8 py-3 text-xs tracking-widest uppercase hover:border-[#c8921a]/50 transition-all duration-300"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                ← Atrás
              </button>
              <button
                onClick={confirmar}
                disabled={!puedeConfirmar}
                className="bg-[#c8921a] text-[#0f0d0a] px-10 py-3 text-xs tracking-widest uppercase font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#e8b84b] transition-all duration-300 hover:shadow-[0_0_20px_rgba(200,146,26,0.4)]"
                style={{ fontFamily: "var(--font-barlow)" }}
              >
                Sellar el Pacto ᚢ
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
