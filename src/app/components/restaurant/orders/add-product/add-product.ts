import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LucidePackageSearch,
  LucideSearch,
  LucidePackageOpen,
  LucideGift,
  LucidePercent,
  LucideTag,
} from '@lucide/angular';
import { ProductService } from '@core/service/products/product.service';
import { PromotionService } from '@core/service/promotions/promotion.service';
import { OrderCartService } from '@core/service/orders/order-cart.service';
import {
  Subject,
  debounceTime,
  switchMap,
  forkJoin,
  of,
  catchError,
} from 'rxjs';

interface CartItemData {
  id: string; // product or promotion id
  name: string;
  image: string;
  price: number;
  type: 'PRODUCT' | 'PROMOTION';
  promoType?: 'Combo' | 'BOGO' | 'Percent';
}

@Component({
  selector: 'component-restaurant-order-add-product',
  imports: [
    LucideSearch,
    LucidePackageSearch,
    LucidePackageOpen,
    LucideGift,
    LucidePercent,
    LucideTag,
    CommonModule,
    FormsModule,
  ],
  templateUrl: './add-product.html',
})
export class ComponentRestaurantOrderAddProduct {
  private productService = inject(ProductService);
  private promotionService = inject(PromotionService);
  private orderCartService = inject(OrderCartService);

  searchTerm: string = '';
  filteredProducts: CartItemData[] = [];
  selectedProducts: CartItemData[] = [];
  removingProductIds: string[] = [];

  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(300),
        switchMap((term) => {
          if (!term.trim()) {
            return of({ products: [], promotions: [] });
          }

          return forkJoin({
            products: this.productService
              .getAll({ name: term, size: 5, enabled: true })
              .pipe(
                catchError(() => of({ success: false, data: { content: [] } })),
              ),
            promotions: this.promotionService
              .getAll({ name: term, size: 5, enabled: true })
              .pipe(
                catchError(() => of({ success: false, data: { content: [] } })),
              ),
          });
        }),
      )
      .subscribe((result: any) => {
        const items: CartItemData[] = [];

        // Mapear productos
        if (result.products.success && result.products.data) {
          result.products.data.content.forEach((p: any) => {
            items.push({
              id: p.id,
              name: p.name,
              image: p.imageUrl || 'https://via.placeholder.com/150',
              price: p.finalPrice || p.basePrice,
              type: 'PRODUCT',
            });
          });
        }

        // Mapear promociones
        if (result.promotions.success && result.promotions.data) {
          result.promotions.data.content.forEach((p: any) => {
            items.push({
              id: p.id,
              name: p.name,
              image: '',
              price: p.finalPrice || p.price,
              type: 'PROMOTION',
              promoType: p.type,
            });
          });
        }

        // Filtrar los que ya están seleccionados
        this.filteredProducts = items.filter(
          (item) =>
            !this.selectedProducts.some((selected) => selected.id === item.id),
        );
      });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  selectProduct(product: CartItemData) {
    this.selectedProducts.push(product);
    this.searchTerm = '';
    this.filteredProducts = [];
    this.searchSubject.next('');
  }

  removeProduct(productId: string) {
    this.removingProductIds.push(productId);

    setTimeout(() => {
      this.selectedProducts = this.selectedProducts.filter(
        (product) => product.id !== productId,
      );
      this.removingProductIds = this.removingProductIds.filter(
        (id) => id !== productId,
      );
    }, 200); // tiempo igual a la duración de tu animación
  }

  addProducts() {
    if (this.selectedProducts.length === 0) return;

    this.selectedProducts.forEach((item) => {
      if (item.type === 'PRODUCT') {
        this.orderCartService.addItem({
          productId: item.id,
          quantity: 1,
        });
      } else {
        this.orderCartService.addItem({
          promotionId: item.id,
          quantity: 1,
        });
      }
    });

    // Limpiar modal
    this.selectedProducts = [];
    this.searchTerm = '';
    this.filteredProducts = [];
  }
}
