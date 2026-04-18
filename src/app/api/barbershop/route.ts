import { NextResponse } from "next/server";
import sql from "@/lib/db";

const BID = () => process.env.BARBERSHOP_ID ?? "narvek";

// GET /api/barbershop — info pública de la barbería de este despliegue
export async function GET() {
  const rows = await sql`SELECT id, name, slug FROM barbershops WHERE id = ${BID()}`;
  if (rows.length === 0) return NextResponse.json({ id: BID(), name: BID(), slug: BID() });
  return NextResponse.json(rows[0]);
}
