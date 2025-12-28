/**
 * Composable para comprimir imágenes automáticamente
 * Basado en el sistema de onetick/admin con algoritmo de compresión progresiva
 */

export interface CompressionResult {
  compressedFile: File
  originalSize: number
  compressedSize: number
  compressionRatio: string
}

export const useImageCompression = () => {
  /**
   * Carga una imagen desde un archivo File a un objeto HTMLImageElement
   * @param file - Archivo de imagen a cargar
   * @returns Promise con la imagen cargada
   */
  const loadImageFromFile = async (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      const objectUrl = URL.createObjectURL(file)

      img.onload = () => {
        URL.revokeObjectURL(objectUrl) // Limpiar URL temporal
        resolve(img)
      }

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl) // Limpiar URL temporal
        reject(new Error('Error al cargar la imagen'))
      }

      img.src = objectUrl
    })
  }

  /**
   * Comprime una imagen automáticamente a un tamaño objetivo
   * Algoritmo:
   * 1. Cargar imagen en canvas
   * 2. Intentar compresión con calidad decreciente (0.9 → 0.8 → ... → 0.1)
   * 3. Si aún excede el tamaño, redimensionar canvas y comprimir nuevamente
   *
   * @param file - Archivo de imagen original
   * @param maxSizeKB - Tamaño máximo objetivo en KB (default: 500)
   * @returns Promise con el resultado de la compresión
   */
  const compressImage = async (
    file: File,
    maxSizeKB: number = 500
  ): Promise<CompressionResult> => {
    const maxSizeBytes = maxSizeKB * 1024
    const originalSize = file.size

    // Si la imagen ya es más pequeña que el objetivo, retornarla sin comprimir
    if (originalSize <= maxSizeBytes) {
      return {
        compressedFile: file,
        originalSize,
        compressedSize: originalSize,
        compressionRatio: '0%'
      }
    }

    try {
      // Cargar imagen en un elemento Image
      const img = await loadImageFromFile(file)

      // Crear canvas con las dimensiones originales de la imagen
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height

      // Dibujar la imagen en el canvas
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        throw new Error('No se pudo obtener el contexto 2D del canvas')
      }

      ctx.drawImage(img, 0, 0)

      // Paso 1: Reducción de calidad progresiva
      let quality = 0.9
      let blob: Blob | null = null

      for (let attempts = 0; attempts < 9; attempts++) {
        blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, 'image/jpeg', quality)
        })

        if (!blob) {
          throw new Error('Error al convertir canvas a blob')
        }

        // Si alcanzamos el tamaño objetivo o llegamos a la calidad mínima, salir
        if (blob.size <= maxSizeBytes || quality <= 0.1) {
          break
        }

        // Reducir calidad para el siguiente intento
        quality -= 0.1
      }

      // Paso 2: Si aún es muy grande después de reducir calidad, redimensionar el canvas
      if (blob && blob.size > maxSizeBytes) {
        // Calcular factor de escala basado en la raíz cuadrada de la relación de tamaños
        // Multiplicamos por 0.9 como buffer de seguridad
        const scaleFactor = Math.sqrt(maxSizeBytes / blob.size) * 0.9
        const newWidth = Math.round(canvas.width * scaleFactor)
        const newHeight = Math.round(canvas.height * scaleFactor)

        // Crear un nuevo canvas redimensionado
        const resizedCanvas = document.createElement('canvas')
        resizedCanvas.width = newWidth
        resizedCanvas.height = newHeight

        const resizedCtx = resizedCanvas.getContext('2d')
        if (!resizedCtx) {
          throw new Error('No se pudo obtener el contexto 2D del canvas redimensionado')
        }

        // Dibujar la imagen redimensionada con suavizado de alta calidad
        resizedCtx.imageSmoothingEnabled = true
        resizedCtx.imageSmoothingQuality = 'high'
        resizedCtx.drawImage(canvas, 0, 0, newWidth, newHeight)

        // Comprimir el canvas redimensionado con calidad 0.9
        blob = await new Promise<Blob | null>((resolve) => {
          resizedCanvas.toBlob(resolve, 'image/jpeg', 0.9)
        })
      }

      if (!blob) {
        throw new Error('Error al generar imagen comprimida')
      }

      // Crear archivo con nombre descriptivo
      // Reemplazar la extensión original por .jpg y agregar sufijo -compressed
      const fileName = file.name.replace(/\.[^/.]+$/, '') + '-compressed.jpg'
      const compressedFile = new File([blob], fileName, { type: 'image/jpeg' })

      // Calcular ratio de compresión (porcentaje de reducción)
      const compressionRatio = `${Math.round((1 - blob.size / originalSize) * 100)}%`

      return {
        compressedFile,
        originalSize,
        compressedSize: blob.size,
        compressionRatio
      }
    } catch (error) {
      // En caso de error, retornar el archivo original
      console.error('Error al comprimir imagen:', error)
      throw error
    }
  }

  return {
    compressImage,
    loadImageFromFile
  }
}
