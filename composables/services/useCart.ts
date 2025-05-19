import { useApi } from '~/composables/useApi'
import type { Cart, CartItem } from '~/types/cart'
import { useAlertStore } from '~/stores/alert'

export interface AddItemRequest {
  productId: number
  quantity: number
}

/**
 * Composable para gestionar operaciones del carrito de compras
 */
export const useCart = () => {
  const api = useApi()
  const alertStore = useAlertStore()
  
  /**
   * Obtiene el carrito anónimo actual o crea uno nuevo si no existe
   */
  const getAnonymousCart = async () => {
    const { data, error } = await api.request<Cart>('GET', '/carts/anonymous', null, {
      credentials: 'include', // Importante para enviar y recibir cookies
    })
    
    if (error) {
      alertStore.showAlert(`Error al obtener el carrito: ${error}`, 'error')
    }
    
    return { data, error }
  }
  
  /**
   * Añade un producto al carrito anónimo
   */
  const addItemToCart = async (productId: number, quantity: number) => {
    const { data, error } = await api.request<CartItem, AddItemRequest>(
      'POST', 
      '/carts/anonymous/items', 
      { productId, quantity },
      { credentials: 'include' } // Importante para enviar y recibir cookies
    )
    
    if (error) {
      // Mostrar mensaje de error específico dependiendo del tipo de error
      if (error.includes('stock')) {
        alertStore.showAlert('No hay suficiente stock disponible', 'error')
      } else if (error.includes('activo')) {
        alertStore.showAlert('Este producto no está disponible actualmente', 'error')
      } else {
        alertStore.showAlert(`Error al añadir el producto al carrito: ${error}`, 'error')
      }
    } else {
      alertStore.showAlert('Producto añadido al carrito', 'success')
    }
    
    return { data, error }
  }
  
  /**
   * Actualiza la cantidad de un producto en el carrito
   */
  const updateCartItemQuantity = async (itemId: string, quantity: number) => {
    const { data, error } = await api.request<CartItem>(
      'PATCH',
      `/carts/anonymous/items/${itemId}`,
      { quantity },
      { credentials: 'include' }
    )
    
    if (error) {
      alertStore.showAlert(`Error al actualizar la cantidad: ${error}`, 'error')
    }
    
    return { data, error }
  }
  
  /**
   * Elimina un producto del carrito
   */
  const removeCartItem = async (itemId: string) => {
    const { data, error } = await api.request<CartItem>(
      'DELETE',
      `/carts/anonymous/items/${itemId}`,
      null,
      { credentials: 'include' }
    )
    
    if (error) {
      alertStore.showAlert(`Error al eliminar el producto del carrito: ${error}`, 'error')
    } else {
      alertStore.showAlert('Producto eliminado del carrito', 'success')
    }
    
    return { data, error }
  }
  
  /**
   * Obtiene el número total de productos en el carrito
   */
  const getCartItemCount = async () => {
    const { data, error } = await getAnonymousCart()
    
    if (error || !data) {
      return 0
    }
    
    return data.items.reduce((total, item) => total + item.quantity, 0)
  }
  
  return {
    getAnonymousCart,
    addItemToCart,
    updateCartItemQuantity,
    removeCartItem,
    getCartItemCount
  }
}