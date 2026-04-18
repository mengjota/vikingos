"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, type Session } from "@/lib/auth";

const DIAS_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DIAS_ORDER  = [1, 2, 3, 4, 5, 6, 0]; // Lun primero

interface DaySchedule { day_of_week: number; is_working: boolean; start_time: string; end_time: string; }

const DEFAULT_SCHEDULE: DaySchedule[] = Array.from({ length: 7 }, (_, i) => ({
  day_of_week: i, is_working: i !== 0, start_time: "09:00", end_time: "20:00",
}));

const S = {
  label: { fontFamily: "var(--font-barlow)", fontSize: "0.62rem", letterSpacing: "0.35em", textTransform: "uppercase" as const, color: "rgba(200,146,26,0.8)", display: "block", marginBottom: "8px" },
  input: { width: "100%", padding: "13px 16px", backgroundColor: "#0a0806", border: "1px solid rgba(92,58,30,0.5)", color: "#f0e6c8", fontFamily: "var(--font-barlow)", fontSize: "0.95rem", outline: "none", boxSizing: "border-box" as const },
};

export default function PerfilBarberoPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [barberName, setBarberName]   = useState("");
  const [specialty, setSpecialty]     = useState("");
  const [isBarber, setIsBarber]       = useState(true);
  const [schedule, setSchedule]       = useState<DaySchedule[]>(DEFAULT_SCHEDULE);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [ok, setOk]                   = useState(false);
  const [error, setError]             = useState("");

  useEffect(() => {
    getSession().then(async s => {
      if (!s || (s.role !== "employee" && s.role !== "owner")) {
        router.replace("/staff"); return;
      }
      setSession(s);

      // Cargar perfil actual
      const res = await fetch("/api/admin/barber-schedules");
      if (res.ok) {
        const data = await res.json();
        const own = data.find((b: { userId: number }) => b.userId === s.userId);
        if (own) {
          setBarberName(own.barberName ?? "");
          setSpecialty(own.specialty ?? "");
          setIsBarber(own.isBarber !== false);
          setSchedule(own.schedule ?? DEFAULT_SCHEDULE);
        }
      }
      setLoading(false);
    });
  }, [router]);

  function toggleDay(dow: number) {
    setSchedule(prev => prev.map(d => d.day_of_week === dow ? { ...d, is_working: !d.is_working } : d));
  }

  function updateTime(dow: number, field: "start_time" | "end_time", val: string) {
    setSchedule(prev => prev.map(d => d.day_of_week === dow ? { ...d, [field]: val } : d));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setOk(false); setError("");
    const res = await fetch("/api/admin/barber-schedules", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: session?.userId, barberName, specialty, isBarber, schedule }),
    });
    setSaving(false);
    if (res.ok) setOk(true);
    else setError("Error al guardar. Inténtalo de nuevo.");
  }

  if (loading || !session) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#080604", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", letterSpacing: "0.5em", color: "rgba(184,168,138,0.3)" }}>CARGANDO...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#060504" }}>
      <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse 60% 35% at 50% 0%, rgba(200,146,26,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ backgroundColor: "#0a0806", borderBottom: "1px solid rgba(92,58,30,0.45)", padding: "0 24px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", height: "64px", display: "flex", alignItems: "center", gap: "20px" }}>
          <a href="/empleado" style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(184,168,138,0.4)", textDecoration: "none", fontFamily: "var(--font-barlow)" }}>← Hub</a>
          <span style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: "1rem", color: "#c8921a" }}>Mi Perfil de Barbero</span>
        </div>
      </div>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>

          {/* ── Perfil público ── */}
          <section style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "28px", position: "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(200,146,26,0.5), transparent)" }} />
            <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(200,146,26,0.6)", marginBottom: "20px" }}>
              Perfil Público
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={S.label}>Nombre que verán los clientes</label>
                <input value={barberName} onChange={e => setBarberName(e.target.value)}
                  placeholder="Ej: Alfonso" style={S.input} />
              </div>
              <div>
                <label style={S.label}>Especialidad</label>
                <input value={specialty} onChange={e => setSpecialty(e.target.value)}
                  placeholder="Ej: Barba y degradado clásico" style={S.input} />
              </div>
            </div>
            <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "14px" }}>
              <button type="button" onClick={() => setIsBarber(!isBarber)} style={{
                width: "48px", height: "26px", borderRadius: "13px", border: "none", cursor: "pointer",
                backgroundColor: isBarber ? "#c8921a" : "rgba(92,58,30,0.5)",
                position: "relative", transition: "background 0.3s",
              }}>
                <span style={{
                  position: "absolute", top: "3px",
                  left: isBarber ? "24px" : "3px",
                  width: "20px", height: "20px", borderRadius: "50%",
                  backgroundColor: "#f0e6c8", transition: "left 0.3s",
                }} />
              </button>
              <div>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.8rem", color: "#f0e6c8" }}>
                  {isBarber ? "Acepto reservas de clientes" : "No aparezco en el sistema de reservas"}
                </p>
                <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", color: "rgba(184,168,138,0.4)" }}>
                  {isBarber ? "Los clientes podrán seleccionarte al reservar" : "El jefe podrá reactivarlo en cualquier momento"}
                </p>
              </div>
            </div>
          </section>

          {/* ── Horario semanal ── */}
          {isBarber && (
            <section style={{ border: "1px solid rgba(92,58,30,0.4)", backgroundColor: "#0e0b07", padding: "28px", position: "relative" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(to right, transparent, rgba(167,139,250,0.5), transparent)" }} />
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(167,139,250,0.6)", marginBottom: "20px" }}>
                Mis Días de Trabajo
              </p>
              <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.72rem", color: "rgba(184,168,138,0.4)", marginBottom: "20px" }}>
                Marca los días que trabajas. Los clientes solo podrán reservarte esos días.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {DIAS_ORDER.map(dow => {
                  const day = schedule.find(d => d.day_of_week === dow) ?? DEFAULT_SCHEDULE[dow];
                  return (
                    <div key={dow} style={{
                      display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
                      padding: "14px 16px",
                      border: `1px solid ${day.is_working ? "rgba(167,139,250,0.25)" : "rgba(92,58,30,0.2)"}`,
                      backgroundColor: day.is_working ? "rgba(167,139,250,0.04)" : "transparent",
                      transition: "all 0.2s",
                    }}>
                      {/* Toggle */}
                      <button type="button" onClick={() => toggleDay(dow)} style={{
                        width: "40px", height: "22px", borderRadius: "11px", border: "none", cursor: "pointer",
                        backgroundColor: day.is_working ? "rgba(167,139,250,0.8)" : "rgba(92,58,30,0.4)",
                        position: "relative", transition: "background 0.3s", flexShrink: 0,
                      }}>
                        <span style={{
                          position: "absolute", top: "3px",
                          left: day.is_working ? "20px" : "3px",
                          width: "16px", height: "16px", borderRadius: "50%",
                          backgroundColor: "#f0e6c8", transition: "left 0.3s",
                        }} />
                      </button>

                      {/* Día */}
                      <span style={{
                        fontFamily: "var(--font-barlow)", fontSize: "0.85rem", fontWeight: 700,
                        letterSpacing: "0.1em", textTransform: "uppercase",
                        color: day.is_working ? "#f0e6c8" : "rgba(184,168,138,0.3)",
                        width: "36px",
                      }}>
                        {DIAS_LABELS[dow]}
                      </span>

                      {/* Horas */}
                      {day.is_working && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <input type="time" value={day.start_time} onChange={e => updateTime(dow, "start_time", e.target.value)}
                            style={{ ...S.input, width: "110px", padding: "8px 10px", fontSize: "0.85rem" }} />
                          <span style={{ color: "rgba(184,168,138,0.4)", fontSize: "0.8rem" }}>—</span>
                          <input type="time" value={day.end_time} onChange={e => updateTime(dow, "end_time", e.target.value)}
                            style={{ ...S.input, width: "110px", padding: "8px 10px", fontSize: "0.85rem" }} />
                        </div>
                      )}
                      {!day.is_working && (
                        <span style={{ fontFamily: "var(--font-barlow)", fontSize: "0.7rem", color: "rgba(184,168,138,0.25)", letterSpacing: "0.2em" }}>
                          NO TRABAJO
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Feedback */}
          {error && <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "#f87171" }}>⚠ {error}</p>}
          {ok && <p style={{ fontFamily: "var(--font-barlow)", fontSize: "0.78rem", color: "#4ade80" }}>✓ Perfil guardado correctamente</p>}

          {/* Submit */}
          <button type="submit" disabled={saving} style={{
            padding: "16px 32px", border: "none", cursor: saving ? "not-allowed" : "pointer",
            background: "linear-gradient(135deg,#a06010,#c8921a)", color: "#080604",
            fontFamily: "var(--font-barlow)", fontSize: "0.8rem", fontWeight: 800,
            letterSpacing: "0.4em", textTransform: "uppercase",
            boxShadow: "0 0 30px rgba(200,146,26,0.3)", opacity: saving ? 0.7 : 1,
            alignSelf: "flex-start",
          }}>
            {saving ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
          </button>
        </form>
      </div>
    </div>
  );
}
