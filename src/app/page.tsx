import React from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, Box, Lock, Monitor, ShieldCheck, Zap } from "lucide-react";
import Button from "./components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#171717] font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src="/suitpress-logo.svg" alt="Manevo Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold tracking-tight text-[#2A2A2A]">manevo</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-[#2A2A2A] transition-colors">
                Características
              </Link>
              <Link href="#about" className="text-sm font-medium text-gray-600 hover:text-[#2A2A2A] transition-colors">
                Nosotros
              </Link>
              <Link href="/login">
                <Button label="Iniciar Sesión" size="sm" variant="primary" />
              </Link>
            </div>
            <div className="md:hidden">
              <Link href="/login">
                <Button label="Entrar" size="sm" variant="primary" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-600 mb-6 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              En Desarrollo
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#2A2A2A] mb-6 leading-tight">
              Gestiona tu negocio con <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2A2A2A] to-gray-500">
                inteligencia y control.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Manevo es la plataforma integral para administrar productos, ventas, inventarios y equipos.
              Simplifica tus operaciones y escala sin límites.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/login">
                <Button label="Registrate Ahora, ¡es gratis!" size="lg" icon={<ArrowRight size={18} />} />
              </Link>
              <Button label="Planes" variant="outline" size="lg" />
            </div>
          </div>

          {/* Hero Image / Dashboard Preview */}
          <div className="relative mx-auto max-w-5xl mt-12 rounded-2xl shadow-2xl border border-gray-200 bg-white p-2 md:p-4 animate-fade-in-up delay-200">
            <div className="rounded-xl overflow-hidden bg-gray-50 aspect-[16/9] relative group">
              {/* Abstract Dashboard UI Representation */}
              <div className="absolute inset-0 flex flex-col">
                {/* Header */}
                <div className="h-12 bg-white border-b border-gray-100 flex items-center px-6 gap-4">
                  <div className="w-32 h-3 bg-gray-200 rounded-full"></div>
                  <div className="flex-1"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
                {/* Body */}
                <div className="flex-1 flex p-6 gap-6">
                  {/* Sidebar */}
                  <div className="w-16 md:w-48 hidden md:flex flex-col gap-4">
                    <div className="w-full h-8 bg-gray-200 rounded-lg opacity-80"></div>
                    <div className="w-full h-8 bg-gray-100 rounded-lg opacity-60"></div>
                    <div className="w-full h-8 bg-gray-100 rounded-lg opacity-60"></div>
                    <div className="w-full h-8 bg-gray-100 rounded-lg opacity-60"></div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="flex gap-4">
                      <div className="flex-1 h-32 bg-indigo-50 rounded-2xl border border-indigo-100 p-4 transition-transform group-hover:-translate-y-1 duration-500">
                        <div className="w-8 h-8 bg-indigo-200 rounded-lg mb-4"></div>
                        <div className="w-24 h-4 bg-indigo-200 rounded mb-2 opacity-70"></div>
                        <div className="w-16 h-6 bg-indigo-300 rounded opacity-90"></div>
                      </div>
                      <div className="flex-1 h-32 bg-emerald-50 rounded-2xl border border-emerald-100 p-4 transition-transform group-hover:-translate-y-1 duration-500 delay-75">
                        <div className="w-8 h-8 bg-emerald-200 rounded-lg mb-4"></div>
                        <div className="w-24 h-4 bg-emerald-200 rounded mb-2 opacity-70"></div>
                        <div className="w-16 h-6 bg-emerald-300 rounded opacity-90"></div>
                      </div>
                      <div className="flex-1 h-32 bg-orange-50 rounded-2xl border border-orange-100 p-4 hidden sm:block transition-transform group-hover:-translate-y-1 duration-500 delay-150">
                        <div className="w-8 h-8 bg-orange-200 rounded-lg mb-4"></div>
                        <div className="w-24 h-4 bg-orange-200 rounded mb-2 opacity-70"></div>
                        <div className="w-16 h-6 bg-orange-300 rounded opacity-90"></div>
                      </div>
                    </div>
                    <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <div className="w-32 h-5 bg-gray-200 rounded"></div>
                        <div className="w-20 h-8 bg-gray-100 rounded"></div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-10 w-full bg-gray-50 rounded flex items-center px-4"><div className="w-full h-2 bg-gray-200 rounded overflow-hidden"><div className="w-3/4 h-full bg-gray-400"></div></div></div>
                        <div className="h-10 w-full bg-gray-50 rounded flex items-center px-4"><div className="w-full h-2 bg-gray-200 rounded overflow-hidden"><div className="w-1/2 h-full bg-gray-300"></div></div></div>
                        <div className="h-10 w-full bg-gray-50 rounded flex items-center px-4"><div className="w-full h-2 bg-gray-200 rounded overflow-hidden"><div className="w-2/3 h-full bg-gray-300"></div></div></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
            </div>
            {/* Blurs */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-20 -z-10 animate-pulse"></div>
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-20 -z-10 animate-pulse delay-700"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-[#2A2A2A] mb-4">Todo lo que necesitas para crecer</h2>
            <p className="text-gray-600">Herramientas poderosas diseñadas para la eficiencia operativa.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Box size={24} className="text-blue-600" />}
              title="Gestión de Inventario"
              description="Controla stock en tiempo real, variantes de productos y categorías con facilidad."
            />
            <FeatureCard
              icon={<Monitor size={24} className="text-purple-600" />}
              title="Punto de Venta (POS)"
              description="Una interfaz rápida y amigable para procesar ventas en segundos desde cualquier dispositivo."
            />
            <FeatureCard
              icon={<ShieldCheck size={24} className="text-green-600" />}
              title="Roles y Permisos"
              description="Define accesos granulares para administradores, vendedores y personal de soporte."
            />
            <FeatureCard
              icon={<BarChart3 size={24} className="text-orange-600" />}
              title="Reportes Avanzados"
              description="Visualiza métricas clave de rendimiento, ventas diarias y proyecciones de crecimiento."
            />
            <FeatureCard
              icon={<Zap size={24} className="text-yellow-600" />}
              title="Rápido y Seguro"
              description="Arquitectura optimizada para velocidad y seguridad de datos con estándares modernos."
            />
            <FeatureCard
              icon={<Lock size={24} className="text-indigo-600" />}
              title="Autenticación Robusta"
              description="Sistema de login y protección de rutas integrado para máxima seguridad."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2A2A2A] mb-6">
            Empieza a usar Manevo hoy
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Únete a cientos de negocios que ya optimizan su gestión con nuestra plataforma.
          </p>
          <div className="flex justify-center">
            <Link href="/login">
              <Button label="Crear una cuenta" size="lg" className="px-8 shadow-xl shadow-gray-200" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2A2A] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src="/suitpress-logo.svg" alt="Manevo Logo" className="h-8 w-auto" />
                <span className="text-2xl font-bold tracking-tight text-white">manevo</span>
              </div>
              <p className="mt-4 text-gray-400 max-w-xs">
                La plataforma definitiva para la gestión moderna de negocios. Simple, potente y segura.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-200">Producto</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-200">Compañía</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Acerca de</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Manevo Inc. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              {/* Social placeholders */}
              <div className="w-5 h-5 bg-gray-700 rounded-full hover:bg-gray-600 cursor-pointer"></div>
              <div className="w-5 h-5 bg-gray-700 rounded-full hover:bg-gray-600 cursor-pointer"></div>
              <div className="w-5 h-5 bg-gray-700 rounded-full hover:bg-gray-600 cursor-pointer"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#2A2A2A] mb-2">{title}</h3>
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
