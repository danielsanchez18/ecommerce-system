import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '@core/interfaces/shared/api-response.interface';
import {
  CartItemRequest,
  CartResponse,
} from '@core/interfaces/cart/cart.interface';
import { API_URL } from '@core/utils/api';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${API_URL}/cart`;

  getCart() {
    return this.http.get<ApiResponse<CartResponse>>(`${this.apiUrl}`);
  }

  addItem(request: CartItemRequest) {
    return this.http.post<ApiResponse<CartResponse>>(
      `${this.apiUrl}/items`,
      request,
    );
  }

  updateItem(request: CartItemRequest) {
    return this.http.put<ApiResponse<CartResponse>>(
      `${this.apiUrl}/items`,
      request,
    );
  }

  removeItem(productId: string) {
    return this.http.delete<ApiResponse<CartResponse>>(
      `${this.apiUrl}/items/${productId}`,
    );
  }

  clearCart() {
    return this.http.delete<ApiResponse<CartResponse>>(`${this.apiUrl}`);
  }

  syncCart(items: CartItemRequest[]) {
    return this.http.post<ApiResponse<CartResponse>>(
      `${this.apiUrl}/sync`,
      items,
    );
  }
}
