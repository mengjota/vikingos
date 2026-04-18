import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { verifySession } from "@/lib/session";

const DAYS = [1, 2, 3, 4, 5, 6, 0]; // Lun-Dom

async function getOwnerBid(email: string): Promise<string | null> {
  if (!email) return null;
  const rows = await sql`SELECT role, barbershop_id FROM users WHERE email = ${email.toLowerCase()}`;
  if (rows.length === 0 || rows[0].role !== "owner") return null;
  return (rows[0].barbershop_id as string) ?? (process.env.BARBERSHOP_ID ?? "narvek");
}

// GET — devuelve el horario semanal completo de la barbería
export async function GET() {
  const session = await verifySession();
  const bid = await getOwnerBid(session?.email ?? "");
  if (!bid) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  // Auto-crear tabla si no existe
  await sql`
    CREATE TABLE IF NOT EXISTS barbershop_hours (
      id           SERIAL PRIMARY KEY,
      barbershop_id TEXT NOT NULL,
      day_of_week  INT  NOT NULL,
      open_time    TEXT NOT NULL DEFAULT '09:00',
      close_time   TEXT NOT NULL DEFAULT '20:00',
      slot_minutes INT  NOT NULL DEFAULT 30,
      active       BOOLEAN NOT NULL DEFAULT true,
      UNIQUE(barbershop_id, day_of_week)
    )
  `;

  const rows = await sql`
    SELECT day_of_week, open_time, close_time, slot_minutes, active
    FROM barbershop_hours
    WHERE barbershop_id = ${bid}
  `;

  // Rellenar los 7 días con defaults si no existen
  const schedule = DAYS.map(d => {
    const row = rows.find(r => r.day_of_week === d);
    return row
      ? { day_of_week: d, open_time: row.open_time, close_time: row.close_time, slot_minutes: Number(row.slot_minutes), active: row.active }
      : { day_of_week: d, open_time: "09:00", close_time: "20:00", slot_minutes: 30, active: d !== 0 }; // Dom cerrado por defecto
  });

  return NextResponse.json(schedule);
}

// PUT — guarda el horario (todos los días de una vez)
export async function PUT(req: NextRequest) {
  const session = await verifySession();
  const bid = await getOwnerBid(session?.email ?? "");
  if (!bid) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const schedule: { day_of_week: number; open_time: string; close_time: string; slot_minutes: number; active: boolean }[] = await req.json();

  for (const day of schedule) {
    await sql`
      INSERT INTO barbershop_hours (barbershop_id, day_of_week, open_time, close_time, slot_minutes, active)
      VALUES (${bid}, ${day.day_of_week}, ${day.open_time}, ${day.close_time}, ${day.slot_minutes}, ${day.active})
      ON CONFLICT (barbershop_id, day_of_week) DO UPDATE SET
        open_time    = EXCLUDED.open_time,
        close_time   = EXCLUDED.close_time,
        slot_minutes = EXCLUDED.slot_minutes,
        active       = EXCLUDED.active
    `;
  }

  return NextResponse.json({ ok: true });
}
