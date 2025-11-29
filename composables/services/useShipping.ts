import type { CartItem } from '~/types/cart'
import type { Address } from '~/types/address'

/**
 * Interface para la cotización de envío de Zipnova
 */
interface ZipnovaShippingQuoteRequest {
  account_id: string | number
  origin_id: string | number
  declared_value: number
  destination: {
    city: string
    state: string
    zipcode: string
  }
  items: Array<{
    id: string
    quantity: number
    weight: number
    length: number
    height: number
    width: number
    value: number
  }>
}

/**
 * Interface para la respuesta de cotización de Zipnova
 */
interface ZipnovaQuoteResponse {
  all_results: Record<string, unknown>[]
  results?: {
    standard_delivery?: {
      amounts?: {
        price_incl_tax?: number
      }
    }
  }
}

/**
 * Composable para consumir la API de Zipnova para cotizar envíos
 */
export const useShipping = () => {
  const config = useRuntimeConfig()
  const ZIPNOVA_API_BASE = 'https://api.zipnova.com.ar/v2'
  const ZIPNOVA_API_TOKEN = config.public.zipnovaApiToken // Token de la API
  const ZIPNOVA_API_SECRET = config.public.zipnovaApiSecret // Secret de la API
  const ZIPNOVA_ACCOUNT_ID = config.public.zipnovaAccountId
  const ZIPNOVA_ORIGIN_ID = config.public.zipnovaOriginId

  /**
   * Genera el header de autenticación básica para Zipnova
   * @returns Header de autorización en formato Basic
   */
  const getBasicAuthHeader = (): string => {
    const credentials = `${ZIPNOVA_API_TOKEN}:${ZIPNOVA_API_SECRET}`
    // En Nuxt, podemos usar btoa para codificar en base64
    const encoded = btoa(credentials)
    return `Basic ${encoded}`
  }

  /**
   * Cotiza el envío mediante la API de Zipnova
   * @param items Items del carrito con sus dimensiones
   * @param shippingAddress Dirección de envío del cliente
   * @param totalValue Valor total del carrito
   * @returns Respuesta con el precio de envío (price_incl_tax) o error
   */
  const quoteShipping = async (
    items: CartItem[],
    shippingAddress: Partial<Address>,
    totalValue: number
  ) => {
    try {
      // Validar que tenemos las credenciales
      if (!ZIPNOVA_API_TOKEN || !ZIPNOVA_API_SECRET) {
        throw new Error('Credenciales de Zipnova no configuradas')
      }

      // Construir la solicitud para Zipnova
      const quoteRequest: ZipnovaShippingQuoteRequest = {
        account_id: ZIPNOVA_ACCOUNT_ID,
        origin_id: ZIPNOVA_ORIGIN_ID,
        declared_value: totalValue,
        destination: {
          city: shippingAddress.city || '',
          state: shippingAddress.state || '',
          zipcode: shippingAddress.zipCode || ''
        },
        items: items.map(item => ({
          id: item.productId.toString(),
          quantity: item.quantity,
          weight: Math.max(Math.ceil(item.product.size?.weight || 10), 10),
          length: Math.ceil(item.product.size?.length || 0),
          height: Math.ceil(item.product.size?.height || 0),
          width: Math.ceil(item.product.size?.width || 0),
          value: item.product.price
        }))
      }
      // Llamar directamente a la API de Zipnova con autenticación básica
      const response = await $fetch<ZipnovaQuoteResponse>(
        `${ZIPNOVA_API_BASE}/shipments/quote`,
        {
          method: 'POST',
          body: quoteRequest,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': getBasicAuthHeader()
          }
        }
      )

      // Extraer el precio de envío con impuestos (price_incl_tax) de standard_delivery
      const deliveryPrice = response.results?.standard_delivery?.amounts?.price_incl_tax

      if (deliveryPrice === undefined) {
        console.warn('No se encontró price_incl_tax en la respuesta de Zipnova:', response)
      }

      console.log('Respuesta de cotización de Zipnova:', response)
      console.log('Precio de envío extraído (price_incl_tax):', deliveryPrice)

      return { data: { ...response, deliveryPrice }, error: null }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      console.error('Error al cotizar envío:', errorMessage)
      return { data: null, error: errorMessage }
    }
  }

  return { quoteShipping }
}
