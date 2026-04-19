import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const SENDING_ADDRESS = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://barberos.icu";

function formatFecha(fecha: string) {
  return new Date(fecha + "T12:00:00").toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long",
  });
}

function emailHtml({
  title,
  lines,
  footer,
  barberiaNombre,
  barberiaPhone,
  cancelToken,
}: {
  title: string;
  lines: string[];
  footer: string;
  barberiaNombre?: string;
  barberiaPhone?: string;
  cancelToken?: string;
}) {
  const headerLabel = barberiaNombre?.toUpperCase() ?? "BARBEROS";

  const cancelBlock = cancelToken
    ? `<div style="text-align:center;margin:28px 0 0;">
        <a href="${APP_URL}/cancelar?token=${cancelToken}"
          style="display:inline-block;background:transparent;border:1px solid rgba(200,146,26,0.45);color:#c8921a;padding:11px 28px;font-size:12px;letter-spacing:3px;text-transform:uppercase;text-decoration:none;font-family:Georgia,serif;">
          Cancelar cita
        </a>
      </div>`
    : "";

  const phoneBlock = barberiaPhone
    ? `<p style="margin:20px 0 0;font-size:13px;color:rgba(184,168,138,0.5);text-align:center;">
        ¿Necesitas cambiar la fecha? Llámanos: <a href="tel:${barberiaPhone}" style="color:#c8921a;text-decoration:none;">${barberiaPhone}</a>
      </p>`
    : "";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#080604;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080604;padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#0e0b07;border:1px solid #3a2210;">
        <tr><td style="height:3px;background:linear-gradient(to right,#a06010,#c8921a,#f0c040,#c8921a,#a06010);"></td></tr>
        <tr><td style="padding:36px 40px 20px;text-align:center;">
          <p style="margin:0 0 6px;font-size:11px;letter-spacing:6px;text-transform:uppercase;color:#8b6914;">${headerLabel}</p>
          <h1 style="margin:0;font-size:24px;color:#c8921a;letter-spacing:3px;font-weight:normal;">${title}</h1>
        </td></tr>
        <tr><td style="padding:0 40px 36px;">
          <div style="height:1px;background:linear-gradient(to right,transparent,#3a2210,transparent);margin-bottom:24px;"></div>
          ${lines.map(l => `<p style="margin:0 0 14px;font-size:15px;color:#f0e6c8;line-height:1.7;">${l}</p>`).join("")}
          ${cancelBlock}
          ${phoneBlock}
          <p style="margin:24px 0 0;font-size:12px;color:rgba(184,168,138,0.45);border-top:1px solid #1e1208;padding-top:16px;line-height:1.6;">${footer}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export async function sendConfirmacion(params: {
  to: string; nombre: string; servicio: string;
  barbero: string; fecha: string; hora: string;
  barberiaNombre?: string; barberiaEmail?: string;
  barberiaPhone?: string; cancelToken?: string;
}) {
  if (!process.env.RESEND_API_KEY || !params.to) return;
  const fechaFmt = formatFecha(params.fecha);
  const fromName = params.barberiaNombre ?? "BarberOS";
  await resend.emails.send({
    from: `${fromName} <${SENDING_ADDRESS}>`,
    ...(params.barberiaEmail ? { replyTo: params.barberiaEmail } : {}),
    to: params.to,
    subject: `Cita confirmada — ${params.hora} · ${fechaFmt}`,
    html: emailHtml({
      title: "Cita Confirmada ✓",
      lines: [
        `Hola <strong style="color:#c8921a;">${params.nombre}</strong>, tu reserva está confirmada.`,
        `<strong>Servicio:</strong> ${params.servicio}`,
        `<strong>Barbero:</strong> ${params.barbero}`,
        `<strong>Fecha:</strong> ${fechaFmt}`,
        `<strong>Hora:</strong> ${params.hora}`,
      ],
      footer: "Si necesitas cancelar o cambiar la cita, usa el botón de arriba o llámanos.",
      barberiaNombre: params.barberiaNombre,
      barberiaPhone: params.barberiaPhone,
      cancelToken: params.cancelToken,
    }),
  });
}

export async function sendRecordatorio(params: {
  to: string; nombre: string; servicio: string;
  barbero: string; fecha: string; hora: string;
  barberiaNombre?: string; barberiaEmail?: string;
  barberiaPhone?: string; cancelToken?: string;
}) {
  if (!process.env.RESEND_API_KEY || !params.to) return;
  const fechaFmt = formatFecha(params.fecha);
  const fromName = params.barberiaNombre ?? "BarberOS";
  await resend.emails.send({
    from: `${fromName} <${SENDING_ADDRESS}>`,
    ...(params.barberiaEmail ? { replyTo: params.barberiaEmail } : {}),
    to: params.to,
    subject: `Recordatorio — Mañana tienes cita a las ${params.hora}`,
    html: emailHtml({
      title: "Recordatorio de Cita",
      lines: [
        `Hola <strong style="color:#c8921a;">${params.nombre}</strong>, te recordamos que mañana tienes cita.`,
        `<strong>Servicio:</strong> ${params.servicio}`,
        `<strong>Barbero:</strong> ${params.barbero}`,
        `<strong>Fecha:</strong> ${fechaFmt}`,
        `<strong>Hora:</strong> ${params.hora}`,
      ],
      footer: "Si no puedes asistir, cancela con antelación. ¡Hasta mañana!",
      barberiaNombre: params.barberiaNombre,
      barberiaPhone: params.barberiaPhone,
      cancelToken: params.cancelToken,
    }),
  });
}
