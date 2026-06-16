import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideSearch,
  LucideCircleQuestionMark,
  LucideBell,
  LucideCheckCheck,
  LucideInfo,
  LucideAlertCircle,
  LucideCheckCircle2,
  LucideShoppingBag,
  LucideDynamicIcon,
} from '@lucide/angular';
import { NotificationService } from '@core/service/notification/notification.service';
import {
  NotificationResponse,
  NotificationType,
} from '@core/models/notification.model';
import { Router } from '@angular/router';

@Component({
  selector: 'component-shared-navbar',
  imports: [
    CommonModule,
    LucideSearch,
    LucideCircleQuestionMark,
    LucideDynamicIcon,
    LucideBell,
    LucideCheckCheck,
  ],
  templateUrl: './navbar.html',
})
export class ComponentSharedNavbar implements OnInit {
  public notificationService = inject(NotificationService);
  private router = inject(Router);

  public unreadCount = 0;
  public notifications: NotificationResponse[] = [];
  public showDropdown = false;

  ngOnInit() {
    this.notificationService.unreadCount$.subscribe((count) => {
      this.unreadCount = count;
    });

    this.notificationService.notifications$.subscribe((notifs) => {
      this.notifications = notifs;
    });
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  markAsRead(notification: NotificationResponse) {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id).subscribe();
      this.notificationService.localMarkAsRead(notification.id);
    }

    this.showDropdown = false;

    if (notification.linkUrl) {
      this.router.navigateByUrl(notification.linkUrl);
    }
  }

  markAllAsRead(event: Event) {
    event.stopPropagation();
    this.notificationService.markAllAsRead().subscribe();
    this.notificationService.localMarkAllAsRead();
  }

  getIcon(type: string): any {
    switch (type) {
      case NotificationType.INFO:
        return LucideInfo;
      case NotificationType.SUCCESS:
        return LucideCheckCircle2;
      case NotificationType.WARNING:
        return LucideAlertCircle;
      case NotificationType.ORDER_CREATED:
        return LucideShoppingBag;
      default:
        return LucideBell;
    }
  }

  getColor(type: string): string {
    switch (type) {
      case NotificationType.INFO:
        return 'text-blue-500 bg-blue-50';
      case NotificationType.SUCCESS:
        return 'text-green-500 bg-green-50';
      case NotificationType.WARNING:
        return 'text-yellow-500 bg-yellow-50';
      case NotificationType.ORDER_CREATED:
        return 'text-primary bg-primary/10';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  }
}
