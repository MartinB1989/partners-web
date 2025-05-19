import type { User } from './auth'
import type { Product } from './product'
import type { Address } from './address'

/**
 * Tipo de entrega para el carrito
 */
export enum DeliveryType {
  SHIPPING = 'SHIPPING', // Envío a domicilio
  PICKUP = 'PICKUP'      // Retiro en tienda
}

/**
 * Interfaz para el carrito de compras
 */
export interface Cart {
  id: string
  sessionId?: string    // Para usuarios anónimos
  userId?: string       // Para usuarios registrados
  user?: User
  items: CartItem[]
  createdAt: Date
  updatedAt: Date
  address?: Address     // Dirección opcional para el envío
  addressId?: string
  deliveryType: DeliveryType
  
  // Campos calculados por el backend
  subtotal?: number
  subtotalFormatted?: string
  total?: number
  totalFormatted?: string
  shippingCost?: number
  shippingCostFormatted?: string
}

/**
 * Interfaz para los items del carrito
 */
export interface CartItem {
  id: string
  cartId: string
  cart: Cart
  productId: number
  product: Product
  quantity: number
  createdAt: Date
  updatedAt: Date
}
