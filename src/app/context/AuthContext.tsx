"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import $axios from "../lib/axios"

interface Usuario {
  id: number
  email: string
  operador?: {
    nombre_completo: string
    tipo_documento_documento: string
    cargo: any
  }
  permissions: string[]
  roles: string[]
  password_changed_at: string | null
}

interface AuthContextType {
  user: Usuario | null
  token: string | null
  loading: boolean
  setToken: (token: string | null) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  setToken: () => {},
  logout: () => {},
  refreshUser: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const setToken = (token: string | null) => {
    setTokenState(token)
    if (token) {
      localStorage.setItem("token", token)
      // Asegurar que $axios envíe el header Authorization
      $axios.defaults.headers.common = $axios.defaults.headers.common || {}
      $axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    } else {
      localStorage.removeItem("token")
      if ($axios.defaults.headers && $axios.defaults.headers.common) {
        delete $axios.defaults.headers.common["Authorization"]
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    // Limpiar header por si acaso
    if ($axios.defaults.headers && $axios.defaults.headers.common) {
      delete $axios.defaults.headers.common["Authorization"]
    }
    window.location.href = "/login"
  }

  const refreshUser = async () => {
    // No depender únicamente del estado `token` (puede ser stale al recargar).
    const currentToken = token ?? localStorage.getItem("token")
    if (!currentToken) {
      setUser(null)
      return
    }

    // Asegurar header Authorization en $axios antes de la llamada
    $axios.defaults.headers.common = $axios.defaults.headers.common || {}
    if (!$axios.defaults.headers.common["Authorization"]) {
      $axios.defaults.headers.common["Authorization"] = `Bearer ${currentToken}`
    }

    try {
      const { data } = await $axios.get("/auth/me")
      setUser(data)
      localStorage.setItem("usuario", JSON.stringify(data))

      if (data.response == 401){
        logout();
      }

    } catch (error) {
      console.error("Error al obtener usuario:", error)
      logout()
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      refreshUser().finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, setToken, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
