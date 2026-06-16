import { Component, inject, OnInit } from '@angular/core';
import { ComponentRestaurantOrderSelectProducts } from '@components/restaurant/orders/select-products/select-products';
import { ComponentRestaurantOrderSummary } from '@components/restaurant/orders/summary/summary';
import { ComponentSharedToast } from '@components/shared/toast/toast';
import { OrderCartService } from '@core/service/orders/order-cart.service';
import { OrderService } from '@core/service/orders/order.service';
import { AuthService } from '@core/service/auth/auth.service';
import { TableService } from '@core/service/tables/table.service';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { OrderRequest } from '@core/interfaces/orders/order.interface';

@Component({
  selector: 'page-restaurant-order',
  imports: [
    RouterLink,
    ComponentRestaurantOrderSelectProducts,
    ComponentRestaurantOrderSummary,
    ComponentSharedToast,
  ],
  templateUrl: './order.html',
})
export class PageRestaurantOrder implements OnInit {
  private readonly orderCartService = inject(OrderCartService);
  private readonly orderService = inject(OrderService);
  private readonly tableService = inject(TableService);
  private readonly authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    // Al entrar a la vista de "Tomar Pedido", limpiamos cualquier carrito anterior
    // para garantizar que la orden del restaurante sea siempre efímera (fresca).
    // Esto limpia la tabla en BD para el cajero actual, pero mantiene
    // intacta la infraestructura de persistencia general para cuando se desarrolle
    // la app del cliente final.
    this.orderCartService.clearCart();
  }

  onConfirmOrder() {
    const cart = this.orderCartService.cart();
    if (!cart || cart.items.length === 0) {
      Swal.fire('Error', 'El pedido no tiene productos', 'warning');
      return;
    }

    const employeeId = this.authService.currentUser()?.id;
    const orderType = this.orderCartService.orderType();
    const tables = this.orderCartService.selectedTables();

    // Asumimos que para mesa unida tomamos el ID de la primera
    const tableId =
      orderType === 'DINE_IN' && tables.length > 0 ? tables[0].id : undefined;

    const request: OrderRequest = {
      userId: undefined, // En restaurante todavía no asociamos a un cliente por defecto
      registeredBy: employeeId,
      attendedBy: employeeId,
      tableId: tableId,
      orderType: orderType,
      paymentMethod: 'CASH', // TODO: Get from summary select dynamically
      preparationTime: this.orderCartService.estimatedTime(),
      manualDiscount: this.orderCartService.manualDiscount(),
      deliveryAddress: orderType === 'DELIVERY' ? this.orderCartService.deliveryAddress() : undefined,
      items: cart.items.map((item) => ({
        productId: item.product?.id,
        promotionId: item.promotion?.id,
        discountId: item.product?.discountId,
        quantity: item.quantity,
      })),
    };

    this.orderService.create(request).subscribe({
      next: (res) => {
        if (res.success) {
          // If DINE_IN, set all selected tables to OCCUPIED
          if (orderType === 'DINE_IN' && this.orderCartService.selectedTables().length > 0) {
            const tableUpdates = this.orderCartService.selectedTables().map(t => 
              this.tableService.updateStatus(t.id, 'OCCUPIED')
            );
            
            forkJoin(tableUpdates).subscribe(() => {
              this.showSuccessAndNavigate();
            });
          } else {
            this.showSuccessAndNavigate();
          }
        }
      },
      error: () => {
        Swal.fire('Error', 'Hubo un problema al crear el pedido', 'error');
      },
    });
  }

  private showSuccessAndNavigate() {
    Swal.fire(
      '¡Pedido creado!',
      'El pedido se ha generado correctamente.',
      'success',
    );
    this.orderCartService.clearCart();
    this.orderCartService.clearTables();
    this.router.navigate(['/dashboard/restaurante/overview']);
  }
}
