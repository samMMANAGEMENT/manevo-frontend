"use client";

import { useEffect, useState, useMemo } from "react";
import { Edit, Plus, Trash2, AlertCircle } from "lucide-react";
import PageHeader from "@/app/components/ui/PageHeader";
import Button from "@/app/components/ui/Button";
import DataTable from "@/app/components/ui/DataTable";
import Modal from "@/app/components/ui/Modal";
import Input from "@/app/components/ui/Input";
import ProductosService, { Producto, ProductoForm } from "@/app/services/Admin/ProductosService";

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingProducto, setSavingProducto] = useState<boolean>(false);

  const [isProductoModalOpen, setIsProductoModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState<ProductoForm>({
    name: "",
    cost_price: 0,
    sale_price: 0,
    stock: 0,
    active: true,
  });

  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    cargarProductos();
  }, []);

  const tablaProductos = useMemo(
    () =>
      productos.map((producto) => ({
        ...producto,
        categoryName: producto.category?.name || "Sin categoría",
        statusLabel: producto.active ? "Activo" : "Inactivo",
        margen: producto.sale_price > 0 ? (((producto.sale_price - producto.cost_price) / producto.sale_price) * 100).toFixed(2) + "%" : "0%",
      })),
    [productos]
  );

  const columns = [
    { key: "name", label: "Producto", align: "left" as const },
    { key: "categoryName", label: "Categoría", align: "left" as const },
    { key: "cost_price", label: "Precio Costo", align: "center" as const },
    { key: "sale_price", label: "Precio Venta", align: "center" as const },
    { key: "margen", label: "Margen", align: "center" as const },
    { key: "stock", label: "Stock", align: "center" as const },
    { key: "statusLabel", label: "Estado", align: "center" as const },
  ];

  const actions = [
    {
      label: "Editar",
      icon: <Edit size={18} />,
      onClick: (producto: Producto) => abrirModalEdicion(producto),
    },
    {
      label: "Eliminar",
      icon: <Trash2 size={18} />,
      onClick: (producto: Producto) => eliminarProducto(producto),
    },
  ];

  async function cargarProductos() {
    try {
      setLoading(true);
      setError("");
      const data = await ProductosService.listarProductos();
      setProductos(data.data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }

  function abrirModalCreacion() {
    setIsEditMode(false);
    setFormData({
      name: "",
      cost_price: 0,
      sale_price: 0,
      stock: 0,
      active: true,
    });
    setProductoSeleccionado(null);
    setError("");
    setIsProductoModalOpen(true);
  }

  function abrirModalEdicion(producto: Producto) {
    setIsEditMode(true);
    setProductoSeleccionado(producto);
    setFormData({
      name: producto.name,
      cost_price: producto.cost_price,
      sale_price: producto.sale_price,
      stock: producto.stock,
      active: producto.active,
      category_id: producto.category_id,
    });
    setError("");
    setIsProductoModalOpen(true);
  }

  function cerrarModal() {
    setIsProductoModalOpen(false);
    setProductoSeleccionado(null);
    setFormData({
      name: "",
      cost_price: 0,
      sale_price: 0,
      stock: 0,
      active: true,
    });
    setError("");
  }

  async function guardarProducto() {
    if (!formData.name.trim()) {
      setError("El nombre del producto es requerido");
      return;
    }

    if (formData.sale_price < 0 || formData.cost_price < 0) {
      setError("Los precios no pueden ser negativos");
      return;
    }

    try {
      setSavingProducto(true);
      setError("");

      if (isEditMode && productoSeleccionado) {
        const actualizado = await ProductosService.actualizarProducto(
          productoSeleccionado.id,
          formData
        );
        setProductos((prev) =>
          prev.map((p) => (p.id === actualizado.id ? actualizado : p))
        );
      } else {
        const nuevoProducto = await ProductosService.crearProducto(formData);
        setProductos((prev) => [nuevoProducto, ...prev]);
      }

      cerrarModal();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      setError("Error al guardar producto");
    } finally {
      setSavingProducto(false);
    }
  }

  async function eliminarProducto(producto: Producto) {
    const confirmed = window.confirm(
      `¿Eliminar "${producto.name}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");
      await ProductosService.eliminarProducto(producto.id);
      setProductos((prev) => prev.filter((p) => p.id !== producto.id));
    } catch (err: any) {
      console.error("Error al eliminar producto:", err);
      setError(err.response?.data?.error || "Error al eliminar producto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Productos"
        subtitle="Gestiona el inventario y catálogo de productos"
      >
        <Button
          label="Agregar producto"
          variant="primary"
          icon={<Plus size={16} />}
          onClick={abrirModalCreacion}
        />
      </PageHeader>

      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <DataTable
        columns={columns}
        data={tablaProductos}
        actions={actions}
        loading={loading}
      />

      <Modal
        isOpen={isProductoModalOpen}
        onClose={cerrarModal}
        title={isEditMode ? "Editar producto" : "Crear producto"}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del producto *
            </label>
            <Input
              placeholder="Nombre del producto"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio de costo *
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.cost_price.toString()}
              onChange={(e) =>
                setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })
              }
              required
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio de venta *
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.sale_price.toString()}
              onChange={(e) =>
                setFormData({ ...formData, sale_price: parseFloat(e.target.value) || 0 })
              }
              required
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock *
            </label>
            <Input
              type="number"
              placeholder="0"
              value={formData.stock.toString()}
              onChange={(e) =>
                setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
              }
              required
              step="1"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Activo</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            variant="ghost"
            label="Cancelar"
            onClick={cerrarModal}
            disabled={savingProducto}
          />
          <Button
            label={isEditMode ? "Actualizar" : "Crear"}
            onClick={guardarProducto}
            loading={savingProducto}
            disabled={savingProducto || !formData.name.trim()}
          />
        </div>
      </Modal>
    </div>
  );
}
