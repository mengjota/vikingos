import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body.secret !== "narvek-dev-2025") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const tablesCreated: string[] = [];

  // ── Tabla services ──────────────────────────────────────────
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
  tablesCreated.push("services");

  // ── Tabla products ──────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      barbershop_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price DECIMAL(10,2) NOT NULL,
      price_display TEXT NOT NULL,
      volume TEXT DEFAULT '',
      category TEXT DEFAULT 'General',
      featured BOOLEAN DEFAULT false,
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  tablesCreated.push("products");

  // ── Tabla orders ────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      barbershop_id TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_name TEXT NOT NULL,
      items JSONB NOT NULL DEFAULT '[]',
      total DECIMAL(10,2) NOT NULL DEFAULT 0,
      payment_method TEXT DEFAULT 'transfer',
      arrival_date TEXT,
      arrival_time TEXT,
      notes TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  tablesCreated.push("orders");

  // ── Servicios por defecto para 'narvek' ─────────────────────
  const inserted = await sql`
    INSERT INTO services (barbershop_id, name, price, duration_min)
    SELECT 'narvek', s.name, s.price, s.dur
    FROM (VALUES
      ('Corte de Cabello', '$80', 30),
      ('Corte y Barba', '$150', 60),
      ('Perfilado de Barba', '$60', 20),
      ('Afeitado al Ras', '$120', 45),
      ('Limpieza Facial', '$100', 40),
      ('Rizos Permanentes', '$220', 90)
    ) AS s(name, price, dur)
    WHERE NOT EXISTS (SELECT 1 FROM services WHERE barbershop_id = 'narvek')
    RETURNING id
  `;

  return NextResponse.json({
    ok: true,
    tablesCreated,
    servicesInserted: inserted.length,
  });
}
