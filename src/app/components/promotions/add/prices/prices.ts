import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PromotionRequest } from '@core/interfaces/promotions/promotion.interface';

@Component({
  selector: 'component-promotions-add-prices',
  imports: [CommonModule, FormsModule],
  templateUrl: './prices.html',
})
export class ComponentPromotionsAddPrices {
  @Input() promotion!: PromotionRequest;
  @Input() originalPrice: number = 0;
}
