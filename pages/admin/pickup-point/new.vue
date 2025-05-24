<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex align-center mb-4">
        <v-btn
          variant="outlined"
          prepend-icon="mdi-arrow-left"
          to="/admin/pickup-point"
          color="primary"
        >
          Atrás
        </v-btn>
        <v-spacer/>
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-title class="headline">
            Nuevo Punto de retiro
          </v-card-title>
          
          <v-card-text>
            <PickupPointForm
              :loading="loading"
              submit-button-text="Guardar punto de retiro"
              cancel-route="/admin/pickup-point"
              @submit="onSubmit"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
    >
      {{ snackbar.text }}
      <template #actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { usePickupPoint } from '@/composables/services/usePickupPoint'
import { useRouter } from 'vue-router'
import PickupPointForm from '@/components/admin/pickup-point/PickupPointForm.vue'
definePageMeta({
  layout: 'admin',
})

const router = useRouter()
const { createPickupPoint } = usePickupPoint()

const loading = ref(false)

// Estado para el snackbar
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
})

// Definimos una interfaz para los datos del formulario
interface FormData {
  name: string
  street: string
  number: string
  city: string
  state: string
  zipCode: string
  additionalInfo?: string
  isActive: boolean
}

const onSubmit = async (formData: FormData) => {
  loading.value = true
  
  try {
    const { error } = await createPickupPoint(formData)
    
    if (error) {
      snackbar.color = 'error'
      snackbar.text = 'Error al crear el punto de retiro: ' + error
      snackbar.show = true
    } else {
      snackbar.color = 'success'
      snackbar.text = 'Punto de retiro creado correctamente'
      snackbar.show = true
      
      // Redirigir después de crear exitosamente
      setTimeout(() => {
        router.push('/admin/pickup-point')
      }, 1500)
    }
  } catch (err: unknown) {
    snackbar.color = 'error'
    snackbar.text = 'Error inesperado: ' + ((err as Error).message || 'Desconocido')
    snackbar.show = true
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

</style>
