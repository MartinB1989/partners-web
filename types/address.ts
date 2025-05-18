import type { User } from './auth'
import type { Cart } from './cart'
import type { Order } from './order'

/**
 * Interfaz para la dirección de envío
 */
export interface Address {
  id: string
  street: string
  number: string
  city: string
  state: string
  zipCode: string
  country: string
  userId?: string
  user?: User
  carts?: Cart[]
  orders?: Order[]
  createdAt: Date
  updatedAt: Date
}
