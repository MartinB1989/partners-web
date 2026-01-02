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
 * Vendor info for grouping cart items
 */
export interface VendorInfo {
  id: string
  name: string
  email: string
}

/**
 * Cart items grouped by vendor
 */
export interface ItemsByVendor {
  vendor: VendorInfo
  items: CartItem[]
  subtotal: number
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
  itemsByVendor?: ItemsByVendor[] // Items agrupados por vendedor
  address?: Address     // Dirección opcional para el envío
  addressId?: string
  deliveryType: DeliveryType
  deliveryPrice?: number // Costo de envío obtenido de la API de Zipnova

  // Campos calculados por el backend
  total?: number
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
  subTotal: number
}
