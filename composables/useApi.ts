// web/composables/useApi.ts
import { useAuthStore } from '../stores/auth'
import type { ApiError } from './useErrorHandler';
import { useErrorHandler } from './useErrorHandler'

// Interfaz que representa la estructura de error del backend
interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  error: Record<string, unknown>;
  timestamp: string;
  path: string;
}

// Interfaz para los errores de validación
interface ValidationError {
  field: string;
  message: string;
  [key: string]: unknown;
}

export function useApi() {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase
  const { handleApiError } = useErrorHandler()
  const authStore = useAuthStore()
  
  // Función para manejar errores de forma centralizada
  const handleError = (error: unknown): ApiError => {
    console.error('Error en la API:', error)
    
    let mensaje = 'Error en la conexión con el servidor'
    let statusCode = 500
    let validationErrors: Record<string, string[]> | undefined
    
    // Extraer información útil del error según el formato de la API
    if (error && typeof error === 'object' && 'response' in error) {
      const responseError = error.response as { 
        _data?: ApiErrorResponse, 
        status?: number 
      }
      
      // Obtener el código de estado directamente de la respuesta si está disponible
      statusCode = responseError.status || 500
      
      if (responseError && responseError._data) {
        const { _data } = responseError
        mensaje = _data.message || mensaje
        statusCode = _data.statusCode || statusCode
        
        // Extraer errores de validación si existen
        if (_data.error && typeof _data.error === 'object') {
          // Si hay información detallada de validación, formatearla para nuestro manejador
          if ('errors' in _data.error && Array.isArray(_data.error.errors)) {
            validationErrors = {};
            
            // Convertir el formato del backend a nuestro formato de frontend
            (_data.error.errors as ValidationError[]).forEach((err) => {
              if (err.field && err.message) {
                if (!validationErrors![err.field]) {
                  validationErrors![err.field] = [];
                }
                validationErrors![err.field].push(err.message);
              }
            });
          }
          
          // Log adicional para información detallada del error
          console.error('Detalles del error:', _data.error)
        }
      }
    }
    
    // Manejar caso especial de error 401 (no autorizado)
    if (statusCode === 401) {
      authStore.logout() // Cerrar sesión si el token no es válido
      navigateTo('/login') // Redirigir al login
    }
    
    // Crear un objeto de error estructurado para que nuestro manejador lo procese
    const apiError: ApiError = {
      error: true,
      mensaje,
      statusCode,
      ...(validationErrors && { validationErrors })
    }
    
    // Usar nuestro manejador especializado para mostrar el error apropiadamente
    handleApiError(apiError)
    
    return apiError
  }
  
  // Función para obtener el token de autenticación
  const getAuthToken = (): string | null => {
    // Verificar si estamos en el cliente (browser)
    if (typeof window !== 'undefined') {
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
      
      const response = await $fetch<T>(`${baseURL}${endpoint}`, {
        ...options,
        headers,
      })
      
      return { data: response, error: null }
    } catch (err) {
      return { data: null, error: handleError(err) }
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