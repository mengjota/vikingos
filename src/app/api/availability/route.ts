import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

const BID = (override?: string | null) => override ?? process.env.BARBERSHOP_ID ?? "narvek";

function genSlots(openTime: string, closeTime: string, slotMin: number): string[] {
  const slots: string[] = [];
  const [oh, om] = openTime.split(":").map(Number);
  const [ch, cm] = closeTime.split(":").map(Number);
  let cur = oh * 60 + om;
  const end = ch * 60 + cm;
  while (cur < end) {
    const h = Math.floor(cur / 60).toString().padStart(2, "0");
    const m = (cur % 60).toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
    cur += slotMin;
  }
  return slots;
}

// GET /api/availability?fecha=2025-06-10&barbero=Carlos
// GET /api/availability?schedule=true   → devuelve el horario semanal (para el calendario)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bid = BID(searchParams.get("barbershopId"));

  // ── Modo schedule: devuelve qué días de la semana están abiertos ──
  if (searchParams.get("schedule") === "true") {
    let rows: Awaited<ReturnType<typeof sql>> = [];
    try {
      rows = await sql`
        SELECT day_of_week, open_time, close_time, slot_minutes, active
        FROM barbershop_hours
        WHERE barbershop_id = ${bid}
      `;
    } catch {
      // Tabla no existe aún — devolver defaults
    }
    // Si no hay config, devolver defaults: Lun-Sab abiertos
    if (rows.length === 0) {
      const defaults = [1,2,3,4,5,6].map(d => ({ day_of_week: d, open_time: "09:00", close_time: "20:00", slot_minutes: 30, active: true }));
      defaults.push({ day_of_week: 0, open_time: "09:00", close_time: "14:00", slot_minutes: 30, active: false });
      return NextResponse.json(defaults);
    }
    return NextResponse.json(rows.map(r => ({
      day_of_week: r.day_of_week,
      open_time: r.open_time,
      close_time: r.close_time,
      slot_minutes: Number(r.slot_minutes),
      active: r.active,
    })));
  }

  // ── Modo disponibilidad para una fecha ──
  const fecha = searchParams.get("fecha");
  const barbero = searchParams.get("barbero") ?? "";

  if (!fecha) return NextResponse.json({ error: "fecha requerida" }, { status: 400 });

  // Día de la semana (0=Dom)
  const dayOfWeek = new Date(fecha + "T12:00:00").getDay();

  // Obtener horario de ese día
  let hoursRows: Awaited<ReturnType<typeof sql>> = [];
  try {
    hoursRows = await sql`
      SELECT open_time, close_time, slot_minutes, active
      FROM barbershop_hours
      WHERE barbershop_id = ${bid} AND day_of_week = ${dayOfWeek}
    `;
  } catch {
    // Tabla no existe — usar defaults
  }

  const config = hoursRows[0];
  // Sin config: usar defaults Lun-Sab abiertos, Dom cerrado
  const dayOpen = config ? Boolean(config.active) : dayOfWeek !== 0;
  if (!dayOpen) return NextResponse.json({ slots: [], dayOpen: false });

  const openTime   = config?.open_time   ?? "09:00";
  const closeTime  = config?.close_time  ?? "20:00";
  const slotMin    = config ? Number(config.slot_minutes) : 30;

  const allSlots = genSlots(openTime, closeTime, slotMin);

  // Horas ya ocupadas (reservas activas)
  const esEspecifico = barbero && barbero !== "El que más pronto me pueda atender";
  let occupied: string[] = [];

  if (esEspecifico) {
    const resRows = await sql`
      SELECT time FROM reservations
      WHERE barbershop_id = ${bid}
        AND barber = ${barbero}
        AND date::text = ${fecha}
        AND status != 'cancelada'
    `;
    const pauseRows = await sql`
      SELECT hora_inicio, hora_fin FROM pauses
      WHERE barbershop_id = ${bid}
        AND barbero = ${barbero}
        AND fecha = ${fecha}
    `.catch(() => []);

    occupied = resRows.map(r => String(r.time).substring(0, 5));

    // Marcar slots que caigan dentro de una pausa
    for (const pause of pauseRows) {
      const pi = String(pause.hora_inicio).substring(0, 5);
      const pf = String(pause.hora_fin).substring(0, 5);
      for (const slot of allSlots) {
        if (slot >= pi && slot < pf) occupied.push(slot);
      }
    }
  } else {
    // "Cualquiera": mostrar todos los slots (sin filtrar por barbero)
    // Solo bloquear si TODOS los barberos están ocupados en ese slot
    // Por simplicidad, mostramos todos disponibles
  }

  const available = allSlots.filter(s => !occupied.includes(s));

  return NextResponse.json({ slots: available, dayOpen: true, openTime, closeTime });
}
