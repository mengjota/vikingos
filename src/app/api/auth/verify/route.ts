import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/verificar?error=token_invalido", req.url));
  }

  const rows = await sql`
    SELECT id, email_verified FROM users WHERE verification_token = ${token}
  `;

  if (rows.length === 0) {
    return NextResponse.redirect(new URL("/verificar?error=token_invalido", req.url));
  }

  if (rows[0].email_verified) {
    return NextResponse.redirect(new URL("/verificar?estado=ya_verificado", req.url));
  }

  await sql`
    UPDATE users SET email_verified = true, verification_token = null WHERE verification_token = ${token}
  `;

  return NextResponse.redirect(new URL("/verificar?estado=ok", req.url));
}
