import { useApi } from "~/composables/useApi";
import type { Order } from "~/types/order";
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

  return { createOrder };
};

export default useOrder;
