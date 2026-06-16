import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../../core/service/orders/order.service';
import { OrderResponse } from '../../../../core/interfaces/orders/order.interface';
import { Page } from '../../../../core/interfaces/shared/page.interface';
import { ComponentOrdersTable } from '../../../../components/orders/table/table';
import { ComponentSharedPaginator } from '../../../../components/shared/paginator/paginator';
import { ComponentSharedEmpty } from '../../../../components/shared/empty/empty';

@Component({
  selector: 'page-users-details-orders',
  imports: [
    CommonModule,
    ComponentOrdersTable,
    ComponentSharedPaginator,
    ComponentSharedEmpty
  ],
  templateUrl: './orders.html',
})
export class PageUsersDetailsOrders implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  userId: string = '';
  page: Page<OrderResponse> | null = null;
  orders: OrderResponse[] = [];
  loading = false;
  currentPage = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.route.parent?.paramMap.subscribe(params => {
      this.userId = params.get('id') || '';
      if (this.userId) {
        this.loadOrders(0);
      }
    });
  }

  loadOrders(pageIndex: number) {
    this.loading = true;
    this.currentPage = pageIndex;
    
    this.orderService.getByUser(this.userId, this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        if (res.data) {
          this.page = res.data;
          this.orders = res.data.content || [];
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onPageChange(pageIndex: number) {
    this.loadOrders(pageIndex);
  }

  onViewOrder(order: OrderResponse) {
    this.router.navigate(['/dashboard/pedidos', order.id]);
  }

  onEditOrder(order: OrderResponse) {
    this.router.navigate(['/dashboard/pedidos', order.id, 'editar']);
  }
}
