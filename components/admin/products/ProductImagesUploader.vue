<template>
  <div class="d-flex justify-center">
    <v-card class="pa-4 mb-4 w-100" max-width="1200">
      <v-card-text>
        <p class="text-h6 mb-4">Subir imágenes del producto</p>
        
        <v-file-input
          label="Seleccionar imágenes"
          accept=".jpeg,.jpg,.png,.webp,image/jpeg,image/png,image/webp"
          :rules="[validateImages]"
          counter
          multiple
          prepend-icon="mdi-camera"
          variant="outlined"
          @update:model-value="(files) => addImages(files as FileList | File[] | null)"
        />
        
        <p v-if="images && images.length > 0" class="mt-4 mb-2">Vista previa:</p>
        
        <v-row v-if="images && images.length > 0" class="mt-2">
          <v-col
            v-for="(preview, index) in imagePreviews"
            :key="index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              class="mx-auto"
              height="200"
              :class="{ 'main-image-card': mainImageIndex === index }"
            >
              <div class="d-flex justify-center align-center h-100 position-relative">
                <img
                  :src="preview.url"
                  class="object-cover max-width-100 max-height-100"
                  alt="Vista previa"
                >

                <!-- Indicador de compresión en progreso -->
                <v-progress-circular
                  v-if="compressionProgress[index] !== undefined && compressionProgress[index] < 100"
                  :model-value="compressionProgress[index]"
                  color="primary"
                  size="60"
                  width="5"
                  class="position-absolute compression-progress"
                >
                  {{ compressionProgress[index] }}%
                </v-progress-circular>

                <v-btn
                  icon
                  size="small"
                  color="error"
                  class="position-absolute"
                  style="top: 5px; right: 5px;"
                  @click="removeImage(index)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>

                <v-btn
                  icon
                  size="small"
                  :color="mainImageIndex === index ? 'amber-darken-2' : 'grey'"
                  class="position-absolute"
                  style="top: 5px; left: 5px;"
                  :title="mainImageIndex === index ? 'Quitar selección como principal' : 'Establecer como principal'"
                  @click="setMainImage(index)"
                >
                  <v-icon>mdi-star</v-icon>
                </v-btn>

                <v-chip
                  v-if="mainImageIndex === index"
                  color="amber-darken-2"
                  size="small"
                  class="position-absolute"
                  style="bottom: 5px; left: 5px;"
                >
                  Principal
                </v-chip>

                <!-- Badge de compresión exitosa -->
                <v-chip
                  v-if="compressionInfo[index] && compressionInfo[index].ratio !== '0%'"
                  color="success"
                  size="x-small"
                  class="position-absolute compression-badge"
                  style="bottom: 5px; right: 5px;"
                >
                  <v-icon size="x-small" start>mdi-check-circle</v-icon>
                  {{ formatFileSize(compressionInfo[index].originalSize) }} →
                  {{ formatFileSize(compressionInfo[index].compressedSize) }}
                  ({{ compressionInfo[index].ratio }})
                </v-chip>
              </div>
              <v-card-text class="text-caption text-truncate">
                {{ images[index]?.name }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        
        <v-alert
          v-if="errorMessage"
          type="error"
          class="mt-4"
          density="compact"
          variant="tonal"
          closable
          @click:close="errorMessage = ''"
        >
          {{ errorMessage }}
        </v-alert>
      </v-card-text>
      
      <v-card-actions>
        <v-btn
          v-if="!hideBackButton"
          color="secondary"
          variant="outlined"
          @click="$emit('back')"
        >
          Volver
        </v-btn>
        
        <v-spacer/>
        
        <v-btn
          v-if="!hideCancelButton"
          color="error"
          variant="text"
          @click="$emit('cancel')"
        >
          Cancelar
        </v-btn>
        
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="loading"
          @click="submitImages"
        >
          {{ loading ? 'Guardando...' : submitButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useImageCompression } from '~/composables/useImageCompression'
import { useAlertStore } from '~/stores/alert'

interface Props {
  productData: Record<string, unknown>
  hideBackButton?: boolean
  hideCancelButton?: boolean
  submitButtonText?: string
  allowDeselect?: boolean
}

interface CompressionInfo {
  originalSize: number
  compressedSize: number
  ratio: string
}

const props = withDefaults(defineProps<Props>(), {
  hideBackButton: false,
  hideCancelButton: false,
  submitButtonText: 'Guardar producto',
  allowDeselect: true
})

const emit = defineEmits<{
  save: [images: Array<{ file: File; contentType: string; fileExtension: string; main: boolean }>]
  back: []
  cancel: []
}>()

const images = ref<File[]>([])
const imagePreviews = ref<Array<{ url: string; name: string }>>([])
const loading = ref(false)
const errorMessage = ref('')
const mainImageIndex = ref(0) // Por defecto, la primera imagen es la principal

// Nuevos estados para compresión
const compressionProgress = ref<Record<number, number>>({})
const compressionInfo = ref<Record<number, CompressionInfo>>({})

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const maxFileSize = 5 * 1024 * 1024 // 5MB
const compressionThreshold = 1 * 1024 * 1024 // 1MB - Solo comprimir imágenes mayores a este tamaño

const alertStore = useAlertStore()
const { compressImage } = useImageCompression()

/**
 * Formatea el tamaño de archivo en bytes a formato legible
 */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const validateImages = (fileList: FileList | File[] | null): string | true => {
  if (!fileList) return true

  const files = Array.isArray(fileList) ? fileList : Array.from(fileList)

  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      return 'Solo se permiten archivos de imagen (JPEG, JPG, PNG, WEBP)'
    }

    if (file.size > maxFileSize) {
      return `El tamaño máximo por archivo es 5MB. "${file.name}" excede este límite.`
    }
  }

  return true
}

/**
 * Genera preview para un archivo individual
 */
const generatePreview = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      if (e.target?.result) {
        imagePreviews.value.push({
          url: e.target.result as string,
          name: file.name
        })
        resolve()
      } else {
        reject(new Error('Error al leer el archivo'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }

    reader.readAsDataURL(file)
  })
}

const removeImage = (index: number) => {
  if (index >= 0 && index < images.value.length) {
    // Eliminamos el archivo
    const newImages = [...images.value]
    newImages.splice(index, 1)
    images.value = newImages

    // Eliminamos la vista previa
    const newPreviews = [...imagePreviews.value]
    newPreviews.splice(index, 1)
    imagePreviews.value = newPreviews

    // Limpiar información de compresión
    const newCompressionInfo: Record<number, CompressionInfo> = {}
    const newCompressionProgress: Record<number, number> = {}

    Object.keys(compressionInfo.value).forEach((key) => {
      const keyIndex = parseInt(key)
      const info = compressionInfo.value[keyIndex]
      if (info) {
        if (keyIndex < index) {
          // Mantener índices anteriores
          newCompressionInfo[keyIndex] = info
        } else if (keyIndex > index) {
          // Decrementar índices posteriores
          newCompressionInfo[keyIndex - 1] = info
        }
      }
    })

    Object.keys(compressionProgress.value).forEach((key) => {
      const keyIndex = parseInt(key)
      const progress = compressionProgress.value[keyIndex]
      if (progress !== undefined) {
        if (keyIndex < index) {
          newCompressionProgress[keyIndex] = progress
        } else if (keyIndex > index) {
          newCompressionProgress[keyIndex - 1] = progress
        }
      }
    })

    compressionInfo.value = newCompressionInfo
    compressionProgress.value = newCompressionProgress

    // Si se eliminó la imagen principal, actualizamos el índice
    if (mainImageIndex.value === index) {
      if (newImages.length > 0) {
        // Si hay más imágenes, la primera pasa a ser la principal
        mainImageIndex.value = 0
      } else {
        // Si no quedan imágenes, reiniciamos el índice
        mainImageIndex.value = 0
      }
    } else if (mainImageIndex.value > index) {
      // Si se eliminó una imagen antes de la principal,
      // debemos decrementar el índice principal
      mainImageIndex.value--
    }
  }
}

const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

const setMainImage = (index: number) => {
  if (index >= 0 && index < images.value.length) {
    // Si allowDeselect está habilitado y ya era la imagen principal,
    // desactivamos la selección estableciendo a -1 (ninguna imagen principal)
    if (props.allowDeselect && mainImageIndex.value === index) {
      mainImageIndex.value = -1
    } else {
      mainImageIndex.value = index
    }
  }
}

const submitImages = () => {
  if (images.value && images.value.length > 0) {
    const imagesData = images.value.map((file, index) => ({
      file,
      contentType: file.type,
      fileExtension: getFileExtension(file.name).toLowerCase(),
      main: mainImageIndex.value === index // Establecer main=true solo para la imagen principal
    }))
    
    console.log('Datos del producto completo:', {
      ...props.productData,
      images: imagesData
    })
    
    emit('save', imagesData)
  } else {
    // Si no hay imágenes, también permitimos guardar el producto
    console.log('Guardando producto sin imágenes:', props.productData)
    emit('save', [])
  }
}

/**
 * Agrega imágenes con compresión automática
 */
const addImages = async (newFiles: FileList | File[] | null) => {
  if (!newFiles || newFiles.length === 0) return

  errorMessage.value = ''
  const currentFiles = images.value || []
  const wasEmpty = currentFiles.length === 0

  // Convertir a array
  const filesToAdd = Array.isArray(newFiles) ? newFiles : Array.from(newFiles)

  // Procesar cada archivo con compresión automática
  for (let i = 0; i < filesToAdd.length; i++) {
    const file = filesToAdd[i]
    if (!file) continue

    const index = currentFiles.length + i

    // Inicializar progreso de compresión
    compressionProgress.value[index] = 0

    try {
      // Verificar si la imagen necesita compresión
      if (file.size > compressionThreshold) {
        // Imagen grande: comprimir automáticamente
        // Simular progreso de compresión
        compressionProgress.value[index] = 50

        // Comprimir imagen automáticamente (objetivo: 500 KB)
        const result = await compressImage(file, 500)

        // Actualizar progreso a 100%
        compressionProgress.value[index] = 100

        // Guardar información de compresión
        compressionInfo.value[index] = {
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          ratio: result.compressionRatio
        }

        // Agregar archivo comprimido al array de imágenes
        images.value.push(result.compressedFile)

        // Generar preview
        await generatePreview(result.compressedFile)

        // Mostrar notificación si hubo compresión significativa
        if (result.originalSize > result.compressedSize) {
          const savedKB = ((result.originalSize - result.compressedSize) / 1024).toFixed(0)
          console.log(
            `Imagen comprimida: ${formatFileSize(result.originalSize)} → ${formatFileSize(result.compressedSize)} (ahorro: ${savedKB} KB)`
          )
        }
      } else {
        // Imagen pequeña (< 1 MB): usar original sin comprimir
        images.value.push(file)
        await generatePreview(file)

        console.log(
          `Imagen agregada sin compresión: ${formatFileSize(file.size)} (por debajo del umbral de ${formatFileSize(compressionThreshold)})`
        )
      }
    } catch (error) {
      console.error('Error al comprimir imagen:', error)

      // Si falla la compresión, agregar archivo original
      images.value.push(file)
      await generatePreview(file)

      alertStore.showAlert(
        `No se pudo comprimir "${file.name}". Se usará la imagen original.`,
        'warning',
        3000
      )
    } finally {
      // Limpiar progreso después de un breve delay
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete compressionProgress.value[index]
      }, 1000)
    }
  }

  // Si no había imágenes previamente, la primera nueva imagen será la principal
  if (wasEmpty && filesToAdd.length > 0) {
    mainImageIndex.value = 0
  }
}

// Limpiar URLs de vista previa cuando el componente se destruye
watch(images, (newVal) => {
  if (!newVal || newVal.length === 0) {
    imagePreviews.value = []
  }
})
</script>

<style scoped>
.max-width-100 {
  max-width: 100%;
}

.max-height-100 {
  max-height: 100%;
}

.object-cover {
  object-fit: contain;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.main-image-card {
  border: 2px solid #FF8F00;
  box-shadow: 0 0 8px rgba(255, 143, 0, 0.6);
}

.compression-progress {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.compression-badge {
  font-size: 0.65rem !important;
  opacity: 0.95;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style> 