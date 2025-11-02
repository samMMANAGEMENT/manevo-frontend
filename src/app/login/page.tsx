"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import authService from "../services/Auth/AuthService";

export default function LoginAuthComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function enviarFormulario(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await authService.Login({ email, password });

      if (response.token) localStorage.setItem("token", response.token);
      if (response.usuario)
        localStorage.setItem("usuario", JSON.stringify(response.usuario));
      router.push("/main/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Error al iniciar sesión, intente de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="flex w-[800px] bg-gray-200 rounded-xl">
        {/* Lado izquierdo */}
        <div className="flex items-center justify-center w-1/2">
          <div className="bg-black rounded-2xl p-6">
            <img src="/suitpress-logo.svg" alt="Suitpress Logo" />
          </div>
        </div>

        {/* Lado derecho */}
        <div className="w-10/12 bg-white rounded-2xl p-8 flex flex-col justify-center text-black">
          <h2 className="text-3xl font-bold text-center mb-8">
            Bienvenido a tu <br /> plataforma de gestión
          </h2>

          <form className="space-y-4" onSubmit={enviarFormulario}>
            <div>
              <label className="block font-semibold mb-1 text-2xl">
                Email
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Ingrese su correo de inicio de sesión
              </p>
              <div className="flex items-center bg-gray-200 rounded-md px-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="samuel.pineda@suitpress.com"
                  className="flex-1 bg-transparent py-2 text-gray-700 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-2xl font-semibold mb-1">
                Contraseña
              </label>
              <p className="text-xs text-gray-500 mb-1">
                Ingrese la contraseña con la que inicia sesión
              </p>
              <div className="flex items-center bg-gray-200 rounded-md px-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent py-2 text-gray-700 focus:outline-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md font-medium hover:bg-gray-800 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
              ) : (
                "Iniciar sesión"
              )}
            </button>

            <div className="text-right text-xs text-gray-500 mt-1 cursor-pointer">
              ¿Olvidó email o contraseña?
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
