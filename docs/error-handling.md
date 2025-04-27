# Sistema de Manejo de Errores

Este documento explica cómo funciona el sistema de manejo de errores de la aplicación y cómo utilizarlo correctamente en el frontend.

## Arquitectura

El sistema de manejo de errores consta de tres componentes principales:

1. **Backend (NestJS)**:
   - `AllExceptionsFilter`: Captura todas las excepciones y las transforma en un formato estándar.
   - `TransformInterceptor`: Asegura que todas las respuestas exitosas tengan un formato uniforme.

2. **Frontend (Nuxt.js)**:
   - `useApi.ts`: Composable que encapsula las peticiones HTTP y maneja los errores de manera uniforme.
   - `useErrorHandler.ts`: Composable especializado en manejar y mostrar errores al usuario.

## Formato de Respuesta

### Respuestas Exitosas
```json
{
  "success": true,
  "data": { /* datos de la respuesta */ },
  "message": "Operación realizada con éxito"
}
```

### Respuestas de Error
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error de validación",
  "error": {
    "errors": [
      { "field": "email", "message": "El email es inválido" }
    ]
  },
  "timestamp": "2023-08-01T12:34:56.789Z",
  "path": "/api/usuarios"
}
```

## Uso en Componentes

### Ejemplo Básico

```typescript
const { data, error } = await api.get('/usuarios')

if (error) {
  // El error ya ha sido manejado por useErrorHandler
  // pero podemos hacer algo específico si es necesario
  return
}

// Hacer algo con los datos
console.log(data)
```

### Manejo de Errores de Validación

```typescript
const { data, error } = await api.post('/usuarios', formulario)

if (error && error.statusCode === 400 && error.validationErrors) {
  // Asignar errores a campos específicos del formulario
  Object.assign(errores, error.validationErrors)
  return
}
```

## Tipos de Errores

El sistema clasifica los errores en varios tipos para facilitar su manejo:

- `VALIDATION`: Errores de validación (400)
- `AUTHENTICATION`: Errores de autenticación (401)
- `AUTHORIZATION`: Errores de autorización (403)
- `NOT_FOUND`: Recurso no encontrado (404)
- `SERVER_ERROR`: Error del servidor (500)
- `NETWORK_ERROR`: Error de red (sin conexión)
- `UNKNOWN`: Otros errores no clasificados

## Funciones Útiles

- `isApiError`: Verifica si un objeto es un error de API
- `handleApiError`: Maneja un error de API (muestra mensajes, etc.)
- `getErrorType`: Obtiene el tipo de error según el código HTTP
- `extractValidationErrors`: Extrae errores de validación de una respuesta

## Beneficios

- **Consistencia**: Todas las respuestas y errores tienen un formato estandarizado
- **Separación de Responsabilidades**: Los componentes pueden centrarse en la lógica de negocio
- **Experiencia de Usuario**: Los mensajes de error son claros y contextuales
- **Mantenibilidad**: Centraliza la lógica de manejo de errores 