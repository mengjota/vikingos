import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { verifySession } from "@/lib/session";

async function getOwnerInfo(email: string) {
  if (!email) return null;
  const rows = await sql`
    SELECT u.role, u.barbershop_id, b.id AS bs_id, b.name AS bs_name, b.slug
    FROM users u
    LEFT JOIN barbershops b ON b.id = u.barbershop_id
    WHERE u.email = ${email.toLowerCase()}
  `;
  if (rows.length === 0 || rows[0].role !== "owner") return null;
  return rows[0];
}

// GET — devuelve info de la barbería del owner
export async function GET(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  const info = await getOwnerInfo(email);
  if (!info) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  return NextResponse.json({
    id:   info.bs_id,
    name: info.bs_name,
    slug: info.slug,
  });
}

// PUT — actualiza el nombre de la barbería
export async function PUT(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  const info = await getOwnerInfo(email);
  if (!info) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name } = await req.json();
  if (!name || String(name).trim().length < 2) {
    return NextResponse.json({ error: "El nombre debe tener al menos 2 caracteres" }, { status: 400 });
  }

  const cleanName = String(name).trim();
  await sql`UPDATE barbershops SET name = ${cleanName} WHERE id = ${info.bs_id}`;

  return NextResponse.json({ ok: true, name: cleanName });
}
