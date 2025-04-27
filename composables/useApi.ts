import { useRuntimeConfig } from '#app'
import type { ApiError, ApiResponse, RequestResult } from '~/types/api-response'

export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const request = async <T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: Record<string, unknown>,
    options = {}
  ): Promise<RequestResult<T>> => {
    try {
      const response = await $fetch<ApiResponse<T>>(`${baseURL}${endpoint}`, {
        method,
        body,
        ...options
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
