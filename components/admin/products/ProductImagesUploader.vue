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
          @update:model-value="addImages"
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
                  :title="mainImageIndex === index ? 'Imagen principal' : 'Establecer como principal'"
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
              </div>
              <v-card-text class="text-caption text-truncate">
                {{ images[index].name }}
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

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  productData: {
    type: Object,
    required: true
  },
  hideBackButton: {
    type: Boolean,
    default: false
  },
  hideCancelButton: {
    type: Boolean,
    default: false
  },
  submitButtonText: {
    type: String,
    default: 'Guardar producto'
  }
})

const emit = defineEmits(['save', 'back', 'cancel'])

const images = ref([])
const imagePreviews = ref([])
const loading = ref(false)
const errorMessage = ref('')
const mainImageIndex = ref(0) // Por defecto, la primera imagen es la principal

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const maxFileSize = 5 * 1024 * 1024 // 5MB

const validateImages = (fileList) => {
  if (!fileList) return true
  
  for (const file of fileList) {
    if (!allowedTypes.includes(file.type)) {
      return 'Solo se permiten archivos de imagen (JPEG, JPG, PNG, WEBP)'
    }
    
    if (file.size > maxFileSize) {
      return `El tamaño máximo por archivo es 5MB. "${file.name}" excede este límite.`
    }
  }
  
  return true
}

const generatePreviews = () => {
  errorMessage.value = ''
  
  if (!images.value || images.value.length === 0) return
  
  const startIndex = imagePreviews.value.length
  const newImages = images.value.slice(startIndex)
  
  for (const file of newImages) {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      imagePreviews.value.push({
        url: e.target.result,
        name: file.name
      })
    }
    
    reader.readAsDataURL(file)
  }
}

const removeImage = (index) => {
  if (index >= 0 && index < images.value.length) {
    // Eliminamos el archivo
    const newImages = [...images.value]
    newImages.splice(index, 1)
    images.value = newImages
    
    // Eliminamos la vista previa
    const newPreviews = [...imagePreviews.value]
    newPreviews.splice(index, 1)
    imagePreviews.value = newPreviews
    
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

const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

const setMainImage = (index) => {
  if (index >= 0 && index < images.value.length) {
    mainImageIndex.value = index
  }
}

const submitImages = () => {
  if (images.value && images.value.length > 0) {
    const imagesData = images.value.map((file, index) => ({
      file,
      contentType: file.type,
      fileExtension: getFileExtension(file.name).toLowerCase(),
      main: index === mainImageIndex.value // Establecer main=true solo para la imagen principal
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

const addImages = (newFiles) => {
  if (!newFiles || newFiles.length === 0) return
  
  const currentFiles = images.value || []
  const wasEmpty = currentFiles.length === 0
  
  // Convertimos a array y concatenamos con los archivos existentes
  const filesToAdd = Array.from(newFiles)
  images.value = [...currentFiles, ...filesToAdd]
  
  // Si no había imágenes previamente, la primera nueva imagen será la principal
  if (wasEmpty && filesToAdd.length > 0) {
    mainImageIndex.value = 0
  }
  
  generatePreviews()
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
</style> 