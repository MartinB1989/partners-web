import type { User } from './auth'
import type { Address } from './address'
import type { Product } from './product'
import type { DeliveryType } from './cart'

/**
 * Estados posibles de una orden
 */
export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

/**
 * Interfaz para la orden/pedido
 */
export interface Order {
  id?: string
  userId?: string
  user?: User
  addressId?: string
  address?: Address
  email: string
  name: string
  phone?: string
  total: number
  status?: OrderStatus
  deliveryType: DeliveryType
  sessionId?: string
  notes?: string
  items: OrderItem[]
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Interfaz para los items de una orden
 */
export interface OrderItem {
  id?: string
  orderId?: string
  order?: Order
  productId: number
  product?: Product
  title: string
  unitPrice: number
  subTotal: number
  quantity: number
  imageUrl?: string
} 