<template>
  <v-container>
    <h1 class="text-h4 mb-6 text-center">Editar producto</h1>
    
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

    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProducts } from '~/composables/services/useProducts'
import { useAlertStore } from '~/stores/alert'
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
const { getProductById } = useProducts()
const alertStore = useAlertStore()

const loading = ref(true)

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

const handleFormContinue = (productData) => {
  // Actualizar los datos del producto con los datos del formulario
  product.value = { 
    ...product.value, 
    title: productData.title,
    description: productData.description,
    price: productData.price,
    stock: productData.stock,
    active: productData.active
  }
  
  alertStore.showAlert('Datos del producto actualizados', 'success')
}

const handleImagesUpload = (_imagesData) => {
  // En una implementación real, aquí iría el código para subir las nuevas imágenes
  // Por ahora solo mostramos un mensaje de simulación
  alertStore.showAlert('Nuevas imágenes procesadas (simulación)', 'success')
}

const handleRemoveImage = ({ imageId }) => {
  console.log('Eliminar imagen:', imageId)
  // Aquí iría la lógica real para eliminar la imagen
  // De momento solo lo simulamos
  alertStore.showAlert(`Imagen ${imageId} eliminada (simulación)`, 'info')
}

const handleSetMainImage = ({ imageId, main }) => {
  console.log('Establecer imagen principal:', imageId, main)
  // Aquí iría la lógica real para establecer la imagen principal
  // De momento lo simulamos actualizando localmente
  
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