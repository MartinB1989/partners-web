import { useApi } from "~/composables/useApi";
import type { OrderStatus, Order, OrderSummary } from "~/types/order";

import type { ListResponse } from "~/types/api-response";
import { useCartStore } from "~/stores/cart";
import { useCart } from "~/composables/services/useCart";

const useOrder = () => {
  const api = useApi();
  const cartStore = useCartStore();
  const { getAnonymousCart } = useCart();

  const createOrder = async (order: Order) => {
    const { data, error } = await api.request('POST', '/orders', order, {
      credentials: 'include', // Importante para enviar y recibir cookies
    });

    // Si la orden se creó correctamente, vaciar el carrito
    if (data && !error) {
      // Obtenemos el carrito actualizado desde el servidor (que debería estar vacío)
      const { data: cartData } = await getAnonymousCart();
      // Actualizamos el store de Pinia con el carrito vacío
      cartStore.setCart(cartData || null);
    }

    return { data, error };
  };

  const getOrders = async (page = 1, limit = 10) => {
    return await api.request<ListResponse<OrderSummary>>('GET', `/orders?page=${page}&limit=${limit}`);
  };

  const getOrderById = async (orderId: number) => {
    return await api.request<Order>('GET', `/orders/${orderId}`);
  };

  const updateOrderStatus = async (orderId: number, status: OrderStatus) => {
    const { data, error } = await api.request<{ status: OrderStatus }>('PATCH', `/orders/${orderId}/status`, {status})
    return { data, error}
  }

  return { createOrder, getOrders, getOrderById, updateOrderStatus };
};

export default useOrder;
