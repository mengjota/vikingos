import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

const RUNES = ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ", "ᚺ", "ᚾ"];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const barbershopId = searchParams.get("barbershopId") ?? (process.env.BARBERSHOP_ID ?? "narvek");
  const fecha = searchParams.get("fecha"); // YYYY-MM-DD — si se pasa, filtra por disponibilidad

  // Asegurar columnas opcionales
  try { await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_barber BOOLEAN DEFAULT true`; } catch (_) {}
  try { await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS barber_specialty TEXT`; } catch (_) {}

  const rows = await sql`
    SELECT id, name, email, barber_name, barber_specialty, role, is_barber, barbershop_id
    FROM users
    WHERE barbershop_id = ${barbershopId}
      AND barber_name IS NOT NULL
      AND is_barber IS NOT FALSE
      AND (role = 'employee' OR role = 'owner')
    ORDER BY role DESC, name
  `;

  let barbers = rows.map((r, i) => ({
    id: r.id as number,
    name: r.barber_name as string,
    specialty: (r.barber_specialty as string) ?? "Barbero Profesional",
    rune: RUNES[i] ?? "᛭",
    role: r.role as string,
  }));

  // Si hay fecha, filtrar solo los que trabajan ese día de la semana
  if (fecha && barbers.length > 0) {
    const dow = new Date(fecha + "T12:00:00").getDay(); // 0=Dom

    const scheduleRows = await sql`
      SELECT user_id, is_working FROM barber_schedules
      WHERE user_id = ANY(${barbers.map(b => b.id)})
        AND day_of_week = ${dow}
    `.catch(() => [] as { user_id: number; is_working: boolean }[]);

    barbers = barbers.filter(b => {
      const sched = (scheduleRows as { user_id: number; is_working: boolean }[]).find(s => s.user_id === b.id);
      // Si no tiene horario configurado, asumir que trabaja (defecto Mon-Sat)
      if (!sched) return dow !== 0;
      return sched.is_working;
    });
  }

  // Incluir el horario semanal de cada barbero
  const withSchedule = await Promise.all(barbers.map(async b => {
    const schedRows = await sql`
      SELECT day_of_week, is_working FROM barber_schedules WHERE user_id = ${b.id}
    `.catch(() => [] as { day_of_week: number; is_working: boolean }[]);

    // Generar array de 7 días con defaults
    const schedule = Array.from({ length: 7 }, (_, i) => {
      const row = (schedRows as { day_of_week: number; is_working: boolean }[]).find(s => s.day_of_week === i);
      return { day_of_week: i, is_working: row ? row.is_working : i !== 0 };
    });
    return { ...b, schedule };
  }));

  return NextResponse.json([
    { id: 0, name: "El que más pronto me pueda atender", specialty: "Cualquier maestro disponible", rune: "᛭", schedule: null },
    ...withSchedule,
  ]);
}
