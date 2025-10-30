"use client"
import { Search, Bell, MessageSquare } from "lucide-react"

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-transparent p-3 sm:p-4">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#0D0D0D]">Dashboard</h1>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search (Desktop) */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-[#727272]" size={16} />
          <input
            type="text"
            placeholder="Busca cualquier cosa..."
            className="w-32 md:w-48 lg:w-80 rounded-xl bg-[#FDFDFD] pl-9 lg:pl-11 pr-3 lg:pr-4 py-2 lg:py-2.5 text-xs lg:text-sm outline-none focus:ring-2 focus:ring-[#2A2A2A]/10 text-[#0D0D0D] placeholder:text-[#727272]"
          />
        </div>

        {/* Search (Mobile) */}
        <button className="md:hidden p-2 bg-[#FDFDFD] rounded-xl transition-all duration-200 text-[#727272] hover:text-[#0D0D0D]">
          <Search size={18} />
        </button>

        {/* Create */}
        <button className="bg-[#2A2A2A] text-[#FDFDFD] px-3 sm:px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl hover:bg-[#0D0D0D] transition-all duration-200 text-xs lg:text-sm font-medium">
          <span className="hidden sm:inline">Crear</span>
          <span className="sm:hidden">+</span>
        </button>

        {/* Notifications */}
        <button className="hidden sm:block p-2 lg:p-2.5 bg-[#FDFDFD] rounded-xl transition-all duration-200 text-[#727272] hover:text-[#0D0D0D]">
          <Bell size={18} />
        </button>

        {/* Messages */}
        <button className="hidden sm:block p-2 lg:p-2.5 bg-[#FDFDFD] rounded-xl transition-all duration-200 text-[#727272] hover:text-[#0D0D0D]">
          <MessageSquare size={18} />
        </button>

        {/* Avatar */}
        <img
          alt="User"
          src="/avatar.png"
          className="w-8 h-8 lg:w-9 lg:h-9 rounded-full border-2 border-[#FDFDFD] shadow-sm object-cover"
        />
      </div>
    </header>
  )
}
