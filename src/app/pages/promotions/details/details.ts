import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ComponentSharedToast } from '@components/shared/toast/toast';
import { ComponentPromotionsDetailsImages } from '@components/promotions/details/images/images';
import { ComponentPromotionsDetailsInfo } from '@components/promotions/details/info/info';
import { ComponentPromotionsDetailsProducts } from '@components/promotions/details/products/products';
import { ComponentPromotionsDetailsTerms } from '@components/promotions/details/terms/terms';
import { PromotionService } from '@core/service/promotions/promotion.service';
import { PromotionResponse } from '@core/interfaces/promotions/promotion.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'page-promotions-details',
  imports: [
    RouterLink,
    ComponentSharedToast,
    ComponentPromotionsDetailsImages,
    ComponentPromotionsDetailsInfo,
    ComponentPromotionsDetailsProducts,
    ComponentPromotionsDetailsTerms,
  ],
  templateUrl: './details.html',
})
export class PagePromotionsDetails {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly promotionService = inject(PromotionService);

  promotionId: string | null = null;
  promotion: PromotionResponse = {} as PromotionResponse;

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
          this.promotion = response.data;
        } else {
          Swal.fire('Error', response.message || 'No se pudo cargar la promoción', 'error').then(() => {
            this.router.navigate(['/dashboard/promociones']);
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar detalles de promoción:', err);
        Swal.fire('Error', 'Error al cargar los detalles de la promoción', 'error').then(() => {
          this.router.navigate(['/dashboard/promociones']);
        });
      },
    });
  }

  // Handlers para el Toast
  onEditClick(): void {
    if (this.promotionId) {
      this.router.navigate([
        '/dashboard/promociones',
        this.promotionId,
        'editar',
      ]);
    }
  }

  onDeleteClick(): void {
    if (!this.promotionId) return;

    Swal.fire({
      title: 'Eliminar Promoción',
      text: `¿Estás seguro de que deseas eliminar permanentemente la promoción "${this.promotion.name || 'Seleccionada'}"?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.promotionService.delete(this.promotionId!).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire('Eliminado', 'La promoción ha sido eliminada correctamente.', 'success').then(() => {
                this.router.navigate(['/dashboard/promociones']);
              });
            } else {
              Swal.fire('Error', response.message || 'No se pudo eliminar la promoción.', 'error');
            }
          },
          error: (err) => {
            const backendMessage = err.error?.message || err.message || 'Error al eliminar la promoción.';
            Swal.fire('Error', backendMessage, 'error');
          }
        });
      }
    });
  }

  onStatusClick(): void {
    if (!this.promotionId) return;

    const isEnabling = !this.promotion.enabled;
    const title = isEnabling ? 'Habilitar Promoción' : 'Suspender Promoción';
    const message = isEnabling
      ? `¿Estás seguro de que deseas habilitar la promoción "${this.promotion.name || ''}"?`
      : `¿Estás seguro de que deseas suspender temporalmente la promoción "${this.promotion.name || ''}"?`;

    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.promotionService.changeStatus(this.promotionId!).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire(
                'Estado Actualizado',
                `La promoción se ha ${isEnabling ? 'habilitado' : 'suspendido'} correctamente.`,
                'success'
              );
              // Reload details to update the UI (buttons and info)
              this.loadPromotionDetails(this.promotionId!);
            } else {
              Swal.fire('Error', response.message || 'No se pudo actualizar el estado.', 'error');
            }
          },
          error: (err) => {
            const backendMsg = err.error?.message || err.message || 'Error al cambiar estado.';
            Swal.fire('Error de Operación', backendMsg, 'error');
          },
        });
      }
    });
  }
}
