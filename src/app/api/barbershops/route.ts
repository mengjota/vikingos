import { NextResponse } from "next/server";
import sql from "@/lib/db";

// GET /api/barbershops — lista pública de barberías disponibles para registro de clientes
export async function GET() {
  const rows = await sql`
    SELECT id, name, slug FROM barbershops ORDER BY name ASC
  `;
  return NextResponse.json(rows);
}
