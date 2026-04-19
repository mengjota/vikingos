"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DemoPage() {
  const [seeded, setSeeded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seed-demo", { method: "POST" })
      .then(() => setSeeded(true))
      .catch(() => setSeeded(true))
      .finally(() => setLoading(false));
  }, []);

  const gold: React.CSSProperties = { color: "#c8921a" };

  return (
    <main style={{ backgroundColor: "#080604", minHeight: "100vh" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 25%, rgba(200,146,26,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* ── Hero ── */}
      <section style={{ textAlign: "center", padding: "140px 24px 80px", position: "relative" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.7em", textTransform: "uppercase", ...gold, marginBottom: "20px", opacity: 0.7 }}>
          — Demo Interactiva —
        </p>
        <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(2.4rem,8vw,5.5rem)", fontWeight: 900, color: "#f0e6c8", lineHeight: 1.05, marginBottom: "16px", textShadow: "0 0 80px rgba(200,146,26,0.25)" }}>
          BarberOS
        </h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", margin: "16px 0 24px" }}>
          <div style={{ height: "1px", width: "60px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.7))" }} />
          <span style={{ ...gold, fontSize: "1.3rem" }}>᛭</span>
          <div style={{ height: "1px", width: "60px", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.7))" }} />
        </div>
        <p style={{ fontFamily: "var(--font-lato)", fontSize: "clamp(0.95rem,2vw,1.15rem)", color: "rgba(184,168,138,0.6)", maxWidth: "520px", margin: "0 auto 12px", lineHeight: 1.8, fontStyle: "italic" }}>
          Esto es exactamente lo que tendría tu barbería — pruébalo tú mismo.
        </p>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", ...gold, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "0" }}>
          Viking Barbers BCN · Barbería de demostración
        </p>
      </section>

      {/* ── Cards ── */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>

        {/* Card Cliente */}
        <div style={{ border: "1px solid rgba(200,146,26,0.3)", backgroundColor: "#0e0b07", padding: "36px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(to right, transparent, #c8921a, transparent)" }} />
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", ...gold, marginBottom: "16px", opacity: 0.7 }}>Vista del Cliente</p>
          <h2 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.6rem", color: "#f0e6c8", fontWeight: 900, marginBottom: "16px" }}>Reservar Cita</h2>
          <p style={{ fontFamily: "var(--font-lato)", fontSize: "0.88rem", color: "rgba(184,168,138,0.55)", lineHeight: 1.7, marginBottom: "28px" }}>
            Lo que ve el cliente cuando entra a tu web. Elige servicio, barbero, fecha y hora. Recibe confirmación por email al momento.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {["Reserva en menos de 2 minutos", "Sin registro ni contraseña", "Email de confirmación automático", "Recordatorio 24h antes", "Cancelación con un click"].map(item => (
              <li key={item} style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "rgba(184,168,138,0.6)", display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ ...gold }}>✓</span> {item}
              </li>
            ))}
          </ul>
          {loading ? (
            <div style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.3em", color: "rgba(184,168,138,0.3)", textAlign: "center", padding: "16px" }}>PREPARANDO DEMO...</div>
          ) : (
            <Link href="/reservar?barbershopId=demo"
              style={{ display: "block", textAlign: "center", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", color: "#080604", fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.4em", textTransform: "uppercase", padding: "16px 32px", textDecoration: "none", boxShadow: "0 0 30px rgba(200,146,26,0.4)" }}>
              Probar como Cliente →
            </Link>
          )}
        </div>

        {/* Card Admin */}
        <div style={{ border: "1px solid rgba(200,146,26,0.15)", backgroundColor: "#0e0b07", padding: "36px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.5), transparent)" }} />
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", ...gold, marginBottom: "16px", opacity: 0.7 }}>Vista del Dueño</p>
          <h2 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.6rem", color: "#f0e6c8", fontWeight: 900, marginBottom: "16px" }}>Panel de Control</h2>
          <p style={{ fontFamily: "var(--font-lato)", fontSize: "0.88rem", color: "rgba(184,168,138,0.55)", lineHeight: 1.7, marginBottom: "28px" }}>
            Lo que ves tú cada día. Gestiona reservas, empleados, servicios, caja e ingresos desde un panel limpio y rápido.
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {["Reservas en tiempo real", "Control de caja por empleado", "Gestión de horarios y servicios", "Fichajes del personal", "Notificaciones push de nuevas citas"].map(item => (
              <li key={item} style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "rgba(184,168,138,0.6)", display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ ...gold }}>✓</span> {item}
              </li>
            ))}
          </ul>

          {/* Credentials */}
          <div style={{ backgroundColor: "rgba(200,146,26,0.05)", border: "1px solid rgba(200,146,26,0.15)", padding: "14px 16px", marginBottom: "24px" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(200,146,26,0.5)", marginBottom: "8px" }}>Acceso demo</p>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "rgba(184,168,138,0.6)", marginBottom: "4px" }}>
              📧 <span style={{ color: "#f0e6c8" }}>demo@barberos.icu</span>
            </p>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "rgba(184,168,138,0.6)" }}>
              🔑 <span style={{ color: "#f0e6c8" }}>Demo2025!</span>
            </p>
          </div>

          <Link href="/login"
            style={{ display: "block", textAlign: "center", color: "#c8921a", fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", padding: "16px 32px", textDecoration: "none", border: "1px solid rgba(200,146,26,0.4)" }}>
            Entrar al Panel →
          </Link>
        </div>
      </section>

      {/* ── Qué incluye ── */}
      <section style={{ borderTop: "1px solid rgba(92,58,30,0.3)", padding: "60px 24px" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.6em", textTransform: "uppercase", ...gold, textAlign: "center", marginBottom: "40px", opacity: 0.7 }}>— Todo incluido por 60€/mes —</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
            {[
              { icon: "📅", title: "Reservas online 24h",    desc: "Tus clientes reservan mientras duermes" },
              { icon: "📧", title: "Emails automáticos",      desc: "Confirmación y recordatorio sin tocar nada" },
              { icon: "💰", title: "Control de caja",         desc: "Ventas e ingresos por empleado" },
              { icon: "⏱️", title: "Fichajes del personal",   desc: "Entradas y salidas registradas" },
              { icon: "📱", title: "App en el móvil",         desc: "Instalable en iOS y Android" },
              { icon: "🔔", title: "Notificaciones push",     desc: "Te avisamos cuando llega una cita" },
              { icon: "🌐", title: "3 idiomas",               desc: "Español, inglés y catalán" },
              { icon: "✂️", title: "Tu catálogo propio",      desc: "Servicios, precios y duración" },
            ].map(f => (
              <div key={f.title} style={{ border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0e0b07", padding: "20px" }}>
                <p style={{ fontSize: "1.4rem", marginBottom: "8px" }}>{f.icon}</p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.82rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "4px" }}>{f.title}</p>
                <p style={{ fontFamily: "var(--font-lato)", fontSize: "0.75rem", color: "rgba(184,168,138,0.45)", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "60px 24px 100px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.4rem,4vw,2.4rem)", color: "#f0e6c8", fontWeight: 900, marginBottom: "12px" }}>
          ¿Quieres esto para tu barbería?
        </h2>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.82rem", color: "rgba(184,168,138,0.45)", marginBottom: "32px", letterSpacing: "0.1em" }}>
          Sin permanencia · Configurado en 24h · Soporte incluido
        </p>
        <a href="https://wa.me/34TUNUMERO?text=Hola,%20quiero%20una%20demo%20de%20BarberOS%20para%20mi%20barbería"
          target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-block", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", color: "#080604", fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.4em", textTransform: "uppercase", padding: "20px 56px", textDecoration: "none", boxShadow: "0 0 50px rgba(200,146,26,0.5)" }}>
          Solicitar Demo por WhatsApp
        </a>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "rgba(184,168,138,0.25)", marginTop: "16px", letterSpacing: "0.2em" }}>
          60€ / mes · Todo incluido
        </p>
      </section>
    </main>
  );
}
