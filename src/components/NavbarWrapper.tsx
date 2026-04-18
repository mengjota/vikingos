"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/staff" || pathname === "/empleado" || pathname.startsWith("/admin")) return null;
  const transparentOnTop = pathname === "/";
  return <Navbar transparentOnTop={transparentOnTop} />;
}
