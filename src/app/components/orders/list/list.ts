import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '@core/service/orders/order.service';
import { OrderResponse } from '@core/interfaces/orders/order.interface';
import Swal from 'sweetalert2';
import { ComponentSharedSearchBox } from '@components/shared/search-box/search-box';
import { ComponentSharedFilters } from '@components/shared/filters/filters';
import { ComponentSharedImport } from '@components/shared/import/import';
import { ComponentSharedPaginator } from '@components/shared/paginator/paginator';
import { ComponentSharedEmpty } from '@components/shared/empty/empty';
import { ComponentOrdersTable } from '../table/table';

@Component({
  selector: 'component-orders-list',
  imports: [
    ComponentSharedSearchBox,
    ComponentSharedFilters,
    ComponentSharedImport,
    ComponentSharedPaginator,
    ComponentSharedEmpty,
    ComponentOrdersTable,
  ],
  templateUrl: './list.html',
})
export class ComponentOrdersList implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  @Output() editClick = new EventEmitter<OrderResponse>();

  orders: OrderResponse[] = [];
  searchTerm: string = '';
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService
      .getAll({
        orderCode: this.searchTerm || undefined,
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success && response.data) {
            this.orders = response.data.content;
            this.totalPages = response.data.totalPages;
            this.totalElements = response.data.totalElements;

            // console.log(this.orders);
          } else {
            this.orders = [];
            this.totalPages = 0;
            this.totalElements = 0;
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error al cargar pedidos:', err);
          this.orders = [];
          this.totalPages = 0;
          this.totalElements = 0;
        },
      });
  }

  onSearchQueryChange(query: string): void {
    this.searchTerm = query;
    this.page = 0;
    this.loadOrders();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadOrders();
  }

  onViewOrder(order: OrderResponse): void {
    this.router.navigate(['/dashboard/pedidos', order.id]);
  }

  onEditOrder(order: OrderResponse): void {
    this.router.navigate(['/dashboard/pedidos', order.id, 'editar']);
  }

  onStatusChange(order: OrderResponse): void {
    // Si el usuario quiere "rechazar", asumo que cambiaremos el estado a CANCELLED o REJECTED
    // El enum de ordenes probablemente tiene CANCELLED o REJECTED.
    // Usaremos Swal para confirmarlo.
    Swal.fire({
      title: 'Rechazar Pedido',
      text: `¿Estás seguro de que deseas rechazar el pedido ${order.orderCode}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Enviar a backend cambio de estado
        this.orderService.updateStatus(order.id, 'CANCELLED').subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire(
                'Rechazado',
                'El pedido ha sido rechazado correctamente.',
                'success',
              );
              this.loadOrders();
            }
          },
          error: (err) => {
            Swal.fire('Error', 'No se pudo rechazar el pedido.', 'error');
          },
        });
      }
    });
  }
}
