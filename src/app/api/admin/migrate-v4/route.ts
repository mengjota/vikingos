import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body.secret !== "narvek-dev-2025") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const tablesCreated: string[] = [];

  // ── Tabla time_logs (Fichajes) ────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS time_logs (
      id SERIAL PRIMARY KEY,
      barbershop_id TEXT NOT NULL,
      employee_email TEXT NOT NULL,
      employee_name TEXT,
      clock_in TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      clock_out TIMESTAMPTZ,
      status TEXT DEFAULT 'active',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  tablesCreated.push("time_logs");

  return NextResponse.json({
    ok: true,
    tablesCreated,
  });
}
