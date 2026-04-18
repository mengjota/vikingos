export interface Session {
  name: string;
  email: string;
  role: "owner" | "employee" | "client";
  barberName?: string;
  barbershopId?: string;
  barbershopName?: string;
}

export interface Reservation {
  id: string;
  servicio: string;
  precio: string;
  barbero: string;
  fecha: string;
  hora: string;
  creadaEl: string;
  clienteEmail?: string;
  clienteNombre?: string;
  estado?: "pendiente" | "completada" | "cancelada";
  facturaId?: string;
}

export async function getSession(): Promise<Session | null> {
  if (typeof window === "undefined") return null;
  try {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return null;
    const data = await res.json();
    return data.session;
  } catch {
    return null;
  }
}

export async function logout(redirectTo = "/login") {
  if (typeof window === "undefined") return;
  await fetch("/api/auth/logout", { method: "POST" });
  window.location.href = redirectTo;
}

// Reservas del cliente — filtradas en el servidor por email
export async function getReservations(email: string): Promise<Reservation[]> {
  const res = await fetch(`/api/reservations?email=${encodeURIComponent(email)}`);
  if (!res.ok) return [];
  return res.json();
}

// Guardar reserva en la DB vía API
export async function saveReservation(
  email: string,
  nombreCliente: string,
  reserva: Omit<Reservation, "id" | "creadaEl" | "clienteEmail" | "clienteNombre" | "estado">
) {
  const res = await fetch("/api/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clienteNombre: nombreCliente,
      clienteEmail:  email.toLowerCase(),
      servicio:      reserva.servicio,
      precio:        reserva.precio,
      barbero:       reserva.barbero,
      fecha:         reserva.fecha,
      hora:          reserva.hora,
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Error al guardar la reserva.");
  }
}
