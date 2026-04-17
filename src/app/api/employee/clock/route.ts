import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import sql from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await verifySession(req);
  if (!session || (session.role !== "employee" && session.role !== "owner")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // Buscar si hay un turno activo ('active')
    const result = await sql`
      SELECT id, clock_in 
      FROM time_logs 
      WHERE employee_email = ${session.email} 
      AND barbershop_id = ${session.barbershopId}
      AND status = 'active'
      ORDER BY clock_in DESC
      LIMIT 1
    `;
    
    if (result.length > 0) {
      return NextResponse.json({ 
        active: true, 
        currentLog: result[0] 
      });
    }

    return NextResponse.json({ active: false, currentLog: null });
  } catch (error) {
    console.error("Error fetching clock status:", error);
    return NextResponse.json({ error: "Error intero del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await verifySession(req);
  if (!session || (session.role !== "employee" && session.role !== "owner")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // Buscar si hay un turno activo
    const result = await sql`
      SELECT id FROM time_logs 
      WHERE employee_email = ${session.email} 
      AND barbershop_id = ${session.barbershopId}
      AND status = 'active'
      ORDER BY clock_in DESC
      LIMIT 1
    `;

    if (result.length > 0) {
      // Registrar salida (Clock Out)
      const logId = result[0].id;
      await sql`
        UPDATE time_logs 
        SET clock_out = NOW(), status = 'completed'
        WHERE id = ${logId}
      `;
      return NextResponse.json({ success: true, message: "Turno cerrado exitosamente.", active: false });
    } else {
      // Obtener el nombre del empleado a través de la sesión. Si no existe, usamos el correo
      const empName = session.name || session.email;
      
      // Registrar entrada (Clock In)
      const insertResult = await sql`
        INSERT INTO time_logs (barbershop_id, employee_email, employee_name, clock_in, status)
        VALUES (${session.barbershopId}, ${session.email}, ${empName}, NOW(), 'active')
        RETURNING id, clock_in
      `;
      
      return NextResponse.json({ 
        success: true, 
        message: "Turno iniciado.", 
        active: true, 
        currentLog: insertResult[0] 
      });
    }
  } catch (error) {
    console.error("Error updating clock status:", error);
    
    // Auto-migración por si el dueño no ha ejecutado el migrate-v4
    if ((error as any).message?.includes("relation \"time_logs\" does not exist")) {
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
      return NextResponse.json({ error: "Tabla creada automáticamente (migrate-v4 applied). Intenta de nuevo." }, { status: 500 });
    }

    return NextResponse.json({ error: "Error en la base de datos." }, { status: 500 });
  }
}
