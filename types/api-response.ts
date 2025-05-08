// Interfaz para la respuesta estándar de la API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: unknown;
}

// Interfaz para errores de la API
export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  error: Record<string, unknown>;
  timestamp: string;
  path: string;
}

// Interfaz para el resultado de la petición
export interface RequestResult<T> {
  data: T | null;
  error: string | null;
}

export interface ListResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    lastPage: number
  }
}