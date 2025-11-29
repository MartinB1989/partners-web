import { defineStore } from 'pinia'
import type { Cart } from '~/types/cart'

interface CartState {
  cart: Cart | null
  itemCount: number
  loading: boolean
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    cart: null,
    itemCount: 0,
    loading: false
  }),

  getters: {
    hasItems: (state) => state.itemCount > 0,
    totalItems: (state) => state.itemCount,
    cartItems: (state) => state.cart?.items || []
  },

  actions: {
    setCart(cart: Cart | null) {
      this.cart = cart
      this.itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0
    },
    
    setLoading(loading: boolean) {
      this.loading = loading
    },
    
    // Incrementa el contador de items sin tener que cargar todo el carrito nuevamente
    incrementItemCount(quantity: number = 1) {
      this.itemCount += quantity
    },
    
    // Decrementa el contador de items sin tener que cargar todo el carrito nuevamente
    decrementItemCount(quantity: number = 1) {
      this.itemCount = Math.max(0, this.itemCount - quantity)
    },
    
    // Actualiza completamente el contador de items
    updateItemCount() {
      if (this.cart) {
        this.itemCount = this.cart.items.reduce((total, item) => total + item.quantity, 0)
      } else {
        this.itemCount = 0
      }
    },
    
    reset() {
      this.cart = null
      this.itemCount = 0
      this.loading = false
    },

    // Establece el precio de envío en el carrito
    setDeliveryPrice(price: number) {
      if (this.cart) {
        this.cart.deliveryPrice = price
      }
    }
  }
})