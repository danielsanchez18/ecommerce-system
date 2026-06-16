import { Component, Input } from '@angular/core';
import { ComponentPromotionsAddProduct } from '../product/product';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucidePackageSearch, LucideTrash2 } from '@lucide/angular';

@Component({
  selector: 'component-promotions-add-products',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    LucidePackageSearch,
    LucideTrash2,
    ComponentPromotionsAddProduct,
  ],
  templateUrl: './products.html',
})
export class ComponentPromotionsAddProducts {
  @Input() selectedProducts: any[] = [];
  removingProductIds: string[] = [];

  getExistingProductIds(): string[] {
    return this.selectedProducts.map((p) => p.id);
  }

  onProductsAdded(newProducts: any[]) {
    newProducts.forEach((np) => {
      this.selectedProducts.push({
        ...np,
        quantity: 1,
      });
    });
  }

  removeProduct(productId: string) {
    this.removingProductIds.push(productId);

    setTimeout(() => {
      const index = this.selectedProducts.findIndex((p) => p.id === productId);
      if (index !== -1) {
        this.selectedProducts.splice(index, 1);
      }
      this.removingProductIds = this.removingProductIds.filter(
        (id) => id !== productId,
      );
    }, 200); // tiempo igual a la duración de tu animación
  }
}
