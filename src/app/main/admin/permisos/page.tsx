"use client";

import { useEffect, useState } from "react";
import PermisosService, { Permiso } from "@/app/services/Admin/PermisosServices";
import DataTable from "@/app/components/ui/DataTable";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import Button from "@/app/components/ui/Button";
import PageHeader from "@/app/components/ui/PageHeader";
import Modal from "@/app/components/ui/Modal";
import Input from "@/app/components/ui/Input";

export default function AdminPermisos() {
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  useEffect(() => {
    obtenerPermisos();
  }, []);

  async function obtenerPermisos() {
    try {
      setLoading(true);
      const data = await PermisosService.obtenerPermisos();
      setPermisos(data);
    } catch (error) {
      console.error("Error al cargar permisos:", error);
    } finally {
      setLoading(false);
    }
  }

  function abrirModal() {
    setIsModalOpen(true);
  }

  async function crearPermiso(payload: { nombre: string; descripcion: string }) {
    try {
      await PermisosService.crearPermiso(payload);
      await obtenerPermisos();
      setIsModalOpen(false);
      setNombre("");
      setDescripcion("");
    } catch (error) {
      console.error("Error al crear permiso:", error);
    }
  }

  const actions = [
    {
      label: "Editar",
      icon: <Edit size={18} />,
      onClick: (row: Permiso) => alert(`Editar: ${row.name}`),
    },
    {
      label: "Eliminar",
      icon: <Trash2 size={18} />,
      onClick: (row: Permiso) => alert(`Eliminar: ${row.name}`),
    },
  ];

  return (
    <div>
      <div className="space-y-6">
        <PageHeader
          title="Lista de Permisos"
          subtitle="Gestiona todos los permisos del sistema"
        >
          <Button
            label="Agregar Permiso"
            variant="primary"
            icon={<Plus size={16} />}
            onClick={abrirModal}
          />
        </PageHeader>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <DataTable
          columns={[
            { key: "name", label: "Nombre" },
            { key: "description", label: "Descripción" },
          ]}
          data={permisos}
          actions={actions}
          loading={loading}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Agregar Permiso"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <Input
              placeholder="Nombre del permiso"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <Input
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del permiso"
            />
          </div>
        </div>
        <div className="flex justify-end pt-4 border-gray-200">
          <Button
            type="submit"
            label="Guardar"
            className="flex items-center gap-2"
            onClick={() => crearPermiso({ nombre, descripcion })}
          />
        </div>
      </Modal>
    </div>
  );
}
