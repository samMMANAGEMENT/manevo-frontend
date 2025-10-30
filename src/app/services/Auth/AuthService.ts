import $axios from "@/app/lib/axios";

export interface AuthResponse {
  token_type: string;
  token: string;
  usuario: Usuario;
}

interface Usuario {
  id: number;
  email: string;
  operador: Operador;
  permissions: any[];
  roles: any[];
  password_changed_at: null;
}

interface Operador {
  nombre_completo: string;
  tipo_documento_documento: string;
  cargo: Cargo;
}

interface Cargo {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
}

interface payload {
  email: string;
  password: string;
}

async function Login(data: payload): Promise<AuthResponse> {
  const response = await $axios.post("/auth/login", data);
  return response.data;
}

export const authService = {
  Login,
};

export default authService;
