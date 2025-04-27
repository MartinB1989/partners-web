import { useAlertStore } from '../stores/alert'

// Tipos de error que podemos manejar
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN = 'UNKNOWN'
}

// Mapeo de códigos HTTP a tipos de error
const errorTypeByStatusCode: Record<number, ErrorType> = {
  400: ErrorType.VALIDATION,
  401: ErrorType.AUTHENTICATION,
  403: ErrorType.AUTHORIZATION,
  404: ErrorType.NOT_FOUND,
  500: ErrorType.SERVER_ERROR
}

// Interfaz para errores de API
export interface ApiError {
  error: true;
  mensaje: string;
  statusCode: number;
  type?: ErrorType;
  validationErrors?: Record<string, string[]>;
}

// Verificar si un objeto es un error de API
export function isApiError(obj: unknown): obj is ApiError {
  return obj !== null && 
         typeof obj === 'object' && 
         'error' in obj && 
         obj.error === true;
}

export function useErrorHandler() {
  const alertStore = useAlertStore()

  // Obtener el tipo de error basado en el código de estado
  const getErrorType = (statusCode: number): ErrorType => {
    return errorTypeByStatusCode[statusCode] || ErrorType.UNKNOWN;
  }

  // Extraer errores de validación de la respuesta del backend
  const extractValidationErrors = (apiError: unknown): Record<string, string[]> | undefined => {
    if (isApiError(apiError) && 
        apiError.statusCode === 400 && 
        apiError.validationErrors) {
      return apiError.validationErrors;
    }
    return undefined;
  }

  // Función para mostrar mensajes de error de validación de forma amigable
  const displayValidationErrors = (validationErrors: Record<string, string[]>) => {
    const fields = Object.keys(validationErrors);
    
    if (fields.length === 0) return;
    
    // Si hay varios campos con error, mostrar mensaje general
    if (fields.length > 1) {
      alertStore.showAlert('Por favor, corrige los errores en el formulario', 'error');
      return;
    }
    
    // Si es solo un campo, mostrar el mensaje específico
    const fieldName = fields[0];
    const errors = validationErrors[fieldName];
    if (errors && errors.length > 0) {
      alertStore.showAlert(errors[0], 'error');
    }
  }

  // Manejador para respuestas de error
  const handleApiError = (apiError: unknown) => {
    if (!isApiError(apiError)) return;
    
    const errorType = getErrorType(apiError.statusCode);
    let validationErrors;
    
    // Manejar diferentes tipos de error
    switch (errorType) {
      case ErrorType.VALIDATION:
        validationErrors = extractValidationErrors(apiError);
        if (validationErrors) {
          displayValidationErrors(validationErrors);
        } else {
          alertStore.showAlert(apiError.mensaje, 'error');
        }
        break;
        
      case ErrorType.AUTHENTICATION:
        alertStore.showAlert('Sesión expirada. Por favor, inicia sesión nuevamente.', 'error');
        // Aquí podríamos redirigir al login o limpiar la sesión
        break;
        
      case ErrorType.AUTHORIZATION:
        alertStore.showAlert('No tienes permisos para realizar esta acción', 'error');
        break;
        
      case ErrorType.NOT_FOUND:
        alertStore.showAlert('El recurso solicitado no existe', 'error');
        break;
        
      case ErrorType.SERVER_ERROR:
        alertStore.showAlert('Error en el servidor. Por favor, intenta más tarde', 'error');
        break;
        
      case ErrorType.NETWORK_ERROR:
        alertStore.showAlert('Error de conexión. Verifica tu internet', 'error');
        break;
        
      default:
        alertStore.showAlert(apiError.mensaje || 'Ha ocurrido un error', 'error');
    }
  }
  
  return {
    isApiError,
    handleApiError,
    getErrorType,
    extractValidationErrors
  }
} 