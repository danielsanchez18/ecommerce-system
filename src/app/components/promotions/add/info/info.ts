import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PromotionRequest } from '@core/interfaces/promotions/promotion.interface';

@Component({
  selector: 'component-promotions-add-info',
  imports: [CommonModule, FormsModule],
  templateUrl: './info.html',
})
export class ComponentPromotionsAddInfo {
  @Input() promotion!: PromotionRequest;
}
