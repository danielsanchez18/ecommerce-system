import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderHistoryResponse } from '@core/interfaces/orders/order.interface';
import { OrderService } from '@core/service/orders/order.service';
import { LucideClock, LucideUser, LucideCheckCircle, LucideXCircle, LucideEdit, LucideRefreshCw } from '@lucide/angular';

@Component({
  selector: 'component-orders-details-timeline',
  standalone: true,
  imports: [CommonModule, LucideClock, LucideUser, LucideCheckCircle, LucideXCircle, LucideEdit, LucideRefreshCw],
  templateUrl: './timeline.html',
})
export class ComponentOrdersDetailsTimeline implements OnInit {
  @Input() orderId!: string;
  
  private readonly orderService = inject(OrderService);
  
  history: OrderHistoryResponse[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadHistory();
  }

  loadHistory() {
    if (!this.orderId) return;
    
    this.orderService.getHistory(this.orderId).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.history = res.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
