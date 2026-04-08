import { NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET() {
  const clientes = await sql`
    SELECT
      u.id,
      u.name,
      u.email,
      u.email_verified,
      u.created_at,
      COUNT(r.id) AS total_reservas
    FROM users u
    LEFT JOIN reservations r ON r.client_email = u.email
    GROUP BY u.id, u.name, u.email, u.email_verified, u.created_at
    ORDER BY u.created_at DESC
  `;
  return NextResponse.json(clientes);
}
