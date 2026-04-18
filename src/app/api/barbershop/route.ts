import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

const BID = () => process.env.BARBERSHOP_ID ?? "narvek";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bid = searchParams.get("id") ?? BID();
  try {
    const rows = await sql`SELECT id, name, slug, address, phone, description FROM barbershops WHERE id = ${bid}`;
    if (rows.length === 0) return NextResponse.json({ id: bid, name: bid, slug: bid, address: "", phone: "", description: "" });
    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ id: bid, name: bid, slug: bid, address: "", phone: "", description: "" });
  }
}
