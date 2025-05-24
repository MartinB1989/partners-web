<template>
  <v-form ref="form" v-model="isFormValid" @submit.prevent>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="formData.name"
          :rules="[v => !!v || 'El nombre es obligatorio']"
          label="Nombre del punto de retiro"
          required
          variant="outlined"
          density="comfortable"
        />
      </v-col>
      
      <v-col cols="12">
        <GooglePlaceAutocomplete @place-selected="handlePlaceSelected" />
      </v-col>
      
      <v-col cols="12" md="8">
        <v-text-field
          v-model="formData.street"
          :rules="[v => !!v || 'La calle es obligatoria']"
          label="Calle"
          required
          variant="outlined"
          density="comfortable"
        />
      </v-col>
      
      <v-col cols="12" md="4">
        <v-text-field
          v-model="formData.number"
          :rules="[v => !!v || 'El número es obligatorio']"
          label="Número"
          required
          variant="outlined"
          density="comfortable"
        />
      </v-col>
      
      <v-col cols="12" md="4">
        <v-text-field
          v-model="formData.city"
          :rules="[v => !!v || 'La ciudad es obligatoria']"
          label="Ciudad"
          required
          variant="outlined"
          density="comfortable"
        />
      </v-col>
      
      <v-col cols="12" md="4">
        <v-text-field
          v-model="formData.state"
          :rules="[v => !!v || 'La provincia es obligatoria']"
          label="Provincia"
          required
          variant="outlined"
          density="comfortable"
        />
      </v-col>
      
      <v-col cols="12" md="4">
        <v-text-field
          v-model="formData.zipCode"
          :rules="[v => !!v || 'El código postal es obligatorio']"
          label="Código Postal"
          required
          variant="outlined"
          density="comfortable"
        />
      </v-col>
      
      <v-col cols="12">
        <v-textarea
          v-model="formData.additionalInfo"
          label="Información adicional"
          variant="outlined"
          density="comfortable"
          rows="3"
          hint="Instrucciones especiales, puntos de referencia, etc."
        />
      </v-col>
      
      <v-col cols="12">
        <v-switch
          v-model="formData.isActive"
          label="Punto de retiro activo"
          color="primary"
          inset
        />
      </v-col>
    </v-row>

    <v-card-actions>
      <v-spacer/>
      <v-btn
        :to="cancelRoute"
        variant="tonal"
        color="grey"
      >
        Cancelar
      </v-btn>
      <v-btn
        color="primary"
        :loading="loading"
        :disabled="!isFormValid || loading"
        @click="submitForm"
      >
        {{ submitButtonText }}
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, defineProps, defineEmits } from 'vue'
import type { PickupAddress } from '~/types/pickup-address'
import GooglePlaceAutocomplete from '@/components/app/GooglePlaceAutocomplete.vue'
import type { PlaceResult } from '@/types/google-maps'

interface FormData {
  name: string
  street: string
  number: string
  city: string
  state: string
  zipCode: string
  additionalInfo?: string
  isActive: boolean
  latitude?: number
  longitude?: number
}

const props = defineProps<{
  pickupPoint?: Partial<PickupAddress>
  loading: boolean
  submitButtonText: string
  cancelRoute: string
}>()

const emit = defineEmits<{
  (e: 'update:loading', value: boolean): void
  (e: 'submit', formData: FormData): void
}>()

const form = ref<HTMLFormElement | null>(null)
const isFormValid = ref(false)

// Datos del formulario inicializados con valores por defecto o datos existentes
const formData = reactive<FormData>({
  name: props.pickupPoint?.name || '',
  street: props.pickupPoint?.street || '',
  number: props.pickupPoint?.number || '',
  city: props.pickupPoint?.city || '',
  state: props.pickupPoint?.state || '',
  zipCode: props.pickupPoint?.zipCode || '',
  additionalInfo: props.pickupPoint?.additionalInfo || '',
  isActive: props.pickupPoint?.isActive !== undefined ? props.pickupPoint.isActive : true,
  latitude: props.pickupPoint?.latitude,
  longitude: props.pickupPoint?.longitude
})

// Actualizar formData si cambian los props
watch(() => props.pickupPoint, (newValue) => {
  if (newValue) {
    formData.name = newValue.name || ''
    formData.street = newValue.street || ''
    formData.number = newValue.number || ''
    formData.city = newValue.city || ''
    formData.state = newValue.state || ''
    formData.zipCode = newValue.zipCode || ''
    formData.additionalInfo = newValue.additionalInfo || ''
    formData.isActive = newValue.isActive !== undefined ? newValue.isActive : true
    formData.latitude = newValue.latitude
    formData.longitude = newValue.longitude
  }
}, { deep: true })

// Manejador para cuando se selecciona un lugar del autocompletado
const handlePlaceSelected = (place: PlaceResult) => {
  if (!place || !place.placeDetails) return
  
  // Guardar coordenadas
  if (place.location) {
    formData.latitude = place.location.lat
    formData.longitude = place.location.lng
  }
  
  const addressComponents = place.placeDetails.address_components || []
  
  // Extraer información de los componentes de dirección
  let street = ''
  let number = ''
  let city = ''
  let state = ''
  let zipCode = ''
  
  addressComponents.forEach(component => {
    const types = component.types
    
    if (types.includes('route')) {
      street = component.long_name
    } else if (types.includes('street_number')) {
      number = component.long_name
    } else if (types.includes('locality') || types.includes('sublocality')) {
      city = component.long_name
    } else if (types.includes('administrative_area_level_1')) {
      state = component.long_name
    } else if (types.includes('postal_code')) {
      zipCode = component.long_name
    }
  })
  
  // Actualizar formData con la información extraída
  if (street) formData.street = street
  if (number) formData.number = number
  if (city) formData.city = city
  if (state) formData.state = state
  if (zipCode) formData.zipCode = zipCode
}

const submitForm = () => {
  if (!isFormValid.value) return
  
  emit('submit', { ...formData })
}

defineExpose({
  form,
  isFormValid,
  formData
})
</script>

<style scoped>
.v-btn--size-small {
  text-transform: none;
}
</style> 