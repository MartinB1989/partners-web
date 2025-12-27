import { useRuntimeConfig } from '#app'
import type { ApiError, ApiResponse, RequestResult } from '~/types/api-response'
import { useAuthStore } from '~/stores/auth'
import { useLoginRateLimitStore } from '~/stores/loginRateLimit'

// Flag para evitar múltiples refreshes simultáneos
let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null

// Contador de retries pendientes (para debugging)
let pendingRetries = 0

/**
 * Delay aleatorio pequeño para evitar que múltiples retries simultáneos saturen el servidor
 */
const randomDelay = (min = 50, max = 200): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, delay))
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase
  const authStore = useAuthStore()
  const loginRateLimitStore = useLoginRateLimitStore()

  /**
   * Intenta refrescar el access token usando el refresh token
   * @returns true si el refresh fue exitoso, false si no
   */
  const tryRefreshToken = async (): Promise<boolean> => {
    // Si ya hay un refresh en curso, esperar a que termine
    if (isRefreshing && refreshPromise) {
      return await refreshPromise
    }

    // Si no hay refresh token, no podemos refrescar
    if (!authStore.hasRefreshToken || !authStore.refreshToken) {
      return false
    }

    isRefreshing = true
    refreshPromise = (async () => {
      try {
        // Llamar al endpoint de refresh SIN usar useApi para evitar recursión
        const response = await $fetch<ApiResponse<any>>(`${baseURL}/auth/refresh`, {
          method: 'POST',
          body: { refreshToken: authStore.refreshToken }
        })

        if (response.data) {
          // Actualizar tokens en el store
          authStore.setTokens(response.data)
          return true
        }
        return false
      } catch {
        // Si el refresh falla, cerrar sesión
        authStore.clearAuth()

        // Redirigir al login si estamos en el navegador
        if (import.meta.client) {
          navigateTo('/admin')
        }
        return false
      } finally {
        isRefreshing = false
        refreshPromise = null
      }
    })()

    return await refreshPromise
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const request = async <T, B extends BodyInit | Record<string, any> | null = any>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    body?: B,
    options: {
      headers?: Record<string, string>;
      skipRetry?: boolean; // Nueva opción para evitar retry en endpoints de auth
      [key: string]: unknown;
    } = {}
  ): Promise<RequestResult<T>> => {
    const { skipRetry = false, ...fetchOptions } = options

    try {
      // Preparar las opciones de la petición
      const requestOptions = { ...fetchOptions }

      // Añadir el token de autenticación si existe
      if (authStore.isAuthenticated && authStore.accessToken) {
        requestOptions.headers = {
          ...requestOptions.headers,
          Authorization: `Bearer ${authStore.accessToken}`
        }
      }

      const response = await $fetch<ApiResponse<T>>(`${baseURL}${endpoint}`, {
        method,
        body,
        ...requestOptions
      })

      // Si la petición fue exitosa, devolvemos los datos y error null
      return { data: response.data, error: null }
    } catch (error: unknown) {
      // Si es un error de la API, extraemos la información detallada
      if (error && typeof error === 'object' && 'response' in error &&
          error.response && typeof error.response === 'object' &&
          '_data' in error.response) {
        const apiError = error.response._data as ApiError

        // Rate limit para login
        if(apiError.statusCode == 429 && apiError.path === '/api/auth/admin/login' ) {
          const expiraLimitAt = apiError.timestamp
          loginRateLimitStore.setBlockedUntil(expiraLimitAt)
        }

        // Si es un 401 (Unauthorized) y NO es un endpoint de auth, intentar refresh
        if (
          apiError.statusCode === 401 &&
          !skipRetry &&
          !endpoint.includes('/auth/login') &&
          !endpoint.includes('/auth/refresh') &&
          !endpoint.includes('/auth/register') &&
          !endpoint.includes('/auth/admin/login')
        ) {
          console.log(`[useApi] 401 detectado en ${endpoint}, intentando refresh...`)

          const refreshSuccess = await tryRefreshToken()

          if (refreshSuccess) {
            // Incrementar contador de retries pendientes
            pendingRetries++
            console.log(`[useApi] Refresh exitoso, reintentando ${endpoint} (retry #${pendingRetries})`)

            // Delay aleatorio pequeño para evitar saturar el servidor con retries simultáneos
            // Si hay muchos retries pendientes, usar un delay mayor
            const delayMin = pendingRetries > 3 ? 100 : 50
            const delayMax = pendingRetries > 3 ? 300 : 200
            await randomDelay(delayMin, delayMax)

            try {
              // Reintentar la petición original con el nuevo token
              const result = await request<T, B>(method, endpoint, body, { ...options, skipRetry: true })
              pendingRetries--
              return result
            } catch (error) {
              pendingRetries--
              throw error
            }
          }
        }

        return { data: null, error: apiError.message }
      }

      // Para otros errores, devolvemos un mensaje genérico
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      return { data: null, error: errorMessage }
    }
  }

  return {
    request,
    tryRefreshToken
  }
}
