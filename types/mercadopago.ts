/**
 * Types for MercadoPago integration
 */

/**
 * MercadoPago account linkage status
 */
export interface MercadoPagoLinkageStatus {
  linked: boolean
  accountId?: string
  email?: string
  createdAt?: string
  updatedAt?: string
}

/**
 * MercadoPago account information
 */
export interface MercadoPagoAccount {
  id: string
  email: string
  publicKey?: string
  accessToken?: string
  refreshToken?: string
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

/**
 * MercadoPago linking response
 */
export interface MercadoPagoLinkingResponse {
  success: boolean
  message: string
  authorizationUrl?: string
}

/**
 * MercadoPago unlinking response
 */
export interface MercadoPagoUnlinkingResponse {
  success: boolean
  message: string
}
