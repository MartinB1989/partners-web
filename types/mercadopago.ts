export interface MercadoPagoLinkageStatusResponse {
  hasIntegration: boolean
}

export interface MercadoPagoUnlinkResponse {
  message: string
}

export interface MercadoPagoLinkResponse {
  id: number
  mpUserId: string
  publicKey: string
  liveMode: boolean
}
