import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { verifySession } from "@/lib/session";

const IVA_PCT = 21.00;

async function ensureVentasTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS ventas (
      id           SERIAL PRIMARY KEY,
      barbershop_id VARCHAR(80) NOT NULL,
      empleado_email VARCHAR(200) NOT NULL,
      empleado_nombre VARCHAR(200) DEFAULT '',
      servicio     VARCHAR(200) NOT NULL,
      metodo_pago  VARCHAR(50)  DEFAULT 'efectivo',
      precio_total NUMERIC(10,2) NOT NULL,
      precio_base  NUMERIC(10,2) NOT NULL,
      iva_pct      NUMERIC(5,2)  NOT NULL DEFAULT 21.00,
      iva_importe  NUMERIC(10,2) NOT NULL,
      notas        TEXT DEFAULT '',
      created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

// GET — employee sees own sales today; owner/filter by date range
export async function GET(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (session.role !== "employee" && session.role !== "owner") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await ensureVentasTable();

  const { searchParams } = new URL(req.url);
  const desde = searchParams.get("desde");
  const hasta = searchParams.get("hasta");
  const bid   = session.barbershopId ?? process.env.BARBERSHOP_ID ?? "narvek";

  const isValidDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d));
  if (desde && !isValidDate(desde)) return NextResponse.json({ error: "Formato de fecha inválido" }, { status: 400 });
  if (hasta && !isValidDate(hasta)) return NextResponse.json({ error: "Formato de fecha inválido" }, { status: 400 });

  let rows;
  if (session.role === "employee") {
    rows = await sql`
      SELECT * FROM ventas
      WHERE barbershop_id = ${bid} AND empleado_email = ${session.email}
        ${desde ? sql`AND created_at >= ${desde}::date` : sql``}
        ${hasta ? sql`AND created_at <  (${hasta}::date + interval '1 day')` : sql``}
      ORDER BY created_at DESC
    `;
  } else {
    rows = await sql`
      SELECT * FROM ventas
      WHERE barbershop_id = ${bid}
        ${desde ? sql`AND created_at >= ${desde}::date` : sql``}
        ${hasta ? sql`AND created_at <  (${hasta}::date + interval '1 day')` : sql``}
      ORDER BY created_at DESC
    `;
  }

  return NextResponse.json(rows);
}

// POST — employee registers a sale
export async function POST(req: NextRequest) {
  const session = await verifySession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (session.role !== "employee" && session.role !== "owner") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  await ensureVentasTable();

  const body = await req.json();
  const { servicio, metodo_pago = "efectivo", precio_total, notas = "" } = body;

  if (!servicio?.trim()) return NextResponse.json({ error: "Servicio requerido" }, { status: 400 });
  const total = parseFloat(precio_total);
  if (isNaN(total) || total <= 0) return NextResponse.json({ error: "Precio inválido" }, { status: 400 });

  const base    = parseFloat((total / (1 + IVA_PCT / 100)).toFixed(2));
  const iva_imp = parseFloat((total - base).toFixed(2));
  const bid     = session.barbershopId ?? process.env.BARBERSHOP_ID ?? "narvek";

  const [row] = await sql`
    INSERT INTO ventas (barbershop_id, empleado_email, empleado_nombre, servicio, metodo_pago, precio_total, precio_base, iva_pct, iva_importe, notas)
    VALUES (${bid}, ${session.email}, ${session.barberName ?? session.name}, ${servicio.trim()}, ${metodo_pago}, ${total}, ${base}, ${IVA_PCT}, ${iva_imp}, ${notas})
    RETURNING *
  `;

  return NextResponse.json({ ok: true, venta: row });
}
