import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderResponse } from '@core/interfaces/orders/order.interface';
import { LucidePrinter, LucideX } from '@lucide/angular';

@Component({
  selector: 'component-orders-receipt',
  standalone: true,
  imports: [CommonModule, LucidePrinter, LucideX],
  templateUrl: './receipt.html',
})
export class ComponentOrdersReceipt {
  @Input() order!: OrderResponse;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  printReceipt() {
    const receiptElement = document.getElementById('receipt-content');
    if (!receiptElement) return;

    // Guardar la ubicación original
    const originalParent = receiptElement.parentNode;
    const originalNextSibling = receiptElement.nextSibling;

    // Mover el recibo directamente al body
    document.body.appendChild(receiptElement);

    // Ocultar todo lo demás en el body
    const siblingsToHide: HTMLElement[] = [];
    Array.from(document.body.children).forEach((child: Element) => {
      const htmlChild = child as HTMLElement;
      if (
        htmlChild !== receiptElement &&
        htmlChild.tagName !== 'SCRIPT' &&
        htmlChild.tagName !== 'STYLE' &&
        htmlChild.id !== 'receipt-print-style'
      ) {
        siblingsToHide.push(htmlChild);
        htmlChild.style.setProperty('display', 'none', 'important');
      }
    });

    // Inyectar estilos específicos de impresión (80mm)
    const style = document.createElement('style');
    style.id = 'receipt-print-style';
    style.innerHTML = `
      @media print {
        @page {
          margin: 0;
          size: 80mm auto;
        }
        body {
          margin: 0;
          background: white;
        }
        #receipt-content {
          padding: 5mm;
          width: 80mm;
          font-size: 12px !important;
        }
        /* Ajustar tamaños para térmica */
        #receipt-content h1 { font-size: 16px !important; }
        #receipt-content p, #receipt-content span, #receipt-content td, #receipt-content th { font-size: 12px !important; }
      }
    `;
    document.head.appendChild(style);

    // Imprimir
    window.print();

    // Restaurar
    document.head.removeChild(style);
    siblingsToHide.forEach((child) => child.style.removeProperty('display'));
    
    if (originalNextSibling) {
      originalParent?.insertBefore(receiptElement, originalNextSibling);
    } else {
      originalParent?.appendChild(receiptElement);
    }
  }

  closeModal() {
    this.close.emit();
  }
}
