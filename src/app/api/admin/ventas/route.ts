import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { verifySession } from "@/lib/session";

async function getOwnerBid(email: string): Promise<string | null> {
  const rows = await sql`SELECT barbershop_id, role FROM users WHERE email = ${email.toLowerCase()} LIMIT 1`;
  if (!rows.length || rows[0].role !== "owner") return null;
  return (rows[0].barbershop_id as string) ?? process.env.BARBERSHOP_ID ?? "narvek";
}

// GET /api/admin/ventas?mes=2026-04  — todas las ventas del mes (owner)
export async function GET(req: NextRequest) {
  const session = await verifySession();
  if (!session || session.role !== "owner") return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const bid = await getOwnerBid(session.email);
  if (!bid) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const mes = searchParams.get("mes"); // "2026-04"

  let rows;
  if (mes) {
    const desde = `${mes}-01`;
    rows = await sql`
      SELECT * FROM ventas
      WHERE barbershop_id = ${bid}
        AND created_at >= ${desde}::date
        AND created_at <  (${desde}::date + interval '1 month')
      ORDER BY created_at DESC
    `;
  } else {
    rows = await sql`
      SELECT * FROM ventas WHERE barbershop_id = ${bid} ORDER BY created_at DESC LIMIT 500
    `;
  }

  return NextResponse.json(rows);
}
