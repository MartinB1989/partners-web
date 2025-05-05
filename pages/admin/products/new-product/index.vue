<template>
  <v-container>
    <h1 class="text-h4 mb-6 text-center">Nuevo producto</h1>
    
    <div class="d-flex justify-center mb-6">
      <v-stepper v-model="currentStep" class="w-100" max-width="800">
        <v-stepper-header>
          <v-stepper-item value="1">
            Detalles del producto
          </v-stepper-item>
          
          <v-divider/>
          
          <v-stepper-item value="2">
            Imágenes
          </v-stepper-item>
        </v-stepper-header>
      </v-stepper>
    </div>
    
    <!-- Paso 1: Formulario del producto -->
    <div v-if="currentStep === '1'">
      <ProductForm 
        :initial-data="product"
        @cancel="$router.push('/admin/products')"
        @continue="handleContinue"
      />
    </div>
    
    <!-- Paso 2: Carga de imágenes -->
    <div v-else-if="currentStep === '2'">
      <div v-if="uploadingImages" class="d-flex justify-center mb-6">
        <v-card class="pa-4 mb-4 w-100" max-width="800">
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
      
      <ProductImagesUploader
        v-else
        :product-data="product"
        @back="currentStep = '1'"
        @cancel="$router.push('/admin/products')"
        @save="handleSave"
      />
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '~/composables/services/useProducts'
import { useAlertStore } from '~/stores/alert'
import { useProductImages } from '~/composables/useProductImage'
import ProductForm from '~/components/admin/products/ProductForm.vue'
import ProductImagesUploader from '~/components/admin/products/ProductImagesUploader.vue'

definePageMeta({
  layout: 'admin'
})

const router = useRouter()
const { createProduct } = useProducts()
const alertStore = useAlertStore()

const currentStep = ref('1')
const product = ref({
  title: '',
  description: '',
  price: 0,
  stock: 0,
  active: true
})

const loading = ref(false)
const uploadingImages = ref(false)
const totalImages = ref(0)
const uploadedImages = ref(0)

const handleContinue = (productData) => {
  // Actualizar los datos del producto con los datos del formulario
  product.value = { ...productData }
  // Avanzar al siguiente paso
  currentStep.value = '2'
}

const handleSave = async (imagesData) => {
  loading.value = true
  
  try {
    // Paso 1: Crear el producto y obtener su ID
    const { data, error } = await createProduct(product.value)
    
    if (error) {
      alertStore.showAlert(error, 'error')
      return
    }

    const productId = data.id
    
    // Si hay imágenes para procesar
    if (imagesData && imagesData.length > 0) {
      console.log('Producto creado:', data)
      totalImages.value = imagesData.length
      uploadingImages.value = true
      
      // Inicializar el composable con el ID del producto
      const { uploadImage } = useProductImages(productId)
      
      // Subir cada imagen y mantener la propiedad main
      for (let i = 0; i < imagesData.length; i++) {
        const imgData = imagesData[i]
        
        try {
          await uploadImage(
            imgData.file,
            imgData.main, // Pasar el valor main que seleccionó el usuario
            i // Orden basado en el índice
          )
          
          uploadedImages.value++
        } catch (uploadErr) {
          console.error('Error al subir imagen:', uploadErr)
          // Continuamos con la siguiente imagen aun si una falla
        }
      }
    }
    
    alertStore.showAlert('Producto creado correctamente', 'success')
    setTimeout(() => {
      router.push('/admin/products')
    }, 1500)
  } catch (err) {
    alertStore.showAlert(err.message || 'Error inesperado', 'error')
  } finally {
    loading.value = false
    uploadingImages.value = false
    uploadedImages.value = 0
    totalImages.value = 0
  }
}
</script>

