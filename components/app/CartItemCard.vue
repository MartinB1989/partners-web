<template>
  <v-card class="cart-item-card" elevation="2">
    <div class="d-flex flex-column flex-sm-row">
      <!-- Imagen del producto -->
      <div class="cart-item-image-container align-self-center">
        <v-img
          :src="productImage"
          :aspect-ratio="1"
          cover
          class="cart-item-image"
        >
          <template v-if="!hasImage">
            <div class="d-flex align-center justify-center h-100 bg-grey-lighten-3">
              <v-icon size="64" color="grey-lighten-1">mdi-image-off</v-icon>
            </div>
          </template>
        </v-img>
      </div>

      <!-- Contenido del item -->
      <v-card-text class="flex-grow-1 d-flex flex-column justify-space-between pa-4">
        <div>
          <!-- Título del producto -->
          <div class="text-h6 font-weight-medium mb-2">
            {{ item.product.title }}
          </div>

          <!-- Precio unitario y cantidad -->
          <div class="d-flex align-center gap-2 mb-2">
            <div class="text-body-1 font-weight-bold">
              <app-currency-display :amount="item.product.price" />
            </div>
            <v-chip size="small" color="primary" variant="outlined" class="mx-2">
              x{{ item.quantity }}
            </v-chip>
          </div>

          <!-- Subtotal -->
          <div class="d-flex align-center">
            <span class="text-body-2 text-grey-darken-1 me-2">Subtotal:</span>
            <span class="text-h6 font-weight-bold text-primary">
              <app-currency-display :amount="subtotal" />
            </span>
          </div>
        </div>

        <!-- Controles de cantidad y eliminar -->
        <div class="d-flex align-center justify-space-between mt-4">
          <div class="d-flex align-center">
            <v-btn
              variant="outlined"
              density="comfortable"
              icon
              size="small"
              color="primary"
              :disabled="loading || item.quantity <= 1"
              @click.stop="updateQuantity(item.quantity - 1)"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>

            <span class="mx-3 text-body-1 font-weight-medium">{{ item.quantity }}</span>

            <v-btn
              variant="outlined"
              density="comfortable"
              icon
              size="small"
              color="primary"
              :disabled="loading || item.quantity >= item.product.stock"
              @click.stop="updateQuantity(item.quantity + 1)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>

          <v-btn
            variant="text"
            color="error"
            prepend-icon="mdi-delete"
            :disabled="loading"
            @click.stop="remove"
          >
            Eliminar
          </v-btn>
        </div>
      </v-card-text>
    </div>
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
    if (mainImage?.url) {
      return mainImage.url
    }
    return props.item.product.images[0]?.url || 'https://partners-develop-216021.s3.us-east-1.amazonaws.com/imagen-de-no-hay-imagen.png'
  }
  return 'https://partners-develop-216021.s3.us-east-1.amazonaws.com/imagen-de-no-hay-imagen.png'
})

const hasImage = computed(() => {
  return props.item.product.images && props.item.product.images.length > 0
})

// function truncateText(text: string, maxLength: number): string {
//   if (!text) return '';
//   return text.length > maxLength
//     ? text.substring(0, maxLength) + '...'
//     : text;
// }

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
  transition: all 0.2s ease;
  overflow: hidden;
}

.cart-item-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.cart-item-image-container {
  width: 180px;
  min-width: 180px;
  height: 180px;
  flex-shrink: 0;
}

.cart-item-image {
  width: 100%;
  height: 100%;
}

/* Responsive: en móvil la imagen ocupa todo el ancho */
@media (max-width: 599px) {
  .cart-item-image-container {
    width: 100%;
    min-width: 100%;
    height: 200px;
  }
}
</style>