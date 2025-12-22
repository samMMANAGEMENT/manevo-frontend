"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2, AlertCircle } from "lucide-react";
import Link from "next/link";
import Button from "@/app/components/ui/Button";
import Input from "@/app/components/ui/Input";
import ProductosService, { Producto } from "@/app/services/Admin/ProductosService";

interface ItemOrden {
  producto_id: number;
  producto: Producto;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export default function CrearOrdenPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(true);
  const [error, setError] = useState<string>("");

  const [itemsOrden, setItemsOrden] = useState<ItemOrden[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [cantidadItem, setCantidadItem] = useState<number>(1);

  useEffect(() => {
    cargarProductos();
  }, []);

  async function cargarProductos() {
    try {
      setLoadingProductos(true);
      setError("");
      const data = await ProductosService.listarProductos();
      setProductos(data.data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("Error al cargar productos");
    } finally {
      setLoadingProductos(false);
    }
  }

  function agregarItem() {
    if (!productoSeleccionado || cantidadItem <= 0) {
      setError("Selecciona un producto y una cantidad válida");
      return;
    }

    const itemExistente = itemsOrden.find(
      (item) => item.producto_id === productoSeleccionado.id
    );

    if (itemExistente) {
      setItemsOrden((prev) =>
        prev.map((item) =>
          item.producto_id === productoSeleccionado.id
            ? {
                ...item,
                cantidad: item.cantidad + cantidadItem,
                subtotal: (item.cantidad + cantidadItem) * item.precio_unitario,
              }
            : item
        )
      );
    } else {
      const nuevoItem: ItemOrden = {
        producto_id: productoSeleccionado.id,
        producto: productoSeleccionado,
        cantidad: cantidadItem,
        precio_unitario: productoSeleccionado.sale_price,
        subtotal: cantidadItem * productoSeleccionado.sale_price,
      };
      setItemsOrden((prev) => [...prev, nuevoItem]);
    }

    setProductoSeleccionado(null);
    setCantidadItem(1);
    setError("");
  }

  function eliminarItem(productoId: number) {
    setItemsOrden((prev) => prev.filter((item) => item.producto_id !== productoId));
  }

  function actualizarCantidad(productoId: number, nuevaCantidad: number) {
    if (nuevaCantidad <= 0) {
      eliminarItem(productoId);
      return;
    }

    setItemsOrden((prev) =>
      prev.map((item) =>
        item.producto_id === productoId
          ? {
              ...item,
              cantidad: nuevaCantidad,
              subtotal: nuevaCantidad * item.precio_unitario,
            }
          : item
      )
    );
  }

  const total = itemsOrden.reduce((sum, item) => sum + item.subtotal, 0);

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
                <select
                  value={productoSeleccionado?.id ?? ""}
                  onChange={(e) => {
                    const producto = productos.find((p) => p.id === parseInt(e.target.value));
                    setProductoSeleccionado(producto || null);
                  }}
                  className="w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent px-4 py-2 text-gray-900"
                  disabled={loadingProductos}
                >
                  <option value="">Selecciona un producto</option>
                  {productos.map((producto) => (
                    <option key={producto.id} value={producto.id}>
                      {producto.name} - ${producto.sale_price.toFixed(2)} (Stock: {producto.stock})
                    </option>
                  ))}
                </select>
              </div>

              {productoSeleccionado && (
                <div className="rounded-lg bg-gray-50 p-3 border border-gray-200">
                  <p className="text-xs text-gray-600">Precio unitario</p>
                  <p className="text-xl font-semibold text-gray-900">
                    ${productoSeleccionado.sale_price.toFixed(2)}
                  </p>
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
                />
              </div>

              <Button
                label="Agregar a orden"
                variant="primary"
                icon={<Plus size={18} />}
                fullWidth
                onClick={agregarItem}
                disabled={!productoSeleccionado || cantidadItem <= 0}
              />
            </div>
          </div>
        </div>

        {/* Panel de orden */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Orden actual</h2>

            {itemsOrden.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-sm">Sin productos agregados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {itemsOrden.map((item) => (
                  <div
                    key={item.producto_id}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.producto.name}</h3>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-sm text-gray-600">
                        <div>
                          <p className="text-xs text-gray-500">Cantidad</p>
                          <Input
                            type="number"
                            value={item.cantidad.toString()}
                            onChange={(e) =>
                              actualizarCantidad(item.producto_id, parseInt(e.target.value) || 0)
                            }
                            className="w-20"
                            min="1"
                            step="1"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Unitario</p>
                          <p className="font-semibold text-gray-900">
                            ${item.precio_unitario.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Subtotal</p>
                          <p className="font-semibold text-gray-900">
                            ${item.subtotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => eliminarItem(item.producto_id)}
                      className="ml-4 p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                      title="Eliminar item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                <div className="border-t border-gray-200 mt-6 pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-3xl font-bold text-black">
                      ${total.toFixed(2)}
                    </span>
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
                      disabled={itemsOrden.length === 0}
                      onClick={() => alert("Función de confirmación a implementar")}
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
