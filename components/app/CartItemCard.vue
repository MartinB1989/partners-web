<template>
  <v-card class="mb-4" variant="outlined">
    <div class="d-flex">
      <!-- Imagen del producto -->
      <v-img
        :src="productImage"
        :alt="item.product.title"
        width="120"
        height="120"
        contain
        class="flex-shrink-0"
      />
      
      <!-- Información del producto -->
      <v-card-item class="flex-grow-1">
        <v-card-title class="text-subtitle-1 font-weight-bold">
          {{ item.product.title }}
        </v-card-title>
        
        <v-card-subtitle>
          {{ formattedPrice }}
        </v-card-subtitle>
        
        <!-- Controles de cantidad -->
        <div class="d-flex align-center mt-2">
          <v-btn
            variant="text"
            icon
            density="comfortable"
            :disabled="loading || item.quantity <= 1"
            @click="updateQuantity(item.quantity - 1)"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>
          
          <span class="mx-2">{{ item.quantity }}</span>
          
          <v-btn
            variant="text"
            icon
            density="comfortable"
            :disabled="loading || item.quantity >= item.product.stock"
            @click="updateQuantity(item.quantity + 1)"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
          
          <v-btn
            variant="text"
            icon
            color="error"
            :disabled="loading"
            class="ml-auto"
            @click="remove"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </v-card-item>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CartItem } from '~/types/cart'
import { useCart } from '~/composables/services/useCart'
import { useCartStore } from '~/stores/cart'

const props = defineProps<{
  item: CartItem
}>()

const emit = defineEmits(['removed', 'updated'])
const loading = ref(false)
const { updateCartItemQuantity, removeCartItem } = useCart()
const cartStore = useCartStore()

// Obtener la imagen principal o una imagen por defecto
const productImage = computed(() => {
  if (props.item.product.images && props.item.product.images.length > 0) {
    const mainImage = props.item.product.images.find(img => img.main)
    if (mainImage) {
      return mainImage.url
    }
    return props.item.product.images[0].url
  }
  return '/images/placeholder.png'
})

// Formatear el precio
const formattedPrice = computed(() => {
  const formatter = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  })
  return formatter.format(props.item.product.price)
})

// Actualizar la cantidad del producto
async function updateQuantity(newQuantity: number) {
  if (loading.value) return
  
  try {
    loading.value = true
    cartStore.setLoading(true)
    
    // Usamos el productId para actualizar la cantidad
    console.log('Actualizando cantidad del producto con ID:', props.item.productId)
    
    const { data, error } = await updateCartItemQuantity(props.item.productId, newQuantity)
    
    if (!error && data) {
      // Calcular la diferencia para actualizar el contador total
      const diff = newQuantity - props.item.quantity
      if (diff > 0) {
        cartStore.incrementItemCount(diff)
      } else {
        cartStore.decrementItemCount(Math.abs(diff))
      }
      
      emit('updated', data)
    }
  } finally {
    loading.value = false
    cartStore.setLoading(false)
  }
}

// Eliminar el producto del carrito
async function remove() {
  if (loading.value) return
  
  try {
    loading.value = true
    cartStore.setLoading(true)
    
    // Usamos el productId para eliminar el item
    console.log('Eliminando producto con ID:', props.item.productId)
    
    const { error } = await removeCartItem(props.item.productId)
    
    if (!error) {
      cartStore.decrementItemCount(props.item.quantity)
      emit('removed', props.item.id)
    }
  } finally {
    loading.value = false
    cartStore.setLoading(false)
  }
}
</script>