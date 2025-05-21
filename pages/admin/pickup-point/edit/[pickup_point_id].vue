<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="headline">
            Editar Punto de retiro
          </v-card-title>
          
          <v-card-text v-if="isLoading">
            <v-skeleton-loader type="article" />
          </v-card-text>
          
          <v-card-text v-else-if="error">
            <v-alert
              type="error"
              title="Error al cargar el punto de retiro"
              :text="error"
            />
          </v-card-text>
          
          <v-card-text v-else>
            <PickupPointForm
              :pickup-point="pickupPoint"
              :loading="loading"
              submit-button-text="Actualizar punto de retiro"
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
import { ref, reactive, onMounted } from 'vue'
import { usePickupPoint } from '@/composables/services/usePickupPoint'
import { useRouter, useRoute } from 'vue-router'
import PickupPointForm from '@/components/admin/pickup-point/PickupPointForm.vue'
import type { PickupAddress } from '~/types/pickup-address'

definePageMeta({
  layout: 'admin',
})

const router = useRouter()
const route = useRoute()
const { getPickupPoint, updatePickupPoint } = usePickupPoint()

const pickupPoint = ref<Partial<PickupAddress>>({})
const isLoading = ref(true)
const loading = ref(false)
const error = ref<string | null>(null)

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

// Cargar datos del punto de retiro
onMounted(async () => {
  const id = Number(route.params.pickup_point_id)
  if (isNaN(id)) {
    error.value = 'ID de punto de retiro inválido'
    isLoading.value = false
    return
  }
  
  try {
    const { data, error: fetchError } = await getPickupPoint(id)
    
    if (fetchError) {
      error.value = `Error al cargar el punto de retiro: ${fetchError}`
    } else if (data) {
      pickupPoint.value = data
    } else {
      error.value = 'No se encontró el punto de retiro'
    }
  } catch (err: unknown) {
    error.value = `Error inesperado: ${(err as Error).message || 'Desconocido'}`
  } finally {
    isLoading.value = false
  }
})

const onSubmit = async (formData: FormData) => {
  const id = Number(route.params.pickup_point_id)
  loading.value = true
  
  try {
    const { error: updateError } = await updatePickupPoint(id, formData)
    
    if (updateError) {
      snackbar.color = 'error'
      snackbar.text = 'Error al actualizar el punto de retiro: ' + updateError
      snackbar.show = true
    } else {
      snackbar.color = 'success'
      snackbar.text = 'Punto de retiro actualizado correctamente'
      snackbar.show = true
      
      // Redirigir después de actualizar exitosamente
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
