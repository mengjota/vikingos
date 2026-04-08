"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn, adminLogout, getAllReservations, getFacturas } from "@/lib/adminAuth";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ pendientes: 0, completadas: 0, ingresos: 0 });

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin"); return; }
    const reservas = getAllReservations();
    const facturas = getFacturas();
    const ingresos = facturas.reduce((s, f) => s + f.total, 0);
    setStats({
      pendientes: reservas.filter((r) => r.estado === "pendiente" || !r.estado).length,
      completadas: reservas.filter((r) => r.estado === "completada").length,
      ingresos,
    });
  }, [router]);

  function handleLogout() { adminLogout(); router.push("/admin"); }

  const nav = [
    { href: "/admin/reservas",    label: "Reservas",    sub: "Gestionar citas y pagos",    icon: "📋" },
    { href: "/admin/productos",   label: "Tienda",      sub: "Administrar catálogo",        icon: "🛍️" },
    { href: "/admin/facturacion", label: "Facturación", sub: "Historial de pagos",          icon: "💰" },
    { href: "/admin/staff",       label: "Staff",       sub: "Añadir y eliminar empleados", icon: "✂️" },
    { href: "/admin/clientes",    label: "Clientes",    sub: "Usuarios registrados",        icon: "👥" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080604" }}>
      <div style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(200,146,26,0.08) 0%, transparent 60%)", position: "fixed", inset: 0, pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "0 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "68px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1.3rem", fontWeight: 900, color: "#c8921a" }}>INVICTUS</span>
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", borderLeft: "1px solid rgba(92,58,30,0.5)", paddingLeft: "16px" }}>Admin</span>
          </div>
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <a href="/" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)" }}>Ver Sitio</a>
            <button onClick={handleLogout}
              style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(239,68,68,0.6)", background: "none", border: "none", cursor: "pointer" }}>
              Salir
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>

        {/* Título */}
        <div style={{ marginBottom: "48px" }}>
          <h1 style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", color: "#f0e6c8", fontWeight: 900, marginBottom: "8px" }}>
            Panel de Control
          </h1>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", letterSpacing: "0.15em", color: "rgba(184,168,138,0.5)" }}>
            Bienvenido al centro de gestión de Invictus Barbería
          </p>
        </div>

        {/* Estadísticas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px", marginBottom: "48px" }}>
          {[
            { label: "Reservas Pendientes", value: stats.pendientes, color: "#f0c040" },
            { label: "Servicios Completados", value: stats.completadas, color: "#4ade80" },
            { label: "Ingresos Totales", value: `$${stats.ingresos}`, color: "#c8921a" },
          ].map((s, i) => (
            <div key={i} style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${s.color}80, transparent)` }} />
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)", marginBottom: "12px" }}>{s.label}</p>
              <p style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "2rem", fontWeight: 900, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Navegación */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {nav.map((n) => (
            <a key={n.href} href={n.href}
              style={{ display: "block", border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "32px", textDecoration: "none", transition: "all 0.25s", position: "relative", overflow: "hidden" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(200,146,26,0.5)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 0 30px rgba(200,146,26,0.08)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(92,58,30,0.4)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.4), transparent)" }} />
              <p style={{ fontSize: "2rem", marginBottom: "12px" }}>{n.icon}</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "1rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "6px", letterSpacing: "0.05em" }}>{n.label}</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "rgba(184,168,138,0.5)" }}>{n.sub}</p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c8921a", marginTop: "20px" }}>Ir →</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
