import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  LucideBadgeInfo,
  LucideCalendar1,
  LucideCalendarCheck,
  LucideCircleCheck,
  LucideClock,
  LucideMail,
  LucidePhone,
  LucideUser,
} from '@lucide/angular';
import { UserService } from '../../../../core/service/users/user.service';
import { UserResponse } from '../../../../core/interfaces/users/user.interface';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'page-users-details-info',
  imports: [
    CommonModule,
    LucideBadgeInfo,
    LucideCalendar1,
    LucideCalendarCheck,
    LucideUser,
    LucideMail,
    LucidePhone,
    LucideCircleCheck,
    LucideClock,
  ],
  templateUrl: './info.html',
})
export class PageUsersDetailsInfo implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private clipboard = inject(Clipboard);

  userId: string = '';
  user: UserResponse | null = null;
  loading: boolean = true;
  copied: boolean = false;

  ngOnInit(): void {
    // Info page is a child route of overview, so ID is in the parent params
    this.route.parent?.paramMap.subscribe(params => {
      this.userId = params.get('id') || '';
      if (this.userId) {
        this.userService.findById(this.userId).subscribe({
          next: (res) => {
            this.user = res.data ? res.data : (res as any);
            this.loading = false;
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    });
  }

  copyId() {
    if (this.userId) {
      this.clipboard.copy(this.userId);
      this.copied = true;
      setTimeout(() => this.copied = false, 2000);
    }
  }
}
