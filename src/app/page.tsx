"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";

interface ShopInfo { id: string; name: string; description: string; address: string; phone: string; }
interface Service { id: number; name: string; price: string; duration_min: number; description: string; }

export default function Home() {
  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetch("/api/barbershop").then(r => r.json()).then(setShop).catch(() => {});
    fetch("/api/services").then(r => r.json()).then((s: Service[]) => setServices(s.slice(0, 6))).catch(() => {});
  }, []);

  const shopName = shop?.name?.toUpperCase() ?? "";

  return (
    <main style={{ backgroundColor: "#080604", minHeight: "100vh" }}>

      {/* Glow ambiental */}
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 70% 50% at 50% 30%, rgba(200,146,26,0.1) 0%, transparent 65%)", pointerEvents: "none" }} />

      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>

        {/* Patrón rúnico */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0 L40 80 M0 40 L80 40 M10 10 L70 70 M70 10 L10 70' stroke='%23c8921a' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`, backgroundSize: "80px 80px" }} />

        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "140px 24px 80px", maxWidth: "800px", margin: "0 auto" }}>

          {/* Eyebrow */}
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.7em", textTransform: "uppercase", color: "rgba(200,146,26,0.6)", marginBottom: "24px" }}>
            — Bienvenido —
          </p>

          {/* Nombre de la barbería */}
          {shopName && (
            <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(2.8rem,10vw,7rem)", fontWeight: 900, color: "#f0e6c8", lineHeight: 1, marginBottom: "8px", letterSpacing: "0.03em", textShadow: "0 0 80px rgba(200,146,26,0.2)" }}>
              {shopName}
            </h1>
          )}

          {/* Separador rúnico */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", margin: "20px 0" }}>
            <div style={{ height: "1px", width: "60px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.7))" }} />
            <span style={{ color: "#c8921a", fontSize: "1.4rem" }}>᛭</span>
            <div style={{ height: "1px", width: "60px", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.7))" }} />
          </div>

          {/* Subtítulo */}
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", letterSpacing: "0.55em", textTransform: "uppercase", color: "#c8921a", marginBottom: "16px" }}>
            Barbería
          </p>

          {/* Descripción */}
          {shop?.description && (
            <p style={{ fontFamily: "var(--font-lato)", fontSize: "clamp(0.9rem,2vw,1.1rem)", color: "rgba(184,168,138,0.6)", lineHeight: 1.8, maxWidth: "500px", margin: "0 auto 40px", fontStyle: "italic" }}>
              {shop.description}
            </p>
          )}
          {!shop?.description && (
            <p style={{ fontFamily: "var(--font-lato)", fontSize: "clamp(0.9rem,2vw,1.1rem)", color: "rgba(184,168,138,0.5)", lineHeight: 1.8, maxWidth: "480px", margin: "0 auto 40px", fontStyle: "italic" }}>
              Donde el acero se afila con honor y el oficio se lleva en la sangre.
            </p>
          )}

          {/* CTA botones */}
          <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "16px" }}>
            <Link href="/reservar"
              style={{ display: "inline-block", background: "linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010)", color: "#0f0d0a", fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 800, letterSpacing: "0.45em", textTransform: "uppercase", padding: "18px 56px", boxShadow: "0 0 40px rgba(200,146,26,0.5), 0 0 80px rgba(200,146,26,0.2)", textDecoration: "none" }}>
              Reservar Cita
            </Link>
            <Link href="/login"
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", textDecoration: "none" }}>
              Iniciar sesión →
            </Link>
          </div>
        </div>

        {/* Líneas laterales */}
        <div style={{ position: "absolute", left: "32px", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "16px" }}>
          <div style={{ width: "1px", height: "120px", background: "linear-gradient(to bottom, transparent, rgba(200,146,26,0.5))" }} />
          <span style={{ color: "rgba(200,146,26,0.3)", fontSize: "0.6rem", letterSpacing: "0.5em", textTransform: "uppercase", writingMode: "vertical-rl", fontFamily: "var(--font-barlow)" }}>Est. MMXXV</span>
          <div style={{ width: "1px", height: "120px", background: "linear-gradient(to top, transparent, rgba(200,146,26,0.5))" }} />
        </div>
      </section>

      {/* ── SERVICIOS (si hay) ── */}
      {services.length > 0 && (
        <section style={{ padding: "80px 24px", maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "#c8921a", marginBottom: "16px" }}>— Nuestros Servicios —</p>
            <h2 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.6rem,4vw,2.8rem)", color: "#f0e6c8", fontWeight: 900 }}>El Oficio</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {services.map(s => (
              <div key={s.id} style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "28px 24px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.5), transparent)" }} />
                <p style={{ fontFamily: "var(--font-oswald)", fontSize: "1.05rem", fontWeight: 600, color: "#f0e6c8", marginBottom: "8px", letterSpacing: "0.04em" }}>{s.name}</p>
                {s.description && <p style={{ fontFamily: "var(--font-lato)", fontSize: "0.82rem", color: "rgba(184,168,138,0.5)", lineHeight: 1.6, marginBottom: "16px" }}>{s.description}</p>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "1.2rem", fontWeight: 900, color: "#c8921a" }}>{s.price}</span>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "rgba(184,168,138,0.35)", letterSpacing: "0.1em" }}>{s.duration_min} min</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link href="/reservar"
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", color: "#c8921a", border: "1px solid rgba(200,146,26,0.4)", padding: "14px 36px", textDecoration: "none", display: "inline-block" }}>
              Reservar Ahora
            </Link>
          </div>
        </section>
      )}

      {/* ── INFO CONTACTO (si hay) ── */}
      {(shop?.address || shop?.phone) && (
        <section style={{ padding: "60px 24px", borderTop: "1px solid rgba(92,58,30,0.3)" }}>
          <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.6em", textTransform: "uppercase", color: "#c8921a", marginBottom: "24px" }}>— Encuéntranos —</p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
              {shop.address && <p style={{ fontFamily: "var(--font-lato)", fontSize: "0.95rem", color: "rgba(184,168,138,0.6)" }}>📍 {shop.address}</p>}
              {shop.phone && <p style={{ fontFamily: "var(--font-lato)", fontSize: "0.95rem", color: "rgba(184,168,138,0.6)" }}>📞 {shop.phone}</p>}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
