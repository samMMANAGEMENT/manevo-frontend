// hooks/useCan.ts
import { useAuth } from "../context/AuthContext"

export const useCan = () => {
  const { user } = useAuth()

  const can = (perm: string): boolean => {
    return user?.permissions?.includes(perm) || false
  }

  const canAny = (perms: string[]): boolean => perms.some(can)
  const canAll = (perms: string[]): boolean => perms.every(can)

  return { can, canAny, canAll }
}
