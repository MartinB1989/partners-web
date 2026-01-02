import { useApi } from '~/composables/useApi'
import type { SellerSettings } from '~/types/user'
import type { User } from '~/types/auth'
import type { PickupAddress } from '~/types/pickup-address'

export function useUser() {
  const api = useApi()

  const updateUser = async (userId: string, updateData: Partial<Pick<User, 'name'>>) => {
    const { data, error } = await api.request<User>('PATCH', `/users/${userId}`, updateData)
    return { data, error }
  }

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

  const getPickupPointsBySellerId = async (sellerId: string) => {
    const { data, error } = await api.request<PickupAddress[]>('GET', `/pickup-addresses/seller/${sellerId}/active`)
    return { data, error }
  }
  return {
    updateUser,
    getSellerSettings,
    updateSellerSettings,
    getPickupPointsBySellerId
  }
}
