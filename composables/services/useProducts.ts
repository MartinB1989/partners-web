import { useApi } from '~/composables/useApi'
import type { Product } from '~/types/product'

export interface PresignedUrlRequest {
  contentType: string
  fileExtension: string
}

export interface PresignedUrlResponse {
  presignedUrl: string
  key: string
  publicUrl: string
}

export interface ProductImageRequest {
  url: string
  key: string
  main: boolean
  order: number
}

export const useProducts = () => {
  const api = useApi()

  const createProduct = async (product: Product) => {
    const { data, error } = await api.request('POST', '/products', product)
    return { data, error }
  }

  const getMyProducts = async () => {
    const { data, error } = await api.request('GET', '/products/my-products?limit=0&page=1')
    return { data, error }
  }

  const getProductById = async (productId: string) => {
    const { data, error } = await api.request('GET', `/products/${productId}`)
    return { data, error } as { data: Product, error: string | null }
  }

  const updateProduct = async (productId: string, product: Product) => {
    const { data, error } = await api.request('PATCH', `/products/${productId}`, product)
    return { data, error }
  }

  // Obtener URL prefirmada para subir imagen
  const getPresignedUrl = async (request: PresignedUrlRequest) => {
    const { data, error } = await api.request<PresignedUrlResponse, PresignedUrlRequest>(
      'POST',
      '/products/images/presigned-url',
      request
    )
    return { data, error }
  }

  // Subir imagen directamente a S3 usando la URL prefirmada
  const uploadImageToS3 = async (presignedUrl: string, file: File) => {
    try {
      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!response.ok) {
        throw new Error(`Error al subir imagen: ${response.statusText}`)
      }

      return { success: true, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al subir la imagen'
      return { success: false, error: errorMessage }
    }
  }

  // Registrar imagen en el backend después de subir a S3
  const registerProductImage = async (productId: string, imageData: ProductImageRequest) => {
    const { data, error } = await api.request(
      'POST',
      `/products/${productId}/images`,
      imageData
    )
    return { data, error }
  }

  const setMainImage = async (productId: string, imageId: string) => {
    const { data, error } = await api.request(
      'PATCH',
      `/products/${productId}/images/${imageId}/set-main`
    )
    return { data, error }
  }

  // Obtener URL prefirmada para eliminar imagen
  const getDeleteImageUrl = async (productId: string, imageId: string) => {
    const { data, error } = await api.request<string, string>(
      'GET',
      `/products/${productId}/images/${imageId}/delete-url`
    )
    return { data, error }
  }

  // Eliminar imagen de S3 usando URL prefirmada
  const deleteImageFromS3 = async (deleteUrl: string) => {
    try {
      const response = await fetch(deleteUrl, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`Error al eliminar imagen: ${response.statusText}`)
      }

      return { success: true, error: null }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido al eliminar la imagen'
      return { success: false, error: errorMessage }
    }
  }

  // Eliminar registro de imagen en el backend
  const deleteProductImage = async (productId: string, imageId: string) => {
    const { data, error } = await api.request(
      'DELETE',
      `/products/${productId}/images/${imageId}`
    )
    return { data, error }
  }

  return {
    createProduct,
    getMyProducts,
    getProductById,
    updateProduct,
    getPresignedUrl,
    uploadImageToS3,
    registerProductImage,
    setMainImage,
    getDeleteImageUrl,
    deleteImageFromS3,
    deleteProductImage
  }
}
