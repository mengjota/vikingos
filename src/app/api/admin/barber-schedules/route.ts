import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { verifySession } from "@/lib/session";

let _tablesReady = false;
async function ensureTables() {
  if (_tablesReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS barber_schedules (
      id            SERIAL PRIMARY KEY,
      barbershop_id TEXT NOT NULL,
      user_id       INT  NOT NULL,
      day_of_week   INT  NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
      is_working    BOOLEAN NOT NULL DEFAULT true,
      start_time    TEXT NOT NULL DEFAULT '09:00',
      end_time      TEXT NOT NULL DEFAULT '20:00',
      UNIQUE(user_id, day_of_week)
    )
  `;
  try { await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_barber BOOLEAN DEFAULT true`; } catch (_) {}
  try { await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS barber_specialty TEXT`; } catch (_) {}
  _tablesReady = true;
}

const DEFAULT_SCHEDULE = Array.from({ length: 7 }, (_, i) => ({
  day_of_week: i,
  is_working: i !== 0, // Dom cerrado
  start_time: "09:00",
  end_time: "20:00",
}));

function mergeSchedule(rows: Record<string, unknown>[]) {
  return DEFAULT_SCHEDULE.map(def => {
    const row = rows.find(r => Number(r.day_of_week) === def.day_of_week);
    return row ? { day_of_week: def.day_of_week, is_working: row.is_working, start_time: String(row.start_time), end_time: String(row.end_time) } : def;
  });
}

// GET — devuelve todos los barberos con su horario semanal
export async function GET(req: NextRequest) {
  const session = await verifySession();
  if (!session || (session.role !== "owner" && session.role !== "employee")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await ensureTables();

  const bid = session.barbershopId ?? (process.env.BARBERSHOP_ID ?? "narvek");

  // Empleados + owner si is_barber
  const users = await sql`
    SELECT id, name, barber_name, email, role, is_barber, barber_specialty
    FROM users
    WHERE barbershop_id = ${bid}
      AND (role = 'employee' OR (role = 'owner' AND is_barber = true))
    ORDER BY role DESC, name
  `;

  const result = await Promise.all(users.map(async u => {
    const schedRows = await sql`
      SELECT day_of_week, is_working, start_time, end_time
      FROM barber_schedules WHERE user_id = ${u.id}
    `;
    return {
      userId: u.id,
      name: u.name,
      barberName: u.barber_name,
      role: u.role,
      isBarber: u.is_barber !== false,
      specialty: u.barber_specialty ?? "",
      schedule: mergeSchedule(schedRows),
    };
  }));

  return NextResponse.json(result);
}

// PUT — actualiza horario de un barbero específico (owner) o el propio (employee/owner self)
export async function PUT(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await ensureTables();

  const { userId, barberName, specialty, isBarber, schedule } = await req.json();
  const bid = session.barbershopId ?? (process.env.BARBERSHOP_ID ?? "narvek");

  // Employee solo puede editar su propio perfil y NO puede cambiar su horario
  if (session.role === "employee" && userId !== session.userId) {
    return NextResponse.json({ error: "Solo puedes editar tu propio perfil" }, { status: 403 });
  }

  // Actualizar campos del usuario
  await sql`
    UPDATE users SET
      barber_name      = COALESCE(${barberName ?? null}, barber_name),
      barber_specialty = COALESCE(${specialty ?? null}, barber_specialty),
      is_barber        = ${isBarber ?? true}
    WHERE id = ${userId} AND barbershop_id = ${bid}
  `;

  // Solo el jefe puede modificar horarios
  if (session.role !== "owner") {
    return NextResponse.json({ ok: true });
  }

  // Guardar horario
  if (Array.isArray(schedule)) {
    for (const day of schedule) {
      await sql`
        INSERT INTO barber_schedules (barbershop_id, user_id, day_of_week, is_working, start_time, end_time)
        VALUES (${bid}, ${userId}, ${day.day_of_week}, ${day.is_working}, ${day.start_time}, ${day.end_time})
        ON CONFLICT (user_id, day_of_week) DO UPDATE SET
          is_working = EXCLUDED.is_working,
          start_time = EXCLUDED.start_time,
          end_time   = EXCLUDED.end_time
      `;
    }
  }

  return NextResponse.json({ ok: true });
}
