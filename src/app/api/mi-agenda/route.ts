import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

// GET /api/mi-agenda?email=...&weekStart=YYYY-MM-DD (lunes de la semana)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const weekStart = searchParams.get("weekStart"); // lunes

  if (!email || !weekStart) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  // Verificar que es empleado y obtener su nombre de barbero
  const users = await sql`
    SELECT barber_name, role FROM users WHERE email = ${email.toLowerCase()}
  `;
  if (users.length === 0 || users[0].role !== "employee") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const barberName = users[0].barber_name;

  // Calcular domingo (fin de semana)
  const start = new Date(weekStart + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const weekEnd = end.toISOString().split("T")[0];

  const rows = await sql`
    SELECT id, client_name, client_email, service, price, barber,
           date::text AS date, time, status
    FROM reservations
    WHERE barber = ${barberName}
      AND date >= ${weekStart}::date
      AND date <= ${weekEnd}::date
    ORDER BY date ASC, time ASC
  `;

  return NextResponse.json({
    barberName,
    weekStart,
    weekEnd,
    reservations: rows.map((r) => ({
      id: String(r.id),
      clienteNombre: r.client_name,
      servicio: r.service,
      precio: r.price,
      fecha: String(r.date).split("T")[0],
      hora: r.time,
      estado: r.status as "pendiente" | "completada" | "cancelada",
    })),
  });
}
