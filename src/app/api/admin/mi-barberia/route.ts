import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { verifySession } from "@/lib/session";

let _colsReady = false;
async function ensureBarbershipCols() {
  if (_colsReady) return;
  try { await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS address TEXT DEFAULT ''`; } catch (_) {}
  try { await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT ''`; } catch (_) {}
  try { await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS description TEXT DEFAULT ''`; } catch (_) {}
  try { await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS cif TEXT DEFAULT ''`; } catch (_) {}
  try { await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS razon_social TEXT DEFAULT ''`; } catch (_) {}
  try { await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS nombre_comercial TEXT DEFAULT ''`; } catch (_) {}
  try { await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS direccion_fiscal TEXT DEFAULT ''`; } catch (_) {}
  try { await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS codigo_postal TEXT DEFAULT ''`; } catch (_) {}
  try { await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS ciudad_fiscal TEXT DEFAULT ''`; } catch (_) {}
  try { await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS email_fiscal TEXT DEFAULT ''`; } catch (_) {}
  try { await sql`ALTER TABLE barbershops ADD COLUMN IF NOT EXISTS iva_pct NUMERIC(5,2) DEFAULT 21`; } catch (_) {}
  _colsReady = true;
}

async function getOwnerInfo(email: string) {
  if (!email) return null;
  await ensureBarbershipCols();
  const rows = await sql`
    SELECT u.role, u.barbershop_id,
           b.id AS bs_id, b.name AS bs_name, b.slug,
           b.address, b.phone, b.description,
           b.cif, b.razon_social, b.nombre_comercial,
           b.direccion_fiscal, b.codigo_postal, b.ciudad_fiscal,
           b.email_fiscal, b.iva_pct
    FROM users u
    LEFT JOIN barbershops b ON b.id = u.barbershop_id
    WHERE u.email = ${email.toLowerCase()}
  `;
  if (rows.length === 0 || rows[0].role !== "owner") return null;
  return rows[0];
}

export async function GET(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  const info = await getOwnerInfo(email);
  if (!info) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  return NextResponse.json({
    id:               info.bs_id,
    name:             info.bs_name,
    slug:             info.slug,
    address:          info.address ?? "",
    phone:            info.phone ?? "",
    description:      info.description ?? "",
    cif:              info.cif ?? "",
    razon_social:     info.razon_social ?? "",
    nombre_comercial: info.nombre_comercial ?? "",
    direccion_fiscal: info.direccion_fiscal ?? "",
    codigo_postal:    info.codigo_postal ?? "",
    ciudad_fiscal:    info.ciudad_fiscal ?? "",
    email_fiscal:     info.email_fiscal ?? "",
    iva_pct:          info.iva_pct ?? 21,
  });
}

export async function PUT(req: NextRequest) {
  const session = await verifySession();
  const email = session?.email ?? "";
  const info = await getOwnerInfo(email);
  if (!info) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      name, address, phone, description,
      cif, razon_social, nombre_comercial,
      direccion_fiscal, codigo_postal, ciudad_fiscal, email_fiscal, iva_pct,
    } = body;

    if (name !== undefined && String(name).trim().length < 2) {
      return NextResponse.json({ error: "El nombre debe tener al menos 2 caracteres" }, { status: 400 });
    }

    const s = (v: unknown) => (v != null && String(v) !== "") ? String(v) : null;
    const n = (v: unknown) => (v != null && !isNaN(parseFloat(String(v)))) ? parseFloat(String(v)) : null;

    await sql`
      UPDATE barbershops SET
        name             = COALESCE(${name ? String(name).trim() : null}, name),
        address          = COALESCE(${s(address)}, address),
        phone            = COALESCE(${s(phone)}, phone),
        description      = COALESCE(${s(description)}, description),
        cif              = COALESCE(${s(cif)}, cif),
        razon_social     = COALESCE(${s(razon_social)}, razon_social),
        nombre_comercial = COALESCE(${s(nombre_comercial)}, nombre_comercial),
        direccion_fiscal = COALESCE(${s(direccion_fiscal)}, direccion_fiscal),
        codigo_postal    = COALESCE(${s(codigo_postal)}, codigo_postal),
        ciudad_fiscal    = COALESCE(${s(ciudad_fiscal)}, ciudad_fiscal),
        email_fiscal     = COALESCE(${s(email_fiscal)}, email_fiscal),
        iva_pct          = COALESCE(${n(iva_pct)}, iva_pct)
      WHERE id = ${info.bs_id}
    `;

    const updated = await getOwnerInfo(email);
    return NextResponse.json({
      ok: true,
      name:             updated?.bs_name ?? "",
      address:          updated?.address ?? "",
      phone:            updated?.phone ?? "",
      description:      updated?.description ?? "",
      cif:              updated?.cif ?? "",
      razon_social:     updated?.razon_social ?? "",
      nombre_comercial: updated?.nombre_comercial ?? "",
      direccion_fiscal: updated?.direccion_fiscal ?? "",
      codigo_postal:    updated?.codigo_postal ?? "",
      ciudad_fiscal:    updated?.ciudad_fiscal ?? "",
      email_fiscal:     updated?.email_fiscal ?? "",
      iva_pct:          updated?.iva_pct ?? 21,
    });
  } catch (err) {
    console.error("[mi-barberia PUT]", err);
    return NextResponse.json({ error: "Error interno al guardar" }, { status: 500 });
  }
}
