import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// Gestión de barberías — solo Narvek System
// POST: crear nueva barbería
// GET: listar todas
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-secret");
  if (secret !== (process.env.DEV_SECRET ?? "narvek-dev-2025")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const rows = await sql`SELECT * FROM barbershops ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { name, slug, ownerEmail, secret } = await req.json();

  if (secret !== (process.env.DEV_SECRET ?? "narvek-dev-2025")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!name || !slug) {
    return NextResponse.json({ error: "name y slug son requeridos" }, { status: 400 });
  }

  const existing = await sql`SELECT id FROM barbershops WHERE id = ${slug} OR slug = ${slug}`;
  if (existing.length > 0) {
    return NextResponse.json({ error: "Ya existe una barbería con ese slug" }, { status: 409 });
  }

  const [row] = await sql`
    INSERT INTO barbershops (id, name, slug, owner_email)
    VALUES (${slug}, ${name}, ${slug}, ${ownerEmail ?? null})
    RETURNING *
  `;

  return NextResponse.json({ ok: true, barbershop: row }, { status: 201 });
}
