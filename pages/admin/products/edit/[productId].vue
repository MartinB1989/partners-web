<template>
  <v-container>
    <div class="d-flex justify-space-between align-center mb-4">
      <h1 class="text-h4">Editar producto</h1>
      <v-btn
        variant="outlined"
        prepend-icon="mdi-arrow-left"
        @click="() => router.back()"
      >
        Atrás
      </v-btn>
    </div>
    
    <div v-if="loading" class="d-flex justify-center">
      <v-progress-circular indeterminate color="primary" />
    </div>
    
    <div v-else>

      <!-- Gestor de imágenes existentes -->
      <ProductImagesManager 
        :product-images="product.images"
        class="mt-6"
        @remove-image="handleRemoveImage"
        @set-main-image="handleSetMainImage"
      />
      <!-- Formulario de detalles del producto -->
      <ProductForm 
        :initial-data="product"
        :hide-cancel-button="true"
        :is-edit-mode="true"
        submit-button-text="Guardar"
        @cancel="$router.push('/admin/products')"
        @continue="handleFormContinue"
      />
      
      <!-- Carga de nuevas imágenes -->
      <ProductImagesUploader 
        :product-data="product"
        :hide-back-button="true"
        :hide-cancel-button="true"
        submit-button-text="Subir imágenes"
        class="mt-6"
        @save="handleImagesUpload"
        @cancel="$router.push('/admin/products')"
      />

      <!-- Indicador de progreso de carga -->
      <v-card v-if="uploadingImages" class="pa-4 mb-4 w-100 mt-6" max-width="800">
        <v-card-text class="text-center">
          <p class="text-h6 mb-4">Subiendo imágenes...</p>
          <v-progress-linear 
            :model-value="uploadedImages / totalImages * 100" 
            height="20" 
            color="primary" 
            striped
          >
            <template #default>
              {{ uploadedImages }} de {{ totalImages }}
            </template>
          </v-progress-linear>
          <p class="mt-4">Por favor, no cierres esta página.</p>
        </v-card-text>
      </v-card>

    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProducts } from '~/composables/services/useProducts'
import { useAlertStore } from '~/stores/alert'
import { useProductImages } from '~/composables/useProductImage'
import ProductForm from '~/components/admin/products/ProductForm.vue'
import ProductImagesUploader from '~/components/admin/products/ProductImagesUploader.vue'
import ProductImagesManager from '~/components/admin/products/ProductImagesManager.vue'
import type { Product } from '~/types/product'

definePageMeta({
  layout: 'admin'
})

const router = useRouter()
const route = useRoute()
const productId = route.params.productId as string
const { getProductById, updateProduct, setMainImage } = useProducts()
const { deleteImage } = useProductImages()
const alertStore = useAlertStore()

const loading = ref(true)
const uploadingImages = ref(false)
const totalImages = ref(0)
const uploadedImages = ref(0)

const product = ref<Product>({
  title: '',
  description: '',
  price: 0,
  stock: 0,
  active: false,
  images: []
})

const loadProduct = async () => {
  try {
    loading.value = true
    const { data, error } = await getProductById(productId)
    
    if (error) {
      alertStore.showAlert('Error al cargar el producto: ' + error, 'error')
      router.push('/admin/products')
      return
    }
    
    if (data) {
      product.value = data
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    alertStore.showAlert(`Error al cargar el producto: ${errorMessage}`, 'error')
    router.push('/admin/products')
  } finally {
    loading.value = false
  }
}

const handleFormContinue = async (productData: Product) => {
  // Crear objeto de actualización
  const updateData: Product = {
    title: productData.title,
    description: productData.description,
    price: productData.price,
    stock: productData.stock,
    active: productData.active,
    categoryIds: productData.categoryIds || []
  }
  
  // Actualizar el producto local
  product.value = {
    ...product.value,
    ...updateData
  }
  
  try {
    const { data, error } = await updateProduct(productId, updateData)
    if (error) {
      alertStore.showAlert('Error al actualizar el producto: ' + error, 'error')
    } else {
      console.log(data)
      alertStore.showAlert('Datos del producto actualizados', 'success')
    }
  } catch (error) {
    alertStore.showAlert('Error al actualizar el producto: ' + error, 'error')
  }
}

const handleImagesUpload = async (imagesData: { file: File, main: boolean, order: number }[]) => {
  if (!imagesData || imagesData.length === 0) {
    alertStore.showAlert('No hay imágenes para subir', 'info')
    return
  }
  
  totalImages.value = imagesData.length
  uploadingImages.value = true
  
  try {
    // Inicializar el composable sin el ID del producto
    const { uploadMultipleImages, uploadedImages: imagesUploadedRef } = useProductImages()
    
    // Preparar los datos para la función de carga múltiple
    const imagesForUpload = imagesData.map((imgData, index) => ({
      file: imgData.file,
      main: imgData.main,
      order: index
    }))
    
    // Usar la función de carga múltiple pasando el productId como primer argumento
    const results = await uploadMultipleImages(productId, imagesForUpload)
    
    // Sincronizar el estado de progreso con nuestro componente
    const updateProgress = () => {
      uploadedImages.value = imagesUploadedRef.value
    }
    
    // Configurar una actualización periódica del progreso
    const progressInterval = setInterval(updateProgress, 100)
    
    // Esperar a que se complete la carga
    await new Promise(resolve => {
      const checkCompletion = () => {
        if (imagesUploadedRef.value >= totalImages.value) {
          clearInterval(progressInterval)
          resolve(null)
        } else {
          setTimeout(checkCompletion, 100)
        }
      }
      checkCompletion()
    })
    
    const successCount = results.filter(result => result !== null).length
    alertStore.showAlert(`${successCount} de ${imagesData.length} imágenes subidas correctamente`, 'success')
    
    // Recargar el producto para mostrar las nuevas imágenes
    await loadProduct()
  } catch (error) {
    console.error('Error al subir imágenes:', error)
    alertStore.showAlert('Error al subir imágenes: ' + error, 'error')
  } finally {
    uploadingImages.value = false
    uploadedImages.value = 0
    totalImages.value = 0
  }
}

const handleRemoveImage = async ({ imageId }: { imageId: string }) => {
  try {
    const success = await deleteImage(productId, imageId)
    
    if (success) {
      // Actualizar la lista de imágenes localmente eliminando la imagen
      if (product.value.images) {
        product.value.images = product.value.images.filter(img => img.id !== imageId)
      }
      alertStore.showAlert('Imagen eliminada correctamente', 'success')
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    alertStore.showAlert(`Error al eliminar la imagen: ${errorMessage}`, 'error')
  }
}

const handleSetMainImage = async ({ imageId, main }: { imageId: string, main: boolean }) => {
  console.log('Establecer imagen principal:', imageId, main)
  try {
    const { data, error } = await setMainImage(productId, imageId)
    if (error) {
      alertStore.showAlert('Error al establecer la imagen principal: ' + error, 'error')
    } else {
      console.log(data)
      alertStore.showAlert('Imagen principal establecida', 'success')
    }
  } catch (error) {
    alertStore.showAlert('Error al establecer la imagen principal: ' + error, 'error')
  }
  if (product.value.images) {
    product.value.images = product.value.images.map(img => ({
      ...img,
      main: img.id === imageId
    }))
  }
  
  alertStore.showAlert(`Imagen ${imageId} establecida como principal (simulación)`, 'success')
}

onMounted(async () => {
  await loadProduct()
})
</script>

<style scoped>
.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}
</style>