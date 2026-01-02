<template>
  <v-container>
    <ClientOnly>
    <h1 class="text-h4 mb-4">Mi Carrito</h1>

    <v-card v-if="loading" class="pa-4 mb-4">
      <v-progress-linear indeterminate color="primary"/>
      <p class="text-center my-4">Cargando carrito...</p>
    </v-card>

    <template v-else-if="cartStore.hasItems">
      <v-row>
        <!-- Columna 1: Lista de productos agrupados por vendedor -->
        <v-col cols="12" md="8" lg="9">
          <div class="cart-items-list">
            <!-- Agrupado por vendedor si existe itemsByVendor -->
            <template v-if="cartStore.cart?.itemsByVendor && cartStore.cart.itemsByVendor.length > 0">
              <v-card
                v-for="vendorGroup in cartStore.cart.itemsByVendor"
                :key="vendorGroup.vendor.id"
                variant="outlined"
                class="mb-4 vendor-group"
              >
                <v-card-title class="bg-grey-lighten-4 d-flex align-center">
                  <v-icon class="mr-2" color="primary">mdi-store</v-icon>
                  <span>{{ vendorGroup.vendor.name }}</span>
                </v-card-title>

                <v-card-text class="pa-0">
                  <div class="vendor-items">
                    <app-cart-item-card
                      v-for="item in vendorGroup.items"
                      :key="item.id"
                      :item="item"
                      class="vendor-item"
                      @removed="handleItemRemoved"
                      @updated="handleItemUpdated"
                      @refresh-cart="(options) => refreshCart(options)"
                    />
                  </div>
                </v-card-text>

                <v-card-actions class="bg-grey-lighten-5 justify-end px-4 py-3">
                  <span class="text-body-2 mr-2">Subtotal vendedor:</span>
                  <app-currency-display
                    :amount="vendorGroup.subtotal"
                    bold
                  />
                </v-card-actions>
              </v-card>
            </template>

            <!-- Fallback: mostrar items sin agrupar si no existe itemsByVendor -->
            <template v-else>
              <app-cart-item-card
                v-for="item in cartStore.cartItems"
                :key="item.id"
                :item="item"
                class="mb-3"
                @removed="handleItemRemoved"
                @updated="handleItemUpdated"
                @refresh-cart="(options) => refreshCart(options)"
              />
            </template>
          </div>
        </v-col>

        <!-- Columna 2: Resumen del pedido -->
        <v-col cols="12" md="4" lg="3">
          <v-card variant="outlined" class="sticky-summary">
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
  </ClientOnly>
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
.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.vendor-group {
  border-radius: 8px;
  overflow: hidden;
}

.vendor-items {
  display: flex;
  flex-direction: column;
}

.vendor-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.vendor-item:last-child {
  border-bottom: none;
}

.sticky-summary {
  position: sticky;
  top: 80px;
  align-self: flex-start;
}

/* En móvil, el resumen no es sticky */
@media (max-width: 959px) {
  .sticky-summary {
    position: static;
  }
}
</style>