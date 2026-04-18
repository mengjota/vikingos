import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { name, email, password, barbershopId } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Todos los campos son requeridos." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "La contraseña debe tener mínimo 6 caracteres." }, { status: 400 });
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
  if (existing.length > 0) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese correo." }, { status: 409 });
  }

  // Validar barbería si se proporcionó
  let validBarbershopId: string | null = null;
  if (barbershopId) {
    const bs = await sql`SELECT id FROM barbershops WHERE id = ${barbershopId}`;
    if (bs.length > 0) validBarbershopId = barbershopId;
  }

  const hash = await bcrypt.hash(password, 10);
  await sql`
    INSERT INTO users (name, email, password_hash, email_verified, role, barbershop_id)
    VALUES (${name}, ${email.toLowerCase()}, ${hash}, true, 'client', ${validBarbershopId})
  `;

  const sessionPayload = {
    name,
    email: email.toLowerCase(),
    role: "client",
    barberName: null,
    barbershopId: validBarbershopId,
    barbershopName: null, // Si quisieras, podrías consultarlo.
  };

  await createSession(sessionPayload as any);

  return NextResponse.json({ ok: true, ...sessionPayload });
}
