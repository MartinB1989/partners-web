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
  token: string;
  user: User;
}

/**
 * Servicio para manejar todas las operaciones de autenticación
 */
export const useAuthService = () => {
  const api = useApi()
  const authEndpoint = '/auth'
  const authStore = useAuthStore()
  
  /**
   * Guarda el token en el store
   */
  const saveToken = (token: string): void => {
    authStore.setToken(token)
  }
  
  /**
   * Guarda la información del usuario en el store
   */
  const saveUser = (user: User): void => {
    authStore.setUser(user)
  }
  
  /**
   * Obtiene el token desde el store
   */
  const getToken = (): string | null => {
    return authStore.token
  }
  
  /**
   * Verifica si el usuario está autenticado
   */
  const isAuthenticated = (): boolean => {
    return authStore.isAuthenticated
  }

  /**
   * Registra un nuevo usuario
   * @param userData Datos del usuario a registrar
   */
  const register = async (userData: RegisterUserData) => {
    const response = await api.post<LoginResponse>(`${authEndpoint}/register`, userData)
    if (response.data) {
      if (response.data.token) {
        saveToken(response.data.token)
      }
      if (response.data.user) {
        saveUser(response.data.user)
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
      if (response.data.token) {
        saveToken(response.data.token)
      }
      if (response.data.user) {
        saveUser(response.data.user)
      }
    }
    return response
  }

  /**
   * Cierra la sesión del usuario
   */
  const logout = (): void => {
    authStore.logout()
  }

  /**
   * Obtiene el perfil del usuario actual
   * @requires JWT Token
   */
  const getProfile = async () => {
    const response = await api.get<User>(`${authEndpoint}/profile`)
    if (response.data) {
      saveUser(response.data)
    }
    return response
  }

  /**
   * Verifica si el usuario tiene un rol específico
   * @param role Rol a verificar
   */
  const hasRole = (role: string): boolean => {
    return authStore.hasRole(role)
  }

  /**
   * Verifica si el usuario es administrador
   */
  const isAdmin = (): boolean => {
    return authStore.isAdmin
  }

  /**
   * Verifica si el usuario es productor
   */
  const isProducer = (): boolean => {
    return authStore.isProducer
  }

  return {
    register,
    login,
    logout,
    getProfile,
    getToken,
    isAuthenticated,
    hasRole,
    isAdmin,
    isProducer
  }
} 