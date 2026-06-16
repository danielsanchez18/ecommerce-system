import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentSharedStates } from '@components/shared/states/states';
import { DiscountResponse } from '@core/interfaces/discounts/discount.interface';
import {
  LucideBadgeCheck,
  LucideBadgeMinus,
  LucideClipboardPenLine,
  LucideEye,
  LucideTag,
} from '@lucide/angular';

@Component({
  selector: 'component-discounts-table',
  imports: [
    RouterLink,
    ComponentSharedStates,
    CurrencyPipe,
    LucideEye,
    LucideClipboardPenLine,
    LucideBadgeCheck,
    LucideBadgeMinus,
    LucideTag,
  ],
  templateUrl: './table.html',
})
export class ComponentDiscountsTable {
  @Input() discounts: DiscountResponse[] = [];

  @Output() viewClick = new EventEmitter<string>();
  @Output() editClick = new EventEmitter<DiscountResponse>();
  @Output() statusChange = new EventEmitter<DiscountResponse>();

  getDiscountStatus(discount: DiscountResponse): string {
    if (discount.deleted) return 'Eliminado';
    if (!discount.enabled) return 'Oculto';

    const now = new Date();
    const start = new Date(
      discount.startDate + (discount.startDate.endsWith('Z') ? '' : 'Z'),
    );
    const end = new Date(
      discount.endDate + (discount.endDate.endsWith('Z') ? '' : 'Z'),
    );

    if (discount.maxUses > 0 && discount.uses >= discount.maxUses) {
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
