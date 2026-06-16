export interface ReviewRequest {
  orderId: string;
  rating: number;
  comment?: string;
}

export interface ReviewResponse {
  id: string;
  orderId: string;
  userId: string;
  userFullName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}
