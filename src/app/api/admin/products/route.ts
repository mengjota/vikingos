import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { verifySession } from "@/lib/session";

async function getOwnerBid(email: string): Promise<string | null> {
  if (!email) return null;
  const rows = await sql`SELECT role, barbershop_id FROM users WHERE email = ${email.toLowerCase()}`;
  if (rows.length === 0 || rows[0].role !== "owner") return null;
  return (rows[0].barbershop_id as string) ?? (process.env.BARBERSHOP_ID ?? "narvek");
}

function toProduct(r: Record<string, unknown>) {
  return { id: r.id, name: r.name, description: r.description, price: Number(r.price), price_display: r.price_display, volume: r.volume, category: r.category, featured: r.featured, active: r.active };
}

export async function GET() {
  const s = await verifySession();
  const bid = await getOwnerBid(s?.email ?? "");
  if (!bid) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const rows = await sql`SELECT id, name, description, price, price_display, volume, category, featured, active FROM products WHERE barbershop_id = ${bid} ORDER BY category, id ASC`;
  return NextResponse.json(rows.map(toProduct));
}

export async function POST(req: Request) {
  const s = await verifySession();
  const bid = await getOwnerBid(s?.email ?? "");
  if (!bid) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { name, description, price, volume, category, featured } = await req.json();
  if (!name || price === undefined) return NextResponse.json({ error: "Nombre y precio requeridos" }, { status: 400 });
  const priceNum = parseFloat(price) || 0;
  const priceDisplay = `€${priceNum % 1 === 0 ? priceNum.toFixed(0) : priceNum.toFixed(2)}`;
  const [row] = await sql`INSERT INTO products (barbershop_id, name, description, price, price_display, volume, category, featured) VALUES (${bid}, ${name}, ${description ?? ""}, ${priceNum}, ${priceDisplay}, ${volume ?? ""}, ${category ?? "General"}, ${featured ?? false}) RETURNING id, name, description, price, price_display, volume, category, featured, active`;
  return NextResponse.json({ ok: true, product: toProduct(row) }, { status: 201 });
}

export async function PUT(req: Request) {
  const s = await verifySession();
  const bid = await getOwnerBid(s?.email ?? "");
  if (!bid) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id, name, description, price, volume, category, featured, active } = await req.json();
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  const priceNum = price !== undefined ? parseFloat(price) || 0 : undefined;
  const priceDisplay = priceNum !== undefined ? `€${priceNum % 1 === 0 ? priceNum.toFixed(0) : priceNum.toFixed(2)}` : undefined;
  const [row] = await sql`UPDATE products SET name = COALESCE(${name ?? null}, name), description = COALESCE(${description ?? null}, description), price = COALESCE(${priceNum ?? null}, price), price_display = COALESCE(${priceDisplay ?? null}, price_display), volume = COALESCE(${volume ?? null}, volume), category = COALESCE(${category ?? null}, category), featured = COALESCE(${featured ?? null}, featured), active = COALESCE(${active ?? null}, active) WHERE id = ${id} AND barbershop_id = ${bid} RETURNING id, name, description, price, price_display, volume, category, featured, active`;
  if (!row) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true, product: toProduct(row) });
}

export async function DELETE(req: Request) {
  const s = await verifySession();
  const bid = await getOwnerBid(s?.email ?? "");
  if (!bid) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "ID requerido" }, { status: 400 });
  const result = await sql`DELETE FROM products WHERE id = ${id} AND barbershop_id = ${bid} RETURNING id`;
  if (result.length === 0) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
