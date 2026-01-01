import { useApi } from '~/composables/useApi'
import type { SellerSettings } from '~/types/user'
import type { User } from '~/types/auth'

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

  return {
    updateUser,
    getSellerSettings,
    updateSellerSettings
  }
}
