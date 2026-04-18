"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Product {
  id: number; name: string; price: string;
  description: string; category: string; stock: number; active: boolean;
}

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState("todas");

  useEffect(() => {
    const bid = process.env.NEXT_PUBLIC_BARBERSHOP_ID ?? "narvek";
    fetch(`/api/admin/products?barbershopId=${bid}`)
      .then(r => r.json())
      .then(d => { setProducts(Array.isArray(d) ? d.filter((p: Product) => p.active) : []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cats = ["todas", ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  const filtered = cat === "todas" ? products : products.filter(p => p.category === cat);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080604" }}>
      <Navbar />
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(200,146,26,0.07) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Hero */}
      <section style={{ paddingTop: "140px", paddingBottom: "60px", textAlign: "center", padding: "140px 24px 60px" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.7em", textTransform: "uppercase", color: "rgba(200,146,26,0.6)", marginBottom: "20px" }}>— Productos —</p>
        <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(2rem,6vw,4rem)", fontWeight: 900, color: "#f0e6c8", marginBottom: "16px" }}>La Armería</h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", margin: "0 0 20px" }}>
          <div style={{ height: "1px", width: "60px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.7))" }} />
          <span style={{ color: "#c8921a", fontSize: "1.4rem" }}>᛭</span>
          <div style={{ height: "1px", width: "60px", background: "linear-gradient(to left, transparent, rgba(200,146,26,0.7))" }} />
        </div>
        <p style={{ fontFamily: "var(--font-lato)", fontSize: "clamp(0.85rem,2vw,1rem)", color: "rgba(184,168,138,0.5)", fontStyle: "italic", maxWidth: "460px", margin: "0 auto" }}>
          Productos seleccionados para el cuidado del guerrero moderno.
        </p>
      </section>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px 80px" }}>
        {/* Filtro categorías */}
        {cats.length > 1 && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "40px", justifyContent: "center" }}>
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "capitalize", padding: "8px 18px", border: `1px solid ${cat === c ? "#c8921a" : "rgba(92,58,30,0.4)"}`, backgroundColor: cat === c ? "rgba(200,146,26,0.12)" : "transparent", color: cat === c ? "#c8921a" : "rgba(184,168,138,0.5)", cursor: "pointer" }}>
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", letterSpacing: "0.4em", color: "rgba(184,168,138,0.3)", textAlign: "center", padding: "60px" }}>CARGANDO...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 24px", border: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0e0b07" }}>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.3)", marginBottom: "12px" }}>
              Sin productos disponibles
            </p>
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.2)" }}>
              El catálogo se actualizará pronto.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
            {filtered.map(p => (
              <div key={p.id} style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "28px 24px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.5), transparent)" }} />
                {p.category && (
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(200,146,26,0.5)", border: "1px solid rgba(200,146,26,0.2)", padding: "2px 8px", alignSelf: "flex-start" }}>
                    {p.category}
                  </span>
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "8px" }}>{p.name}</p>
                  {p.description && (
                    <p style={{ fontFamily: "var(--font-lato)", fontSize: "0.82rem", color: "rgba(184,168,138,0.5)", lineHeight: 1.6 }}>{p.description}</p>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(92,58,30,0.3)", paddingTop: "14px" }}>
                  <span style={{ fontFamily: "var(--font-barlow)", fontSize: "1.3rem", fontWeight: 900, color: "#c8921a" }}>{p.price}</span>
                  {p.stock !== undefined && p.stock <= 5 && p.stock > 0 && (
                    <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(251,146,60,0.8)", border: "1px solid rgba(251,146,60,0.3)", padding: "2px 8px" }}>
                      Últimas {p.stock}
                    </span>
                  )}
                  {p.stock === 0 && (
                    <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.6rem", letterSpacing: "0.2em", color: "rgba(239,68,68,0.6)", border: "1px solid rgba(239,68,68,0.2)", padding: "2px 8px" }}>
                      Agotado
                    </span>
                  )}
                </div>
                <a href="/reservar"
                  style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", padding: "10px", textAlign: "center", background: "linear-gradient(135deg,#a06010,#c8921a)", color: "#080604", textDecoration: "none", display: "block", opacity: p.stock === 0 ? 0.4 : 1, pointerEvents: p.stock === 0 ? "none" : "auto" }}>
                  Consultar en Barbería
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
