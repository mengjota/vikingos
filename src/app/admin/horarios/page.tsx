"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, logout } from "@/lib/auth";

const DAY_NAMES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Lun → Dom

interface DayConfig {
  day_of_week: number;
  open_time: string;
  close_time: string;
  slot_minutes: number;
  active: boolean;
}

const S = {
  input: {
    backgroundColor: "#141209",
    border: "1px solid rgba(92,58,30,0.5)",
    color: "#f0e6c8",
    fontFamily: "var(--font-barlow)",
    fontSize: "0.9rem",
    padding: "10px 12px",
    outline: "none",
  } as React.CSSProperties,
  label: {
    display: "block",
    fontFamily: "var(--font-barlow)",
    fontSize: "0.62rem",
    letterSpacing: "0.35em",
    textTransform: "uppercase",
    color: "rgba(200,146,26,0.7)",
    marginBottom: "6px",
  } as React.CSSProperties,
};

export default function HorariosPage() {
  const router = useRouter();
  const [schedule, setSchedule] = useState<DayConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [slotMinutes, setSlotMinutes] = useState(30);

  useEffect(() => {
    getSession().then(s => {
      if (!s || s.role !== "owner") { router.push("/staff"); return; }
      fetch("/api/admin/horarios")
        .then(r => r.json())
        .then((data: DayConfig[]) => {
          if (Array.isArray(data)) {
            setSchedule(data);
            if (data.length > 0) setSlotMinutes(data[0].slot_minutes);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }).catch(() => { router.push("/staff"); });
  }, [router]);

  function updateDay(dow: number, field: keyof DayConfig, value: string | number | boolean) {
    setSchedule(prev => prev.map(d => d.day_of_week === dow ? { ...d, [field]: value } : d));
  }

  async function handleSave() {
    setSaving(true);
    const payload = schedule.map(d => ({ ...d, slot_minutes: slotMinutes }));
    await fetch("/api/admin/horarios", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080604", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", letterSpacing: "0.3em", color: "rgba(184,168,138,0.3)" }}>CARGANDO...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080604" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "0 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <a href="/admin/dashboard" style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.5)", textDecoration: "none" }}>← Dashboard</a>
            <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700, color: "#f0e6c8" }}>Horarios de Apertura</span>
          </div>
          <button onClick={() => logout().then(() => router.push("/staff"))}
            style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(239,68,68,0.5)", background: "none", border: "none", cursor: "pointer" }}>
            Salir
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Slot duration — global */}
        <div style={{ border: "1px solid rgba(200,146,26,0.25)", backgroundColor: "#0e0b07", padding: "24px 28px", marginBottom: "32px", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, #c8921a, transparent)" }} />
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "#c8921a", marginBottom: "16px" }}>
            Duración de cada cita
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[15, 20, 30, 45, 60, 90].map(m => (
              <button key={m} onClick={() => setSlotMinutes(m)}
                style={{
                  padding: "10px 20px",
                  fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 700,
                  border: slotMinutes === m ? "1px solid #c8921a" : "1px solid rgba(92,58,30,0.4)",
                  backgroundColor: slotMinutes === m ? "#c8921a" : "transparent",
                  color: slotMinutes === m ? "#080604" : "rgba(184,168,138,0.6)",
                  cursor: "pointer",
                }}>
                {m} min
              </button>
            ))}
          </div>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", color: "rgba(184,168,138,0.3)", marginTop: "12px", letterSpacing: "0.1em" }}>
            Los clientes verán franjas de tiempo cada {slotMinutes} minutos en el calendario
          </p>
        </div>

        {/* Días */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {DAY_ORDER.map(dow => {
            const day = schedule.find(d => d.day_of_week === dow) ?? { day_of_week: dow, open_time: "09:00", close_time: "20:00", slot_minutes: 30, active: false };
            return (
              <div key={dow} style={{
                border: day.active ? "1px solid rgba(200,146,26,0.3)" : "1px solid rgba(92,58,30,0.25)",
                backgroundColor: "#0e0b07",
                padding: "20px 24px",
                display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap",
                opacity: day.active ? 1 : 0.55,
                transition: "all 0.2s",
              }}>
                {/* Toggle */}
                <button onClick={() => updateDay(dow, "active", !day.active)}
                  style={{
                    width: "48px", height: "26px", borderRadius: "13px",
                    backgroundColor: day.active ? "#c8921a" : "rgba(92,58,30,0.3)",
                    border: "none", cursor: "pointer", position: "relative", flexShrink: 0,
                    transition: "background 0.2s",
                  }}>
                  <div style={{
                    position: "absolute", top: "3px",
                    left: day.active ? "25px" : "3px",
                    width: "20px", height: "20px", borderRadius: "50%",
                    backgroundColor: day.active ? "#080604" : "rgba(184,168,138,0.4)",
                    transition: "left 0.2s",
                  }} />
                </button>

                {/* Nombre del día */}
                <p style={{
                  fontFamily: "var(--font-barlow)", fontSize: "0.9rem", fontWeight: 700,
                  color: day.active ? "#f0e6c8" : "rgba(184,168,138,0.4)",
                  minWidth: "100px",
                }}>
                  {DAY_NAMES[dow]}
                </p>

                {day.active && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <div>
                        <label style={S.label}>Apertura</label>
                        <input type="time" value={day.open_time}
                          onChange={e => updateDay(dow, "open_time", e.target.value)}
                          style={{ ...S.input, colorScheme: "dark" }} />
                      </div>
                      <span style={{ color: "rgba(184,168,138,0.3)", fontFamily: "var(--font-barlow)", marginTop: "20px" }}>→</span>
                      <div>
                        <label style={S.label}>Cierre</label>
                        <input type="time" value={day.close_time}
                          onChange={e => updateDay(dow, "close_time", e.target.value)}
                          style={{ ...S.input, colorScheme: "dark" }} />
                      </div>
                    </div>
                    <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", color: "rgba(184,168,138,0.3)", marginLeft: "auto" }}>
                      {Math.floor((
                        (parseInt(day.close_time.split(":")[0]) * 60 + parseInt(day.close_time.split(":")[1])) -
                        (parseInt(day.open_time.split(":")[0]) * 60 + parseInt(day.open_time.split(":")[1]))
                      ) / slotMinutes)} citas posibles
                    </p>
                  </>
                )}

                {!day.active && (
                  <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", letterSpacing: "0.2em", color: "rgba(184,168,138,0.25)", textTransform: "uppercase" }}>
                    Cerrado
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Guardar */}
        <div style={{ marginTop: "32px", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={handleSave} disabled={saving}
            style={{
              fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 800,
              letterSpacing: "0.4em", textTransform: "uppercase",
              padding: "16px 48px", border: "none", cursor: "pointer",
              background: saved
                ? "linear-gradient(135deg, #065f46, #059669, #34d399, #059669, #065f46)"
                : "linear-gradient(135deg, #a06010, #c8921a, #f0c040, #c8921a, #a06010)",
              color: "#080604",
              boxShadow: "0 0 30px rgba(200,146,26,0.4)",
              opacity: saving ? 0.7 : 1,
            }}>
            {saving ? "Guardando..." : saved ? "✓ Guardado" : "Guardar Horarios"}
          </button>
        </div>

        {/* Info */}
        <div style={{ marginTop: "48px", padding: "20px 24px", border: "1px solid rgba(92,58,30,0.2)", backgroundColor: "rgba(14,11,7,0.5)" }}>
          <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#c8921a", marginBottom: "12px" }}>
            ¿Cómo funciona?
          </p>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              "Los clientes verán un calendario con los días disponibles según este horario",
              "Al elegir un día, verán solo los huecos libres (quitando citas ya existentes y pausas del staff)",
              "Pueden reservar sin cuenta — solo nombre y teléfono",
              "Los cambios se aplican inmediatamente para nuevas reservas",
            ].map((t, i) => (
              <li key={i} style={{ fontFamily: "var(--font-barlow)", fontSize: "0.75rem", color: "rgba(184,168,138,0.5)", display: "flex", gap: "10px" }}>
                <span style={{ color: "#c8921a", flexShrink: 0 }}>᛭</span> {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
