import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import sql from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await verifySession();
  if (!session || session.role !== "owner") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const logs = await sql`
      SELECT 
        id, 
        employee_email, 
        employee_name, 
        clock_in, 
        clock_out, 
        status
      FROM time_logs
      WHERE barbershop_id = ${session.barbershopId}
      ORDER BY clock_in DESC
      LIMIT 200
    `;

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching time logs:", error);
    
    if ((error as any).message?.includes("relation \"time_logs\" does not exist")) {
      return NextResponse.json([]); // Si no existe la tabla, retornamos vacío (para evitar errores en cascada UI)
    }

    return NextResponse.json({ error: "Error en la base de datos." }, { status: 500 });
  }
}
