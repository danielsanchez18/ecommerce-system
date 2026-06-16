import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ComponentSharedToast } from '@components/shared/toast/toast';
import { PromotionRequest } from '@core/interfaces/promotions/promotion.interface';
import { PromotionService } from '@core/service/promotions/promotion.service';
import { ComponentPromotionsAddInfo } from "@components/promotions/add/info/info";
import { ComponentPromotionsAddProducts } from "@components/promotions/add/products/products";
import { ComponentPromotionsAddPrices } from "@components/promotions/add/prices/prices";
import { ComponentPromotionsAddTerms } from "@components/promotions/add/terms/terms";
import Swal from 'sweetalert2';

@Component({
  selector: 'page-promotions-add',
  imports: [
    CommonModule, 
    RouterModule,
    ComponentSharedToast, 
    ComponentPromotionsAddInfo, 
    ComponentPromotionsAddProducts, 
    ComponentPromotionsAddPrices, 
    ComponentPromotionsAddTerms
  ],
  templateUrl: './add.html',
})
export class PagePromotionsAdd {
  private readonly promotionService = inject(PromotionService);
  private readonly router = inject(Router);

  activeTab: string = 'info';

  promotion: PromotionRequest = {
    name: '',
    type: 'Combo',
    tag: '',
    description: '',
    finalPrice: 0,
    startDate: '',
    endDate: '',
    maxUses: 0,
    enabled: true,
    terms: [],
    products: [],
  };

  selectedProducts: {
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    quantity: number;
  }[] = [];

  get originalPrice(): number {
    return this.selectedProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }

  showValidationError(title: string, message: string): void {
    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Entendido'
    });
  }

  onSave() {
    if (!this.promotion.name.trim()) {
      this.showValidationError('Nombre Obligatorio', 'Debe ingresar el nombre de la promoción.');
      this.activeTab = 'info';
      return;
    }

    if (this.selectedProducts.length === 0) {
      this.showValidationError('Productos Vacíos', 'Debe incluir al menos un producto en la promoción.');
      this.activeTab = 'products';
      return;
    }

    if (this.promotion.finalPrice <= 0) {
      this.showValidationError('Precio Inválido', 'El precio final de la oferta debe ser mayor que cero.');
      this.activeTab = 'prices';
      return;
    }

    if (!this.promotion.startDate || !this.promotion.endDate) {
      this.showValidationError('Fechas Obligatorias', 'Debe ingresar las fechas de inicio y fin.');
      this.activeTab = 'prices';
      return;
    }

    // Use JS Date to parse the datetime-local value correctly
    const start = new Date(this.promotion.startDate);
    const end = new Date(this.promotion.endDate);

    if (end <= start) {
      this.showValidationError('Fecha de Fin Inválida', 'La fecha de fin debe ser posterior a la fecha de inicio.');
      this.activeTab = 'prices';
      return;
    }

    if (this.promotion.maxUses < 0) {
      this.showValidationError('Límite Inválido', 'El número de usos máximos no puede ser negativo.');
      this.activeTab = 'prices';
      return;
    }
    
    // Map selectedProducts to the format expected by the API
    this.promotion.products = this.selectedProducts.map(p => ({
      productId: p.id,
      quantity: p.quantity || 1
    }));
    
    // Ensure dates are correctly converted to local ISO format for the backend using our global patch
    const requestData: PromotionRequest = {
      ...this.promotion,
      startDate: (start as any).toJSON(),
      endDate: (end as any).toJSON()
    };

    // Call API
    this.promotionService.create(requestData).subscribe({
      next: (response) => {
        if (response.success) {
          Swal.fire(
            'Promoción Creada', 
            `La promoción "${this.promotion.name}" se creó correctamente.`, 
            'success'
          ).then(() => {
            this.router.navigate(['/dashboard/promociones']);
          });
        } else {
          Swal.fire('Error', response.message || 'Error al crear la promoción.', 'error');
        }
      },
      error: (err) => {
        const msg = err.error?.message || err.message || 'Error de conexión al crear la promoción.';
        Swal.fire('Error', msg, 'error');
      }
    });
  }
}
