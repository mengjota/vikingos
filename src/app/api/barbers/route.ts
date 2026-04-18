import { NextResponse } from "next/server";
import sql from "@/lib/db";

// GET /api/barbers — devuelve los barberos activos de esta barbería
// La barbería se determina por la variable de entorno BARBERSHOP_ID
export async function GET() {
  const barbershopId = process.env.BARBERSHOP_ID ?? "narvek";

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
