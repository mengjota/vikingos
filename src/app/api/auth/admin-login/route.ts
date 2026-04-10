import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password || password.trim() !== (process.env.ADMIN_PASSWORD ?? "").trim()) {
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  const secret = process.env.ADMIN_SESSION_SECRET!;
  const res = NextResponse.json({ ok: true });

  res.cookies.set("inv_adm", secret, {
    httpOnly: true,      // JavaScript del browser no puede leerla
    secure: true,        // Solo HTTPS
    sameSite: "strict",  // Protección CSRF
    path: "/",
    maxAge: 60 * 60 * 12, // 12 horas
  });

  return res;
}
