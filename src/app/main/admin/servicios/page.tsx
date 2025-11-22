"use client";

import Button from '@/app/components/ui/Button'
import DataTable from '@/app/components/ui/DataTable';
import Input from '@/app/components/ui/Input';
import Modal from '@/app/components/ui/Modal';
import PageHeader from '@/app/components/ui/PageHeader'
import ServiciosService, { ServicioForm } from '@/app/services/Admin/ServiciosService';
import { Servicio } from '@/app/services/Admin/ServiciosService';
import { Edit, Plus, Trash2 } from 'lucide-react'
import { useEffect, useState } from "react";

export default function AdminServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<ServicioForm>({
    nombre: '',
    precio: 0,
    estado: true,
    porcentaje_pago_empleado: '40',
  });

  useEffect(() => {
    obtenerServicio();
  }, []);

  function abrirModal() {
    setIsModalOpen(true);
  }

  async function obtenerServicio() {
    try {
      setLoading(true);
      const data = await ServiciosService.obtenerServicios();
      setServicios(data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    } finally {
      setLoading(false);
    }
  }

  async function crearServicio() {
    try {
      await ServiciosService.crearServicio(formData);
      setIsModalOpen(false);
      setFormData({
        nombre: '',
        precio: 0,
        estado: true,
        porcentaje_pago_empleado: '40',
      });
      obtenerServicio();
    } catch (error) {
      console.error("Error al crear servicio:", error);
    }
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "precio", label: "Precio" },
    { key: "porcentaje_pago_empleado", label: "Porcentaje Pago Empleado" },
    { key: "estado", label: "Estado" }
  ]

  const actions = [
    {
      label: "Editar",
      icon: <Edit size={18} />,
      onClick: (row: Servicio) => alert(`Editar: ${row.nombre}`),
    },
    {
      label: "Eliminar",
      icon: <Trash2 size={18} />,
      onClick: (row: Servicio) => alert(`Eliminar: ${row.nombre}`),
    },
  ];

  return (
    <div>
      <div className="space-y-6">
        <PageHeader title='Lista de Servicios'
          subtitle='Gestiona todos los servicios'>
          <Button
            label="Agregar Servicio"
            variant="primary"
            icon={<Plus size={16} />}
            onClick={abrirModal}
          />
        </PageHeader>
      </div>

      <DataTable columns={columns}
        data={servicios} actions={actions}
        loading={loading} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar Servicio"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <Input
              placeholder="Nombre del servicio"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio *
            </label>
            <Input
              type='number'
              value={formData.precio.toString()}
              onChange={(e) => setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })}
              placeholder="Precio del servicio"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Porcentaje Pago Empleado *
            </label>
            <Input
              placeholder="Porcentaje pago empleado"
              value={formData.porcentaje_pago_empleado}
              onChange={(e) => setFormData({ ...formData, porcentaje_pago_empleado: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="flex justify-end pt-4 border-gray-200">
          <Button
            type="submit"
            label="Guardar"
            className="flex items-center gap-2"
            onClick={crearServicio}
          />
        </div>
      </Modal>
    </div>
  )
}
