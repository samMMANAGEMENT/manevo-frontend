"use client";

import Link from "next/link";
import { PlusCircle, Package } from "lucide-react";

export default function PosPage() {
  const cards = [
    {
      title: "Crear Orden",
      description: "Genera una nueva orden de venta",
      href: "/main/pos/crear-orden",
      Icon: PlusCircle,
    },
    {
      title: "Ver productos",
      description: "Explora y gestiona el catálogo",
      href: "/main/pos/productos",
      Icon: Package,
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl p-2">
        {cards.map(({ title, description, href, Icon }) => (
          <Link
            key={title}
            href={href}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-900 group-hover:bg-black group-hover:text-white transition-colors">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-700 group-hover:text-black">
              <span>Ir ahora</span>
              <span
                aria-hidden
                className="inline-block translate-x-0 group-hover:translate-x-0.5 transition-transform"
              >
                →
              </span>
            </div>

            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-transparent group-hover:ring-black/10" />
          </Link>
        ))}
      </div>
    </div>
  );
}
