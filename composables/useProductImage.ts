import { ref } from 'vue'
import { useProducts } from '~/composables/services/useProducts'
import { useAlertStore } from '~/stores/alert'

export const useProductImages = () => {
  const alertStore = useAlertStore()
  const productsService = useProducts()
  
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const totalImages = ref(0)
  const uploadedImages = ref(0)

  /**
   * Sube una imagen al producto y la registra
   */
  const uploadImage = async (productId: string, file: File, isMain = false, order = 0) => {
    if (!productId) {
      alertStore.showAlert('Es necesario un ID de producto para subir imágenes', 'error')
      return null
    }

    // Validar tamaño de la imagen (límite de 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alertStore.showAlert('La imagen no debe superar los 5MB', 'error')
      return null
    }

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      alertStore.showAlert('Formato de imagen no válido. Use JPEG, PNG o WebP', 'error')
      return null
    }

    try {
      isUploading.value = true
      uploadProgress.value = 10

      // Determinar la extensión del archivo
      const fileExtension = file.name.split('.').pop() || 'jpg'

      // Paso 1: Obtener URL prefirmada
      const { data: urlData, error: urlError } = await productsService.getPresignedUrl({
        contentType: file.type,
        fileExtension
      })

      if (urlError || !urlData) {
        throw new Error(urlError || 'Error al obtener URL para subir la imagen')
      }

      uploadProgress.value = 30

      // Paso 2: Subir imagen a S3
      const { success, error: uploadError } = await productsService.uploadImageToS3(
        urlData.presignedUrl,
        file
      )

      if (!success) {
        throw new Error(uploadError || 'Error al subir la imagen a S3')
      }

      uploadProgress.value = 70

      // Paso 3: Registrar imagen en el backend
      const imageData = {
        url: urlData.publicUrl,
        key: urlData.key,
        main: isMain,
        order
      }

      const { data: registeredImage, error: registerError } = await productsService.registerProductImage(
        productId,
        imageData
      )

      if (registerError) {
        throw new Error(registerError)
      }

      uploadProgress.value = 100
      alertStore.showAlert('Imagen subida correctamente', 'success')
      
      return registeredImage
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      alertStore.showAlert(`Error al subir la imagen: ${errorMessage}`, 'error')
      return null
    } finally {
      isUploading.value = false
      // Resetear el progreso después de un breve retraso
      setTimeout(() => {
        uploadProgress.value = 0
      }, 1000)
    }
  }

  /**
   * Elimina una imagen del producto
   */
  const deleteImage = async (productId: string, imageId: string) => {
    if (!productId) {
      alertStore.showAlert('Es necesario un ID de producto para eliminar imágenes', 'error')
      return false
    }

    if (!imageId) {
      alertStore.showAlert('Es necesario un ID de imagen para eliminarla', 'error')
      return false
    }

    try {
      // Paso 1: Obtener URL para eliminar de S3
      const { data: urlData, error: urlError } = await productsService.getDeleteImageUrl(
        productId,
        imageId
      )

      if (urlError || !urlData) {
        throw new Error(urlError || 'Error al obtener URL para eliminar la imagen')
      }

      // Paso 2: Eliminar de S3
      const { success, error: deleteError } = await productsService.deleteImageFromS3(urlData)

      if (!success) {
        throw new Error(deleteError || 'Error al eliminar la imagen de S3')
      }

      // Paso 3: Eliminar registro en backend
      const { error: registerError } = await productsService.deleteProductImage(
        productId,
        imageId
      )

      if (registerError) {
        throw new Error(registerError)
      }

      alertStore.showAlert('Imagen eliminada correctamente', 'success')
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      alertStore.showAlert(`Error al eliminar la imagen: ${errorMessage}`, 'error')
      return false
    }
  }

  /**
   * Sube múltiples imágenes al producto
   * @param images Array de objetos con estructura { file: File, main: boolean, order?: number }
   * @returns Array con los resultados de cada carga
   */
  const uploadMultipleImages = async (productId: string, images: Array<{ file: File, main: boolean, order?: number }>) => {
    if (!productId) {
      alertStore.showAlert('Es necesario un ID de producto para subir imágenes', 'error')
      return []
    }
    
    if (!images || images.length === 0) {
      return []
    }
    
    isUploading.value = true
    totalImages.value = images.length
    uploadedImages.value = 0
    
    const results = []
    
    // Subir cada imagen manteniendo la propiedad main y orden
    for (let i = 0; i < images.length; i++) {
      const imgData = images[i]
      
      try {
        const result = await uploadImage(
          productId,
          imgData.file,
          imgData.main,
          imgData.order !== undefined ? imgData.order : i
        )
        
        uploadedImages.value++
        results.push(result)
      } catch (error) {
        console.error('Error al subir imagen:', error)
        results.push(null)
        // Continuamos con la siguiente imagen aunque una falle
      }
    }
    
    isUploading.value = false
    
    return results
  }

  return {
    isUploading,
    uploadProgress,
    totalImages,
    uploadedImages,
    uploadImage,
    deleteImage,
    uploadMultipleImages
  }
} 