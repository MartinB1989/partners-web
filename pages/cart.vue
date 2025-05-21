<template>
  <v-container>
    <h1 class="text-h4 mb-4">Mi Carrito</h1>

    <v-card v-if="loading" class="pa-4 mb-4">
      <v-progress-linear indeterminate color="primary"/>
      <p class="text-center my-4">Cargando carrito...</p>
    </v-card>

    <template v-else-if="cartStore.hasItems">
      <div>
        <!-- Productos en formato de cuadrícula -->
        <v-row>
          <v-col
            v-for="item in cartStore.cartItems"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <app-cart-item-card
              :item="item"
              @removed="handleItemRemoved"
              @updated="handleItemUpdated"
              @refresh-cart="(options) => refreshCart(options)"
            />
          </v-col>
        </v-row>

        <!-- Resumen del carrito -->
        <v-row>
          <v-col cols="12" md="8" lg="9">
            <!-- Espacio para contenido adicional si se necesita -->
          </v-col>
          <v-col cols="12" md="4" lg="3">
            <v-card variant="outlined">
              <v-card-item>
                <v-card-title>Resumen del pedido</v-card-title>
                
                <div class="d-flex justify-space-between mt-2">
                  <span>Total ({{ cartStore.totalItems }} productos)</span>
                  <app-currency-display 
                    v-if="cartStore.cart?.total" 
                    :amount="cartStore.cart.total" 
                    bold
                  />
                  <span v-else class="font-weight-bold">$0</span>
                </div>
                
                <v-divider class="my-4"/>
                
                <div class="d-flex justify-space-between mt-2">
                  <span class="text-h6">Total a pagar</span>
                  <app-currency-display 
                    v-if="cartStore.cart?.total" 
                    :amount="cartStore.cart.total" 
                    bold 
                    color="primary"
                    class="text-h6"
                  />
                  <span v-else class="text-h6 font-weight-bold">$0</span>
                </div>
                
                <v-btn
                  color="primary"
                  variant="elevated"
                  block
                  size="large"
                  class="mt-4"
                  :loading="loading"
                  to="/checkout"
                >
                  Proceder al pago
                </v-btn>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </template>

    <!-- Carrito vacío -->
    <v-card v-else class="pa-4 text-center">
      <v-icon
        size="64"
        color="grey"
        class="mb-4"
      >
        mdi-cart-outline
      </v-icon>
      <h2 class="text-h5 mb-2">Tu carrito está vacío</h2>
      <p class="text-body-1 mb-4">Añade productos para comenzar tu compra</p>
      <v-btn
        color="primary"
        to="/"
      >
        Ir a la tienda
      </v-btn>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import { useCart } from '~/composables/services/useCart'
import type { CartItem, Cart } from '~/types/cart'
import AppCurrencyDisplay from '~/components/app/CurrencyDisplay.vue'

const cartStore = useCartStore()
const { getAnonymousCart } = useCart()
const loading = ref(false)

// Cargar el carrito solo si aún no ha sido cargado por el plugin
onMounted(async () => {
  // Verificamos si el carrito ya ha sido cargado por el plugin
  if (!cartStore.cart) {
    await refreshCart()
  }
})

// Actualizar el carrito
async function refreshCart(options = { silent: false }) {
  try {
    // Si la actualización es silenciosa, no activamos el indicador de carga
    if (!options.silent) {
      loading.value = true
    }
    
    const { data, error } = await getAnonymousCart()
    
    if (!error && data) {
      // Actualizar el carrito completo, incluyendo totales y cantidades
      cartStore.setCart(data)
      
      // Asegurar que el contador de items esté actualizado
      cartStore.updateItemCount()
    }
  } finally {
    if (!options.silent) {
      loading.value = false
    }
  }
}

// Manejar la eliminación de un item
function handleItemRemoved(itemId: string) {
  if (!cartStore.cart) return
  
  // Filtrar el item eliminado del carrito local
  const updatedCart = { 
    ...cartStore.cart,
    items: cartStore.cartItems.filter(item => item.id !== itemId)
  } as Cart
  
  cartStore.setCart(updatedCart)
}

// Manejar la actualización de un item
function handleItemUpdated(updatedItem: CartItem) {
  if (!cartStore.cart) return
  
  // Actualizar el item específico en el carrito local
  const updatedCart = { 
    ...cartStore.cart,
    items: cartStore.cartItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    )
  } as Cart
  
  cartStore.setCart(updatedCart)
}
</script>

<style scoped>
.v-col {
  transition: all 0.3s ease;
}
</style>