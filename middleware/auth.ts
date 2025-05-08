export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // La ruta /admin es pública (login)
  if (to.path === '/admin') {
    return
  }
  
  // Verificar si la ruta comienza con /admin/
  if (to.path.startsWith('/admin/')) {
    // Si el usuario no está autenticado, redirigir al login
    if (!authStore.isAuthenticated) {
      return navigateTo('/admin')
    }
    
    // Verificar si el usuario tiene roles ADMIN o PRODUCTOR
    const userRoles = authStore.user?.roles || []
    const hasAccess = userRoles.some(role => ['ADMIN', 'PRODUCTOR'].includes(role))
    
    if (!hasAccess) {
      // Si no tiene los roles necesarios, redirigir
      return navigateTo('/')
    }
  }
}) 