import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { ensurePushTable } from "@/lib/push";
import { verifySession } from "@/lib/session";

// POST — save a push subscription
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { subscription, barbershopId, userEmail } = body;

  if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
    return NextResponse.json({ error: "Suscripción inválida" }, { status: 400 });
  }

  // Prefer session data, fallback to body (for anonymous clients after booking)
  let bid = barbershopId ?? "";
  let email = userEmail ?? "";

  const session = await verifySession().catch(() => null);
  if (session) {
    bid   = session.barbershopId ?? bid;
    email = session.email ?? email;
  }

  await ensurePushTable();

  await sql`
    INSERT INTO push_subscriptions (barbershop_id, user_email, endpoint, p256dh, auth)
    VALUES (${bid}, ${email}, ${subscription.endpoint}, ${subscription.keys.p256dh}, ${subscription.keys.auth})
    ON CONFLICT (endpoint) DO UPDATE
      SET barbershop_id = ${bid},
          user_email    = ${email},
          p256dh        = ${subscription.keys.p256dh},
          auth          = ${subscription.keys.auth}
  `;

  return NextResponse.json({ ok: true });
}

// DELETE — remove a push subscription
export async function DELETE(req: NextRequest) {
  const { endpoint } = await req.json();
  if (!endpoint) return NextResponse.json({ error: "Endpoint requerido" }, { status: 400 });
  await ensurePushTable();
  await sql`DELETE FROM push_subscriptions WHERE endpoint = ${endpoint}`;
  return NextResponse.json({ ok: true });
}
