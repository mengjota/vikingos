import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { verifySession } from "@/lib/session";

async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS pauses (
      id SERIAL PRIMARY KEY,
      barbershop_id TEXT NOT NULL,
      barbero TEXT NOT NULL,
      fecha TEXT NOT NULL,
      horaInicio TEXT NOT NULL,
      horaFin TEXT NOT NULL,
      motivo TEXT DEFAULT 'Descanso',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

async function getOwnerBarbershop(email: string): Promise<string | null> {
  const rows = await sql`SELECT barbershop_id FROM owner_config WHERE owner_email = ${email} LIMIT 1`;
  return rows.length > 0 ? rows[0].barbershop_id : null;
}

export async function GET(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  const barbershopId = await getOwnerBarbershop(email);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await initDB();

  const rows = await sql`
    SELECT id::text as id, barbero, fecha, horaInicio, horaFin, motivo
    FROM pauses
    WHERE barbershop_id = ${barbershopId}
    ORDER BY fecha DESC, horaInicio ASC
  `;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  const barbershopId = await getOwnerBarbershop(email);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await initDB();

  const { barbero, fecha, horaInicio, horaFin, motivo } = await req.json();

  const inserted = await sql`
    INSERT INTO pauses (barbershop_id, barbero, fecha, horaInicio, horaFin, motivo)
    VALUES (${barbershopId}, ${barbero}, ${fecha}, ${horaInicio}, ${horaFin}, ${motivo})
    RETURNING id::text as id
  `;

  return NextResponse.json({ ok: true, id: inserted[0].id });
}

export async function DELETE(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  const barbershopId = await getOwnerBarbershop(email);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  await initDB();
  const { id } = await req.json();

  await sql`DELETE FROM pauses WHERE id = ${Number(id)} AND barbershop_id = ${barbershopId}`;
  return NextResponse.json({ ok: true });
}
