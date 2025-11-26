<template>
  <div>
    <v-text-field
      id="autocomplete"
      v-model="searchText"
      placeholder="Busca una dirección"
      :loading="loading"
      variant="outlined"
      density="comfortable"
      hide-details
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, onMounted } from 'vue'
import type { GoogleAutocomplete, PlaceResult } from '@/types/google-maps'

// Declaración de tipos para TypeScript
declare global {
  interface Window {
    initMap?: () => void;
  }
}

const searchText = ref('')
const loading = ref(true)
let autocomplete: GoogleAutocomplete | null = null

// Usamos onMounted para asegurarnos de que el código solo se ejecute en el cliente
onMounted(async () => {
  // Cargamos Google Maps usando el plugin
  const { $googleMaps } = useNuxtApp()
  
  try {
    // Esperamos a que Google Maps se cargue
    await $googleMaps.load()
    loading.value = false
    
    // Inicializamos el autocompletado una vez que Google Maps está cargado
    const input = document.getElementById('autocomplete') as HTMLInputElement
    if (!input) return
    
    autocomplete = new window.google!.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'ar' }, // Restringimos búsqueda a Argentina
      fields: ['address_components', 'geometry', 'name', 'formatted_address'],
    })
    
    // Evento que se dispara cuando el usuario selecciona un lugar
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete!.getPlace()
      
      if (!place.geometry) {
        // Si el usuario presiona Enter sin seleccionar un lugar de la lista
        return
      }
      
      // Actualizamos el valor del input con la dirección formateada
      searchText.value = place.formatted_address
      
      // Aquí puedes emitir un evento con los datos del lugar seleccionado
      emit('place-selected', {
        address: place.formatted_address,
        location: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        },
        placeDetails: place
      })
    })
  } catch (error) {
    console.error('Error al cargar Google Maps:', error)
  }
})

// Limpiamos los recursos cuando el componente se desmonta
onBeforeUnmount(() => {
  if (import.meta.client && autocomplete) {
    window.google?.maps?.event?.clearInstanceListeners?.(autocomplete)
  }
})

// Definimos los eventos que este componente puede emitir
const emit = defineEmits<{
  (e: 'place-selected', place: PlaceResult): void;
}>()
</script>

<style scoped>
.pac-container {
  z-index: 9999 !important;
}
</style>