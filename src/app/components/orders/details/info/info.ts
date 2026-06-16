import { Component, Input, OnChanges, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderResponse } from '@core/interfaces/orders/order.interface';
import { UserService } from '@core/service/users/user.service';
import { UserRoleService } from '@core/service/roles/user-role.service';
import { RoleService } from '@core/service/roles/role.service';
import { RouterLink } from '@angular/router';
import { ComponentSharedStates } from '@components/shared/states/states';
import {
  LucideCalendarClock,
  LucideTicketPercent,
  LucideMap,
  LucideShoppingBag,
  LucideTruck,
  LucideClock,
  LucideWallet,
  LucideChevronRight,
  LucideUtensilsCrossed,
} from '@lucide/angular';

@Component({
  selector: 'component-orders-details-info',
  imports: [
    CommonModule,
    DatePipe,
    ComponentSharedStates,
    RouterLink,
    LucideCalendarClock,
    LucideTicketPercent,
    LucideMap,
    LucideShoppingBag,
    LucideTruck,
    LucideClock,
    LucideWallet,
    LucideChevronRight,
    LucideUtensilsCrossed,
  ],
  templateUrl: './info.html',
})
export class ComponentOrdersDetailsInfo implements OnChanges {
  @Input() order!: OrderResponse;

  private readonly userService = inject(UserService);
  private readonly userRoleService = inject(UserRoleService);
  private readonly roleService = inject(RoleService);

  employeeName: string | null = null;
  employeeRole: string | null = null;
  customerName: string | null = null;

  ngOnChanges(): void {
    if (this.order) {
      if (this.order.attendedBy) {
        this.loadEmployeeDetails(this.order.attendedBy);
      } else if (this.order.registeredBy) {
        this.loadEmployeeDetails(this.order.registeredBy);
      }
      if (this.order.userId) {
        this.loadCustomerDetails(this.order.userId);
      }
    }
  }

  private loadEmployeeDetails(employeeId: string): void {
    this.userService.findById(employeeId).subscribe((res) => {
      if (res.success && res.data) {
        this.employeeName = res.data.names;
      }
    });

    this.userRoleService.findRolesByUserId(employeeId).subscribe((res) => {
      if (res.success && res.data && res.data.length > 0) {
        const roleId = res.data[0].roleId;
        this.roleService.findById(roleId).subscribe((roleRes) => {
          if (roleRes.success && roleRes.data) {
            this.employeeRole = roleRes.data.name;
          }
        });
      }
    });
  }

  private loadCustomerDetails(customerId: string): void {
    this.userService.findById(customerId).subscribe((res) => {
      if (res.success && res.data) {
        this.customerName = res.data.names;
      }
    });
  }

  mapPaymentMethod(method?: string): string {
    if (!method) return 'No especificado';
    const methodMap: { [key: string]: string } = {
      CASH: 'En efectivo',
      CREDIT_CARD: 'Tarjeta de Crédito',
      DEBIT_CARD: 'Tarjeta de Débito',
      WALLET: 'Billetera Digital',
    };
    return methodMap[method] || method;
  }
}
