<template>
  <div class="d-flex justify-center">
    <v-card class="pa-4 mb-4 w-100" max-width="800">
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
            <v-card class="mx-auto" height="200">
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
          color="secondary"
          variant="outlined"
          @click="$emit('back')"
        >
          Volver
        </v-btn>
        
        <v-spacer/>
        
        <v-btn
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
          {{ loading ? 'Guardando...' : 'Guardar producto' }}
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
  }
})

const emit = defineEmits(['save', 'back', 'cancel'])

const images = ref([])
const imagePreviews = ref([])
const loading = ref(false)
const errorMessage = ref('')

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
  }
}

const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

const submitImages = () => {
  if (images.value && images.value.length > 0) {
    const imagesData = images.value.map(file => ({
      file,
      contentType: file.type,
      fileExtension: getFileExtension(file.name).toLowerCase()
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
  const filesToAdd = Array.from(newFiles)
  images.value = [...currentFiles, ...filesToAdd]
  
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
</style> 