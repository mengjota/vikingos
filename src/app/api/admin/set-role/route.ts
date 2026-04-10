import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// Endpoint exclusivo Narvek System
// POST /api/admin/set-role
// { "email": "...", "role": "owner|employee|client", "barbershopId": "invictus", "secret": "narvek-dev-2025" }
export async function POST(req: NextRequest) {
  const { email, role, barbershopId, secret } = await req.json();

  if (secret !== (process.env.DEV_SECRET ?? "narvek-dev-2025")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!["owner", "employee", "client"].includes(role)) {
    return NextResponse.json({ error: "Rol inválido. Usa: owner, employee, client" }, { status: 400 });
  }

  const bid = barbershopId ?? process.env.BARBERSHOP_ID ?? "invictus";

  const result = await sql`
    UPDATE users
    SET role = ${role}, barbershop_id = ${bid}
    WHERE email = ${email.toLowerCase()}
    RETURNING id, name, email, role, barbershop_id
  `;

  if (result.length === 0) {
    return NextResponse.json({ error: "Usuario no encontrado. Debe crear su cuenta primero en /login." }, { status: 404 });
  }

  return NextResponse.json({ ok: true, user: result[0] });
}
