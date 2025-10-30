"use client"

import {
  LayoutDashboard,
  AlignVerticalSpaceAround,
  User,
  ShoppingCart,
  ClipboardMinus,
  Settings,
  MessageSquare,
  Moon,
  Sun,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "../context/AuthContext"
import { useCan } from "../hooks/useCan"
import Link from "next/link"

export default function SidebarMenu() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const { can } = useCan()

  const menu = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, perm: "menu.inicio" },
    { name: "Productos", href: "/dashboard/products", icon: AlignVerticalSpaceAround, perm: "productos.vista" },
    { name: "Clientes", href: "/dashboard/customers", icon: User, perm: "usuarios.vista" },
    { name: "Tienda", href: "/dashboard/shop", icon: ShoppingCart, perm: "menu.piezasInformativas" },
    { name: "Reportes", href: "/dashboard/reports", icon: ClipboardMinus, perm: "reportes.vista" },
    { name: "Configuración", href: "/dashboard/settings", icon: Settings, perm: "roles.vista" },
  ]

  return (
    <aside className="hidden lg:flex lg:w-60 p-4 lg:p-6 flex-col justify-between min-h-screen bg-[#F9F9F9]">
      {/* 🔹 Top */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6 lg:mb-10 px-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <img src="/suitpress-logo.svg" alt="Logo" className="w-12 lg:w-16 h-auto" />
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-1">
          {menu
            .filter((item) => can(item.perm))
            .map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl transition-all duration-200 cursor-pointer
                    ${active
                      ? "bg-white text-[#0D0D0D] shadow-sm"
                      : "text-[#727272] hover:bg-white hover:text-[#0D0D0D]"
                    }`}
                >
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span className="text-xs lg:text-sm font-medium">{item.name}</span>
                </Link>
              )
            })}
        </nav>
      </div>

      {/* 🔹 Bottom Buttons */}
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
  )
}
