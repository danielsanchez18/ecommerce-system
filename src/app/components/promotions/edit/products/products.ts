import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucidePackageSearch, LucideTrash2 } from '@lucide/angular';
import { FormsModule } from '@angular/forms';
import { ComponentPromotionsAddProduct } from '@components/promotions/add/product/product';

@Component({
  selector: 'component-promotions-edit-products',
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
export class ComponentPromotionsEditProducts {
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
