import { Injectable, inject, signal } from '@angular/core';
import { TableResponse } from '@core/interfaces/tables/table.interface';
import { CartService } from '../cart/cart.service';
import { ProductService } from '../products/product.service';
import {
  CartResponse,
  CartItemRequest,
} from '@core/interfaces/cart/cart.interface';
import { forkJoin, map, of, switchMap, Observable, Subject, concatMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderCartService {
  private readonly cartService = inject(CartService);
  private readonly productService = inject(ProductService);

  // Queue to prevent race conditions on concurrent cart updates
  private cartOperationQueue = new Subject<Observable<CartResponse | null>>();

  // Cart State (from backend)
  cart = signal<CartResponse | null>(null);

  // Local Order State (Frontend only until checkout)
  selectedTables = signal<TableResponse[]>([]);
  orderType = signal<'DINE_IN' | 'PICKUP' | 'DELIVERY'>('PICKUP');
  estimatedTime = signal<number>(20);
  manualDiscount = signal<number>(0);
  couponCode = signal<string>('');
  deliveryAddress = signal<string>('');
  orderStatus = signal<string>('PENDING');

  // Editing State
  isEditing = signal<boolean>(false);
  editingOrderId = signal<string | null>(null);

  constructor() {
    this.cartOperationQueue.pipe(
      concatMap(op => op)
    ).subscribe(enrichedCart => {
      if (enrichedCart) {
        this.cart.set(enrichedCart);
      }
    });

    this.loadCart();
  }

  // --- Cart Operations ---

  private enrichCart(cartData: CartResponse): Observable<CartResponse> {
    if (!cartData.items || cartData.items.length === 0) {
      return of(cartData);
    }

    const itemObservables = cartData.items.map((item) => {
      if (item.product && item.product.id) {
        return this.productService.getById(item.product.id).pipe(
          map((res) => {
            if (res.success && res.data) {
              item.product = res.data;
            }
            return item;
          }),
        );
      }
      return of(item);
    });

    return forkJoin(itemObservables).pipe(
      map((items) => {
        cartData.items = items;
        return cartData;
      }),
    );
  }

  loadCart() {
    const op = this.cartService.getCart().pipe(
      switchMap((res) => {
        if (res.success && res.data) {
          return this.enrichCart(res.data);
        }
        return of(null);
      })
    );
    this.cartOperationQueue.next(op);
  }

  addItem(request: CartItemRequest) {
    const op = this.cartService.addItem(request).pipe(
      switchMap((res) => {
        if (res.success && res.data) {
          return this.enrichCart(res.data);
        }
        return of(null);
      })
    );
    this.cartOperationQueue.next(op);
  }

  updateItemQuantity(request: CartItemRequest) {
    const op = this.cartService.updateItem(request).pipe(
      switchMap((res) => {
        if (res.success && res.data) {
          return this.enrichCart(res.data);
        }
        return of(null);
      })
    );
    this.cartOperationQueue.next(op);
  }

  removeItem(itemId: string) {
    const op = this.cartService.removeItem(itemId).pipe(
      switchMap((res) => {
        if (res.success && res.data) {
          return this.enrichCart(res.data);
        }
        return of(null);
      })
    );
    this.cartOperationQueue.next(op);
  }

  clearCart() {
    const op = this.cartService.clearCart().pipe(
      switchMap((res) => {
        if (res.success && res.data) {
          return this.enrichCart(res.data);
        }
        return of(null);
      })
    );
    this.cartOperationQueue.next(op);
  }

  // --- Local Order Operations ---
  setTables(tables: TableResponse[]) {
    this.selectedTables.set(tables);
    this.orderType.set(tables.length > 0 ? 'DINE_IN' : 'PICKUP');
  }

  clearTables() {
    this.selectedTables.set([]);
    this.orderType.set('PICKUP');
    this.deliveryAddress.set('');
  }

  setEstimatedTime(time: number) {
    this.estimatedTime.set(time);
  }

  setManualDiscount(discount: number) {
    this.manualDiscount.set(discount);
  }

  setCouponCode(code: string) {
    this.couponCode.set(code);
  }

  setDeliveryAddress(address: string) {
    this.deliveryAddress.set(address);
  }
  
  setOrderType(type: 'DINE_IN' | 'PICKUP' | 'DELIVERY') {
    this.orderType.set(type);
  }

  setOrderStatus(status: string) {
    this.orderStatus.set(status);
  }

  // --- Editing Operations ---
  loadOrderForEditing(order: any) {
    this.isEditing.set(true);
    this.editingOrderId.set(order.id);
    
    this.setEstimatedTime(order.preparationTime || 20);
    this.setManualDiscount(order.manualDiscount || 0);
    this.setDeliveryAddress(order.deliveryAddress || '');
    this.setOrderStatus(order.status || 'PENDING');

    // Si tiene mesas (DINE_IN)
    if (order.orderType === 'DINE_IN' && order.tableId) {
      // Idealmente traer la mesa real del TableService, pero por ahora solo el ID
      this.selectedTables.set([{ id: order.tableId, tableNumber: order.tableNumber } as any]);
      this.orderType.set('DINE_IN');
    } else {
      this.orderType.set(order.orderType as any);
      this.selectedTables.set([]);
    }
    
    // Limpiar carrito actual y cargar items del pedido
    this.cartService.clearCart().subscribe(() => {
      this.cart.set(null); // Clear local signal
      if (order.items && order.items.length > 0) {
        order.items.forEach((item: any) => {
          this.addItem({
            productId: item.productId,
            promotionId: item.promotionId,
            quantity: item.quantity
          });
        });
      }
    });
  }

  clearEditingState() {
    this.isEditing.set(false);
    this.editingOrderId.set(null);
  }

  // --- Calculations ---
  getSubtotal(): number {
    const currentCart = this.cart();
    if (!currentCart || !currentCart.items) return 0;

    return currentCart.items.reduce((total, item) => {
      let price = 0;
      if (item.product) {
        price = item.product.finalPrice || item.product.basePrice;
      } else if (item.promotion) {
        price = item.promotion.finalPrice;
      }
      return total + price * item.quantity;
    }, 0);
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const discount = this.manualDiscount();

    // Por ahora el cupón tiene valor 0
    let couponDiscount = 0;

    const total = subtotal - discount - couponDiscount;
    return total > 0 ? total : 0;
  }
}
