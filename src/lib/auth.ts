export interface Session {
  name: string;
  email: string;
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

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("inv_session");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("inv_session");
}

// Reservas del cliente — se leen desde la DB vía API
export async function getReservations(email: string): Promise<Reservation[]> {
  const res = await fetch(`/api/reservations?email=${encodeURIComponent(email)}`);
  if (!res.ok) return [];
  const all: Reservation[] = await res.json();
  return all.filter(r => r.clienteEmail === email.toLowerCase());
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
