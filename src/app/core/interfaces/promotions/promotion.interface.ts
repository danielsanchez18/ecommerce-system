export type PromotionType = 'Combo' | 'BOGO' | 'Percent';

export interface PromotionProductRequest {
  productId: string;
  quantity: number;
}

export interface PromotionRequest {
  name: string;
  type: PromotionType;
  tag?: string;
  description?: string;
  finalPrice: number;
  startDate: string;
  endDate: string;
  maxUses: number;
  enabled: boolean;
  terms?: string[];
  products: PromotionProductRequest[];
}

export interface PromotionProductResponse {
  id: string;
  productId: string;
  productName: string;
  productDescription?: string;
  originalPrice: number;
  productImageUrl?: string;
  quantity: number;
}

export interface PromotionResponse {
  id: string;
  name: string;
  type: PromotionType;
  tag?: string;
  description?: string;
  originalPrice: number;
  finalPrice: number;
  startDate: string;
  endDate: string;
  maxUses: number;
  uses: number;
  code: string;
  enabled: boolean;
  deleted: boolean;
  terms: string[];
  products: PromotionProductResponse[];
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy?: string;
}

export interface PromotionFilters {
  name?: string;
  code?: string;
  enabled?: boolean;
  deleted?: boolean;
  page?: number;
  size?: number;
}
