import type { MercadoPagoLinkageStatus, MercadoPagoLinkingResponse, MercadoPagoUnlinkingResponse } from '~/types/mercadopago'

/**
 * MercadoPago API service composable
 * Handles MercadoPago account linking/unlinking operations
 */
export const useMercadoPago = () => {
  const { request } = useApi()

  /**
   * Get current MercadoPago linkage status for a user
   * @param userId - User ID to check linkage status
   * @returns Linkage status information
   */
  const getLinkageStatus = async (userId: string) => {
    return await request<MercadoPagoLinkageStatus>('GET', `/mercadopago/status/${userId}`)
  }

  /**
   * Get MercadoPago authorization URL for linking account
   * @returns Authorization URL and linking information
   */
  const getAuthorizationUrl = async () => {
    return await request<MercadoPagoLinkingResponse>('GET', '/mercadopago/auth-url')
  }

  /**
   * Unlink MercadoPago account
   * @param userId - User ID to unlink account from
   * @returns Unlinking confirmation
   */
  const unlinkAccount = async (userId: string) => {
    return await request<MercadoPagoUnlinkingResponse>('POST', `/mercadopago/unlink/${userId}`)
  }

  /**
   * Handle OAuth callback after authorization
   * @param code - Authorization code from MercadoPago
   * @param state - State parameter for security validation
   * @returns Success status
   */
  const handleCallback = async (code: string, state: string) => {
    return await request<MercadoPagoLinkingResponse>('POST', '/mercadopago/callback', {
      code,
      state
    })
  }

  return {
    getLinkageStatus,
    getAuthorizationUrl,
    unlinkAccount,
    handleCallback
  }
}
