<template>
  <div class="add-to-cart">
    <div class="d-flex align-center">
      <v-btn
        variant="text"
        icon
        density="comfortable"
        :disabled="quantity <= 1 || loading"
        @click="decrementQuantity"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      
      <span class="mx-2">{{ quantity }}</span>
      
      <v-btn
        variant="text"
        icon
        density="comfortable"
        :disabled="loading"
        @click="incrementQuantity"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>

    <v-btn
      color="primary"
      variant="elevated"
      :loading="loading"
      :disabled="loading || !isAvailable"
      class="ml-2"
      @click="addToCart"
    >
      <v-icon left class="mr-1">mdi-cart-plus</v-icon>
      {{ buttonText }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCart } from '~/composables/services/useCart'
import { useCartStore } from '~/stores/cart'

const props = defineProps({
  productId: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  buttonText: {
    type: String,
    default: 'Añadir al carrito'
  }
})

const quantity = ref(1)
const loading = ref(false)
const { addItemToCart, getAnonymousCart } = useCart()
const cartStore = useCartStore()

// Incrementar la cantidad
function incrementQuantity() {
  if (props.stock > 0 && quantity.value < props.stock) {
    quantity.value++
  }
}

// Decrementar la cantidad
function decrementQuantity() {
  if (quantity.value > 1) {
    quantity.value--
  }
}

// Añadir al carrito
async function addToCart() {
  if (!props.isAvailable || props.stock <= 0) {
    return
  }
  
  try {
    loading.value = true
    cartStore.setLoading(true)
    
    const { data, error } = await addItemToCart(props.productId, quantity.value)
    
    if (!error && data) {
      // Actualizar el carrito completo después de agregar un producto
      const { data: cartData } = await getAnonymousCart()
      if (cartData) {
        cartStore.setCart(cartData)
      } else {
        // Si no se puede obtener el carrito completo, al menos actualizar el contador
        cartStore.incrementItemCount(quantity.value)
      }
      
      // Reiniciar el contador a 1 después de añadir al carrito
      quantity.value = 1
    }
  } finally {
    loading.value = false
    cartStore.setLoading(false)
  }
}
</script>

<style scoped>
.add-to-cart {
  display: flex;
  align-items: center;
}
</style>