import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const barbershopId = searchParams.get("barbershopId") ?? process.env.BARBERSHOP_ID ?? "narvek";

  const rows = await sql`
    SELECT id, barbershop_id, name, price, duration_min, description, active, created_at
    FROM services
    WHERE barbershop_id = ${barbershopId} AND active = true
    ORDER BY id ASC
  `;

  return NextResponse.json(rows);
}
