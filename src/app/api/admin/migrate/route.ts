import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// Migración única — agrega columnas role y barber_name a la tabla users
// Llamar una sola vez: POST /api/admin/migrate { "secret": "narvek-dev-2025" }
export async function POST(req: NextRequest) {
  const { secret } = await req.json();

  if (secret !== (process.env.DEV_SECRET ?? "narvek-dev-2025")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'client'`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS barber_name VARCHAR(200)`;

  return NextResponse.json({ ok: true, message: "Migración completada: columnas role y barber_name agregadas." });
}
