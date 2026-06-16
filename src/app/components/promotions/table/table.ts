import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentSharedStates } from '@components/shared/states/states';
import { PromotionResponse } from '@core/interfaces/promotions/promotion.interface';
import { LucideBadgePercent, LucideGift, LucideTag } from '@lucide/angular';

@Component({
  selector: 'component-promotions-table',
  imports: [
    RouterLink,
    CommonModule,
    ComponentSharedStates,
    LucideBadgePercent,
    LucideGift,
    LucideTag,
    CurrencyPipe,
  ],
  templateUrl: './table.html',
})
export class ComponentPromotionsTable {
  @Input() promotions: PromotionResponse[] = [];

  getPromotionStatus(promotion: PromotionResponse): string {
    if (promotion.deleted) return 'Oculto';
    if (!promotion.enabled) return 'Oculto';

    const now = new Date();
    const start = new Date(
      promotion.startDate + (promotion.startDate.endsWith('Z') ? '' : 'Z'),
    );
    const end = new Date(
      promotion.endDate + (promotion.endDate.endsWith('Z') ? '' : 'Z'),
    );

    if (promotion.maxUses > 0 && promotion.uses >= promotion.maxUses) {
      return 'Finalizado';
    }

    if (now < start) {
      return 'Próximo';
    }

    if (now > end) {
      return 'Finalizado';
    }

    return 'Activo';
  }
}
