import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// Migración acumulativa — segura para re-ejecutar (IF NOT EXISTS)
// POST /api/admin/migrate { "secret": "narvek-dev-2025" }
export async function POST(req: NextRequest) {
  const { secret } = await req.json();

  if (secret !== (process.env.DEV_SECRET ?? "narvek-dev-2025")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const steps: string[] = [];

  // ── v1: roles ──────────────────────────────────────────────
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'client'`;
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS barber_name VARCHAR(200)`;
  steps.push("v1: columnas role y barber_name en users");

  // ── v2: multi-barbería ─────────────────────────────────────
  // Tabla de barberías
  await sql`
    CREATE TABLE IF NOT EXISTS barbershops (
      id          VARCHAR(80)  PRIMARY KEY,
      name        VARCHAR(200) NOT NULL,
      slug        VARCHAR(80)  UNIQUE NOT NULL,
      owner_email VARCHAR(200),
      created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
    )
  `;
  steps.push("v2: tabla barbershops creada");

  // Barbería por defecto para datos existentes
  await sql`
    INSERT INTO barbershops (id, name, slug, owner_email)
    VALUES ('invictus', 'Invictus Barbería', 'invictus', 'admin@invictus.com')
    ON CONFLICT (id) DO NOTHING
  `;
  steps.push("v2: barbería 'invictus' insertada");

  // Columna barbershop_id en users
  await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS barbershop_id VARCHAR(80) REFERENCES barbershops(id)`;
  steps.push("v2: columna barbershop_id en users");

  // Columna barbershop_id en reservations
  await sql`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS barbershop_id VARCHAR(80) REFERENCES barbershops(id)`;
  steps.push("v2: columna barbershop_id en reservations");

  // Migrar reservas existentes sin barbershop_id a 'invictus'
  await sql`UPDATE reservations SET barbershop_id = 'invictus' WHERE barbershop_id IS NULL`;
  steps.push("v2: reservas existentes migradas a 'invictus'");

  // Migrar users existentes sin barbershop_id a 'invictus'
  await sql`UPDATE users SET barbershop_id = 'invictus' WHERE barbershop_id IS NULL AND role IN ('owner','employee')`;
  steps.push("v2: empleados/owners existentes migrados a 'invictus'");

  // ── cleanup: eliminar barberías de prueba ───────────────────
  // Encuentra la barbería real (Inmortales) para reasignar referencias
  const realShops = await sql`SELECT id FROM barbershops WHERE name ILIKE '%inmortales%' LIMIT 1`;
  if (realShops.length > 0) {
    const realId = realShops[0].id as string;
    // Reasignar users y reservas que apunten a barberías falsas
    await sql`UPDATE users SET barbershop_id = ${realId} WHERE barbershop_id NOT IN (SELECT id FROM barbershops WHERE name ILIKE '%inmortales%') AND barbershop_id IS NOT NULL`;
    await sql`UPDATE reservations SET barbershop_id = ${realId} WHERE barbershop_id NOT IN (SELECT id FROM barbershops WHERE name ILIKE '%inmortales%') AND barbershop_id IS NOT NULL`;
    // Eliminar barberías que no son la real
    await sql`DELETE FROM barbershops WHERE name NOT ILIKE '%inmortales%'`;
    steps.push(`cleanup: barberías de prueba eliminadas, todo migrado a '${realId}'`);
  } else {
    steps.push("cleanup: no se encontró 'Barberia los Inmortales', limpieza omitida");
  }

  return NextResponse.json({ ok: true, steps });
}
