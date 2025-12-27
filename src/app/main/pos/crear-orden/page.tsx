"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Plus, Trash2, AlertCircle, CreditCard } from "lucide-react";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import Autocomplete from "@/app/components/ui/Autocomplete";
import ProductosService, { Producto } from "@/app/services/Admin/ProductosService";
import OrdenesService, { MetodoPago, Orden, OrdenItem } from "@/app/services/Admin/OrdenesService";

export default function CrearOrdenPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [orden, setOrden] = useState<Orden | null>(null);
  const [loading, setLoading] = useState(true);
  const [operando, setOperando] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [cantidadItem, setCantidadItem] = useState<number>(1);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("CASH");
  const [busquedaProducto, setBusquedaProducto] = useState<string>("");

  const ordenEditable = orden?.status === "DRAFT";
  const itemsOrden: OrdenItem[] = orden?.items || [];

  const productosFiltrados = useMemo(() => {
    const query = busquedaProducto.toLowerCase().trim();
    if (!query) return productos.slice(0, 20);
    return productos.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 20);
  }, [productos, busquedaProducto]);

  useEffect(() => {
    inicializar();
  }, []);

  function extraerError(err: any, fallback: string): string {
    const apiError = err?.response?.data;
    if (apiError?.errors) {
      const firstKey = Object.keys(apiError.errors)[0];
      if (firstKey) {
        return apiError.errors[firstKey][0];
      }
    }
    return apiError?.message || apiError?.error || fallback;
  }

  async function inicializar() {
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      const [productosResp, ordenResp] = await Promise.all([
        ProductosService.listarProductos(),
        OrdenesService.crearOrden(),
      ]);

      setProductos(productosResp.data);
      setOrden(ordenResp);
    } catch (err) {
      console.error("Error al iniciar creación de orden:", err);
      setError(extraerError(err, "Error al iniciar la orden"));
    } finally {
      setLoading(false);
    }
  }

  function agregarItem() {
    if (!orden) {
      setError("No se pudo crear la orden");
      return;
    }

    if (!ordenEditable) {
      setError("La orden ya no se puede editar");
      return;
    }

    if (!productoSeleccionado || cantidadItem <= 0) {
      setError("Selecciona un producto y una cantidad válida");
      return;
    }

    setOperando(true);
    setError("");
    setSuccess("");

    OrdenesService.agregarItem(orden.id, productoSeleccionado.id, cantidadItem)
      .then(() => refrescarOrden(orden.id))
      .catch((err) => {
        console.error("Error al agregar item:", err);
        setError(extraerError(err, "Error al agregar producto"));
      })
      .finally(() => {
        setOperando(false);
        setProductoSeleccionado(null);
        setCantidadItem(1);
      });
  }

  function eliminarItem(productoId: number) {
    if (!ordenEditable || !orden) return;

    const item = itemsOrden.find((i) => i.product_id === productoId);
    if (!item) return;

    setOperando(true);
    setError("");
    setSuccess("");

    OrdenesService.eliminarItem(orden.id, item.id)
      .then(() => refrescarOrden(orden.id))
      .catch((err) => {
        console.error("Error al eliminar item:", err);
        setError(extraerError(err, "Error al eliminar item"));
      })
      .finally(() => setOperando(false));
  }

  function actualizarCantidad(productoId: number, nuevaCantidad: number) {
    if (!ordenEditable || !orden) return;

    const item = itemsOrden.find((i) => i.product_id === productoId);
    if (!item) return;

    if (nuevaCantidad <= 0) {
      eliminarItem(productoId);
      return;
    }

    setOperando(true);
    setError("");
    setSuccess("");

    OrdenesService.actualizarItem(orden.id, item.id, nuevaCantidad)
      .then(() => refrescarOrden(orden.id))
      .catch((err) => {
        console.error("Error al actualizar cantidad:", err);
        setError(extraerError(err, "Error al actualizar cantidad"));
      })
      .finally(() => setOperando(false));
  }

  async function refrescarOrden(orderId?: number) {
    const id = orderId ?? orden?.id;
    if (!id) return;

    try {
      const data = await OrdenesService.obtenerOrden(id);
      setOrden(data);
    } catch (err) {
      console.error("Error al refrescar orden:", err);
      setError(extraerError(err, "No se pudo actualizar la orden"));
    }
  }

  async function confirmarOrden() {
    if (!orden) {
      setError("No se pudo crear la orden");
      return;
    }

    if (!ordenEditable) {
      setError("La orden ya fue cerrada o cancelada");
      return;
    }

    if (itemsOrden.length === 0) {
      setError("Agrega al menos un producto antes de confirmar");
      return;
    }

    if (orden.total <= 0) {
      setError("El total debe ser mayor a 0");
      return;
    }

    setConfirming(true);
    setError("");
    setSuccess("");

    try {
      const pagada = await OrdenesService.agregarPago(
        orden.id,
        metodoPago,
        orden.total,
        new Date().toISOString()
      );

      setOrden(pagada);
      setSuccess("Orden pagada correctamente");
    } catch (err) {
      console.error("Error al confirmar orden:", err);
      setError(extraerError(err, "Error al confirmar la orden"));
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/main/pos">
          <Button
            variant="ghost"
            icon={<ArrowLeft size={18} />}
            label="Volver"
          />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Crear Orden</h1>
          <p className="text-gray-600 mt-2">Selecciona productos y crea una nueva orden</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <CreditCard className="h-5 w-5 text-green-600 shrink-0" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de selección de productos */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Agregar productos</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Producto
                </label>
                <Autocomplete
                  items={productosFiltrados}
                  value={productoSeleccionado}
                  inputValue={busquedaProducto}
                  onInputChange={(val) => setBusquedaProducto(val)}
                  onSelect={(producto) => {
                    setProductoSeleccionado(producto);
                    setBusquedaProducto(producto.name);
                  }}
                  getOptionLabel={(p) => p.name}
                  renderOptionExtra={(p) => {
                    const price = Number(p.sale_price || 0);
                    return `$${price.toFixed(2)} · Stock ${p.stock}`;
                  }}
                  placeholder="Busca por nombre"
                  disabled={loading || operando || !ordenEditable}
                />
              </div>

              {productoSeleccionado && (
                <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
                  <p className="text-xs text-gray-600">Precio unitario</p>
                  {(() => {
                    const price = Number(productoSeleccionado.sale_price || 0);
                    return (
                  <p className="text-xl font-semibold text-gray-900">
                      ${price.toFixed(2)}
                  </p>
                    );
                  })()}
                  <p className="text-xs text-gray-600 mt-2">
                    Stock disponible: <span className="font-medium">{productoSeleccionado.stock}</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={cantidadItem.toString()}
                  onChange={(e) => setCantidadItem(parseInt(e.target.value) || 0)}
                  min="1"
                  step="1"
                  disabled={operando || !ordenEditable}
                />
              </div>

              <Button
                label="Agregar a orden"
                variant="primary"
                icon={<Plus size={18} />}
                fullWidth
                onClick={agregarItem}
                disabled={!productoSeleccionado || cantidadItem <= 0 || operando || !ordenEditable}
              />
            </div>
          </div>
        </div>

        {/* Panel de orden */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Orden actual</h2>
                <p className="text-sm text-gray-500">Estado: {orden?.status || "Cargando..."}</p>
              </div>
              {orden && (
                <span className="text-sm text-gray-500">#{orden.id}</span>
              )}
            </div>

            {itemsOrden.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">Sin productos agregados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {itemsOrden.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
                        <div>
                          <p className="text-xs text-gray-500">Cantidad</p>
                          <Input
                            type="number"
                            value={item.quantity.toString()}
                            onChange={(e) =>
                              actualizarCantidad(item.product_id, parseInt(e.target.value) || 0)
                            }
                            className="w-20"
                            min="1"
                            step="1"
                            disabled={!ordenEditable || operando}
                          />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Unitario</p>
                          <p className="font-semibold text-gray-900">
                            ${Number(item.price || 0).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Subtotal</p>
                          <p className="font-semibold text-gray-900">
                            ${Number(item.subtotal || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => eliminarItem(item.product_id)}
                      className="ml-4 p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                      title="Eliminar item"
                      disabled={!ordenEditable || operando}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                <div className="border-t border-gray-200 mt-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Método de pago
                      </label>
                      <select
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
                        className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent px-4 py-2 text-gray-900"
                        disabled={!ordenEditable || confirming}
                      >
                        <option value="CASH">Efectivo</option>
                        <option value="TRANSFER">Transferencia</option>
                      </select>
                    </div>
                    <div className="flex items-end justify-end">
                      <div className="text-right">
                        <span className="text-sm text-gray-600">Total</span>
                        <p className="text-3xl font-bold text-black">
                          ${Number(orden?.total || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-lg font-semibold text-gray-900">Estado:</span>
                    <span className="text-base font-medium text-gray-700">{orden?.status}</span>
                  </div>

                  <div className="flex gap-3">
                    <Link href="/main/pos" className="flex-1">
                      <Button
                        label="Cancelar"
                        variant="ghost"
                        fullWidth
                      />
                    </Link>
                    <Button
                      label="Confirmar orden"
                      variant="primary"
                      fullWidth
                      disabled={itemsOrden.length === 0 || confirming || !ordenEditable}
                      onClick={confirmarOrden}
                      loading={confirming}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
