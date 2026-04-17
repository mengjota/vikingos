"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/adminAuth";

interface Cliente {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  total_reservas: number;
}

export default function AdminClientes() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading]   = useState(true);
  const [buscar, setBuscar]     = useState("");

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push("/admin"); return; }
    fetch("/api/admin/clientes")
      .then(r => r.json())
      .then(data => { setClientes(data); setLoading(false); });
  }, [router]);

  const filtrados = clientes.filter(c =>
    c.name.toLowerCase().includes(buscar.toLowerCase()) ||
    c.email.toLowerCase().includes(buscar.toLowerCase())
  );

  const verificados   = clientes.filter(c => c.email_verified).length;
  const sinVerificar  = clientes.length - verificados;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060504", fontFamily: "var(--font-barlow)" }}>

      {/* Header */}
      <div style={{ backgroundColor: "#0a0806", borderBottom: "1px solid rgba(92,58,30,0.45)", padding: "0 28px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/admin/dashboard" style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ color: "rgba(92,58,30,0.5)" }}>|</span>
            <span style={{ fontSize: "1rem", fontWeight: 800, color: "#f0e6c8" }}>Clientes Registrados</span>
            <span style={{ backgroundColor: "rgba(200,146,26,0.15)", color: "#c8921a", border: "1px solid rgba(200,146,26,0.3)", fontSize: "0.65rem", fontWeight: 900, borderRadius: "20px", padding: "2px 10px" }}>
              {clientes.length} total
            </span>
          </div>
          <input
            value={buscar} onChange={e => setBuscar(e.target.value)}
            placeholder="Buscar por nombre o correo..."
            style={{ padding: "8px 14px", backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.4)", color: "#f0e6c8", fontSize: "0.8rem", outline: "none", width: "260px" }}
          />
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 20px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "28px" }}>
          {[
            { label: "Total clientes", value: clientes.length, color: "#c8921a" },
            { label: "Verificados",    value: verificados,     color: "#4ade80" },
            { label: "Sin verificar",  value: sinVerificar,    color: "#f0c040" },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: "#0a0806", border: "1px solid rgba(92,58,30,0.3)", padding: "20px 24px" }}>
              <p style={{ fontSize: "0.58rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", marginBottom: "8px" }}>{s.label}</p>
              <p style={{ fontSize: "2rem", fontWeight: 900, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabla */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "rgba(184,168,138,0.3)", fontSize: "0.75rem", letterSpacing: "0.3em" }}>CARGANDO...</div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "rgba(184,168,138,0.25)", fontSize: "0.75rem", letterSpacing: "0.3em" }}>
            {buscar ? "Sin resultados para esa búsqueda." : "No hay clientes registrados aún."}
          </div>
        ) : (
          <div style={{ backgroundColor: "#0a0806", border: "1px solid rgba(92,58,30,0.3)", overflow: "hidden" }}>
            {/* Cabecera tabla */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr", padding: "12px 20px", borderBottom: "1px solid rgba(92,58,30,0.3)", backgroundColor: "#0f0c08" }}>
              {["Nombre", "Correo", "Estado", "Reservas", "Registro"].map(h => (
                <span key={h} style={{ fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(184,168,138,0.35)", fontWeight: 700 }}>{h}</span>
              ))}
            </div>
            {/* Filas */}
            {filtrados.map((c, i) => (
              <div key={c.id}
                style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr", padding: "16px 20px", borderBottom: i < filtrados.length - 1 ? "1px solid rgba(92,58,30,0.15)" : "none", alignItems: "center" }}>
                <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "#f0e6c8" }}>{c.name}</span>
                <span style={{ fontSize: "0.78rem", color: "rgba(184,168,138,0.6)" }}>{c.email}</span>
                <span style={{
                  fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: c.email_verified ? "#4ade80" : "#f0c040",
                  border: `1px solid ${c.email_verified ? "rgba(74,222,128,0.3)" : "rgba(240,192,64,0.3)"}`,
                  padding: "3px 8px", display: "inline-block"
                }}>
                  {c.email_verified ? "✓ Activo" : "⏳ Pendiente"}
                </span>
                <span style={{ fontSize: "1rem", fontWeight: 900, color: "#c8921a" }}>{c.total_reservas}</span>
                <span style={{ fontSize: "0.72rem", color: "rgba(184,168,138,0.4)" }}>
                  {new Date(c.created_at).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
