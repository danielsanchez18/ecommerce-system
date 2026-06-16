import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucidePackageSearch, LucideSearch } from '@lucide/angular';
import { ProductService } from '@core/service/products/product.service';

@Component({
  selector: 'component-promotions-add-product',
  imports: [CommonModule, FormsModule, LucideSearch, LucidePackageSearch],
  templateUrl: './product.html',
})
export class ComponentPromotionsAddProduct {
  private readonly productService = inject(ProductService);

  @Input() existingProductIds: string[] = [];
  @Output() productsAdded = new EventEmitter<any[]>();

  searchTerm: string = '';
  filteredProducts: any[] = [];
  selectedProducts: any[] = [];
  removingProductIds: string[] = [];

  onSearchChange() {
    if (this.searchTerm.trim() === '') {
      this.filteredProducts = [];
      return;
    }

    this.productService
      .getAll({ name: this.searchTerm, size: 5, enabled: true, deleted: false })
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.filteredProducts = response.data.content
              .map((product) => ({
                id: product.id,
                name: product.name,
                price: product.basePrice,
                image: product.imageUrl || '',
                description:
                  product.description || product.shortDescription || '',
              }))
              .filter(
                (p) =>
                  !this.selectedProducts.some((sp) => sp.id === p.id) &&
                  !this.existingProductIds.includes(p.id),
              );
          }
        },
        error: (err) => {
          console.error('Error al buscar productos:', err);
        },
      });
  }

  selectProduct(product: any) {
    this.selectedProducts.push(product);
    this.searchTerm = '';
    this.filteredProducts = [];
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

    this.productsAdded.emit(this.selectedProducts);
    this.selectedProducts = [];
    this.searchTerm = '';
    this.filteredProducts = [];
  }
}
