export default defineNuxtRouteMiddleware((_to) => {
  const authStore = useAuthStore()
  
  // Verificar si el usuario está autenticado
  if (!authStore.isAuthenticated) {
    return navigateTo('/admin')
  }
  
  // Verificar si el usuario tiene rol ADMIN
  const userRoles = authStore.user?.roles || []
  const isAdmin = userRoles.includes('ADMIN')
  
  if (!isAdmin) {
    // Si no es ADMIN, redirigir al panel principal
    return navigateTo('/admin/panel')
  }
}) 