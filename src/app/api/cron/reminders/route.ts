import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { sendRecordatorio } from "@/lib/email";
import { sendPushToEmail } from "@/lib/push";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const reservations = await sql`
    SELECT r.client_name, r.client_email, r.service, r.barber,
           r.date::text AS date, r.time, r.cancel_token,
           b.nombre_comercial, b.email_fiscal, b.phone
    FROM reservations r
    LEFT JOIN barbershops b ON b.id = r.barbershop_id
    WHERE r.date = ${tomorrowStr}::date
      AND r.status = 'pendiente'
      AND r.client_email IS NOT NULL
      AND r.client_email != ''
  `;

  let sent = 0;
  for (const r of reservations) {
    try {
      await sendRecordatorio({
        to:             String(r.client_email),
        nombre:         String(r.client_name),
        servicio:       String(r.service),
        barbero:        String(r.barber),
        fecha:          String(r.date),
        hora:           String(r.time),
        barberiaNombre: r.nombre_comercial ? String(r.nombre_comercial) : undefined,
        barberiaEmail:  r.email_fiscal     ? String(r.email_fiscal)     : undefined,
        barberiaPhone:  r.phone            ? String(r.phone)            : undefined,
        cancelToken:    r.cancel_token     ? String(r.cancel_token)     : undefined,
      });
      // Push si el cliente tiene suscripción activa
      sendPushToEmail(String(r.client_email), {
        title: "Recuerda tu cita mañana 💈",
        body: `${r.service} con ${r.barber} a las ${r.time}`,
        url: "/mis-reservas",
        tag: "recordatorio",
      }).catch(() => {});
      sent++;
    } catch (_) {}
  }

  return NextResponse.json({ ok: true, sent, total: reservations.length });
}
