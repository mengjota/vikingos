import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";

async function verifyOwner(email: string): Promise<boolean> {
  if (!email) return false;
  const rows = await sql`SELECT role FROM users WHERE email = ${email.toLowerCase()}`;
  return rows.length > 0 && rows[0].role === "owner";
}

// GET — lista todos los empleados
export async function GET(req: NextRequest) {
  const callerEmail = req.headers.get("x-caller-email") ?? "";
  if (!(await verifyOwner(callerEmail))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const rows = await sql`
    SELECT id, name, email, barber_name, created_at
    FROM users WHERE role = 'employee'
    ORDER BY name
  `;
  return NextResponse.json(rows);
}

// POST — crear cuenta de empleado
export async function POST(req: NextRequest) {
  const { callerEmail, name, email, password, barberName } = await req.json();

  if (!(await verifyOwner(callerEmail))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

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
    INSERT INTO users (name, email, password_hash, email_verified, role, barber_name)
    VALUES (${name}, ${email.toLowerCase()}, ${hash}, true, 'employee', ${barberName})
    RETURNING id, name, email, barber_name
  `;

  return NextResponse.json({ ok: true, employee: row }, { status: 201 });
}

// DELETE — eliminar cuenta de empleado
export async function DELETE(req: NextRequest) {
  const { callerEmail, employeeId } = await req.json();

  if (!(await verifyOwner(callerEmail))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const result = await sql`
    DELETE FROM users WHERE id = ${employeeId} AND role = 'employee'
    RETURNING id, name
  `;

  if (result.length === 0) {
    return NextResponse.json({ error: "Empleado no encontrado" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, deleted: result[0] });
}
