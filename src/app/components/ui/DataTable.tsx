import React from "react";

interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
}

interface Action {
  label: string;
  icon: React.ReactNode;
  onClick: (row: any) => void;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  actions?: Action[];
  loading?: boolean;
}

export default function DataTable({
  columns,
  data,
  actions,
  loading = false,
}: DataTableProps) {
  return (
    <div className="relative overflow-x-auto bg-white rounded-2xl shadow-md">
      {/* Overlay de carga */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-10 rounded-2xl">
          <div className="flex flex-col items-center">
            <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      <table className="w-full text-sm text-gray-700">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`py-3 px-6 font-semibold ${
                  col.align === "left"
                    ? "text-left"
                    : col.align === "right"
                    ? "text-right"
                    : "text-center"
                }`}
              >
                {col.label}
              </th>
            ))}
            {actions && actions.length > 0 && (
              <th className="py-3 px-6 font-semibold text-center">Acciones</th>
            )}
          </tr>
        </thead>

        <tbody className={loading ? "opacity-50" : ""}>
          {!loading && data.length > 0 ? (
            data.map((row, i) => (
              <tr
                key={i}
                className={`transition-all duration-150 ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-4 px-6 ${
                      col.align === "left"
                        ? "text-left"
                        : col.align === "right"
                        ? "text-right"
                        : "text-center"
                    }`}
                  >
                    {row[col.key]}
                  </td>
                ))}

                {actions && actions.length > 0 && (
                  <td className="py-4 px-6 text-center">
                    <div className="flex justify-center gap-3">
                      {actions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => action.onClick(row)}
                          title={action.label}
                          className="p-2 rounded-full hover:bg-gray-200 text-gray-600 hover:text-blue-600 transition-all duration-150"
                        >
                          {action.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : !loading ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="py-8 text-center text-gray-400 italic"
              >
                No hay datos disponibles
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
