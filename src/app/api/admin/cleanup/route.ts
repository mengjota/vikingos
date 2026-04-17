import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  const { secret } = await req.json();
  if (secret !== "narvek-dev-2025") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const keepEmail = "feralbluis@gmail.com";

  const deletedUsers = await sql`
    DELETE FROM users WHERE email != ${keepEmail} RETURNING email
  `;
  const deletedReservations = await sql`
    DELETE FROM reservations RETURNING id
  `;

  return NextResponse.json({
    ok: true,
    deletedUsers: deletedUsers.map(r => r.email),
    deletedReservations: deletedReservations.length,
  });
}
