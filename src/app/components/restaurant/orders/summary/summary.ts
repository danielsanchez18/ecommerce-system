import { CommonModule } from '@angular/common';
import { Component, inject, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/service/auth/auth.service';
import { OrderCartService } from '@core/service/orders/order-cart.service';
import { UserService } from '@core/service/users/user.service';
import { UserRoleService } from '@core/service/roles/user-role.service';
import { UserResponse } from '@core/interfaces/users/user.interface';
import { UserRole, RoleResponse } from '@core/interfaces/roles/role.interface';
import { RoleService } from '@core/service/roles/role.service';
import {
  LucideChevronRight,
  LucideClock,
  LucideShoppingBag,
  LucideStore,
  LucideTicketPercent,
  LucideUtensilsCrossed,
  LucideWallet,
} from '@lucide/angular';

@Component({
  selector: 'component-restaurant-order-summary',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    LucideClock,
    LucideWallet,
    LucideTicketPercent,
    LucideChevronRight,
    LucideStore,
    LucideShoppingBag,
    LucideUtensilsCrossed,
  ],
  templateUrl: './summary.html',
})
export class ComponentRestaurantOrderSummary {
  orderCartService = inject(OrderCartService);
  authService = inject(AuthService);
  userService = inject(UserService);
  userRoleService = inject(UserRoleService);

  roleService = inject(RoleService);

  userProfile = signal<UserResponse | null>(null);
  userRoleName = signal<string | null>(null);

  get tipoPedido(): string {
    const type = this.orderCartService.orderType();
    return type === 'DELIVERY'
      ? 'delivery'
      : type === 'PICKUP'
        ? 'recojo'
        : 'dine_in';
  }

  set tipoPedido(value: string) {
    if (value === 'delivery') {
      this.orderCartService.setOrderType('DELIVERY');
    } else if (value === 'recojo') {
      this.orderCartService.setOrderType('PICKUP');
    }
  }

  get editedStatus(): string {
    return this.orderCartService.orderStatus();
  }

  set editedStatus(value: string) {
    this.orderCartService.setOrderStatus(value);
  }

  constructor() {
    effect(() => {
      const currentUser = this.authService.currentUser();
      if (currentUser && currentUser.id) {
        // Cargar perfil del usuario para la foto
        this.userService.findById(currentUser.id).subscribe({
          next: (res) => {
            if (res.success) {
              this.userProfile.set(res.data);
            }
          },
        });

        // Buscar el rol del usuario
        this.userRoleService.findRolesByUserId(currentUser.id).subscribe({
          next: (res) => {
            if (res.success && res.data && res.data.length > 0) {
              const roleId = res.data[0].roleId;
              // Buscar el nombre del rol usando el roleId
              this.roleService.findById(roleId).subscribe({
                next: (roleRes) => {
                  if (roleRes.success && roleRes.data) {
                    this.userRoleName.set(roleRes.data.name);
                  }
                },
              });
            }
          },
        });
      }
    });
  }

  onTimeChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const val = parseInt(input.value) || 0;
    this.orderCartService.setEstimatedTime(val);
  }

  onAddressChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.orderCartService.setDeliveryAddress(input.value);
  }
}
