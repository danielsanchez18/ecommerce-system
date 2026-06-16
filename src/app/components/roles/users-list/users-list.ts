import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentSharedEmpty } from '@components/shared/empty/empty';
import { ComponentSharedSearchBox } from '@components/shared/search-box/search-box';
import { LucideBadgeCheck } from '@lucide/angular';
import { ComponentSharedPaginator } from '@components/shared/paginator/paginator';
import { UserRoleService } from '@core/service/roles/user-role.service';
import { UserService } from '@core/service/users/user.service';
import { UserResponse } from '@core/interfaces/users/user.interface';
import { UserRole } from '@core/interfaces/roles/role.interface';
import { Page } from '@core/interfaces/shared/page.interface';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

interface UserRoleDetail {
  userRole: UserRole;
  user: UserResponse;
}

@Component({
  selector: 'component-roles-users-list',
  imports: [
    CommonModule,
    ComponentSharedSearchBox,
    ComponentSharedEmpty,
    LucideBadgeCheck,
    ComponentSharedPaginator,
  ],
  templateUrl: './users-list.html',
})
export class ComponentRolesUsersList implements OnChanges {
  @Input() roleId!: string;

  private userRoleService = inject(UserRoleService);
  private userService = inject(UserService);

  userRolesWithDetails: UserRoleDetail[] = [];
  loading = false;

  page: Page<UserRole> | null = null;
  currentPage = 0;
  pageSize = 10;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roleId'] && this.roleId) {
      this.loadUsers();
    }
  }

  loadUsers(pageIndex = 0) {
    this.loading = true;
    this.currentPage = pageIndex;

    this.userRoleService
      .findUsersByRoleId(this.roleId, {
        page: this.currentPage,
        size: this.pageSize,
      })
      .pipe(
        switchMap((res) => {
          if (res.data) {
            this.page = res.data;
            const content = res.data.content || [];
            if (content.length > 0) {
              const userReqs = content.map((ur) =>
                this.userService.findById(ur.userId).pipe(
                  map((userRes) => ({
                    userRole: ur,
                    user: userRes.data as UserResponse,
                  })),
                ),
              );
              return forkJoin(userReqs);
            }
          }
          return of([]);
        }),
      )
      .subscribe({
        next: (details) => {
          this.userRolesWithDetails = details;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  onPageChange(pageIndex: number) {
    this.loadUsers(pageIndex);
  }
}
