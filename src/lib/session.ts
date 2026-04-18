import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

const secretKey = process.env.JWT_SECRET || "fallback-secret-para-desarrollo-solo";
const key = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  userId?: number | null;
  name: string;
  email: string;
  role: "owner" | "employee" | "client";
  barberName?: string | null;
  barbershopId?: string | null;
  barbershopName?: string | null;
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(session: string | undefined = "") {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt(payload);
  
  const cookieStore = await cookies();
  cookieStore.set("inv_session_token", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("inv_session_token")?.value;
  const payload = await decrypt(session);
  if (!payload) return null;

  // Verifica que el usuario siga existiendo en BD (cubre casos de empleado eliminado)
  if (payload.userId) {
    try {
      const rows = await sql`SELECT id FROM users WHERE id = ${payload.userId}`;
      if (rows.length === 0) return null;
    } catch (_) {}
  }

  return payload;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("inv_session_token");
}
