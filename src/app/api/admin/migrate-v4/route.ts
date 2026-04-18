import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// POST /api/admin/migrate-v4 { "secret": "narvek-dev-2025" }
// Añade columnas faltantes a barbershops y crea tabla products si no existe
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body.secret !== (process.env.DEV_SECRET ?? "narvek-dev-2025")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const steps: string[] = [];

  await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS address TEXT DEFAULT ''`;
  steps.push("barbershops.address");

  await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT ''`;
  steps.push("barbershops.phone");

  await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''`;
  steps.push("barbershops.description");

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id            SERIAL PRIMARY KEY,
      barbershop_id TEXT NOT NULL,
      name          TEXT NOT NULL,
      description   TEXT DEFAULT '',
      price         DECIMAL(10,2) NOT NULL DEFAULT 0,
      price_display TEXT NOT NULL DEFAULT '€0',
      volume        TEXT DEFAULT '',
      category      TEXT DEFAULT 'General',
      featured      BOOLEAN DEFAULT false,
      active        BOOLEAN DEFAULT true,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  steps.push("tabla products");

  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id            SERIAL PRIMARY KEY,
      barbershop_id TEXT NOT NULL,
      name          TEXT NOT NULL,
      price         TEXT NOT NULL,
      duration_min  INT DEFAULT 30,
      description   TEXT DEFAULT '',
      active        BOOLEAN DEFAULT true,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  steps.push("tabla services (si no existía)");

  return NextResponse.json({ ok: true, steps });
}
