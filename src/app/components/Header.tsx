"use client"
import { Search, Bell, MessageSquare } from "lucide-react"

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-transparent p-3 sm:p-4">

      <div className="flex gap-2 sm:gap-3 justify-end items-center w-full">
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

        {/* Notifications */}
        <button className="hidden sm:block p-2 lg:p-2.5 bg-[#FDFDFD] rounded-xl transition-all duration-200 text-[#727272] hover:text-[#0D0D0D]">
          <Bell size={18} />
        </button>

        {/* Avatar */}
        <img
          alt="User"
          src="/avatar.png"
          className="w-10 h-10 rounded-full shadow-sm object-cover"
        />
      </div>
    </header>
  )
}
