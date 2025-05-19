import { useCartStore } from '~/stores/cart'
import { useCart } from '~/composables/services/useCart'

export default defineNuxtPlugin(async () => {
  // Plugin que se ejecuta solo en el lado del cliente
  if (import.meta.client) {
    const cartStore = useCartStore()
    const { getAnonymousCart } = useCart()
    
    try {
      // Cargar el carrito anónimo al iniciar la app
      const { data } = await getAnonymousCart()
      
      if (data) {
        cartStore.setCart(data)
      }
    } catch (error) {
      console.error('Error al inicializar el carrito:', error)
    }
  }
})