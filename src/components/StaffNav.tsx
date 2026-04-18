"use client";

import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth";

const LINKS = [
  { href: "/mi-agenda", label: "Agenda", icon: "📅" },
  { href: "/caja",      label: "Caja",   icon: "🧾" },
  { href: "/empleado/perfil", label: "Mi Perfil", icon: "👤" },
];

export default function StaffNav({ isOwner = false }: { isOwner?: boolean }) {
  const pathname = usePathname();

  const allLinks = [
    ...LINKS,
    ...(isOwner ? [{ href: "/admin/dashboard", label: "Admin", icon: "🛡️" }] : []),
  ];

  return (
    <div style={{
      backgroundColor: "#0a0806",
      borderBottom: "1px solid rgba(92,58,30,0.45)",
      padding: "0 20px",
      position: "sticky", top: 0, zIndex: 20,
    }}>
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        height: "52px", display: "flex", alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Left: hub + nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <a href="/empleado" style={{
            fontFamily: "var(--font-barlow)", fontSize: "0.6rem",
            letterSpacing: "0.3em", textTransform: "uppercase",
            color: "rgba(184,168,138,0.35)", textDecoration: "none",
            padding: "6px 10px",
          }}>
            ← Hub
          </a>
          <span style={{ color: "rgba(92,58,30,0.4)", fontSize: "0.7rem" }}>|</span>
          {allLinks.map(link => {
            const active = pathname === link.href;
            return (
              <a key={link.href} href={link.href} style={{
                fontFamily: "var(--font-barlow)", fontSize: "0.62rem",
                letterSpacing: "0.25em", textTransform: "uppercase",
                color: active ? "#c8921a" : "rgba(184,168,138,0.45)",
                textDecoration: "none", padding: "6px 10px",
                borderBottom: active ? "2px solid #c8921a" : "2px solid transparent",
                transition: "all 0.2s",
              }}>
                <span style={{ marginRight: "5px" }}>{link.icon}</span>
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right: logout */}
        <button onClick={() => logout("/staff")} style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "var(--font-barlow)", fontSize: "0.58rem",
          letterSpacing: "0.3em", textTransform: "uppercase",
          color: "rgba(239,68,68,0.4)",
        }}>
          Salir
        </button>
      </div>
    </div>
  );
}
