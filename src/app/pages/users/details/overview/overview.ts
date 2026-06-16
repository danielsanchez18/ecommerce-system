import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  LucideMail,
  LucideShoppingBag,
  LucideLock,
  LucideUser,
} from '@lucide/angular';
import { UserService } from '../../../../core/service/users/user.service';
import { UserResponse } from '../../../../core/interfaces/users/user.interface';

@Component({
  selector: 'page-users-details-overview',
  imports: [
    CommonModule,
    RouterModule,
    LucideMail,
    LucideShoppingBag,
    LucideLock,
    LucideUser,
  ],
  templateUrl: './overview.html',
})
export class PageUsersDetailsOverview implements OnInit {
  private route = inject(ActivatedRoute);
  private userService = inject(UserService);

  userId: string = '';
  user: UserResponse | null = null;
  loading: boolean = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
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
}
