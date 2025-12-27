import { useApi } from '~/composables/useApi'
import type { LoginResponse, TokenResponse } from '~/types/auth'
import { useAuthStore } from '~/stores/auth'
import { useAlertStore } from '~/stores/alert'

export function useAuth() {
  const api = useApi()

  const adminLogin = async (email: string, password: string) => {
    const { data, error } = await api.request<LoginResponse>('POST', '/auth/admin/login', { email, password })
    return { data, error }
  }

  const refreshTokens = async (refreshToken: string) => {
    const { data, error } = await api.request<TokenResponse>('POST', '/auth/refresh', { refreshToken })
    return { data, error }
  }

  /**
   * Cierra la sesión actual invalidando el refresh token en el servidor
   */
  const logout = async () => {
    const authStore = useAuthStore()
    const alertStore = useAlertStore()
    const router = useRouter()

    try {
      // Si hay refresh token, notificar al servidor para invalidarlo
      if (authStore.refreshToken) {
        await api.request<{ message: string }>('POST', '/auth/logout', { refreshToken: authStore.refreshToken })
      }

      // Limpiar el estado local
      authStore.clearAuth()

      // Mostrar mensaje de éxito
      alertStore.showAlert('Sesión cerrada correctamente', 'success')

      // Redirigir al login
      router.push('/admin')
    } catch {
      // Aunque falle la petición al servidor, igual cerramos la sesión localmente
      authStore.clearAuth()
      alertStore.showAlert('Sesión cerrada', 'info')
      router.push('/admin')
    }
  }

  /**
   * Cierra todas las sesiones del usuario en todos los dispositivos
   */
  const logoutAll = async () => {
    const authStore = useAuthStore()
    const alertStore = useAlertStore()
    const router = useRouter()

    try {
      await api.request<{ message: string }>('POST', '/auth/logout-all')

      // Limpiar el estado local
      authStore.clearAuth()

      // Mostrar mensaje de éxito
      alertStore.showAlert('Todas las sesiones cerradas correctamente', 'success')

      // Redirigir al login
      router.push('/admin')
    } catch {
      // Aunque falle la petición al servidor, igual cerramos la sesión local
      authStore.clearAuth()
      alertStore.showAlert('Sesión cerrada', 'info')
      router.push('/admin')
    }
  }

  return {
    adminLogin,
    refreshTokens,
    logout,
    logoutAll
  }
} 