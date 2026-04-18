import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Correo y contraseña requeridos." }, { status: 400 });
  }

  const rows = await sql`
    SELECT u.id, u.name, u.email, u.password_hash, u.role, u.barber_name,
           u.barbershop_id, b.name AS barbershop_name
    FROM users u
    LEFT JOIN barbershops b ON b.id = u.barbershop_id
    WHERE u.email = ${email.toLowerCase()}
  `;
  if (rows.length === 0) {
    return NextResponse.json({ error: "No existe una cuenta con ese correo." }, { status: 404 });
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash as string);
  if (!match) {
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  const sessionPayload = {
    userId: user.id as number,
    name: user.name,
    email: user.email,
    role: user.role ?? "client",
    barberName: user.barber_name ?? null,
    barbershopId: user.barbershop_id ?? null,
    barbershopName: user.barbershop_name ?? null,
  };

  await createSession(sessionPayload as any);

  return NextResponse.json({
    ok: true,
    ...sessionPayload
  });
}
