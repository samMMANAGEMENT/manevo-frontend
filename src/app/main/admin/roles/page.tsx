"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckSquare, Plus, Shield, Square, Trash2 } from "lucide-react";
import PageHeader from "@/app/components/ui/PageHeader";
import Button from "@/app/components/ui/Button";
import DataTable from "@/app/components/ui/DataTable";
import Modal from "@/app/components/ui/Modal";
import Input from "@/app/components/ui/Input";
import RolesService, { Rol } from "@/app/services/Admin/RolesService";
import PermisosService, { Permiso } from "@/app/services/Admin/PermisosServices";

export default function AdminRoles() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [busquedaPermiso, setBusquedaPermiso] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [savingRol, setSavingRol] = useState<boolean>(false);
  const [syncingPermisos, setSyncingPermisos] = useState<boolean>(false);

  const [isRolModalOpen, setIsRolModalOpen] = useState(false);
  const [isPermisosModalOpen, setIsPermisosModalOpen] = useState(false);

  const [nombreRol, setNombreRol] = useState("");
  const [descripcionRol, setDescripcionRol] = useState("");

  const [rolSeleccionado, setRolSeleccionado] = useState<Rol | null>(null);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<number[]>([]);

  useEffect(() => {
    cargarRolesYPermisos();
  }, []);

  const tablaRoles = useMemo(
    () =>
      roles.map((rol) => ({
        ...rol,
        descriptionLabel: rol.description || "Sin descripción",
        permisosLabel:
          rol.permissions?.length > 0
            ? rol.permissions.map((permiso) => permiso.name).join(", ")
            : "Sin permisos",
      })),
    [roles]
  );

  const filteredPermisos = useMemo(() => {
    const term = busquedaPermiso.trim().toLowerCase();
    if (!term) return permisos;

    return permisos.filter((permiso) =>
      [permiso.name, permiso.description || ""].some((field) =>
        field.toLowerCase().includes(term)
      )
    );
  }, [busquedaPermiso, permisos]);

  const columns = [
    { key: "name", label: "Nombre", align: "left" as const },
    { key: "descriptionLabel", label: "Descripción", align: "left" as const },
    { key: "permisosLabel", label: "Permisos", align: "left" as const },
  ];

  const actions = [
    {
      label: "Permisos",
      icon: <Shield size={18} />,
      onClick: (rol: Rol) => abrirModalPermisos(rol),
    },
    {
      label: "Eliminar",
      icon: <Trash2 size={18} />,
      onClick: (rol: Rol) => eliminarRol(rol),
    },
  ];

  async function cargarRolesYPermisos() {
    try {
      setLoading(true);
      const [rolesData, permisosData] = await Promise.all([
        RolesService.obtenerRoles(),
        PermisosService.obtenerPermisos(),
      ]);
      setRoles(rolesData);
      setPermisos(permisosData.map((permiso) => ({
        ...permiso,
        id: Number(permiso.id),
      })));
    } catch (error) {
      console.error("Error al cargar roles y permisos:", error);
    } finally {
      setLoading(false);
    }
  }

  async function refrescarRoles() {
    try {
      const rolesData = await RolesService.obtenerRoles();
      setRoles(rolesData);
    } catch (error) {
      console.error("Error al actualizar roles:", error);
    }
  }

  async function crearRol() {
    if (!nombreRol.trim()) return;

    try {
      setSavingRol(true);
      await RolesService.crearRol({
        nombre: nombreRol.trim(),
        descripcion: descripcionRol.trim() || undefined,
      });

      setIsRolModalOpen(false);
      setNombreRol("");
      setDescripcionRol("");

      await refrescarRoles();
    } catch (error) {
      console.error("Error al crear rol:", error);
    } finally {
      setSavingRol(false);
    }
  }

  function abrirModalPermisos(rol: Rol) {
    setRolSeleccionado(rol);
    setPermisosSeleccionados(
      rol.permissions?.map((permiso) => Number(permiso.id)) || []
    );
    setIsPermisosModalOpen(true);
  }

  function cerrarModalPermisos() {
    setIsPermisosModalOpen(false);
    setRolSeleccionado(null);
    setPermisosSeleccionados([]);
  }

  function togglePermiso(permisoId: number) {
    setPermisosSeleccionados((prev) =>
      prev.includes(permisoId)
        ? prev.filter((id) => id !== permisoId)
        : [...prev, permisoId]
    );
  }

  async function guardarPermisos() {
    if (!rolSeleccionado) return;

    try {
      setSyncingPermisos(true);
      const rolActualizado = await RolesService.sincronizarPermisos(
        rolSeleccionado.id,
        permisosSeleccionados
      );

      setRoles((prev) =>
        prev.map((rol) => (rol.id === rolActualizado.id ? rolActualizado : rol))
      );
      cerrarModalPermisos();
    } catch (error) {
      console.error("Error al actualizar permisos del rol:", error);
    } finally {
      setSyncingPermisos(false);
    }
  }

  async function eliminarRol(rol: Rol) {
    const confirmed = window.confirm(
      `¿Eliminar el rol "${rol.name}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    try {
      setLoading(true);
      await RolesService.eliminarRol(rol.id);
      setRoles((prev) => prev.filter((item) => item.id !== rol.id));
    } catch (error) {
      console.error("Error al eliminar rol:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        subtitle="Gestiona los roles y sus permisos"
      >
        <Button
          label="Nuevo rol"
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsRolModalOpen(true)}
        />
      </PageHeader>

      <DataTable
        columns={columns}
        data={tablaRoles}
        actions={actions}
        loading={loading}
      />

      <Modal
        isOpen={isRolModalOpen}
        onClose={() => setIsRolModalOpen(false)}
        title="Crear rol"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <Input
              placeholder="Nombre del rol"
              value={nombreRol}
              onChange={(e) => setNombreRol(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <Input
              placeholder="Descripción del rol"
              value={descripcionRol}
              onChange={(e) => setDescripcionRol(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-gray-200">
          <Button
            type="submit"
            label="Guardar"
            className="flex items-center gap-2"
            onClick={crearRol}
            loading={savingRol}
            disabled={!nombreRol.trim()}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isPermisosModalOpen}
        onClose={cerrarModalPermisos}
        title={`Permisos de ${rolSeleccionado?.name ?? ""}`}
        size="lg"
        subtitle="Activa o desactiva los permisos asignados al rol"
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 font-medium">
                <Shield className="w-4 h-4" />
                {permisosSeleccionados.length} seleccionados
              </span>
              <span className="text-gray-400">•</span>
              <span>{permisos.length} disponibles</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                label="Seleccionar todo"
                size="sm"
                onClick={() => setPermisosSeleccionados(filteredPermisos.map((p) => p.id))}
                disabled={filteredPermisos.length === 0}
              />
              <Button
                variant="ghost"
                label="Limpiar selección"
                size="sm"
                onClick={() => setPermisosSeleccionados([])}
                disabled={permisosSeleccionados.length === 0}
              />
              <Input
                placeholder="Buscar permiso"
                value={busquedaPermiso}
                onChange={(e) => setBusquedaPermiso(e.target.value)}
                className="w-56"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
          {filteredPermisos.map((permiso) => {
            const activo = permisosSeleccionados.includes(permiso.id);
            return (
              <label
                key={permiso.id}
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition ${
                  activo ? "border-black bg-gray-50" : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => togglePermiso(permiso.id)}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={activo}
                  readOnly
                />
                {activo ? (
                  <CheckSquare className="w-5 h-5 text-black mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{permiso.name}</p>
                  {permiso.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{permiso.description}</p>
                  )}
                </div>
              </label>
            );
          })}
          {filteredPermisos.length === 0 && (
            <div className="col-span-2 text-center text-gray-500 py-6 text-sm">
              No hay permisos que coincidan con la búsqueda.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button
            variant="ghost"
            label="Cancelar"
            onClick={cerrarModalPermisos}
            disabled={syncingPermisos}
          />
          <Button
            label="Guardar cambios"
            onClick={guardarPermisos}
            loading={syncingPermisos}
            disabled={syncingPermisos}
          />
        </div>
        </div>
      </Modal>
    </div>
  );
}
