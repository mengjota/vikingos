import { NextResponse } from "next/server";

const DEMO_ID = "demo";

export function demoGuard(barbershopId: string | null | undefined) {
  if (barbershopId === DEMO_ID) {
    return NextResponse.json(
      { error: "Acción no permitida en la demo. Contacta con nosotros para configurar tu barbería real." },
      { status: 403 }
    );
  }
  return null;
}
