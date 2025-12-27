import $axios from "@/app/lib/axios";
import { Producto } from "./ProductosService";

export type MetodoPago = "CASH" | "TRANSFER";

export interface Pago {
  id: number;
  order_id: number;
  method: MetodoPago;
  amount: number;
  paid_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrdenItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  profit: number;
  product?: Producto;
}

export interface Orden {
  id: number;
  entity_id: number;
  status: "DRAFT" | "PAID" | "CANCELLED";
  total: number;
  items: OrdenItem[];
  payments: Pago[];
  created_at?: string;
  updated_at?: string;
}

async function listarOrdenes(status?: string): Promise<Orden[]> {
  const response = await $axios.get("/pos/ordenes", { params: { status } });
  return response.data;
}

async function crearOrden(): Promise<Orden> {
  const response = await $axios.post("/pos/ordenes");
  return response.data;
}

async function obtenerOrden(orderId: number): Promise<Orden> {
  const response = await $axios.get(`/pos/ordenes/${orderId}`);
  return response.data;
}

async function agregarItem(orderId: number, productId: number, quantity: number): Promise<OrdenItem> {
  const response = await $axios.post(`/pos/ordenes/${orderId}/items`, {
    product_id: productId,
    quantity,
  });
  return response.data;
}

async function actualizarItem(orderId: number, itemId: number, quantity: number): Promise<OrdenItem> {
  const response = await $axios.put(`/pos/ordenes/${orderId}/items/${itemId}`, {
    quantity,
  });
  return response.data;
}

async function eliminarItem(orderId: number, itemId: number): Promise<void> {
  await $axios.delete(`/pos/ordenes/${orderId}/items/${itemId}`);
}

async function agregarPago(orderId: number, method: MetodoPago, amount: number, paidAt: string): Promise<Orden> {
  const response = await $axios.post(`/pos/ordenes/${orderId}/pagos`, {
    method,
    amount,
    paid_at: paidAt,
  });
  return response.data;
}

async function cancelarOrden(orderId: number): Promise<Orden> {
  const response = await $axios.post(`/pos/ordenes/${orderId}/cancelar`);
  return response.data;
}

export const OrdenesService = {
  listarOrdenes,
  crearOrden,
  obtenerOrden,
  agregarItem,
  actualizarItem,
  eliminarItem,
  agregarPago,
  cancelarOrden,
};

export default OrdenesService;
