import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ComponentPromotionsEditInfo } from '@components/promotions/edit/info/info';
import { ComponentPromotionsEditPrices } from '@components/promotions/edit/prices/prices';
import { ComponentPromotionsEditProducts } from '@components/promotions/edit/products/products';
import { ComponentPromotionsEditTerms } from '@components/promotions/edit/terms/terms';
import { ComponentSharedToast } from '@components/shared/toast/toast';
import { PromotionRequest } from '@core/interfaces/promotions/promotion.interface';
import { PromotionService } from '@core/service/promotions/promotion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'page-promotions-edit',
  imports: [
    RouterLink,
    CommonModule,
    FormsModule,
    ComponentPromotionsEditInfo,
    ComponentPromotionsEditProducts,
    ComponentPromotionsEditPrices,
    ComponentPromotionsEditTerms,
    ComponentSharedToast,
  ],
  templateUrl: './edit.html',
})
export class PagePromotionsEdit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly promotionService = inject(PromotionService);

  activeTab: string = 'info';
  promotionId: string | null = null;
  promotionCode: string = '';
  currentUses: number = 0;
  promotionLoaded: boolean = false;

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

  ngOnInit(): void {
    this.promotionId = this.route.snapshot.paramMap.get('id');
    if (this.promotionId) {
      this.loadPromotionDetails(this.promotionId);
    }
  }

  loadPromotionDetails(id: string): void {
    this.promotionService.getById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const data = response.data;
          this.promotionCode = data.code;
          this.currentUses = data.uses;

          this.promotion = {
            name: data.name,
            type: data.type,
            tag: data.tag || '',
            description: data.description || '',
            finalPrice: data.finalPrice,
            startDate: this.formatDateForInput(data.startDate),
            endDate: this.formatDateForInput(data.endDate),
            maxUses: data.maxUses,
            enabled: data.enabled,
            terms: [...(data.terms || [])],
            products: [],
          };

          this.selectedProducts = (data.products || []).map((p) => ({
            id: p.productId,
            name: p.productName,
            price: p.originalPrice,
            image: p.productImageUrl || '',
            description: p.productDescription || '',
            quantity: p.quantity,
          }));

          this.promotionLoaded = true;
        }
      },
      error: (err) => {
        console.error('Error al cargar promoción:', err);
      },
    });
  }

  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr + (dateStr.endsWith('Z') ? '' : 'Z'));
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  }

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
      this.showValidationError(
        'Nombre Obligatorio',
        'Debe ingresar el nombre de la promoción.',
      );
      return;
    }

    if (this.selectedProducts.length === 0) {
      this.showValidationError(
        'Productos Vacíos',
        'Debe incluir al menos un producto en la promoción.',
      );
      return;
    }

    if (this.promotion.finalPrice <= 0) {
      this.showValidationError(
        'Precio Inválido',
        'El precio de la oferta debe ser mayor que cero.',
      );
      return;
    }

    if (!this.promotion.startDate || !this.promotion.endDate) {
      this.showValidationError(
        'Fechas Obligatorias',
        'Debe ingresar las fechas de inicio y fin.',
      );
      return;
    }

    const start = new Date(this.promotion.startDate);
    const end = new Date(this.promotion.endDate);
    const now = new Date();

    if (end <= now) {
      this.showValidationError(
        'Fecha de Fin Inválida',
        'La fecha de fin debe ser posterior a la fecha y hora actual.',
      );
      return;
    }

    if (end <= start) {
      this.showValidationError(
        'Fecha de Fin Inválida',
        'La fecha de fin debe ser posterior a la fecha de inicio.',
      );
      return;
    }

    if (this.promotion.maxUses < 0) {
      this.showValidationError(
        'Límite Inválido',
        'El número de usos máximos no puede ser negativo.',
      );
      return;
    }

    if (
      this.promotion.maxUses !== 0 &&
      this.promotion.maxUses < this.currentUses
    ) {
      this.showValidationError(
        'Límite Inválido',
        `Los usos máximos (${this.promotion.maxUses}) no pueden ser inferiores a los usos actuales (${this.currentUses}) de la promoción.`,
      );
      return;
    }

    Swal.fire({
      title: 'Guardar Cambios',
      text: `¿Estás seguro de que deseas guardar los cambios de la promoción "${this.promotion.name}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeSave();
      }
    });
  }

  private executeSave(): void {
    this.promotion.products = this.selectedProducts.map((p) => ({
      productId: p.id,
      quantity: p.quantity,
    }));

    const requestPayload: PromotionRequest = {
      ...this.promotion,
      startDate: (new Date(this.promotion.startDate) as any).toJSON(),
      endDate: (new Date(this.promotion.endDate) as any).toJSON(),
    };

    this.promotionService.update(this.promotionId!, requestPayload).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          Swal.fire(
            'Promoción Actualizada',
            `La promoción "${this.promotion.name}" ha sido actualizada exitosamente.`,
            'success'
          ).then(() => {
            this.router.navigate(['/dashboard/promociones']);
          });
        } else {
          this.showValidationError(
            'Error al Actualizar',
            response.message || 'No se pudo actualizar la promoción.',
          );
        }
      },
      error: (err) => {
        const msg =
          err.error?.message ||
          err.message ||
          'Error al comunicarse con el servidor.';
        this.showValidationError('Error al Actualizar', msg);
      },
    });
  }
}
