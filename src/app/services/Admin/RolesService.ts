import $axios from "@/app/lib/axios";
import type { Permiso } from "./PermisosServices";

export interface Rol {
  id: number;
  name: string;
  description: string | null;
  guard_name: string;
  permissions: Permiso[];
}

interface RolPayload {
  nombre: string;
  descripcion?: string;
}

async function obtenerRoles(): Promise<Rol[]> {
  const response = await $axios.get("/admin/roles");
  return response.data;
}

async function crearRol(payload: RolPayload): Promise<Rol> {
  const response = await $axios.post("/admin/roles", payload);
  return response.data;
}

async function sincronizarPermisos(
  rolId: number,
  permisos: number[]
): Promise<Rol> {
  const response = await $axios.post(`/admin/roles/${rolId}/permisos`, {
    permisos,
  });
  return response.data;
}

async function eliminarRol(rolId: number): Promise<void> {
  await $axios.delete(`/admin/roles/${rolId}`);
}

export const RolesService = {
  obtenerRoles,
  crearRol,
  sincronizarPermisos,
  eliminarRol,
};

export default RolesService;
