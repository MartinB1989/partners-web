import type { MercadoPagoLinkageStatus, MercadoPagoLinkingResponse, MercadoPagoUnlinkingResponse } from '~/types/mercadopago'

/**
 * MercadoPago API service composable
 * Handles MercadoPago account linking/unlinking operations
 */
export const useMercadoPago = () => {
  const { request } = useApi()

  const getLinkageStatus = async (userId: string) => {
    return await request<MercadoPagoLinkageStatus>('GET', `/mercadopago/status/${userId}`)
  }

  const unlinkAccount = async (userId: string) => {
    return await request<MercadoPagoUnlinkingResponse>('POST', `/mercadopago/unlink/${userId}`)
  }

  const handleCallback = async (code: string, state: string) => {
    return await request<MercadoPagoLinkingResponse>('POST', '/mercadopago/callback', {
      code,
      state
    })
  }

  return {
    getLinkageStatus,
    unlinkAccount,
    handleCallback
  }
}
