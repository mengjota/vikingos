import { NextResponse } from "next/server";
import sql from "@/lib/db";
import bcrypt from "bcryptjs";

const DEMO_ID = "demo";

export async function POST() {
  // Idempotent — if demo already exists, just return credentials
  const existing = await sql`SELECT id FROM barbershops WHERE id = ${DEMO_ID}`;
  if (existing.length > 0) {
    return NextResponse.json({ ok: true, seeded: false, credentials: creds() });
  }

  // ── 1. Barbershop ────────────────────────────────────────────────────────
  await sql`
    INSERT INTO barbershops (id, name, slug, nombre_comercial, email_fiscal, phone, address)
    VALUES (
      ${DEMO_ID},
      'Viking Barbers BCN',
      'demo',
      'Viking Barbers BCN',
      'demo@barberos.icu',
      '+34 600 123 456',
      'Carrer de Provença 123, Barcelona'
    )
    ON CONFLICT (id) DO NOTHING
  `;

  // ── 2. Owner account ────────────────────────────────────────────────────
  const hash = await bcrypt.hash("Demo2025!", 10);
  const [owner] = await sql`
    INSERT INTO users (name, email, password_hash, role, barber_name, barber_specialty, barbershop_id, is_barber)
    VALUES ('Demo Owner', 'demo@barberos.icu', ${hash}, 'owner', 'Demo Owner', 'Propietario', ${DEMO_ID}, false)
    ON CONFLICT (email) DO UPDATE SET barbershop_id = ${DEMO_ID}
    RETURNING id
  `;

  // ── 3. Barbers (employees) ──────────────────────────────────────────────
  const barberHash = await bcrypt.hash("Barbero2025!", 10);

  const [alex] = await sql`
    INSERT INTO users (name, email, password_hash, role, barber_name, barber_specialty, barbershop_id, is_barber)
    VALUES ('Alex Maestro', 'alex@demo.barberos.icu', ${barberHash}, 'employee', 'Alex Maestro', 'Especialista en fade y degradados', ${DEMO_ID}, true)
    ON CONFLICT (email) DO UPDATE SET barbershop_id = ${DEMO_ID}
    RETURNING id
  `;

  const [carlos] = await sql`
    INSERT INTO users (name, email, password_hash, role, barber_name, barber_specialty, barbershop_id, is_barber)
    VALUES ('Carlos Navaja', 'carlos@demo.barberos.icu', ${barberHash}, 'employee', 'Carlos Navaja', 'Maestro del afeitado clásico', ${DEMO_ID}, true)
    ON CONFLICT (email) DO UPDATE SET barbershop_id = ${DEMO_ID}
    RETURNING id
  `;

  // Schedules: Lun-Sab trabajando, Dom descanso
  for (const userId of [alex.id, carlos.id]) {
    for (let dow = 0; dow <= 6; dow++) {
      await sql`
        INSERT INTO barber_schedules (user_id, day_of_week, is_working)
        VALUES (${userId}, ${dow}, ${dow !== 0})
        ON CONFLICT (user_id, day_of_week) DO NOTHING
      `.catch(() => {});
    }
  }

  // ── 4. Services ──────────────────────────────────────────────────────────
  const services = [
    { name: "Corte Clásico",     price: "18.00", duration: 30, desc: "Corte tradicional con acabado a máquina y tijera" },
    { name: "Corte + Barba",     price: "28.00", duration: 50, desc: "Servicio completo: corte y arreglo de barba" },
    { name: "Afeitado Navaja",   price: "22.00", duration: 40, desc: "Afeitado al ras con navaja y toalla caliente" },
    { name: "Arreglo de Barba",  price: "15.00", duration: 25, desc: "Perfilado, recorte y aceite hidratante" },
    { name: "Corte Niño",        price: "12.00", duration: 25, desc: "Para los más pequeños, hasta 12 años" },
    { name: "Tratamiento Cuero", price: "20.00", duration: 35, desc: "Hidratación y masaje capilar profesional" },
  ];

  for (const s of services) {
    await sql`
      INSERT INTO services (barbershop_id, name, price, duration_min, description, active)
      VALUES (${DEMO_ID}, ${s.name}, ${s.price}, ${s.duration}, ${s.desc}, true)
      ON CONFLICT DO NOTHING
    `.catch(() => {});
  }

  // ── 5. Shop schedule (Lun-Sab 9-20, Dom cerrado) ────────────────────────
  await sql`ALTER TABLE shop_schedules ADD COLUMN IF NOT EXISTS open_time TEXT`.catch(() => {});
  await sql`ALTER TABLE shop_schedules ADD COLUMN IF NOT EXISTS close_time TEXT`.catch(() => {});

  for (let dow = 0; dow <= 6; dow++) {
    await sql`
      INSERT INTO shop_schedules (barbershop_id, day_of_week, is_open, open_time, close_time)
      VALUES (${DEMO_ID}, ${dow}, ${dow !== 0}, '09:00', '20:00')
      ON CONFLICT (barbershop_id, day_of_week) DO NOTHING
    `.catch(() => {});
  }

  return NextResponse.json({ ok: true, seeded: true, credentials: creds() });
}

function creds() {
  return {
    ownerEmail:    "demo@barberos.icu",
    ownerPassword: "Demo2025!",
    barbershopId:  DEMO_ID,
  };
}
