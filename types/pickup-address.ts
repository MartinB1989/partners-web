import type { User } from './auth'

/**
 * Interfaz para la dirección de retiro de productos
 */
export interface PickupAddress {
  id: number
  name: string
  street: string
  number: string
  city: string
  state: string
  zipCode: string
  country: string
  additionalInfo?: string
  isActive: boolean
  userId: string
  user?: User | string
  createdAt: Date
  updatedAt: Date
} 