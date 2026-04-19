import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { sendConfirmacion } from "@/lib/email";

const BID = () => process.env.BARBERSHOP_ID ?? "narvek";

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

// GET — reservas de esta barbería; si se pasa ?email= filtra por cliente
export async function GET(req: NextRequest) {
  const email = new URL(req.url).searchParams.get("email");

  const rows = email
    ? await sql`
        SELECT id, client_name, client_email, service, price, barber,
               date::text AS date, time, status, invoice_id, created_at
        FROM reservations
        WHERE barbershop_id  = ${BID()}
          AND client_email   = ${email.toLowerCase()}
        ORDER BY date DESC, time DESC
      `
    : await sql`
        SELECT id, client_name, client_email, service, price, barber,
               date::text AS date, time, status, invoice_id, created_at
        FROM reservations
        WHERE barbershop_id = ${BID()}
        ORDER BY created_at DESC
      `;

  return NextResponse.json(rows.map(toRes));
}

// POST — crear reserva en esta barbería
export async function POST(req: NextRequest) {
  const d = await req.json();
  const bid = BID();

  // Verificar conflicto de horario dentro de esta barbería
  if (d.barbero && d.barbero !== "El que más pronto me pueda atender") {
    const conflict = await sql`
      SELECT id FROM reservations
      WHERE barber = ${d.barbero}
        AND date   = ${d.fecha}
        AND time   = ${d.hora}
        AND status != 'cancelada'
        AND barbershop_id = ${bid}
    `;
    if (conflict.length > 0) {
      return NextResponse.json(
        { error: `${d.barbero.split(" ")[0]} ya tiene una cita a las ${d.hora}. Elige otro horario.` },
        { status: 409 }
      );
    }
  }

  // Validar formato email si se proporciona
  if (d.clienteEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.clienteEmail).trim())) {
    return NextResponse.json({ error: "Formato de email inválido." }, { status: 400 });
  }

  const finalBid = d.barbershopId ?? bid;

  // Auto-add missing columns if schema is behind migrations
  await sql`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS client_phone TEXT`.catch(() => {});
  await sql`ALTER TABLE reservations ADD COLUMN IF NOT EXISTS barbershop_id TEXT`.catch(() => {});

  const [row] = await sql`
    INSERT INTO reservations
      (client_name, client_email, client_phone, service, price, barber, date, time, status, barbershop_id)
    VALUES
      (${d.clienteNombre}, ${d.clienteEmail ?? null}, ${d.clientePhone ?? null}, ${d.servicio}, ${d.precio},
       ${d.barbero}, ${d.fecha}::date, ${d.hora}, 'pendiente', ${finalBid})
    RETURNING id, client_name, client_email, client_phone, service, price, barber,
              date::text AS date, time, status, invoice_id, created_at
  `;
  // Enviar email de confirmación (no bloqueante)
  if (row.client_email) {
    sql`SELECT nombre_comercial, email_fiscal FROM barbershops WHERE id = ${finalBid}`
      .then(bs => {
        const b = bs[0];
        sendConfirmacion({
          to:             String(row.client_email),
          nombre:         String(row.client_name),
          servicio:       String(row.service),
          barbero:        String(row.barber),
          fecha:          String(row.date),
          hora:           String(row.time),
          barberiaNombre: b?.nombre_comercial ? String(b.nombre_comercial) : undefined,
          barberiaEmail:  b?.email_fiscal     ? String(b.email_fiscal)     : undefined,
        });
      }).catch(() => {});
  }

  return NextResponse.json(toRes(row), { status: 201 });
}
