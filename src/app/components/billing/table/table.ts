import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { InvoiceResponse } from '@core/interfaces/billing/billing.interface';
import { ComponentSharedStates } from '@components/shared/states/states';

@Component({
  selector: 'component-billing-table',
  imports: [CommonModule, ComponentSharedStates, CurrencyPipe, DatePipe],
  templateUrl: './table.html',
})
export class ComponentBillingTable {
  @Input() invoices: InvoiceResponse[] = [];
  
  @Output() viewClick = new EventEmitter<InvoiceResponse>();

  onView(invoice: InvoiceResponse) {
    this.viewClick.emit(invoice);
  }

  mapStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      ISSUED: 'Emitido',
      CANCELLED: 'Cancelado',
      REJECTED: 'Rechazado'
    };
    return statusMap[status] || status;
  }
}
