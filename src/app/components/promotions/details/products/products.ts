import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PromotionProductResponse } from '@core/interfaces/promotions/promotion.interface';

@Component({
  selector: 'component-promotions-details-products',
  imports: [CommonModule, RouterLink],
  templateUrl: './products.html',
})
export class ComponentPromotionsDetailsProducts {
  @Input() products: PromotionProductResponse[] = [];
}
