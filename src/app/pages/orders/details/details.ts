import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '@core/service/orders/order.service';
import { OrderResponse } from '@core/interfaces/orders/order.interface';
import { ComponentSharedToast } from '@components/shared/toast/toast';
import { ComponentSharedStates } from '@components/shared/states/states';
import { ComponentOrdersDetailsProducts } from '@components/orders/details/products/products';
import { ComponentOrdersDetailsInfo } from '@components/orders/details/info/info';
import { ComponentOrdersReceipt } from '@components/orders/receipt/receipt';
import { ComponentOrdersDetailsTimeline } from '@components/orders/details/timeline/timeline';
import { ComponentBillingIssueModal } from '@components/billing/issue-modal/issue-modal';
import { TableService } from '@core/service/tables/table.service';
import { BillingService } from '@core/service/billing/billing.service';
import { InvoiceResponse } from '@core/interfaces/billing/billing.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'page-orders-details',
  imports: [
    RouterLink,
    CommonModule,
    ComponentSharedToast,
    ComponentSharedStates,
    ComponentOrdersDetailsProducts,
    ComponentOrdersDetailsInfo,
    ComponentOrdersReceipt,
    ComponentOrdersDetailsTimeline,
    ComponentBillingIssueModal,
  ],
  templateUrl: './details.html',
})
export class PageOrdersDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly orderService = inject(OrderService);
  private readonly tableService = inject(TableService);
  private readonly billingService = inject(BillingService);

  order: OrderResponse | null = null;
  invoice: InvoiceResponse | null = null;
  isLoading: boolean = true;
  isReceiptOpen: boolean = false;
  isIssueModalOpen: boolean = false;
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

  private loadOrder(id: string): void {
    this.isLoading = true;
    this.orderService.getById(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.order = response.data;
          this.checkInvoice();
          console.log(this.order);
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

  private checkInvoice() {
    if (!this.order) return;
    this.billingService.getInvoiceByOrderId(this.order.id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.invoice = res.data;
        }
      },
      error: (err) => {
        // If 404, it means no invoice yet, which is fine
        this.invoice = null;
      }
    });
  }

  onIssueInvoice() {
    this.isIssueModalOpen = true;
  }

  onInvoiceGenerated() {
    this.checkInvoice();
  }

  onRejectOrder() {
    if (!this.order) return;

    Swal.fire({
      title: '¿Rechazar Pedido?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.updateStatus(this.order!.id, 'CANCELLED').subscribe({
          next: (res) => {
            if (res.success) {
              Swal.fire('Rechazado', 'El pedido ha sido rechazado.', 'success');
              this.order!.status = 'CANCELLED';

              if (this.order?.tableId) {
                this.tableService.promptAndFreeTables(this.order.tableId);
              }
            }
          },
          error: () => {
            Swal.fire('Error', 'No se pudo rechazar el pedido', 'error');
          }
        });
      }
    });
  }

  onEditOrder() {
    if (this.order) {
      this.router.navigate(['/dashboard/pedidos', this.order.id, 'editar']);
    }
  }

  onPrintReceipt() {
    this.isReceiptOpen = true;
  }

  mapStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      PENDING: 'Pendiente',
      PREPARING: 'En Proceso',
      READY: 'Listo',
      COMPLETED: 'Entregado',
      CANCELLED: 'Cancelado',
    };
    return statusMap[status] || status;
  }
}
