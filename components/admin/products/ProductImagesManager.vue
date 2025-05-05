<template>
  <div>
    <v-card class="pa-4 mb-4">
      <v-card-title class="text-h6 mb-4">Gestionar imágenes existentes</v-card-title>
      
      <v-card-text>
        <p v-if="!productImages || productImages.length === 0" class="text-body-1 text-center my-4">
          Este producto no tiene imágenes
        </p>
        
        <v-row v-else class="mt-2">
          <v-col
            v-for="(image, index) in productImages"
            :key="image.id || index"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card 
              class="mx-auto" 
              height="200"
              :class="{ 'main-image-card': image.main }"
            >
              <div class="d-flex justify-center align-center h-100 position-relative">
                <img
                  :src="image.url"
                  class="object-cover max-width-100 max-height-100"
                  alt="Imagen del producto"
                >
                <v-btn
                  icon
                  size="small"
                  color="error"
                  class="position-absolute"
                  style="top: 5px; right: 5px;"
                  @click="handleRemoveImage(image)"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                
                <v-btn
                  icon
                  size="small"
                  :color="image.main ? 'amber-darken-2' : 'grey'"
                  class="position-absolute"
                  style="top: 5px; left: 5px;"
                  :title="image.main ? 'Imagen principal' : 'Establecer como principal'"
                  @click="handleSetMainImage(image)"
                >
                  <v-icon>mdi-star</v-icon>
                </v-btn>
                
                <v-chip
                  v-if="image.main"
                  color="amber-darken-2"
                  size="small"
                  class="position-absolute"
                  style="bottom: 5px; left: 5px;"
                >
                  Principal
                </v-chip>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const _props = defineProps({
  productImages: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['remove-image', 'set-main-image'])

const handleRemoveImage = (image) => {
  // Emite evento al componente padre con el id de la imagen
  emit('remove-image', {
    imageId: image.id
  })
}

const handleSetMainImage = (image) => {
  // Solo emite si no es ya la imagen principal
  if (!image.main) {
    // Emite evento al componente padre con el id de la imagen y main=true
    emit('set-main-image', {
      imageId: image.id,
      main: true
    })
  }
}
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