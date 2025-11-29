import { useCartStore } from '~/stores/cart'
import type { Cart } from '~/types/cart'
import type { Order, OrderItem } from '~/types/order'

/**
 * Composable para transformar un carrito en una orden
 */
export function useCartToOrder() {
  const cartStore = useCartStore()

  /**
   * Transforma un carrito en una orden con el estado inicial
   * @param cart El carrito a transformar
   * @param email Email del comprador (opcional para resumen)
   * @param name Nombre del comprador (opcional para resumen)
   * @param phone Teléfono opcional del comprador
   * @param notes Notas opcionales para la orden
   * @returns La orden generada a partir del carrito
   */
  const cartToOrder = (
    cart: Cart,
    email?: string,
    name?: string,
    phone?: string,
    notes?: string
  ): Order => {
    // Verificar que el carrito tenga items
    if (!cart.items || cart.items.length === 0) {
      throw new Error('El carrito está vacío')
    }

    // Crear los items de la orden a partir de los items del carrito
    const orderItems: OrderItem[] = cart.items.map(item => ({
      productId: item.productId,
      title: item.product.title,
      unitPrice: item.product.price,
      subTotal: item.subTotal,
      quantity: item.quantity,
      imageUrl: item.product.images && item.product.images.length > 0
        ? item.product.images[0].url
        : undefined
    }))

    // Crear la orden - Incluir dirección solo si existe en el carrito
    const order: Order = {
      // Solo incluir addressId y address si existen en el carrito
      ...(cart.addressId ? { addressId: cart.addressId } : {}),
      ...(cart.address ? { address: cart.address } : {}),
      email: email || '',
      name: name || '',
      phone,
      total: cart.total || 0,
      deliveryType: cart.deliveryType,
      // Solo incluir deliveryPrice si existe en el carrito (cuando es envío a domicilio)
      ...(cart.deliveryPrice !== undefined ? { deliveryPrice: cart.deliveryPrice } : {}),
      notes,
      items: orderItems
    }

    return order
  }

  /**
   * Transforma el carrito actual del store en una orden
   * @param email Email del comprador (opcional para resumen)
   * @param name Nombre del comprador (opcional para resumen)
   * @param phone Teléfono opcional del comprador
   * @param notes Notas opcionales para la orden
   * @returns La orden generada a partir del carrito actual o null si no hay carrito
   */
  const currentCartToOrder = (
    email?: string,
    name?: string,
    phone?: string,
    notes?: string
  ): Order | null => {
    if (!cartStore.cart) {
      return null
    }
    
    return cartToOrder(cartStore.cart, email, name, phone, notes)
  }

  /**
   * Obtiene un resumen del carrito actual para mostrar en el checkout
   * @returns Información resumida del carrito actual o null si no hay carrito
   */
  const getCartSummary = () => {
    if (!cartStore.cart || !cartStore.cart.items || cartStore.cart.items.length === 0) {
      return null
    }

    return {
      items: cartStore.cart.items.map(item => ({
        id: item.productId,
        name: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images && item.product.images.length > 0 
          ? item.product.images[0].url 
          : undefined
      })),
      subTotal: cartStore.cart.total || 0,
      deliveryType: cartStore.cart.deliveryType || ''
    }
  }

  return {
    cartToOrder,
    currentCartToOrder,
    getCartSummary
  }
} 