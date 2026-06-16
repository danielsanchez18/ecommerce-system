import { ProductResponse } from '../products/product.interface';
import { PromotionResponse } from '../promotions/promotion.interface';

export interface CartItemRequest {
  productId?: string;
  promotionId?: string;
  quantity: number;
}

export interface CartItemResponse {
  id: string;
  product?: ProductResponse;
  promotion?: PromotionResponse;
  quantity: number;
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItemResponse[];
}
