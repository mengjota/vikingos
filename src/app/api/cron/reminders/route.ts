import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { sendRecordatorio } from "@/lib/email";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const reservations = await sql`
    SELECT client_name, client_email, service, barber, date::text AS date, time
    FROM reservations
    WHERE date = ${tomorrowStr}::date
      AND status = 'pendiente'
      AND client_email IS NOT NULL
      AND client_email != ''
  `;

  let sent = 0;
  for (const r of reservations) {
    try {
      await sendRecordatorio({
        to:       String(r.client_email),
        nombre:   String(r.client_name),
        servicio: String(r.service),
        barbero:  String(r.barber),
        fecha:    String(r.date),
        hora:     String(r.time),
      });
      sent++;
    } catch (_) {}
  }

  return NextResponse.json({ ok: true, sent, total: reservations.length });
}
