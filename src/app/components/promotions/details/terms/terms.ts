import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideBadgeCheck } from '@lucide/angular';

@Component({
  selector: 'component-promotions-details-terms',
  imports: [CommonModule, LucideBadgeCheck],
  templateUrl: './terms.html',
})
export class ComponentPromotionsDetailsTerms {
  @Input() terms: string[] = [];
}
