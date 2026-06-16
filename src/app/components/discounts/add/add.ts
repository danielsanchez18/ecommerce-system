import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideX } from '@lucide/angular';
import { ProductService } from '@core/service/products/product.service';
import { DiscountService } from '@core/service/discounts/discount.service';
import { ProductResponse } from '@core/interfaces/products/product.interface';
import { DiscountRequest, DiscountType } from '@core/interfaces/discounts/discount.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-discounts-add',
  imports: [CommonModule, FormsModule, LucideX],
  templateUrl: './add.html',
})
export class ComponentDiscountsAdd implements OnInit {
  @Output() addSuccess = new EventEmitter<void>();

  private productService = inject(ProductService);
  private discountService = inject(DiscountService);

  searchText: string = '';
  showSuggestions: boolean = false;
  products: ProductResponse[] = [];
  filteredProducts: ProductResponse[] = [];
  selectedProduct: ProductResponse | null = null;

  discountType: DiscountType = 'descFijo';
  discountAmount: number = 0;
  finalPrice: number = 0;
  startDate: string = '';
  endDate: string = '';
  maxUses: number = 0;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAll({ size: 1000 }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.products = response.data.content;
          this.filteredProducts = [...this.products];
        }
      },
      error: (err) => console.error('Error cargando productos', err)
    });
  }

  filterProducts(): void {
    const query = this.searchText.toLowerCase().trim();
    if (query === '') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(p => p.name.toLowerCase().includes(query));
    }
  }

  selectProduct(product: ProductResponse): void {
    this.selectedProduct = product;
    this.searchText = product.name;
    this.showSuggestions = false;
    this.calculateFinalPrice();
  }

  calculateFinalPrice(): void {
    if (!this.selectedProduct) {
      this.finalPrice = 0;
      return;
    }

    const basePrice = this.selectedProduct.basePrice;
    let computedPrice = basePrice;

    if (this.discountType === 'descFijo') {
      computedPrice = basePrice - this.discountAmount;
    } else if (this.discountType === 'descPorcentaje') {
      const discountVal = (basePrice * this.discountAmount) / 100;
      computedPrice = basePrice - discountVal;
    }

    this.finalPrice = computedPrice > 0 ? computedPrice : 0;
  }

  resetForm(): void {
    this.searchText = '';
    this.showSuggestions = false;
    this.selectedProduct = null;
    this.discountType = 'descFijo';
    this.discountAmount = 0;
    this.finalPrice = 0;
    this.startDate = '';
    this.endDate = '';
    this.maxUses = 0;
    
    this.closeModal('#hs-add-discount-modal');
  }

  onSubmit(): void {
    if (!this.selectedProduct) {
      Swal.fire('Atención', 'Debes seleccionar un producto válido de la lista.', 'warning');
      return;
    }
    
    if (this.discountAmount <= 0) {
      Swal.fire('Atención', 'El monto o porcentaje de descuento debe ser mayor a 0.', 'warning');
      return;
    }

    if (!this.startDate || !this.endDate) {
      Swal.fire('Atención', 'Las fechas de inicio y fin son obligatorias.', 'warning');
      return;
    }
    
    const dStart = new Date(this.startDate);
    const dEnd = new Date(this.endDate);

    if (dStart >= dEnd) {
      Swal.fire('Atención', 'La fecha de fin debe ser posterior a la fecha de inicio.', 'warning');
      return;
    }

    if (this.maxUses < 0) {
      Swal.fire('Atención', 'El número máximo de usos no puede ser negativo.', 'warning');
      return;
    }

    const request: DiscountRequest = {
      productId: this.selectedProduct.id,
      discountType: this.discountType,
      discountAmount: this.discountAmount,
      startDate: dStart.toISOString(),
      endDate: dEnd.toISOString(),
      maxUses: this.maxUses,
      enabled: true
    };

    this.discountService.create(request).subscribe({
      next: (response) => {
        if (response.success) {
          Swal.fire('Éxito', 'Descuento creado correctamente', 'success').then(() => {
            this.resetForm();
            this.addSuccess.emit();
            window.location.reload(); // Quick refresh to update the list, similar to products
          });
        } else {
          Swal.fire('Error', response.message || 'Error al crear el descuento', 'error');
        }
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Ocurrió un error de red';
        Swal.fire('Error', msg, 'error');
      }
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
