import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Correo y contraseña requeridos." }, { status: 400 });
  }

  const rows = await sql`SELECT id, name, email, password_hash, email_verified FROM users WHERE email = ${email.toLowerCase()}`;
  if (rows.length === 0) {
    return NextResponse.json({ error: "No existe una cuenta con ese correo." }, { status: 404 });
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) {
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  if (!user.email_verified) {
    return NextResponse.json({ error: "Confirma tu correo antes de entrar. Revisa tu bandeja de entrada.", unverified: true }, { status: 403 });
  }

  return NextResponse.json({ ok: true, name: user.name, email: user.email });
}
