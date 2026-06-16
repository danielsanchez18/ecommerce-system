import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BillingService } from '@core/service/billing/billing.service';
import { InvoiceRequest } from '@core/interfaces/billing/billing.interface';
import { LucideX } from '@lucide/angular';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-billing-issue-modal',
  imports: [CommonModule, FormsModule, LucideX],
  templateUrl: './issue-modal.html',
})
export class ComponentBillingIssueModal {
  @Input() isOpen = false;
  @Input() orderId: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() generated = new EventEmitter<void>();

  request: InvoiceRequest = {
    type: 'BOLETA',
    customerDocumentType: 'DNI',
    customerDocumentNumber: '',
    customerName: '',
    customerAddress: ''
  };

  isSubmitting = false;

  constructor(private billingService: BillingService) {}

  onClose() {
    this.close.emit();
    this.resetForm();
  }

  onTypeChange() {
    if (this.request.type === 'FACTURA') {
      this.request.customerDocumentType = 'RUC';
    } else {
      this.request.customerDocumentType = 'DNI';
    }
  }

  onSubmit() {
    if (!this.orderId) return;
    
    if (!this.request.customerName) {
      Swal.fire('Error', 'Debe ingresar el nombre o razón social', 'warning');
      return;
    }
    if (this.request.type === 'FACTURA' && (!this.request.customerDocumentNumber || this.request.customerDocumentNumber.length !== 11)) {
      Swal.fire('Error', 'Una factura requiere un RUC válido de 11 dígitos', 'warning');
      return;
    }

    this.isSubmitting = true;

    this.billingService.generateInvoice(this.orderId, this.request).subscribe({
      next: (res) => {
        Swal.fire('Éxito', res.message, 'success');
        this.isSubmitting = false;
        this.generated.emit();
        this.onClose();
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Hubo un error al generar el comprobante', 'error');
        this.isSubmitting = false;
      }
    });
  }

  resetForm() {
    this.request = {
      type: 'BOLETA',
      customerDocumentType: 'DNI',
      customerDocumentNumber: '',
      customerName: '',
      customerAddress: ''
    };
  }
}
