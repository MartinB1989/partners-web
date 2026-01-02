import type { Address } from './address'
import type { Cart } from './cart'
import type { Order } from './order'
import type { PickupAddress } from './pickup-address'
import type { Product } from './product'

export interface User {
  id?: string
  email?: string
  password?: string
  name?: string
  roles?: string[]
  createdAt?: Date
  updatedAt?: Date
  addresses?: Address[]
  carts?: Cart[]
  orders?: Order[]
  pickupAddresses?: PickupAddress[]
  products?: Product[]
  refreshTokens?: string
  sellerSettings?: SellerSettings | null
}

export interface SellerSettings {
  id?: string
  acceptsHomeDelivery?: boolean
  acceptsPickup?: boolean
  createdAt?: Date
  updatedAt?: Date
}