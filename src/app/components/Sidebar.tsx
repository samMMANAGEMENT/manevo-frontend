"use client";

import {
  LayoutDashboard,
  User,
  ShoppingCart,
  ClipboardMinus,
  Settings,
  MessageSquare,
  Moon,
  Sun,
  Scissors,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useCan } from "../hooks/useCan";
import Link from "next/link";
import { useState } from "react";

export default function SidebarMenu() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { can } = useCan();
  const [openItem, setOpenItem] = useState<string | null>(null);

  const menu = [
    { name: "Dashboard", href: "/main/dashboard", icon: LayoutDashboard, perm: "menu.dashboard" },
    { name: "Servicios", href: "/main/servicios/registrar", icon: Scissors, perm: "servicios.registrar" },
    { name: "Clientes", href: "/main/dashboard/customers", icon: User, perm: "usuarios.vista" },
    {
      name: "Reportes",
      icon: ClipboardMinus,
      perm: "reportes.vista",
      subItems: [
        { name: "Reportes", href: "/main/reportes", perm: "reportes.vista" },
      ],
    },
    {
      name: "Configuración", href: "/main/admin", icon: Settings, perm: "admin.enter",
      subItems: [
        { name: "Servicios", href: "/main/admin/servicios", perm: "servicios.vista" },
        { name: "Usuarios", href: "/main/admin/usuarios", perm: "usuarios.vista" },
        { name: "Permisos", href: "/main/admin/permisos", perm: "permisos.vista" },
        { name: "Roles", href: "/main/admin/roles", perm: "roles.vista" },
      ],
    },
  ];

  const toggleSubmenu = (name: string) => {
    setOpenItem(openItem === name ? null : name);
  };

  return (
    <aside className="hidden lg:flex lg:w-60 p-4 lg:p-6 flex-col justify-between min-h-screen bg-[#F9F9F9]">
      <div>
        <div className="flex items-center gap-3 mb-6 lg:mb-10 px-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <img src="/suitpress-logo.svg" alt="Logo" className="w-12 lg:w-16 h-auto" />
          </div>
        </div>

        <nav className="space-y-1">
          {menu
            .filter((item) => can(item.perm))
            .map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;

              if (item.subItems) {
                const isOpen = openItem === item.name;
                return (
                  <div key={item.name}>
                    <button
                      onClick={() => toggleSubmenu(item.name)}
                      className={`flex items-center justify-between w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl transition-all duration-200
                        ${isOpen ? "bg-white text-[#0D0D0D] shadow-sm" : "text-[#727272] hover:bg-white hover:text-[#0D0D0D]"}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="text-xs lg:text-sm font-medium">{item.name}</span>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subItems
                          .filter((sub) => can(sub.perm))
                          .map((sub) => {
                            const activeSub = pathname === sub.href;
                            return (
                              <Link
                                key={sub.name}
                                href={sub.href}
                                className={`block text-xs lg:text-sm px-2 py-2 rounded-md transition
                                  ${activeSub
                                    ? "bg-white text-[#0D0D0D] shadow-sm"
                                    : "text-[#727272] hover:bg-white hover:text-[#0D0D0D]"
                                  }`}
                              >
                                {sub.name}
                              </Link>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl transition-all duration-200
                    ${active ? "bg-white text-[#0D0D0D] shadow-sm" : "text-[#727272] hover:bg-white hover:text-[#0D0D0D]"}`}
                >
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                  <span className="text-xs lg:text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
        </nav>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={logout}
          className="p-2.5 lg:p-3 hover:bg-white rounded-xl transition-all duration-200 text-[#727272] hover:text-[#0D0D0D]"
          title="Cerrar sesión"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        <button className="p-2.5 lg:p-3 hover:bg-white rounded-xl transition-all duration-200 text-[#727272] hover:text-[#0D0D0D]">
          <Moon className="w-5 h-5" />
        </button>

        <button className="p-2.5 lg:p-3 hover:bg-white rounded-xl transition-all duration-200 text-[#727272] hover:text-[#0D0D0D]">
          <Sun className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
