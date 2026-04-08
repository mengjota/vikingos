import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// Mapea fila DB → interfaz Reservation
function toRes(r: Record<string, unknown>) {
  return {
    id:            String(r.id),
    servicio:      r.service,
    precio:        r.price,
    barbero:       r.barber,
    fecha:         String(r.date ?? "").split("T")[0],
    hora:          r.time,
    creadaEl:      String(r.created_at ?? "").split("T")[0],
    clienteEmail:  r.client_email,
    clienteNombre: r.client_name,
    estado:        r.status,
    facturaId:     r.invoice_id,
  };
}

// GET — todas las reservas (admin)
export async function GET() {
  const rows = await sql`
    SELECT id, client_name, client_email, service, price, barber,
           date::text AS date, time, status, invoice_id, created_at
    FROM reservations ORDER BY created_at DESC
  `;
  return NextResponse.json(rows.map(toRes));
}

// POST — crear reserva
export async function POST(req: NextRequest) {
  const d = await req.json();

  // Verificar conflicto de horario
  if (d.barbero && d.barbero !== "El que más pronto me pueda atender") {
    const conflict = await sql`
      SELECT id FROM reservations
      WHERE barber = ${d.barbero}
        AND date  = ${d.fecha}
        AND time  = ${d.hora}
        AND status != 'cancelada'
    `;
    if (conflict.length > 0) {
      return NextResponse.json(
        { error: `${d.barbero.split(" ")[0]} ya tiene una cita a las ${d.hora}. Elige otro horario.` },
        { status: 409 }
      );
    }
  }

  const [row] = await sql`
    INSERT INTO reservations (client_name, client_email, service, price, barber, date, time, status)
    VALUES (${d.clienteNombre}, ${d.clienteEmail ?? null}, ${d.servicio}, ${d.precio}, ${d.barbero}, ${d.fecha}::date, ${d.hora}, 'pendiente')
    RETURNING id, client_name, client_email, service, price, barber,
              date::text AS date, time, status, invoice_id, created_at
  `;
  return NextResponse.json(toRes(row), { status: 201 });
}
