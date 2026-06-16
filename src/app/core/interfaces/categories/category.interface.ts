export interface CategoryRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  enabled: boolean;
}

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  enabled: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CategoryFilters {
  name?: string;
  startDate?: string;
  endDate?: string;
  enabled?: boolean;
  deleted?: boolean;
  page?: number;
  size?: number;
  sort?: string;
}
