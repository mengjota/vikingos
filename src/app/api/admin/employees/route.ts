import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { verifySession } from "@/lib/session";

async function getOwnerBarbershop(email: string): Promise<string | null> {
  if (!email) return null;
  const rows = await sql`
    SELECT role, barbershop_id FROM users WHERE email = ${email.toLowerCase()}
  `;
  if (rows.length === 0 || rows[0].role !== "owner") return null;
  return (rows[0].barbershop_id as string) ?? (process.env.BARBERSHOP_ID ?? "invictus");
}

// GET — lista empleados de la barbería del owner
export async function GET(req: NextRequest) {
  const session = await verifySession();
  const callerEmail = session?.email ?? "";
  const barbershopId = await getOwnerBarbershop(callerEmail);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const rows = await sql`
    SELECT id, name, email, barber_name, created_at
    FROM users
    WHERE role = 'employee' AND barbershop_id = ${barbershopId}
    ORDER BY name
  `;
  return NextResponse.json(rows);
}

// POST — crear cuenta de empleado en la barbería del owner
export async function POST(req: NextRequest) {
  const session = await verifySession();
  const callerEmail = session?.email ?? "";
  const { name, email, password, barberName } = await req.json();

  const barbershopId = await getOwnerBarbershop(callerEmail);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!name || !email || !password || !barberName) {
    return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "La contraseña debe tener mínimo 6 caracteres" }, { status: 400 });
  }

  const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`;
  if (existing.length > 0) {
    return NextResponse.json({ error: "Ya existe un usuario con ese correo" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);
  const [row] = await sql`
    INSERT INTO users (name, email, password_hash, email_verified, role, barber_name, barbershop_id)
    VALUES (${name}, ${email.toLowerCase()}, ${hash}, true, 'employee', ${barberName}, ${barbershopId})
    RETURNING id, name, email, barber_name, barbershop_id
  `;

  return NextResponse.json({ ok: true, employee: row }, { status: 201 });
}

// DELETE — eliminar empleado (solo de la barbería del owner)
export async function DELETE(req: NextRequest) {
  const session = await verifySession();
  const callerEmail = session?.email ?? "";
  const { employeeId } = await req.json();

  const barbershopId = await getOwnerBarbershop(callerEmail);
  if (!barbershopId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const result = await sql`
    DELETE FROM users
    WHERE id = ${employeeId} AND role = 'employee' AND barbershop_id = ${barbershopId}
    RETURNING id, name
  `;

  if (result.length === 0) {
    return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, deleted: result[0] });
}
