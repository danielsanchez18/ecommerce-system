export type DiscountType = 'descFijo' | 'descPorcentaje';

export interface DiscountRequest {
  productId: string;
  discountType: DiscountType;
  discountAmount: number;
  startDate: string;
  endDate: string;
  maxUses: number;
  enabled: boolean;
}

export interface DiscountResponse {
  id: string;
  productId: string;
  productName: string;
  productImageUrl?: string;
  categoryName?: string;
  originalPrice: number;
  discountType: DiscountType;
  discountAmount: number;
  finalPrice: number;
  startDate: string;
  endDate: string;
  maxUses: number;
  uses: number;
  code: string;
  enabled: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface DiscountFilters {
  productId?: string;
  code?: string;
  enabled?: boolean;
  deleted?: boolean;
  page?: number;
  size?: number;
}
