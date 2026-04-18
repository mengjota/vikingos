import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { createSession } from "@/lib/session";

let _tableReady = false;
async function ensureLoginAttemptsTable() {
  if (_tableReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id           SERIAL PRIMARY KEY,
      email        TEXT NOT NULL,
      ip           TEXT NOT NULL DEFAULT '',
      attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  _tableReady = true;
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Correo y contraseña requeridos." }, { status: 400 });
  }

  const normalizedEmail = email.toLowerCase();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // Rate limiting: máx 5 intentos fallidos en 15 minutos
  try {
    await ensureLoginAttemptsTable();
    const [{ count }] = await sql`
      SELECT COUNT(*)::int AS count FROM login_attempts
      WHERE email = ${normalizedEmail} AND attempted_at > now() - interval '15 minutes'
    `;
    if (count >= 5) {
      return NextResponse.json(
        { error: "Demasiados intentos fallidos. Espera 15 minutos e inténtalo de nuevo." },
        { status: 429 }
      );
    }
  } catch (_) {}

  const rows = await sql`
    SELECT u.id, u.name, u.email, u.password_hash, u.role, u.barber_name,
           u.barbershop_id, b.name AS barbershop_name
    FROM users u
    LEFT JOIN barbershops b ON b.id = u.barbershop_id
    WHERE u.email = ${normalizedEmail}
  `;

  if (rows.length === 0) {
    try { await sql`INSERT INTO login_attempts (email, ip) VALUES (${normalizedEmail}, ${ip})`; } catch (_) {}
    return NextResponse.json({ error: "No existe una cuenta con ese correo." }, { status: 404 });
  }

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash as string);
  if (!match) {
    try { await sql`INSERT INTO login_attempts (email, ip) VALUES (${normalizedEmail}, ${ip})`; } catch (_) {}
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  // Login correcto: limpiar intentos fallidos
  try { await sql`DELETE FROM login_attempts WHERE email = ${normalizedEmail}`; } catch (_) {}

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

  return NextResponse.json({ ok: true, ...sessionPayload });
}
