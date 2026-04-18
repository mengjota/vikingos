# BarberOS — Contexto del Proyecto para IAs colaboradoras

> **IMPORTANTE:** Este documento es la fuente de verdad. Cualquier IA que trabaje en este repo DEBE leerlo antes de hacer cambios. Si algo contradice lo que ves en el código, confía en el código y actualiza este doc.

---

## El proyecto

- **Plataforma:** BarberOS — SaaS para barberías (by Narvek System)
- **Repo:** https://github.com/mengjota/vikingos
- **Ruta local (Mac):** `/Users/feralbluis/proyectos narveksystem/vikingos`
- **URL producción:** https://vikingos-lovat.vercel.app
- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS v4, NeonDB (PostgreSQL via `@neondatabase/serverless`)
- **Deploy:** Vercel automático al hacer push a `master`

---

## Concepto SaaS — MUY IMPORTANTE

BarberOS es una plataforma multi-tenant. **Cada barbería tiene su propio despliegue en Vercel** con la variable de entorno `BARBERSHOP_ID` que aísla sus datos en la DB compartida.

- El nombre "BarberOS" es el nombre de la **plataforma**, no de ninguna barbería.
- Cada barbería tiene su propio nombre (ej: "Narvek Barbers"), sus propios servicios, productos, empleados y reservas.
- La landing page (`/`) debe ser **genérica** — sin horarios fijos, sin dirección fija, mostrando el nombre de la barbería desde la DB.
- **NO hardcodear** nombres de barberías, precios, horarios ni contacto en el código.

---

## Base de datos (NeonDB PostgreSQL)

### Tablas principales

| Tabla | Descripción |
|---|---|
| `barbershops` | Una fila por barbería. Campos: `id`, `name`, `slug`, `address`, `phone`, `description` |
| `users` | Clientes, empleados y owners. Campos: `email`, `name`, `role`, `barbershop_id` |
| `reservations` | Citas. Ligadas a `barbershop_id` |
| `services` | Servicios por barbería (CRUD del owner) |
| `products` | Productos por barbería (CRUD del owner) |
| `orders` | Pedidos de tienda (en desarrollo) |

### Barbería de prueba registrada

| Campo | Valor |
|---|---|
| `barbershop_id` | `narvek` |
| Owner email | `feralbluis@gmail.com` |
| Owner password | `Luis2003` |
| Nombre | Narvek Barbers (editable desde admin) |
| `BARBERSHOP_ID` env var en Vercel | `narvek` |

### Seguridad interna

- **DEV_SECRET:** `narvek-dev-2025` (para endpoints de migración)
- Migraciones en `/api/admin/migrate` y `/api/admin/migrate-v3`

---

## Roles y autenticación

- La sesión se guarda en `localStorage` con clave `inv_session`
- Formato: `{ name, email, role, barberName?, barbershopId?, barbershopName? }`
- Roles: `owner` | `employee` | `client`
- **Owner** → accede a `/admin/dashboard` y todo el panel
- **Employee** → accede solo a `/mi-agenda`
- **Client** → accede a `/reservar`, `/perfil`, `/productos`

---

## Estructura de páginas

### Públicas (sin login)
- `/` — Landing: Hero con nombre de barbería desde DB, nada hardcodeado
- `/reservar` — Reserva en pasos, servicios cargados desde DB
- `/nosotros` — Página genérica del equipo (sin nombre fijo de barbería)
- `/productos` — Catálogo cargado desde DB
- `/login` — Portal de acceso: cliente / barbero / jefe

### Protegidas (cliente)
- `/perfil` — Historial de citas del cliente

### Protegidas (empleado)
- `/mi-agenda` — Agenda semanal del barbero

### Protegidas (owner)
- `/admin/dashboard` — Panel de control con stats
- `/admin/reservas` — Gestión de citas + crear reserva
- `/admin/staff` — Gestión de empleados (crear cuentas)
- `/admin/servicios` — CRUD de servicios de la barbería ← **PENDIENTE UI**
- `/admin/productos` — CRUD de productos ← **pendiente migrar de localStorage a DB**
- `/admin/clientes` — Lista de clientes registrados
- `/admin/facturacion` — Historial de facturas
- `/admin/configuracion` — Ajustes de la barbería (nombre, dirección, teléfono, descripción)

---

## APIs disponibles

| Endpoint | Método | Descripción |
|---|---|---|
| `/api/barbershop` | GET | Info pública de la barbería actual (BARBERSHOP_ID) |
| `/api/barbershops` | GET | Lista todas las barberías (para registro de clientes) |
| `/api/services?barbershopId=X` | GET | Servicios activos de una barbería |
| `/api/reservations` | GET/POST | Reservas (filtra por email con ?email=) |
| `/api/reservations/[id]` | PATCH | Actualizar estado de reserva |
| `/api/barbers?barbershopId=X` | GET | Barberos activos de una barbería |
| `/api/auth/login` | POST | Login → devuelve `{ name, email, role, barbershopId, barbershopName }` |
| `/api/auth/register` | POST | Registro de cliente |
| `/api/admin/services` | GET/POST/PUT/DELETE | CRUD servicios (requiere `x-caller-email` header con role=owner) |
| `/api/admin/products` | GET/POST/PUT/DELETE | CRUD productos (requiere `x-caller-email` header con role=owner) |
| `/api/admin/mi-barberia` | GET/PUT | Info y edición de la barbería del owner |
| `/api/admin/employees` | GET/POST/DELETE | Gestión de empleados |
| `/api/admin/clientes` | GET | Lista de clientes |

---

## Estilo visual — Diseño Viking/Premium

**Paleta:**
- Dorado: `#c8921a` | `#f0c040` (highlights)
- Fondo: `#080604` | `#0e0b07` | `#0a0806`
- Crema: `#f0e6c8` | `#f5ead0`
- Marrón suave: `#b8a882`
- Error: `#f87171` | Éxito: `#4ade80`

**Tipografías (Google Fonts via next/font):**
| Variable CSS | Fuente | Uso |
|---|---|---|
| `--font-cinzel-decorative` | Cinzel Decorative | Logos, títulos épicos |
| `--font-oswald` | Oswald | Nombres de servicios, barberos |
| `--font-barlow` | Barlow Condensed | Botones, nav, labels uppercase |
| `--font-lato` | Lato | Descripciones, cuerpo de texto |
| `--font-im-fell` | IM Fell English | Citas poéticas |

**Moneda:** `€` (mercado Barcelona + Suiza)
**Locale:** `es-ES`
**Efectos:** glow dorado, partículas, parallax en Hero

---

## Lo que NO debes hacer

- ❌ No hardcodear "Invictus", "Invictus Barbería" o cualquier nombre específico de barbería en la UI
- ❌ No hardcodear horarios, dirección, teléfono ni email en componentes públicos
- ❌ No usar `localStorage` para datos que deben estar en DB (servicios, productos)
- ❌ No usar `$` para precios — siempre `€`
- ❌ No usar locale `es-EC` — siempre `es-ES`
- ❌ No crear archivos de documentación adicionales sin actualizar este

---

## Estado actual (abril 2026)

### Completado ✅
- Auth multi-rol (owner/employee/client) con sesión localStorage
- Multi-tenant por `barbershop_id` en DB
- Panel admin: reservas, staff, clientes, facturación
- Agenda de empleados (diseño dorado, carga desde DB)
- Perfil cliente con historial de citas y cancelación
- Navbar role-based (empleados ven solo agenda)
- Hero dinámico (carga nombre de barbería desde `/api/barbershop`)
- Rebrand a BarberOS completo (sin "Invictus" en UI)
- Moneda `€` en todos los precios
- Locale `es-ES` en todo el código

### Pendiente ⏳
- [ ] Landing page genérica (sin horarios hardcodeados, sin datos fijos)
- [ ] Admin `/admin/servicios` — página CRUD (la API ya existe en `/api/admin/services`)
- [ ] Admin `/admin/productos` — migrar de localStorage a DB (API necesita crearse)
- [ ] Admin `/admin/configuracion` — añadir campos: dirección, teléfono, descripción
- [ ] DB migration — añadir columnas `address`, `phone`, `description` a tabla `barbershops`
- [ ] Página `/reservar` — cargar servicios desde DB en vez de hardcodeados
- [ ] Página `/productos` — cargar desde DB en vez de hardcodeados
- [ ] Dashboard admin — métricas reales (ingresos del día, citas hoy)
- [ ] Sistema de pedidos (tienda online con pago por transferencia)

---

## Cómo trabajamos

- El usuario confirma visualmente en producción antes de continuar
- Siempre hacer `git push` para que Vercel despliegue automáticamente
- No hacer `npm run build` local (tarda mucho), confiar en Vercel
- Todos los cambios van a `master` directamente
- El usuario habla español, responder siempre en español
