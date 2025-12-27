import $axios from "@/app/lib/axios";

export interface Category {
  id: number;
  name: string;
}

export interface Entity {
  id: number;
  name: string;
}

export interface Producto {
  id: number;
  name: string;
  cost_price: number;
  sale_price: number;
  stock: number;
  active: boolean;
  category_id: number;
  entity_id: number;
  category?: Category;
  entity?: Entity;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse {
  data: Producto[];
  current_page: number;
  last_page: number;
  total: number;
}

export interface ProductoForm {
  name: string;
  cost_price: number;
  sale_price: number;
  stock: number;
  active: boolean;
  category_id?: number;
}

async function listarProductos(page: number = 1): Promise<PaginatedResponse> {
  const response = await $axios.get(`/pos/listarProductos?page=${page}`);
  return response.data;
}

async function crearProducto(payload: ProductoForm): Promise<Producto> {
  const response = await $axios.post("/pos/crearProducto", payload);
  return response.data;
}

async function actualizarProducto(
  productoId: number,
  payload: ProductoForm
): Promise<Producto> {
  const response = await $axios.put(`/pos/actualizarProducto/${productoId}`, payload);
  return response.data;
}

async function eliminarProducto(productoId: number): Promise<void> {
  await $axios.delete(`/pos/eliminarProducto/${productoId}`);
}

async function moverStock(productoId: number, delta: number): Promise<Producto> {
  const response = await $axios.put(`/pos/moverStock/${productoId}`, { delta });
  return response.data;
}

async function cambiarEstado(productoId: number, active: boolean): Promise<Producto> {
  const response = await $axios.put(`/pos/cambiarEstado/${productoId}`, { active });
  return response.data;
}

export const ProductosService = {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  moverStock,
  cambiarEstado,
};

export default ProductosService;
