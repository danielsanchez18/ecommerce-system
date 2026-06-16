import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PromotionRequest } from '@core/interfaces/promotions/promotion.interface';

@Component({
  selector: 'component-promotions-edit-prices',
  imports: [CommonModule, FormsModule],
  templateUrl: './prices.html',
})
export class ComponentPromotionsEditPrices {
  @Input() promotion!: PromotionRequest;
  @Input() originalPrice: number = 0;
  @Input() currentUses: number = 0;
}
