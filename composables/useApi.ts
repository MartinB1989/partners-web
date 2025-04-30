import { useRuntimeConfig } from '#app'
import type { ApiError, ApiResponse, RequestResult } from '~/types/api-response'
import { useAuthStore } from '~/stores/auth'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase
  const authStore = useAuthStore()

  const request = async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: Record<string, unknown> | BodyInit,
    options: {
      headers?: Record<string, string>;
      [key: string]: unknown;
    } = {}
  ): Promise<RequestResult<T>> => {
    try {
      // Preparar las opciones de la petición
      const requestOptions = { ...options }
      
      // Añadir el token de autenticación si existe
      if (authStore.isAuthenticated && authStore.token) {
        requestOptions.headers = {
          ...requestOptions.headers,
          Authorization: `Bearer ${authStore.token}`
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
        return { data: null, error: apiError.message }
      }

      // Para otros errores, devolvemos un mensaje genérico
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      return { data: null, error: errorMessage }
    }
  }

  return {
    request
  }
}
