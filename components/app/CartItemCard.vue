<template>
  <v-card class="cart-item-card" elevation="2" height="380">
    <v-img
      :src="productImage"
      height="200"
      contain
      :class="hasImage ? 'align-end' : ''"
      gradient="to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6)"
    >
      <v-card-title v-if="!hasImage" class="text-white">
        {{ truncateText(item.product.title, 35) }}
      </v-card-title>
    </v-img>
    
    <v-card-text class="d-flex flex-column justify-space-between" style="height: 180px;">
      <div>
        <div v-if="hasImage" class="text-subtitle-1 font-weight-medium mb-1 title-truncate">
          {{ truncateText(item.product.title, 35) }}
        </div>
        <div class="d-flex align-center mt-2">
          <span class="text-caption text-grey me-1">Subtotal:</span>
          <span class="font-weight-medium primary--text">
            <app-currency-display :amount="subtotal" />
          </span>
        </div>
      </div>
      
      <div class="d-flex flex-column">
        <div class="d-flex justify-space-between align-center mb-2">
          <div class="text-h6 primary--text font-weight-bold">
            <app-currency-display :amount="item.product.price" />
          </div>
          <v-chip size="small" color="primary" variant="outlined">
            x{{ item.quantity }}
          </v-chip>
        </div>
        
        <div class="d-flex align-center justify-space-between">
          <div>
            <v-btn
              variant="text"
              density="comfortable"
              icon
              color="primary"
              :disabled="loading || item.quantity <= 1"
              @click.stop="updateQuantity(item.quantity - 1)"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            
            <v-btn
              variant="text"
              density="comfortable"
              icon
              color="primary"
              :disabled="loading || item.quantity >= item.product.stock"
              @click.stop="updateQuantity(item.quantity + 1)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
          
          <v-btn
            variant="outlined"
            size="small"
            color="error"
            icon
            :disabled="loading"
            @click.stop="remove"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CartItem } from '~/types/cart'
import { useCart } from '~/composables/services/useCart'
import { useCartStore } from '~/stores/cart'
import AppCurrencyDisplay from '~/components/app/CurrencyDisplay.vue'

const props = defineProps<{
  item: CartItem
}>()

const emit = defineEmits(['removed', 'updated', 'refresh-cart'])
const loading = ref(false)
const { updateCartItemQuantity, removeCartItem } = useCart()
const cartStore = useCartStore()

// Calcular el subtotal (precio × cantidad)
const subtotal = computed(() => {
  return props.item.product.price * props.item.quantity
})

// Obtener la imagen principal o una imagen por defecto
const productImage = computed(() => {
  if (props.item.product.images && props.item.product.images.length > 0) {
    const mainImage = props.item.product.images.find(img => img.main)
    if (mainImage) {
      return mainImage.url
    }
    return props.item.product.images[0].url
  }
  return 'https://partners-develop-216021.s3.us-east-1.amazonaws.com/imagen-de-no-hay-imagen.png'
})

const hasImage = computed(() => {
  return props.item.product.images && props.item.product.images.length > 0
})

function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...' 
    : text;
}

// Actualizar la cantidad del producto
async function updateQuantity(newQuantity: number) {
  if (loading.value) return
  
  try {
    loading.value = true
    
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
      // Emitir evento para solicitar actualización silenciosa del carrito
      emit('refresh-cart', { silent: true })
    }
  } finally {
    loading.value = false
  }
}

// Eliminar el producto del carrito
async function remove() {
  if (loading.value) return
  
  try {
    loading.value = true
    
    const { error } = await removeCartItem(props.item.productId)
    
    if (!error) {
      // Informamos que se eliminó este ítem
      emit('removed', props.item.id)
      
      // Solicitamos una actualización silenciosa del carrito desde el backend
      emit('refresh-cart', { silent: true })
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.cart-item-card {
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.cart-item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
}

.title-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  word-break: break-word;
}

.description-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>