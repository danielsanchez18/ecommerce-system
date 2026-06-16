export interface ProductRequest {
  name: string;
  description?: string;
  shortDescription?: string;
  basePrice: number;
  imageUrl?: string;
  preparationTime?: number;
  categoryId: string;
  enabled: boolean;
}

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  basePrice: number;
  imageUrl?: string;
  preparationTime?: number;
  categoryId: string;
  enabled: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  discountId?: string;
  inDiscount?: boolean;
  discountType?: string;
  discountAmount?: number;
  finalPrice?: number;
  inPromotion?: boolean;
}

export interface ProductFilters {
  name?: string;
  slug?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
  deleted?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}
