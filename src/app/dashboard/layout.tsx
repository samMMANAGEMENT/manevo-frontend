"use client"

import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import SidebarMenu from "../components/Sidebar"
import Header from "../components/Header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !token) router.replace("/login")
  }, [loading, token, router])

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Cargando...</p>
      </div>
    )

  if (!token) return null

  return (
    <div className="flex min-h-screen bg-[#F9F9F9]">
      <SidebarMenu />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
