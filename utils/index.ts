import { OrderStatus } from "~/types/order"

const deliveryTypes = {
  DELIVERY: 'delivery',
  PICKUP: 'pickup'
}

const FriendlyStatus = {
  [OrderStatus.PENDING_PAYMENT]: 'Pendiente de pago',
  [OrderStatus.PENDING]: 'Pendiente',
[OrderStatus.PROCESSING]: 'En proceso',
[OrderStatus.READY_FOR_PICKUP]: 'Listo para retirar',
[OrderStatus.SHIPPED]: 'Enviado',
[OrderStatus.DELIVERED]: 'Entregado',
[OrderStatus.CANCELLED]: 'Cancelado',

}

const getFriendlyStatus = (status: OrderStatus) => FriendlyStatus[status]

export { deliveryTypes, getFriendlyStatus }