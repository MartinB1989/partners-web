<template>
  <v-form ref="form" v-model="isFormValid" @submit.prevent>
    <v-row>
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

    </v-row>

    <v-card-actions class="px-0">
      <v-spacer/>
      <v-btn
        variant="tonal"
        color="grey"
        @click="emit('cancel')"
      >
        Cancelar
      </v-btn>
      <v-btn
        color="primary"
        :disabled="!isFormValid"
        @click="submitForm"
      >
        Confirmar dirección de envío
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import GooglePlaceAutocomplete from '@/components/app/GooglePlaceAutocomplete.vue'
import type { PlaceResult } from '@/types/google-maps'
import type { Address } from '@/types/address'

interface Props {
  initialData?: Partial<Address>
}

const props = withDefaults(defineProps<Props>(), {
  initialData: undefined
})

const emit = defineEmits<{
  (e: 'submit', formData: Partial<Address>): void
  (e: 'cancel'): void
}>()

const form = ref<HTMLFormElement | null>(null)
const isFormValid = ref(false)

const formData = reactive<Partial<Address>>({
  street: props.initialData?.street || '',
  number: props.initialData?.number || '',
  city: props.initialData?.city || '',
  state: props.initialData?.state || '',
  zipCode: props.initialData?.zipCode || '',
})

// Actualizar formData si cambian los props
watch(() => props.initialData, (newValue) => {
  if (newValue) {
    formData.street = newValue.street || ''
    formData.number = newValue.number || ''
    formData.city = newValue.city || ''
    formData.state = newValue.state || ''
    formData.zipCode = newValue.zipCode || ''
  }
}, { deep: true })

// Manejador para cuando se selecciona un lugar del autocompletado
const handlePlaceSelected = (place: PlaceResult) => {
  if (!place || !place.placeDetails) return

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
