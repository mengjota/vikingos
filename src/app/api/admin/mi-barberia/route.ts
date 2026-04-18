import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { verifySession } from "@/lib/session";

async function getOwnerInfo(email: string) {
  if (!email) return null;
  const rows = await sql`
    SELECT u.role, u.barbershop_id,
           b.id AS bs_id, b.name AS bs_name, b.slug,
           b.address, b.phone, b.description
    FROM users u
    LEFT JOIN barbershops b ON b.id = u.barbershop_id
    WHERE u.email = ${email.toLowerCase()}
  `;
  if (rows.length === 0 || rows[0].role !== "owner") return null;
  return rows[0];
}

export async function GET(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  const info = await getOwnerInfo(email);
  if (!info) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  return NextResponse.json({
    id:          info.bs_id,
    name:        info.bs_name,
    slug:        info.slug,
    address:     info.address ?? "",
    phone:       info.phone ?? "",
    description: info.description ?? "",
  });
}

export async function PUT(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  const info = await getOwnerInfo(email);
  if (!info) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { name, address, phone, description } = body;

  if (name !== undefined && String(name).trim().length < 2) {
    return NextResponse.json({ error: "El nombre debe tener al menos 2 caracteres" }, { status: 400 });
  }

  await sql`
    UPDATE barbershops SET
      name        = COALESCE(${name ? String(name).trim() : null}, name),
      address     = COALESCE(${address !== undefined ? String(address) : null}, address),
      phone       = COALESCE(${phone !== undefined ? String(phone) : null}, phone),
      description = COALESCE(${description !== undefined ? String(description) : null}, description)
    WHERE id = ${info.bs_id}
  `;

  const updated = await getOwnerInfo(email);
  return NextResponse.json({
    ok:          true,
    name:        updated?.bs_name ?? "",
    address:     updated?.address ?? "",
    phone:       updated?.phone ?? "",
    description: updated?.description ?? "",
  });
}
