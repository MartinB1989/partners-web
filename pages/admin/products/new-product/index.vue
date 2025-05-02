<template>
  <v-container>
    <h1 class="text-h4 mb-6">Nuevo producto</h1>
    <v-form @submit.prevent="submitProduct">
      <v-card class="pa-4 mb-4" max-width="600">
        <v-card-text>
          <v-text-field
            v-model="product.title"
            label="Título"
            required
            variant="outlined"
            class="mb-4"
            :rules="[v => !!v || 'El título es requerido']"
          />
          
          <v-textarea
            v-model="product.description"
            label="Descripción"
            rows="4"
            required
            variant="outlined"
            class="mb-4"
            :rules="[v => !!v || 'La descripción es requerida']"
          />
          
          <v-text-field
            v-model.number="product.price"
            label="Precio"
            type="number"
            min="0"
            step="0.01"
            prefix="$"
            required
            variant="outlined"
            class="mb-4"
            :rules="[v => !!v || 'El precio es requerido']"
          />
          
          <v-text-field
            v-model.number="product.stock"
            label="Stock"
            type="number"
            min="0"
            required
            variant="outlined"
            class="mb-4"
            :rules="[v => !!v || 'El stock es requerido']"
          />
          
          <v-switch
            v-model="product.active"
            label="Producto activo"
            color="success"
            class="mt-2"
          />
        </v-card-text>
        
        <v-card-actions>
          <v-spacer/>
          <v-btn
            color="error"
            variant="text"
            @click="$router.push('/admin/products')"
          >
            Cancelar
          </v-btn>
          
          <v-btn
            color="primary"
            type="submit"
            :loading="loading"
            :disabled="loading"
          >
            {{ loading ? 'Guardando...' : 'Guardar producto' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '~/composables/services/useProducts'
import { useAlertStore } from '~/stores/alert'

definePageMeta({
  layout: 'admin'
})

const router = useRouter()
const { createProduct } = useProducts()
const alertStore = useAlertStore()

const product = ref({
  title: '',
  description: '',
  price: 0,
  stock: 0,
  active: true
})

const loading = ref(false)

const submitProduct = async () => {
  loading.value = true
  
  try {
    const { data, error } = await createProduct(product.value)
    
    if (error) {
      alertStore.showAlert(error, 'error')
      return
    }
    console.log(data)
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

