import { Component } from '@angular/core';
import { ComponentProductsList } from '@components/products/list/list';
import { ComponentProductsAdd } from '@components/products/add/add';
import { ComponentProductsEdit } from '@components/products/edit/edit';

import { ProductResponse } from '@core/interfaces/products/product.interface';

@Component({
  selector: 'page-products-overview',
  imports: [ComponentProductsList, ComponentProductsAdd, ComponentProductsEdit],
  templateUrl: './overview.html',
})
export class PageProductsOverview {
  selectedProduct: ProductResponse | null = null;

  onEditProduct(product: ProductResponse): void {
    this.selectedProduct = product;
  }
}
