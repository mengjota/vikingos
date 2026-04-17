import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

async function getOwnerBarbershop(email: string): Promise<string | null> {
  if (!email) return null;
  const rows = await sql`
    SELECT role, barbershop_id FROM users WHERE email = ${email.toLowerCase()}
  `;
  if (rows.length === 0 || rows[0].role !== "owner") return null;
  return (rows[0].barbershop_id as string) ?? (process.env.BARBERSHOP_ID ?? "narvek");
}

// GET — lista servicios de la barbería del owner
export async function GET(req: NextRequest) {
  const callerEmail = req.headers.get("x-caller-email") ?? "";
  const barbershopId = await getOwnerBarbershop(callerEmail);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const rows = await sql`
    SELECT id, barbershop_id, name, price, duration_min, description, active, created_at
    FROM services
    WHERE barbershop_id = ${barbershopId}
    ORDER BY id ASC
  `;
  return NextResponse.json(rows);
}

// POST — crear servicio
export async function POST(req: NextRequest) {
  const callerEmail = req.headers.get("x-caller-email") ?? "";
  const barbershopId = await getOwnerBarbershop(callerEmail);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, price, duration_min, description } = await req.json();
  if (!name || !price) {
    return NextResponse.json({ error: "Nombre y precio son requeridos" }, { status: 400 });
  }

  const [row] = await sql`
    INSERT INTO services (barbershop_id, name, price, duration_min, description)
    VALUES (${barbershopId}, ${name}, ${price}, ${duration_min ?? 30}, ${description ?? ''})
    RETURNING id, barbershop_id, name, price, duration_min, description, active, created_at
  `;
  return NextResponse.json({ ok: true, service: row }, { status: 201 });
}

// PUT — actualizar servicio
export async function PUT(req: NextRequest) {
  const callerEmail = req.headers.get("x-caller-email") ?? "";
  const barbershopId = await getOwnerBarbershop(callerEmail);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id, name, price, duration_min, description, active } = await req.json();
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const [row] = await sql`
    UPDATE services
    SET
      name = COALESCE(${name}, name),
      price = COALESCE(${price}, price),
      duration_min = COALESCE(${duration_min}, duration_min),
      description = COALESCE(${description}, description),
      active = COALESCE(${active}, active)
    WHERE id = ${id} AND barbershop_id = ${barbershopId}
    RETURNING id, barbershop_id, name, price, duration_min, description, active, created_at
  `;

  if (!row) return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true, service: row });
}

// DELETE — eliminar servicio
export async function DELETE(req: NextRequest) {
  const callerEmail = req.headers.get("x-caller-email") ?? "";
  const barbershopId = await getOwnerBarbershop(callerEmail);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });

  const result = await sql`
    DELETE FROM services
    WHERE id = ${id} AND barbershop_id = ${barbershopId}
    RETURNING id, name
  `;

  if (result.length === 0) {
    return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, deleted: result[0] });
}
