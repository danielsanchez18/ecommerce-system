import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ComponentDiscountsDetailsInfo } from "@components/discounts/details/info/info";
import { ComponentSharedToast } from "@components/shared/toast/toast";
import { ComponentDiscountsEdit } from "@components/discounts/edit/edit";
import { DiscountService } from '@core/service/discounts/discount.service';
import { DiscountResponse } from '@core/interfaces/discounts/discount.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'page-discounts-details',
  imports: [RouterModule, ComponentDiscountsDetailsInfo, ComponentSharedToast, ComponentDiscountsEdit],
  templateUrl: './details.html',
})
export class PageDiscountsDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private discountService = inject(DiscountService);

  discount: DiscountResponse | null = null;

  ngOnInit(): void {
    this.loadDiscount();
  }

  loadDiscount(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.discountService.getById(id).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.discount = response.data;
          } else {
            Swal.fire('Error', response.message || 'No se pudo cargar el descuento', 'error').then(() => {
              this.router.navigate(['/dashboard/descuentos']);
            });
          }
        },
        error: () => {
          Swal.fire('Error', 'Error al cargar los detalles del descuento', 'error').then(() => {
            this.router.navigate(['/dashboard/descuentos']);
          });
        }
      });
    }
  }

  onDeleteClick(): void {
    if (!this.discount) return;

    Swal.fire({
      title: 'Eliminar Descuento',
      text: `¿Estás seguro de que deseas eliminar permanentemente el descuento "${this.discount.code}"?`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.discountService.delete(this.discount!.id).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire('Eliminado', 'El descuento ha sido eliminado correctamente.', 'success').then(() => {
                this.router.navigate(['/dashboard/descuentos']);
              });
            } else {
              Swal.fire('Error', response.message || 'No se pudo eliminar el descuento.', 'error');
            }
          },
          error: (err) => {
            const backendMessage = err.error?.message || err.message || 'Error al eliminar el descuento.';
            Swal.fire('Error', backendMessage, 'error');
          }
        });
      }
    });
  }

  onStatusClick(): void {
    if (!this.discount) return;

    const isEnabling = !this.discount.enabled;
    const title = isEnabling ? 'Habilitar Descuento' : 'Suspender Descuento';
    const message = isEnabling
      ? `¿Estás seguro de que deseas habilitar el descuento con código "${this.discount.code}"?`
      : `¿Estás seguro de que deseas suspender temporalmente el descuento con código "${this.discount.code}"?`;

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
        this.discountService.changeStatus(this.discount!.id).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire(
                'Estado Actualizado',
                `El descuento "${this.discount!.code}" se ha ${isEnabling ? 'habilitado' : 'suspendido'} correctamente.`,
                'success'
              );
              this.loadDiscount();
            } else {
              Swal.fire('Error', response.message || 'No se pudo actualizar el estado del descuento.', 'error');
            }
          },
          error: (err) => {
            const backendMsg = err.error?.message || err.message || 'Error al cambiar estado del descuento.';
            Swal.fire('Error de Operación', backendMsg, 'error');
          },
        });
      }
    });
  }

  onEditClick(): void {
    // Open the modal manually since the toast button doesn't have the Preline data-attributes natively mapped to the modal ID.
    const modal = document.querySelector('#hs-edit-discount-modal');
    if (modal) {
      const { HSOverlay } = window as any;
      if (HSOverlay) {
        HSOverlay.open(modal);
      } else {
        modal.classList.remove('hidden');
        modal.classList.add('open');
      }
    }
  }
}
