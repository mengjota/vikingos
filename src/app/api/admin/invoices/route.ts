import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { verifySession } from "@/lib/session";

async function getOwnerBarbershop(email: string): Promise<string | null> {
  const rows = await sql`SELECT barbershop_id FROM owner_config WHERE owner_email = ${email} LIMIT 1`;
  return rows.length > 0 ? rows[0].barbershop_id : null;
}

export async function GET(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  const barbershopId = await getOwnerBarbershop(email);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const rows = await sql`
    SELECT id::text as id, client_email as "clienteEmail", client_name as "clienteNombre", 
           items as "productosAdicionales", total, payment_method as "metodoPago", 
           arrival_date as fecha, arrival_time as hora, notes as barbero
    FROM orders
    WHERE barbershop_id = ${barbershopId}
    ORDER BY created_at DESC
  `;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  const barbershopId = await getOwnerBarbershop(email);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  // invoice format: reservaId, clienteEmail, clienteNombre, servicio, barbero, fecha, hora, precioServicio, metodoPago, productosAdicionales, subtotalProductos, total

  const inserted = await sql`
    INSERT INTO orders (
      barbershop_id, client_email, client_name, items, total, payment_method, arrival_date, arrival_time, notes, status
    ) VALUES (
      ${barbershopId}, ${body.clienteEmail ?? ""}, ${body.clienteNombre ?? ""}, ${JSON.stringify(body.productosAdicionales ?? [])}, 
      ${body.total ?? 0}, ${body.metodoPago ?? "efectivo"}, ${body.fecha}, ${body.hora}, ${body.barbero}, 'completada'
    )
    RETURNING id::text as id
  `;

  return NextResponse.json({ ok: true, id: inserted[0].id });
}
