import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// GET /api/reservations/check?barbero=X&fecha=YYYY-MM-DD
// Devuelve las horas ocupadas para ese barbero en esa fecha
export async function GET(req: NextRequest) {
  const barbero = req.nextUrl.searchParams.get("barbero");
  const fecha   = req.nextUrl.searchParams.get("fecha");

  if (!barbero || !fecha) {
    return NextResponse.json([], { status: 200 });
  }

  const bid = process.env.BARBERSHOP_ID ?? "invictus";
  const rows = await sql`
    SELECT time FROM reservations
    WHERE barber = ${barbero}
      AND date   = ${fecha}
      AND status != 'cancelada'
      AND barbershop_id = ${bid}
  `;
  return NextResponse.json(rows.map(r => r.time));
}
