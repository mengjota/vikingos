import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// PATCH — actualizar estado (completada / cancelada) e invoice_id
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { estado, facturaId } = await req.json();

  await sql`
    UPDATE reservations
    SET status = ${estado}, invoice_id = ${facturaId ?? null}
    WHERE id = ${Number(id)}
  `;
  return NextResponse.json({ ok: true });
}
