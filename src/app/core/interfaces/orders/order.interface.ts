export interface OrderItemRequest {
  productId?: string;
  promotionId?: string;
  discountId?: string;
  quantity: number;
}

export interface OrderRequest {
  userId?: string;
  tableId?: string;
  registeredBy?: string;
  attendedBy?: string;
  orderType: string; // DINE_IN, PICKUP, DELIVERY
  paymentMethod?: string;
  preparationTime?: number;
  manualDiscount?: number;
  deliveryAddress?: string;
  items: OrderItemRequest[];
}

export interface OrderItemPromotionProductResponse {
  productId: string;
  productName: string;
  productImageUrl?: string;
  productEnabled: boolean;
  quantity: number;
  basePrice: number;
}

export interface OrderItemResponse {
  id: string;
  productId?: string;
  productName?: string;
  productImageUrl?: string;
  productEnabled?: boolean;
  promotionId?: string;
  promotionName?: string;
  discountId?: string;
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
  subtotal: number;
  promotionProducts?: OrderItemPromotionProductResponse[];
}

export interface OrderResponse {
  id: string;
  orderCode: string;
  userId?: string;
  tableId?: string;
  tableNumber?: number;
  orderType: string;
  paymentMethod?: string;
  status: string; // OrderStatus enum
  preparationTime?: number;
  subtotal: number;
  deliveryFee: number;
  manualDiscount: number;
  totalAmount: number;
  registeredBy?: string;
  attendedBy?: string;
  deliveryDriverId?: string;
  deliveryAddress?: string;
  items: OrderItemResponse[];
  createdAt: string;
}

export interface OrderHistoryResponse {
  id: string;
  orderId: string;
  action: string;
  previousStatus?: string;
  newStatus?: string;
  notes?: string;
  performedById?: string;
  performedByName: string;
  createdAt: string;
}

export interface OrderFilters {
  orderCode?: string;
  userId?: string;
  tableId?: string;
  status?: string;
  orderType?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  deleted?: boolean;
  page?: number;
  size?: number;
}
