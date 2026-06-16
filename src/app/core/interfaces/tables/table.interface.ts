export interface TableRequest {
  tableNumber: number;
  capacity: number;
}

export interface TableResponse {
  id: string;
  tableNumber: number;
  capacity: number;
  status: string; // From TableStatus enum: AVAILABLE, OCCUPIED, MERGED, RESERVED, MAINTENANCE
  mergedWithTableId?: string;
}

export interface TableFilters {
  minCapacity?: number;
  status?: string;
  enabled?: boolean;
  deleted?: boolean;
  page?: number;
  size?: number;
}
