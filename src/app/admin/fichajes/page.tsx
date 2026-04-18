"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/auth";

interface TimeLog {
  id: number;
  employee_email: string;
  employee_name: string;
  clock_in: string;
  clock_out: string | null;
  status: string;
}

export default function AdminFichajes() {
  const router = useRouter();
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEmail, setFiltroEmail] = useState("todos");

  useEffect(() => {
    getSession().then((s) => {
      if (!s || s.role !== "owner") {
        router.push("/admin");
        return;
      }
      
      fetch("/api/admin/time-logs")
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setLogs(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    });
  }, [router]);

  // Lista única de emails para el filtro
  const empleadosEscan = Array.from(new Set(logs.map(l => l.employee_email)));

  const filtrados = logs.filter(l => filtroEmail === "todos" || l.employee_email === filtroEmail);

  const activos = filtrados.filter(l => l.status === "active").length;
  const completados = filtrados.filter(l => l.status !== "active").length;

  function d(dateStr: string | null) {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  function horasTrabajadas(start: string, end: string | null) {
    if (!end) return "En curso";
    const min = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 60000);
    const hrs = Math.floor(min / 60);
    const mins = min % 60;
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060504", fontFamily: "var(--font-barlow)" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#0a0806", borderBottom: "1px solid rgba(92,58,30,0.45)", padding: "0 28px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/admin/dashboard" style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ color: "rgba(92,58,30,0.5)" }}>|</span>
            <span style={{ fontSize: "1rem", fontWeight: 800, color: "#f0e6c8" }}>Control Horario</span>
          </div>
          <select value={filtroEmail} onChange={e => setFiltroEmail(e.target.value)}
            style={{ padding: "8px 14px", backgroundColor: "#141209", border: "1px solid rgba(92,58,30,0.4)", color: "#f0e6c8", fontSize: "0.8rem", outline: "none", width: "260px" }}>
            <option value="todos">Todos los empleados</option>
            {empleadosEscan.map(email => (
              <option key={email} value={email}>{email}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 20px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px", marginBottom: "28px" }}>
          {[
            { label: "Turnos Registrados", value: filtrados.length, color: "#c8921a", bg: "rgba(200,146,26,0.05)" },
            { label: "En turno ahora",     value: activos,          color: "#4ade80", bg: "rgba(74,222,128,0.05)" },
            { label: "Turnos completados", value: completados,      color: "#60a5fa", bg: "rgba(96,165,250,0.05)" },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: s.bg, border: "1px solid rgba(92,58,30,0.3)", padding: "20px 24px", gridColumn: "span 1" }}>
              <p style={{ fontSize: "0.58rem", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", marginBottom: "8px" }}>{s.label}</p>
              <p style={{ fontSize: "2rem", fontWeight: 900, color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabla */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "rgba(184,168,138,0.3)", fontSize: "0.75rem", letterSpacing: "0.3em" }}>CARGANDO FICHAJES...</div>
        ) : filtrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px", color: "rgba(184,168,138,0.25)", fontSize: "0.75rem", letterSpacing: "0.3em" }}>
            No hay registros de horas.
          </div>
        ) : (
          <div style={{ backgroundColor: "#0a0806", border: "1px solid rgba(92,58,30,0.3)", overflow: "hidden" }}>
            {/* Cabecera tabla */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr 1.5fr 1fr", padding: "14px 20px", borderBottom: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07" }}>
              {["Estado", "Empleado", "Entrada", "Salida", "Duración"].map(h => (
                <span key={h} style={{ fontSize: "0.55rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", fontWeight: 700 }}>{h}</span>
              ))}
            </div>
            {/* Filas */}
            {filtrados.map((log, i) => (
              <div key={log.id}
                style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr 1.5fr 1fr", padding: "16px 20px", borderBottom: i < filtrados.length - 1 ? "1px solid rgba(92,58,30,0.15)" : "none", alignItems: "center", backgroundColor: log.status === "active" ? "rgba(74,222,128,0.03)" : "transparent" }}>
                <span style={{ fontSize: "0.58rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: log.status === "active" ? "#4ade80" : "rgba(184,168,138,0.3)", border: log.status === "active" ? "1px solid rgba(74,222,128,0.3)" : "none", padding: log.status === "active" ? "3px 8px" : "0", display: "inline-block", justifySelf: "start" }}>
                  {log.status === "active" ? "🟢 En Turno" : "Completado"}
                </span>
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f0e6c8", marginBottom: "2px" }}>{log.employee_name}</p>
                  <p style={{ fontSize: "0.68rem", color: "rgba(184,168,138,0.5)" }}>{log.employee_email}</p>
                </div>
                <span style={{ fontSize: "0.78rem", color: "#f0e6c8" }}>{d(log.clock_in)}</span>
                <span style={{ fontSize: "0.78rem", color: log.clock_out ? "#f0e6c8" : "rgba(184,168,138,0.3)" }}>{d(log.clock_out)}</span>
                <span style={{ fontSize: "0.88rem", fontWeight: 800, color: log.status === "active" ? "#4ade80" : "#c8921a" }}>{horasTrabajadas(log.clock_in, log.clock_out)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
