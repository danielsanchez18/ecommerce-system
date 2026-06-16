import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentSharedFilters } from '../../shared/filters/filters';
import { ComponentSharedImport } from '../../shared/import/import';
import { ComponentSharedSearchBox } from '../../shared/search-box/search-box';
import { ComponentUsersTable } from '../table/table';
import { ComponentSharedEmpty } from '../../shared/empty/empty';
import { ComponentSharedPaginator } from '../../shared/paginator/paginator';

import { UserService } from '../../../core/service/users/user.service';
import { RoleService } from '../../../core/service/roles/role.service';
import { UserRoleService } from '../../../core/service/roles/user-role.service';
import { UserResponse } from '../../../core/interfaces/users/user.interface';
import { RoleResponse } from '../../../core/interfaces/roles/role.interface';
import { Page } from '../../../core/interfaces/shared/page.interface';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export interface UserDetail {
  user: UserResponse;
  roles: RoleResponse[];
}

@Component({
  selector: 'component-users-list',
  imports: [
    CommonModule,
    ComponentSharedSearchBox,
    ComponentSharedImport,
    ComponentSharedFilters,
    ComponentUsersTable,
    ComponentSharedEmpty,
    ComponentSharedPaginator,
  ],
  templateUrl: './list.html',
})
export class ComponentUsersList implements OnInit {
  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private userRoleService = inject(UserRoleService);

  usersDetails: UserDetail[] = [];
  allRoles: Map<string, RoleResponse> = new Map();
  loading = false;
  
  page: Page<UserResponse> | null = null;
  currentPage = 0;
  pageSize = 10;
  searchQuery = '';

  ngOnInit(): void {
    // First fetch all roles to map them later
    this.roleService.findAll().subscribe({
      next: (res) => {
        if (res.data) {
          res.data.forEach(r => this.allRoles.set(r.id, r));
        }
        this.loadUsers();
      },
      error: () => this.loadUsers() // Load users anyway if roles fail
    });
  }

  loadUsers(pageIndex = 0) {
    this.loading = true;
    this.currentPage = pageIndex;
    
    const filters = {
      page: this.currentPage,
      size: this.pageSize,
      names: this.searchQuery || undefined
    };

    this.userService.findAll(filters).pipe(
      switchMap(res => {
        if (res.data) {
          this.page = res.data;
          const content = res.data.content || [];
          if (content.length > 0) {
            // For each user, fetch their roles
            const requests = content.map(u => 
              this.userRoleService.findRolesByUserId(u.id).pipe(
                map(urRes => {
                  const userRoles = urRes.data || [];
                  const roles = userRoles
                    .map(ur => this.allRoles.get(ur.roleId))
                    .filter((r): r is RoleResponse => r !== undefined);
                  return { user: u, roles };
                })
              )
            );
            return forkJoin(requests);
          }
        }
        return of([]);
      })
    ).subscribe({
      next: (details) => {
        this.usersDetails = details;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onPageChange(pageIndex: number) {
    this.loadUsers(pageIndex);
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.loadUsers(0);
  }
}
