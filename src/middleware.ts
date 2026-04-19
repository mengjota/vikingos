import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const DEMO_ID = "demo";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const method = req.method;
  if (!WRITE_METHODS.has(method)) return NextResponse.next();

  const isAdminWrite =
    pathname.startsWith("/api/admin/") ||
    pathname.startsWith("/api/ventas") ||
    pathname.startsWith("/api/employee/clock");

  if (!isAdminWrite) return NextResponse.next();

  // Check if the session belongs to the demo account
  const token = req.cookies.get("inv_session_token")?.value;
  if (!token) return NextResponse.next();

  try {
    const secretKey = process.env.JWT_SECRET || "fallback-secret-para-desarrollo-solo";
    const key = new TextEncoder().encode(secretKey);
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    const barbershopId = (payload as Record<string, unknown>).barbershopId as string | undefined;

    if (barbershopId === DEMO_ID) {
      return NextResponse.json(
        { error: "Acción no permitida en la demo. Contacta con nosotros para configurar tu barbería real." },
        { status: 403 }
      );
    }
  } catch {
    // Invalid token — let the route handler deal with auth
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*", "/api/ventas", "/api/employee/:path*"],
};
