import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// GET — lookup reservation by token
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token requerido" }, { status: 400 });

  const rows = await sql`
    SELECT id, client_name, service, barber, date::text AS date, time, status
    FROM reservations
    WHERE cancel_token = ${token}
    LIMIT 1
  `;

  if (rows.length === 0) return NextResponse.json({ error: "Enlace no válido o ya usado" }, { status: 404 });
  return NextResponse.json(rows[0]);
}

// POST — cancel reservation by token
export async function POST(req: NextRequest) {
  const token = new URL(req.url).searchParams.get("token");
  if (!token) return NextResponse.json({ error: "Token requerido" }, { status: 400 });

  const rows = await sql`
    SELECT id, status FROM reservations WHERE cancel_token = ${token} LIMIT 1
  `;

  if (rows.length === 0) return NextResponse.json({ error: "Enlace no válido" }, { status: 404 });
  if (rows[0].status === "cancelada") return NextResponse.json({ error: "Esta cita ya estaba cancelada" }, { status: 409 });
  if (rows[0].status === "completada") return NextResponse.json({ error: "Esta cita ya se ha completado y no se puede cancelar" }, { status: 409 });

  await sql`
    UPDATE reservations SET status = 'cancelada' WHERE cancel_token = ${token}
  `;

  return NextResponse.json({ ok: true });
}
