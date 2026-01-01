import { useApi } from '~/composables/useApi'
import type { SellerSettings } from '~/types/user'

export function useUser() {
  const api = useApi()

  /**
   * Obtiene la configuración de vendedor del usuario autenticado
   */
  const getSellerSettings = async () => {
    const { data, error } = await api.request<SellerSettings>('GET', '/users/me/seller-settings')
    return { data, error }
  }

  /**
   * Actualiza la configuración de vendedor del usuario autenticado
   */
  const updateSellerSettings = async (settings: Partial<Pick<SellerSettings, 'acceptsHomeDelivery' | 'acceptsPickup'>>) => {
    const { data, error } = await api.request<SellerSettings>('PATCH', '/users/me/seller-settings', settings)
    return { data, error }
  }

  return {
    getSellerSettings,
    updateSellerSettings
  }
}
