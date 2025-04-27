import { useApi } from '../composables/useApi'
import { useAuthStore } from '../stores/auth'

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  roles: string[];
  [key: string]: unknown;
}

interface LoginData {
  email: string;
  password: string;
  [key: string]: unknown;
}

interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
}

interface LoginResponse {
  data: {
    token: string;
    user: User;
  };
}

/**
 * Servicio para manejar todas las operaciones de autenticación
 */
export const useAuthService = () => {
  const api = useApi()
  const authEndpoint = '/auth'
  const authStore = useAuthStore()

  /**
   * Registra un nuevo usuario
   * @param userData Datos del usuario a registrar
   */
  const register = async (userData: RegisterUserData) => {
    const response = await api.post<LoginResponse>(`${authEndpoint}/register`, userData)
    if (response.data) {
      if (response.data.data.token) {
        authStore.setToken(response.data.data.token)
      }
      if (response.data.data.user) {
        authStore.setUser(response.data.data.user)
      }
    }
    return response
  }

  /**
   * Inicia sesión con credenciales
   * @param credentials Credenciales del usuario
   */
  const login = async (credentials: LoginData) => {
    const response = await api.post<LoginResponse>(`${authEndpoint}/login`, credentials)
    console.log(response)
    if (response.data) {
      if (response.data.data.token) {
        authStore.setToken(response.data.data.token)
      }
      if (response.data.data.user) {
        authStore.setUser(response.data.data.user)
      }
    }
    return response
  }

  return {
    register,
    login,
  }
}