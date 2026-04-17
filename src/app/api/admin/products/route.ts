import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { verifySession } from "@/lib/session";

async function getOwnerBarbershop(email: string): Promise<string | null> {
  if (!email) return null;
  const rows = await sql`SELECT barbershop_id FROM owner_config WHERE owner_email = ${email} LIMIT 1`;
  return rows.length > 0 ? rows[0].barbershop_id : null;
}

// GET — lista productos de la barbería
export async function GET(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  const barbershopId = await getOwnerBarbershop(email);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const rows = await sql`
    SELECT id::text as id, name as nombre, description as descripcion, price::numeric as precio, price_display, volume as volumen, category as categoria, featured as destacado
    FROM products
    WHERE barbershop_id = ${barbershopId} AND active = true
    ORDER BY created_at DESC
  `;
  return NextResponse.json(rows);
}

// POST — crear producto
export async function POST(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  
  const barbershopId = await getOwnerBarbershop(email);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { nombre, descripcion, precio, volumen, categoria, destacado } = await req.json();

  const inserted = await sql`
    INSERT INTO products (barbershop_id, name, description, price, price_display, volume, category, featured)
    VALUES (${barbershopId}, ${nombre}, ${descripcion}, ${precio}, ${"$" + precio}, ${volumen}, ${categoria}, ${destacado})
    RETURNING id::text as id
  `;

  return NextResponse.json({ ok: true, id: inserted[0].id });
}

// PUT — actualizar producto
export async function PUT(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  const barbershopId = await getOwnerBarbershop(email);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id, nombre, descripcion, precio, volumen, categoria, destacado } = await req.json();

  await sql`
    UPDATE products
    SET name = ${nombre}, description = ${descripcion}, price = ${precio}, price_display = ${"$" + precio},
        volume = ${volumen}, category = ${categoria}, featured = ${destacado}
    WHERE id = ${Number(id)} AND barbershop_id = ${barbershopId}
  `;

  return NextResponse.json({ ok: true });
}

// DELETE — eliminar producto (soft delete o delete)
export async function DELETE(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  const barbershopId = await getOwnerBarbershop(email);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await req.json();

  await sql`
    DELETE FROM products
    WHERE id = ${Number(id)} AND barbershop_id = ${barbershopId}
  `;

  return NextResponse.json({ ok: true });
}
