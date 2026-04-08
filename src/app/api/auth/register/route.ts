import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Resend } from "resend";
import sql from "@/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://vikingos-lovat.vercel.app";

export async function POST(req: NextRequest) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Todos los campos son requeridos." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "La contraseña debe tener mínimo 6 caracteres." }, { status: 400 });
  }

  const existing = await sql`SELECT id, email_verified FROM users WHERE email = ${email.toLowerCase()}`;
  if (existing.length > 0) {
    if (!existing[0].email_verified) {
      return NextResponse.json({ error: "Ya existe una cuenta pendiente de verificación. Revisa tu correo." }, { status: 409 });
    }
    return NextResponse.json({ error: "Ya existe una cuenta con ese correo." }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);

  // Cuenta activa directamente — email verificado por defecto
  // (verificación por correo se activa cuando se configure un dominio propio)
  await sql`
    INSERT INTO users (name, email, password_hash, email_verified)
    VALUES (${name}, ${email.toLowerCase()}, ${hash}, true)
  `;

  // Intentar enviar correo de bienvenida (no bloquea si falla)
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Invictus Barbería <onboarding@resend.dev>",
      to:   email,
      subject: "¡Bienvenido a Invictus Barbería!",
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#080604;font-family:'Arial',sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:#0e0b07;border:1px solid #5c3a1e;overflow:hidden;">
            <div style="background:linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010);height:4px;"></div>
            <div style="padding:48px 40px;text-align:center;">
              <p style="color:#c8921a;font-size:11px;letter-spacing:6px;text-transform:uppercase;margin:0 0 8px;">Barbería</p>
              <h1 style="color:#f5ead0;font-size:36px;font-weight:900;margin:0 0 32px;letter-spacing:4px;">INVICTUS</h1>
              <div style="width:40px;height:1px;background:#c8921a;margin:0 auto 32px;"></div>
              <h2 style="color:#f0e6c8;font-size:20px;font-weight:700;margin:0 0 16px;">¡Bienvenido, ${name}! ⚔️</h2>
              <p style="color:#b8a882;font-size:15px;line-height:1.7;margin:0 0 36px;">
                Tu cuenta ha sido creada exitosamente.<br>Ya puedes reservar tus citas en Invictus Barbería.
              </p>
              <a href="${BASE_URL}/reservar"
                style="display:inline-block;background:linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010);color:#080604;font-size:13px;font-weight:900;letter-spacing:4px;text-transform:uppercase;text-decoration:none;padding:18px 40px;">
                RESERVAR MI CITA
              </a>
            </div>
            <div style="background:linear-gradient(135deg,#a06010,#c8921a,#f0c040,#c8921a,#a06010);height:2px;"></div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (_) {
    // El correo es opcional — la cuenta ya fue creada
  }

  return NextResponse.json({ ok: true });
}
