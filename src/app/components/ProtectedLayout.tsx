// components/ProtectedLayout.tsx
"use client"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import SidebarMenu from "./Sidebar"

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth()
  const router = useRouter()

  // Redirigir si no hay token
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
    <div className="flex min-h-screen bg-gray-100">
      <SidebarMenu />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
