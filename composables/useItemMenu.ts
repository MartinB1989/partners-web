import { ref, computed } from 'vue'
import { useAuthStore } from '~/stores/auth'

export interface NavItem {
  title: string
  icon: string
  to: string
  roles?: string[] // Roles permitidos para ver este ítem
}

export function useItemMenu() {
  const authStore = useAuthStore()
  const adminAndProductor = ['ADMIN', 'PRODUCTOR']
  const adminOnly = ['ADMIN']
  // Lista completa de elementos de navegación con sus permisos
  const allNavItems = ref<NavItem[]>([
    { 
      title: 'Panel', 
      icon: 'mdi-view-dashboard', 
      to: '/admin/panel',
      roles: adminAndProductor
    },
    { 
      title: 'Productos', 
      icon: 'mdi-package-variant-closed', 
      to: '/admin/products',
      roles: adminAndProductor
    },
    { 
      title: 'Categorías', 
      icon: 'mdi-folder-outline', 
      to: '/admin/categories',
      roles: adminOnly
    },
  ])
  
  // Filtrar elementos de navegación según el rol del usuario
  const menuItems = computed(() => {
    const userRoles = authStore.user?.roles || []
    
    return allNavItems.value.filter(item => {
      // Si no hay roles especificados, se muestra a todos
      if (!item.roles || item.roles.length === 0) {
        return true
      }
      
      // Mostrar si al menos uno de los roles del usuario está en la lista de roles permitidos
      return item.roles.some(role => userRoles.includes(role))
    })
  })
  
  // Para el panel, excluimos el ítem 'Panel' para evitar redundancia
  const dashboardCards = computed(() => {
    return menuItems.value.filter(item => item.title !== 'Panel')
  })
  
  return {
    menuItems,
    dashboardCards
  }
} 