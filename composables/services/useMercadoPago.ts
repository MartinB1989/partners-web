import type { MercadoPagoLinkageStatusResponse, MercadoPagoUnlinkResponse, MercadoPagoLinkResponse } from '~/types/mercadopago'

export const useMercadoPago = () => {
  const { request } = useApi()

  const getLinkageStatus = async () => {
    const { data, error } = await request<MercadoPagoLinkageStatusResponse>('GET', `/split-integrations/mercadopago/status`)
    return { data, error }
  }

  const unlinkAccount = async () => {
    const { data, error } = await request<MercadoPagoUnlinkResponse>('DELETE', `/split-integrations/mercadopago/unlink`)
    return { data, error }
  }

  const linkAccount = async (code: string) => {
    const { data, error } = await request<MercadoPagoLinkResponse>('GET', `/split-integrations/mercadopago?code=${code}`)
    return { data, error }
  }

  return {
    getLinkageStatus,
    unlinkAccount,
    linkAccount
  }
}
