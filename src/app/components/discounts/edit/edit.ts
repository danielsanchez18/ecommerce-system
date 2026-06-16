import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideX } from '@lucide/angular';
import { DiscountService } from '@core/service/discounts/discount.service';
import {
  DiscountResponse,
  DiscountRequest,
  DiscountType,
} from '@core/interfaces/discounts/discount.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-discounts-edit',
  imports: [CommonModule, FormsModule, LucideX],
  templateUrl: './edit.html',
})
export class ComponentDiscountsEdit implements OnChanges {
  @Input() discount: DiscountResponse | null = null;
  @Output() editSuccess = new EventEmitter<void>();
  private discountService = inject(DiscountService);
  code: string = '';
  productName: string = '';
  productPrice: number = 0;

  discountType: DiscountType = 'descFijo';
  discountAmount: number = 0;
  finalPrice: number = 0;
  startDate: string = '';
  endDate: string = '';
  maxUses: number = 0;
  enabled: boolean = true;
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['discount'] && this.discount) {
      this.code = this.discount.code;
      this.productName = this.discount.productName;
      this.productPrice = this.discount.originalPrice;

      this.discountType = this.discount.discountType;
      this.discountAmount = this.discount.discountAmount;

      // format dates from backend (ISO format) to local datetime format YYYY-MM-DDThh:mm
      if (this.discount.startDate) {
        this.startDate = this.formatDateForInput(this.discount.startDate);
      }
      if (this.discount.endDate) {
        this.endDate = this.formatDateForInput(this.discount.endDate);
      }

      this.maxUses = this.discount.maxUses;
      this.enabled = this.discount.enabled;
      this.calculateFinalPrice();
    }
  }
  // Convert ISO string to format required by <input type="datetime-local">
  private formatDateForInput(dateString: string): string {
    const d = new Date(
      dateString.endsWith('Z') ? dateString : dateString + 'Z',
    );
    const pad = (n: number) => (n < 10 ? '0' + n : n.toString());
    // Use local time for datetime-local
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  calculateFinalPrice(): void {
    if (!this.productPrice) {
      this.finalPrice = 0;
      return;
    }
    const basePrice = this.productPrice;
    let computedPrice = basePrice;
    if (this.discountType === 'descFijo') {
      computedPrice = basePrice - this.discountAmount;
    } else if (this.discountType === 'descPorcentaje') {
      const discountVal = (basePrice * this.discountAmount) / 100;
      computedPrice = basePrice - discountVal;
    }
    this.finalPrice = computedPrice > 0 ? computedPrice : 0;
  }
  onSubmit(): void {
    if (!this.discount) return;
    if (this.discountAmount <= 0) {
      Swal.fire(
        'Atención',
        'El monto o porcentaje de descuento debe ser mayor a 0.',
        'warning',
      );
      return;
    }
    if (!this.endDate) {
      Swal.fire('Atención', 'La fecha de fin es obligatoria.', 'warning');
      return;
    }

    // We only update endDate, maxUses, discountType, discountAmount, enabled
    // Since startDate is disabled in HTML, we will send its original value to avoid issues
    const dStart = new Date(
      this.discount.startDate.endsWith('Z')
        ? this.discount.startDate
        : this.discount.startDate + 'Z',
    );
    const dEnd = new Date(this.endDate);
    if (dStart >= dEnd) {
      Swal.fire(
        'Atención',
        'La fecha de fin debe ser posterior a la fecha de inicio.',
        'warning',
      );
      return;
    }
    if (this.maxUses < 0) {
      Swal.fire(
        'Atención',
        'El número máximo de usos no puede ser negativo.',
        'warning',
      );
      return;
    }
    const request: DiscountRequest = {
      productId: this.discount.productId,
      discountType: this.discountType,
      discountAmount: this.discountAmount,
      startDate: dStart.toISOString(),
      endDate: dEnd.toISOString(),
      maxUses: this.maxUses,
      enabled: this.enabled,
    };
    this.discountService.update(this.discount.id, request).subscribe({
      next: (response) => {
        if (response.success) {
          Swal.fire(
            'Éxito',
            'Descuento actualizado correctamente',
            'success',
          ).then(() => {
            this.editSuccess.emit();
            this.closeModal('#hs-edit-discount-modal');
            window.location.reload(); // Quick refresh to update list
          });
        } else {
          Swal.fire(
            'Error',
            response.message || 'Error al actualizar el descuento',
            'error',
          );
        }
      },
      error: (err) => {
        const msg =
          err.error?.message || err.message || 'Ocurrió un error de red';
        Swal.fire('Error', msg, 'error');
      },
    });
  }
  private closeModal(selector: string): void {
    const overlay = document.querySelector(selector);
    if (overlay) {
      const { HSOverlay } = window as any;
      if (HSOverlay) {
        HSOverlay.close(overlay);
      } else {
        overlay.classList.add('hidden');
        overlay.classList.remove('open');
      }
    }
  }
}
