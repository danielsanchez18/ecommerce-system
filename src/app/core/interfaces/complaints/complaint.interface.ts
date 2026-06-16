export enum ComplaintType {
  RECLAMO = 'RECLAMO',
  QUEJA = 'QUEJA'
}

export interface ComplaintRequest {
  name: string;
  email: string;
  type: ComplaintType;
  message: string;
}

export interface ComplaintResponse {
  id: string;
  name: string;
  email: string;
  type: ComplaintType;
  message: string;
  createdAt: string;
}

export interface ComplaintFilters {
  page?: number;
  size?: number;
  type?: ComplaintType;
}
