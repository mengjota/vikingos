import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { barbershopId, code } = await req.json();
    if (!barbershopId || !code) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }
    const rows = await sql`
      SELECT booking_code FROM barbershops WHERE id = ${barbershopId}
    `;
    if (rows.length === 0) return NextResponse.json({ error: "Barbería no encontrada" }, { status: 404 });

    const stored = rows[0].booking_code;
    if (!stored) return NextResponse.json({ ok: true }); // no code required

    if (String(stored).trim().toLowerCase() !== String(code).trim().toLowerCase()) {
      return NextResponse.json({ error: "Código incorrecto" }, { status: 403 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
