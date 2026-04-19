import webpush from "web-push";
import sql from "@/lib/db";

let _configured = false;
function configure() {
  if (_configured) return;
  webpush.setVapidDetails(
    `mailto:${process.env.EMAIL_FROM ?? "noreply@barberos.icu"}`,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  _configured = true;
}

let _tableReady = false;
export async function ensurePushTable() {
  if (_tableReady) return;
  await sql`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id           SERIAL PRIMARY KEY,
      barbershop_id TEXT NOT NULL DEFAULT '',
      user_email   TEXT NOT NULL DEFAULT '',
      endpoint     TEXT NOT NULL UNIQUE,
      p256dh       TEXT NOT NULL,
      auth         TEXT NOT NULL,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  _tableReady = true;
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

export async function sendPushToBarberShop(barbershopId: string, payload: PushPayload) {
  if (!process.env.VAPID_PRIVATE_KEY) return;
  configure();
  await ensurePushTable();

  const subs = await sql`
    SELECT endpoint, p256dh, auth FROM push_subscriptions
    WHERE barbershop_id = ${barbershopId}
  `;

  const data = JSON.stringify(payload);
  await Promise.allSettled(
    subs.map(s =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        data
      ).catch(async (err: { statusCode?: number }) => {
        // Remove expired/invalid subscriptions
        if (err.statusCode === 410 || err.statusCode === 404) {
          await sql`DELETE FROM push_subscriptions WHERE endpoint = ${s.endpoint}`.catch(() => {});
        }
      })
    )
  );
}

export async function sendPushToEmail(email: string, payload: PushPayload) {
  if (!process.env.VAPID_PRIVATE_KEY) return;
  configure();
  await ensurePushTable();

  const subs = await sql`
    SELECT endpoint, p256dh, auth FROM push_subscriptions
    WHERE user_email = ${email}
  `;

  const data = JSON.stringify(payload);
  await Promise.allSettled(
    subs.map(s =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        data
      ).catch(async (err: { statusCode?: number }) => {
        if (err.statusCode === 410 || err.statusCode === 404) {
          await sql`DELETE FROM push_subscriptions WHERE endpoint = ${s.endpoint}`.catch(() => {});
        }
      })
    )
  );
}
