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
      <ProductImages
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
// import { useProducts } from '~/composables/services/useProducts'
import { useAlertStore } from '~/stores/alert'
import ProductForm from '~/components/admin/products/ProductForm.vue'
import ProductImages from '~/components/admin/products/ProductImages.vue'

definePageMeta({
  layout: 'admin'
})

const router = useRouter()
// const { createProduct } = useProducts()
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
    // const { data, error } = await createProduct(product.value)
    
    // if (error) {
    //   alertStore.showAlert(error, 'error')
    //   return
    // }

    if (imagesData && imagesData.length > 0) {
      console.log('Producto creado:', product.value)
      console.log('Imágenes a procesar:', imagesData)
      
      // Aquí se procesarían las imágenes usando el ID del producto: data.id
      // Por ejemplo:
      // await uploadProductImages(data.id, imagesData)
    }
    
    alertStore.showAlert('Producto creado correctamente', 'success')
    setTimeout(() => {
      router.push('/admin/products')
    }, 1500)
  } catch (err) {
    alertStore.showAlert(err.message || 'Error inesperado', 'error')
  } finally {
    loading.value = false
  }
}
</script>

