import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

const BID = () => process.env.BARBERSHOP_ID ?? "narvek";

// POST /api/employee/clock-pin { pin: "1234" }
// No requiere sesión — el empleado ficha con su PIN desde tablet compartida
export async function POST(req: NextRequest) {
  const { pin } = await req.json();
  if (!pin || !/^\d{4}$/.test(String(pin))) {
    return NextResponse.json({ error: "PIN de 4 dígitos requerido" }, { status: 400 });
  }

  // Buscar empleado por PIN en esta barbería
  const empRows = await sql`
    SELECT id, name, email, barber_name
    FROM users
    WHERE pin = ${String(pin)} AND barbershop_id = ${BID()} AND role = 'employee'
    LIMIT 1
  `;
  if (empRows.length === 0) {
    return NextResponse.json({ error: "PIN incorrecto" }, { status: 401 });
  }

  const emp = empRows[0];

  // Auto-crear tabla si no existe
  await sql`
    CREATE TABLE IF NOT EXISTS time_logs (
      id SERIAL PRIMARY KEY,
      barbershop_id TEXT NOT NULL,
      employee_email TEXT NOT NULL,
      employee_name TEXT,
      clock_in TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      clock_out TIMESTAMPTZ,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `.catch(() => {});

  // Buscar turno activo
  const active = await sql`
    SELECT id, clock_in FROM time_logs
    WHERE employee_email = ${emp.email as string}
      AND barbershop_id = ${BID()}
      AND status = 'active'
    ORDER BY clock_in DESC LIMIT 1
  `;

  if (active.length > 0) {
    // Clock OUT
    await sql`
      UPDATE time_logs SET clock_out = NOW(), status = 'completed'
      WHERE id = ${active[0].id}
    `;
    const mins = Math.floor((Date.now() - new Date(active[0].clock_in as string).getTime()) / 60000);
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return NextResponse.json({
      action: "out",
      name: emp.name,
      barberName: emp.barber_name,
      duration: hrs > 0 ? `${hrs}h ${m}m` : `${m}m`,
    });
  } else {
    // Clock IN
    await sql`
      INSERT INTO time_logs (barbershop_id, employee_email, employee_name, clock_in, status)
      VALUES (${BID()}, ${emp.email as string}, ${emp.name as string}, NOW(), 'active')
    `;
    return NextResponse.json({
      action: "in",
      name: emp.name,
      barberName: emp.barber_name,
    });
  }
}
