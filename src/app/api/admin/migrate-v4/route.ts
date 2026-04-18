import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// POST /api/admin/migrate-v4 { "secret": "narvek-dev-2025" }
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body.secret !== (process.env.DEV_SECRET ?? "narvek-dev-2025")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const steps: string[] = [];

  // Fichajes
  await sql`
    CREATE TABLE IF NOT EXISTS time_logs (
      id SERIAL PRIMARY KEY,
      barbershop_id TEXT NOT NULL,
      employee_email TEXT NOT NULL,
      employee_name TEXT,
      clock_in TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      clock_out TIMESTAMPTZ,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  steps.push("time_logs");

  // Columnas en barbershops
  await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS address TEXT DEFAULT ''`;
  await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT ''`;
  await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''`;
  steps.push("barbershops: address, phone, description");

  // Tabla products
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      barbershop_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      price_display TEXT NOT NULL DEFAULT '€0',
      volume TEXT DEFAULT '',
      category TEXT DEFAULT 'General',
      featured BOOLEAN DEFAULT false,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  steps.push("products");

  // Tabla services
  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      barbershop_id TEXT NOT NULL,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      duration_min INT DEFAULT 30,
      description TEXT DEFAULT '',
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  steps.push("services");

  return NextResponse.json({ ok: true, steps });
}
