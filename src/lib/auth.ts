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

export function getReservations(email: string): Reservation[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("inv_reservas_" + email.toLowerCase());
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function saveReservation(email: string, nombreCliente: string, reserva: Omit<Reservation, "id" | "creadaEl" | "clienteEmail" | "clienteNombre" | "estado">) {
  // Verificar conflicto de horario (solo si hay barbero específico)
  const barberoEspecifico = reserva.barbero && reserva.barbero !== "El que más pronto me pueda atender";
  if (barberoEspecifico) {
    const rawGlobal = localStorage.getItem("inv_reservas_global");
    const global: Reservation[] = rawGlobal ? JSON.parse(rawGlobal) : [];
    const tomado = global.some(
      r => r.barbero === reserva.barbero &&
           r.fecha === reserva.fecha &&
           r.hora === reserva.hora &&
           r.estado !== "cancelada"
    );
    if (tomado) {
      throw new Error(`${reserva.barbero.split(" ")[0]} ya tiene una cita a las ${reserva.hora}. Elige otro horario.`);
    }
  }
  const nueva: Reservation = {
    ...reserva,
    id: Date.now().toString(),
    creadaEl: new Date().toLocaleDateString("es-EC"),
    clienteEmail: email.toLowerCase(),
    clienteNombre: nombreCliente,
    estado: "pendiente",
  };
  // Guardar en historial del cliente
  const reservas = getReservations(email);
  reservas.unshift(nueva);
  localStorage.setItem("inv_reservas_" + email.toLowerCase(), JSON.stringify(reservas));
  // Guardar en lista global para el admin
  const rawGlobal = localStorage.getItem("inv_reservas_global");
  const global: Reservation[] = rawGlobal ? JSON.parse(rawGlobal) : [];
  global.unshift(nueva);
  localStorage.setItem("inv_reservas_global", JSON.stringify(global));
}
