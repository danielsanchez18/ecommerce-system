import { Component, EventEmitter, inject, Output, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ComponentSharedEmpty } from '@components/shared/empty/empty';
import { ComponentSharedFilters } from '@components/shared/filters/filters';
import { ComponentSharedSearchBox } from '@components/shared/search-box/search-box';
import { ComponentDiscountsTable } from '../table/table';
import { ComponentSharedPaginator } from '@components/shared/paginator/paginator';
import { DiscountService } from '@core/service/discounts/discount.service';
import { DiscountResponse } from '@core/interfaces/discounts/discount.interface';

@Component({
  selector: 'component-discounts-list',
  imports: [
    ComponentSharedSearchBox,
    ComponentSharedEmpty,
    ComponentSharedFilters,
    ComponentDiscountsTable,
    ComponentSharedPaginator,
  ],
  templateUrl: './list.html',
})
export class ComponentDiscountsList {
  private readonly discountService = inject(DiscountService);

  discounts: DiscountResponse[] = [];

  // Paginación
  page = 0;
  size = 10;
  totalElements = 0;
  totalPages = 0;

  // Filtros
  searchQuery = '';

  @Output() editClick = new EventEmitter<DiscountResponse>();
  @Output() requestConfirm = new EventEmitter<{
    title: string;
    message: string;
    onConfirm: () => void;
  }>();
  @Output() requestSuccess = new EventEmitter<{
    title: string;
    message: string;
  }>();
  @Output() requestError = new EventEmitter<{
    title: string;
    message: string;
  }>();

  ngOnInit(): void {
    this.loadDiscounts();
  }

  loadDiscounts(): void {
    const filters: any = {
      page: this.page,
      size: this.size,
    };

    if (this.searchQuery.trim() !== '') {
      filters.code = this.searchQuery;
    }

    this.discountService.getAll(filters).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.discounts = response.data.content;
          this.totalElements = response.data.totalElements;
          this.totalPages = response.data.totalPages;
        }
      },
      error: (err) => {
        console.error('Error al cargar descuentos:', err);
        this.requestError.emit({
          title: 'Error de carga',
          message: 'No se pudieron recuperar los descuentos del sistema.',
        });
      },
    });
  }

  onSearchQueryChange(query: string): void {
    this.searchQuery = query;
    this.page = 0;
    this.loadDiscounts();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadDiscounts();
  }

  onStatusChange(discount: DiscountResponse): void {
    const isEnabling = !discount.enabled;
    const title = isEnabling ? 'Habilitar Descuento' : 'Suspender Descuento';
    const message = isEnabling
      ? `¿Estás seguro de que deseas habilitar el descuento con código "${discount.code}"?`
      : `¿Estás seguro de que deseas suspender temporalmente el descuento con código "${discount.code}"?`;

    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.discountService.changeStatus(discount.id).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire(
                'Estado Actualizado',
                `El descuento "${discount.code}" se ha ${isEnabling ? 'habilitado' : 'suspendido'} correctamente.`,
                'success',
              );
              this.loadDiscounts();
            } else {
              Swal.fire(
                'Error',
                response.message ||
                  'No se pudo actualizar el estado del descuento.',
                'error',
              );
            }
          },
          error: (err) => {
            const backendMsg =
              err.error?.message ||
              err.message ||
              'Error al cambiar estado del descuento.';
            Swal.fire('Error de Operación', backendMsg, 'error');
          },
        });
      }
    });
  }
}
