import $axios from "@/app/lib/axios";

export interface Permiso {
    id: number;
    name: string;
    guard_name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

interface payload{
    nombre: string,
    descripcion: string,
}

async function crearPermiso(body: payload){
    const response = await $axios.post("/admin/crear-permiso", body);
    return response.data
}

async function obtenerPermisos(): Promise<Permiso[]> {
    const response = await $axios.get("/admin/obtener-permisos");
    return response.data;
}

export const PermisosService = {
    obtenerPermisos,
    crearPermiso
};

export default PermisosService;

