import { Component } from '@angular/core';
import { ComponentDiscountsAdd } from '@components/discounts/add/add';
import { ComponentDiscountsEdit } from '@components/discounts/edit/edit';
import { ComponentDiscountsList } from '@components/discounts/list/list';
import { DiscountResponse } from '@core/interfaces/discounts/discount.interface';

@Component({
  selector: 'page-discounts-overview',
  imports: [
    ComponentDiscountsList,
    ComponentDiscountsAdd,
    ComponentDiscountsEdit,
  ],
  templateUrl: './overview.html',
})
export class PageDiscountsOverview {
  selectedDiscount: DiscountResponse | null = null;

  onEditDiscount(discount: DiscountResponse): void {
    this.selectedDiscount = discount;
  }
}
