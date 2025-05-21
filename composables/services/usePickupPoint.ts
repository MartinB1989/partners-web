import { useApi } from '@/composables/useApi'
import type { PickupAddress } from '~/types/pickup-address'

export const usePickupPoint = () => {
  const api = useApi()

  const getPickupPoints = async () => {
    const { data, error } = await api.request<PickupAddress[]>('GET', '/pickup-addresses')
    return { data, error }
  }

  const getPickupPoint = async (id: number) => {
    const { data, error } = await api.request<PickupAddress>('GET', `/pickup-addresses/${id}`)
    return { data, error }
  }

  const createPickupPoint = async (pickupPoint: Omit<PickupAddress, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'country'>) => {
    const { data, error } = await api.request<PickupAddress>('POST', '/pickup-addresses', pickupPoint)
    return { data, error }
  }

  const updatePickupPoint = async (id: number, pickupPoint: Partial<PickupAddress>) => {
    const { data, error } = await api.request<PickupAddress>('PATCH', `/pickup-addresses/${id}`, pickupPoint)
    return { data, error }
  }

  const deletePickupPoint = async (id: number) => {
    const { data, error } = await api.request('DELETE', `/pickup-addresses/${id}`)
    return { data, error }
  }

  return {
    getPickupPoints,
    getPickupPoint,
    createPickupPoint,
    updatePickupPoint,
    deletePickupPoint
  }
}   
