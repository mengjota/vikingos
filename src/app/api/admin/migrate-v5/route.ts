import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// POST /api/admin/migrate-v5 { "secret": "narvek-dev-2025" }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body.secret !== (process.env.DEV_SECRET ?? "narvek-dev-2025")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const steps: string[] = [];

  // Tabla horarios por barbería
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
  steps.push("barbershop_hours table");

  // Columna teléfono en reservas (para reservas anónimas)
  await sql`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS client_phone TEXT DEFAULT ''`;
  steps.push("reservations: client_phone column");

  return NextResponse.json({ ok: true, steps });
}
