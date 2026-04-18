import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const barbershopId = searchParams.get("barbershopId") ?? (process.env.BARBERSHOP_ID ?? "narvek");

  const rows = await sql`
    SELECT id, name, email, barber_name, barbershop_id
    FROM users
    WHERE role = 'employee'
      AND barbershop_id = ${barbershopId}
      AND barber_name IS NOT NULL
    ORDER BY name
  `;

  const barbers = rows.map((r) => ({
    id: r.id,
    name: r.barber_name as string,
    specialty: "Barbero Profesional",
  }));

  // Siempre incluir la opción "El que más pronto"
  return NextResponse.json([
    { id: 0, name: "El que más pronto me pueda atender", specialty: "Cualquier maestro disponible", rune: "᛭" },
    ...barbers.map((b, i) => ({ ...b, rune: ["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ"][i] ?? "ᚷ" })),
  ]);
}
