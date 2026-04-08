import type { Reservation } from "./auth";

const ADMIN_PASSWORD = "invictus2025";
const ADMIN_SESSION_KEY = "inv_admin_session";

// ── Auth ────────────────────────────────────────────────
export function adminLogin(password: string): boolean {
  if (typeof window === "undefined") return false;
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
    return true;
  }
  return false;
}

export function adminLogout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

// ── Reservas globales ────────────────────────────────────
export function getAllReservations(): Reservation[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("inv_reservas_global");
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function updateReservationEstado(
  id: string,
  estado: "pendiente" | "completada" | "cancelada",
  facturaId?: string
) {
  if (typeof window === "undefined") return;
  const reservas = getAllReservations();
  const idx = reservas.findIndex((r) => r.id === id);
  if (idx === -1) return;
  reservas[idx].estado = estado;
  if (facturaId) reservas[idx].facturaId = facturaId;
  localStorage.setItem("inv_reservas_global", JSON.stringify(reservas));

  // También actualizar en el historial del cliente
  const email = reservas[idx].clienteEmail;
  if (email) {
    const raw = localStorage.getItem("inv_reservas_" + email);
    if (raw) {
      const clienteReservas: Reservation[] = JSON.parse(raw);
      const ci = clienteReservas.findIndex((r) => r.id === id);
      if (ci !== -1) {
        clienteReservas[ci].estado = estado;
        if (facturaId) clienteReservas[ci].facturaId = facturaId;
        localStorage.setItem("inv_reservas_" + email, JSON.stringify(clienteReservas));
      }
    }
  }
}

// ── Productos ────────────────────────────────────────────
export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  volumen: string;
  categoria: string;
  destacado: boolean;
}

const PRODUCTOS_DEFAULT: Producto[] = [
  { id: "1", nombre: "Aceite de Barba Vikingo", descripcion: "Mezcla artesanal de aceite de argán, jojoba y cedro.", precio: 85, volumen: "30ml", categoria: "Cuidado de Barba", destacado: true },
  { id: "2", nombre: "Bálsamo de Barba Nórdico", descripcion: "Manteca de karité y cera de abejas. Fija y nutre.", precio: 75, volumen: "60ml", categoria: "Cuidado de Barba", destacado: false },
  { id: "3", nombre: "Champú de Barba", descripcion: "Limpieza profunda con extracto de pino y menta.", precio: 65, volumen: "200ml", categoria: "Cuidado de Barba", destacado: false },
  { id: "4", nombre: "Pomada Mate Invictus", descripcion: "Fijación fuerte, acabado mate. Control total.", precio: 90, volumen: "100g", categoria: "Cuidado del Cabello", destacado: true },
  { id: "5", nombre: "Cera de Peinado Clásica", descripcion: "Fijación media, brillo natural.", precio: 80, volumen: "100g", categoria: "Cuidado del Cabello", destacado: false },
  { id: "6", nombre: "Arcilla Moldeadora", descripcion: "Textura y movimiento natural.", precio: 85, volumen: "100g", categoria: "Cuidado del Cabello", destacado: false },
  { id: "7", nombre: "Crema de Afeitado Premium", descripcion: "Base de manteca de cacao y aloe vera.", precio: 70, volumen: "150ml", categoria: "Ritual de Afeitado", destacado: false },
  { id: "8", nombre: "Bálsamo Post-Afeitado", descripcion: "Calma, hidrata y protege. Aroma amaderado.", precio: 80, volumen: "100ml", categoria: "Ritual de Afeitado", destacado: true },
  { id: "9", nombre: "Alum Block", descripcion: "Cierra poros y desinfecta. Afeitado clásico.", precio: 45, volumen: "75g", categoria: "Ritual de Afeitado", destacado: false },
];

export function getProductos(): Producto[] {
  if (typeof window === "undefined") return PRODUCTOS_DEFAULT;
  const raw = localStorage.getItem("inv_productos");
  if (!raw) {
    localStorage.setItem("inv_productos", JSON.stringify(PRODUCTOS_DEFAULT));
    return PRODUCTOS_DEFAULT;
  }
  try { return JSON.parse(raw); } catch { return PRODUCTOS_DEFAULT; }
}

export function saveProducto(p: Omit<Producto, "id">, id?: string): Producto {
  const productos = getProductos();
  if (id) {
    const idx = productos.findIndex((x) => x.id === id);
    if (idx !== -1) {
      productos[idx] = { ...p, id };
      localStorage.setItem("inv_productos", JSON.stringify(productos));
      return productos[idx];
    }
  }
  const nuevo: Producto = { ...p, id: Date.now().toString() };
  productos.push(nuevo);
  localStorage.setItem("inv_productos", JSON.stringify(productos));
  return nuevo;
}

export function deleteProducto(id: string) {
  const productos = getProductos().filter((p) => p.id !== id);
  localStorage.setItem("inv_productos", JSON.stringify(productos));
}

// ── Facturas ─────────────────────────────────────────────
export interface ProductoVendido {
  nombre: string;
  precio: number;
  cantidad: number;
}

export interface Factura {
  id: string;
  reservaId: string;
  clienteEmail: string;
  clienteNombre: string;
  servicio: string;
  barbero: string;
  fecha: string;
  hora: string;
  precioServicio: number;
  metodoPago: "efectivo" | "tarjeta" | "transferencia" | "otro";
  productosAdicionales: ProductoVendido[];
  subtotalProductos: number;
  total: number;
  completadaEl: string;
}

export function getFacturas(): Factura[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem("inv_facturas");
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

export function saveFactura(f: Omit<Factura, "id" | "completadaEl">): Factura {
  const facturas = getFacturas();
  const nueva: Factura = {
    ...f,
    id: "FAC-" + Date.now().toString().slice(-6),
    completadaEl: new Date().toLocaleDateString("es-EC"),
  };
  facturas.unshift(nueva);
  localStorage.setItem("inv_facturas", JSON.stringify(facturas));
  return nueva;
}
