// web/composables/useApi.ts
import { useAuthStore } from '../stores/auth'

export function useApi() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase
  
  // Función para manejar errores de forma centralizada
  const handleError = (error: unknown) => {
    // Aquí puedes implementar tu lógica de manejo de errores
    console.error('Error en la API:', error)
    
    // También podrías usar una store para el manejo de errores globales
    // const alertStore = useAlertStore()
    // alertStore.showAlert('error', 'Error en la solicitud')
    
    throw error
  }
  
  // Función para obtener el token de autenticación
  const getAuthToken = (): string | null => {
    // Verificar si estamos en el cliente (browser)
    if (typeof window !== 'undefined') {
      const authStore = useAuthStore()
      return authStore.token
    }
    return null
  }

  // Definición de tipos para las opciones de fetch
  type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  
  interface FetchOptions {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: Record<string, unknown> | null;
    [key: string]: unknown;
  }
  
  // Wrapper alrededor de $fetch con configuración común
  const apiFetch = async <T = unknown>(endpoint: string, options: FetchOptions = {}) => {
    try {
      // Configurar los headers básicos
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      }
      
      // Añadir el token de autenticación si existe
      const token = getAuthToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const data = await $fetch<T>(`${baseURL}${endpoint}`, {
        ...options,
        headers,
        // Se puede añadir aquí manejo de tokens de autenticación si es necesario
      })
      
      return { data }
    } catch (err) {
      return handleError(err)
    }
  }
  
  return {
    get: <T = unknown>(endpoint: string, options: FetchOptions = {}) => 
      apiFetch<T>(endpoint, { ...options, method: 'GET' }),
    post: <T = unknown>(endpoint: string, body: Record<string, unknown>, options: FetchOptions = {}) => 
      apiFetch<T>(endpoint, { ...options, method: 'POST', body }),
    put: <T = unknown>(endpoint: string, body: Record<string, unknown>, options: FetchOptions = {}) => 
      apiFetch<T>(endpoint, { ...options, method: 'PUT', body }),
    delete: <T = unknown>(endpoint: string, options: FetchOptions = {}) => 
      apiFetch<T>(endpoint, { ...options, method: 'DELETE' })
  }
}