import { ComponentRestaurantOrderSummary } from '@components/restaurant/orders/summary/summary';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '@core/service/orders/order.service';
import { OrderCartService } from '@core/service/orders/order-cart.service';
import { TableService } from '@core/service/tables/table.service';
import {
  OrderResponse,
  OrderRequest,
} from '@core/interfaces/orders/order.interface';
import { ComponentSharedToast } from '@components/shared/toast/toast';
import { ComponentRestaurantOrderSelectProducts } from '@components/restaurant/orders/select-products/select-products';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'page-orders-edit',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ComponentSharedToast,
    ComponentRestaurantOrderSummary,
    ComponentRestaurantOrderSelectProducts,
  ],
  templateUrl: './edit.html',
})
export class PageOrdersEdit implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);
  private readonly orderCartService = inject(OrderCartService);
  private readonly tableService = inject(TableService);

  order: OrderResponse | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrder(id);
    } else {
      this.error = 'No se proporcionó un ID de pedido.';
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.orderCartService.clearEditingState();
    this.orderCartService.clearCart();
  }

  private loadOrder(id: string): void {
    this.isLoading = true;
    this.orderService.getById(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.order = response.data;
          this.orderCartService.loadOrderForEditing(this.order);
        } else {
          this.error = response.message || 'No se pudo cargar el pedido.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Ocurrió un error al cargar el pedido.';
        console.error('Error cargando pedido', err);
      },
    });
  }

  onSaveChanges(): void {
    if (!this.order) return;

    const cart = this.orderCartService.cart();
    if (!cart || cart.items.length === 0) {
      Swal.fire('Error', 'El pedido no puede estar vacío.', 'warning');
      return;
    }

    const request: OrderRequest = {
      userId: this.order.userId,
      registeredBy: this.order.registeredBy,
      attendedBy: this.order.attendedBy,
      tableId:
        this.orderCartService.orderType() === 'DINE_IN' &&
        this.orderCartService.selectedTables().length > 0
          ? this.orderCartService.selectedTables()[0].id
          : this.order.tableId,
      orderType: this.orderCartService.orderType(),
      paymentMethod: this.order.paymentMethod,
      preparationTime: this.orderCartService.estimatedTime(),
      manualDiscount: this.orderCartService.manualDiscount(),
      deliveryAddress:
        this.orderCartService.orderType() === 'DELIVERY'
          ? this.orderCartService.deliveryAddress()
          : undefined,
      items: cart.items.map((item) => ({
        productId: item.product?.id,
        promotionId: item.promotion?.id,
        discountId: item.product?.discountId,
        quantity: item.quantity,
      })),
    };

    this.orderService.updated(this.order.id, request).subscribe({
      next: (res) => {
        if (res.success) {
          // If status changed, update it too
          const currentStatus = this.orderCartService.orderStatus();
          if (currentStatus !== this.order!.status) {
            this.orderService
              .updateStatus(this.order!.id, currentStatus)
              .subscribe({
                next: () => {
                  this.showSuccessAndNavigate();
                },
                error: () => {
                  Swal.fire(
                    'Error',
                    'Se actualizó el pedido pero no se pudo cambiar el estado.',
                    'warning',
                  );
                  this.router.navigate(['/dashboard/pedidos', this.order!.id]);
                },
              });
          } else {
            this.showSuccessAndNavigate();
          }
        }
      },
      error: () => {
        Swal.fire(
          'Error',
          'Hubo un problema al actualizar el pedido.',
          'error',
        );
      },
    });
  }

  private showSuccessAndNavigate(): void {
    Swal.fire(
      '¡Actualizado!',
      'El pedido se actualizó correctamente.',
      'success',
    ).then(() => {
      const currentStatus = this.orderCartService.orderStatus();
      if ((currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') && this.order?.tableId) {
        this.tableService.promptAndFreeTables(this.order.tableId);
      }
    });
    this.router.navigate(['/dashboard/pedidos', this.order!.id]);
  }
}
