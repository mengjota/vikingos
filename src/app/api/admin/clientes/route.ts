import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  const bid = process.env.BARBERSHOP_ID ?? "invictus";

  // Clientes que tienen al menos una reserva en esta barbería
  // o que se registraron sin barbershop_id (clientes públicos)
  const clientes = await sql`
    SELECT
      u.id,
      u.name,
      u.email,
      u.email_verified,
      u.created_at,
      COUNT(r.id) AS total_reservas
    FROM users u
    LEFT JOIN reservations r ON r.client_email = u.email AND r.barbershop_id = ${bid}
    WHERE u.role = 'client'
    GROUP BY u.id, u.name, u.email, u.email_verified, u.created_at
    ORDER BY u.created_at DESC
  `;
  return NextResponse.json(clientes);
}
