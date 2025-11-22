import $axios from "@/app/lib/axios";

export interface Servicio {
  id: number;
  nombre: string;
  precio: number;
  estado: boolean;
  porcentaje_pago_empleado: string;
  entidad_id: number;
  created_at: string;
  updated_at: string;
}

interface payload {
  nombre: string;
  precio: number;
  estado: boolean;
  porcentaje_pago_empleado: string;
}

export interface ServicioForm {
  nombre: string;
  precio: number;
  estado: boolean;
  porcentaje_pago_empleado: string;
}

async function crearServicio(payload: payload) {
  const response = await $axios.post("/servicios/crear-servicio", payload);
  return response.data;
}

async function obtenerServicios() {
  const response = await $axios.get("/servicios/obtener-servicio");
  return response.data;
}

export const ServiciosService = {
  crearServicio,
  obtenerServicios,
};

export default ServiciosService;
