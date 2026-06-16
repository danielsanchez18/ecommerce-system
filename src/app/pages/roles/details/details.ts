import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ComponentRolesUsersList } from '@components/roles/users-list/users-list';
import { LucideShield } from '@lucide/angular';
import { RoleService } from '@core/service/roles/role.service';
import { RolePermissionService } from '@core/service/roles/role-permission.service';
import { PermissionService } from '@core/service/permissions/permission.service';
import { RoleResponse } from '@core/interfaces/roles/role.interface';
import { PermissionResponse } from '@core/interfaces/permissions/permission.interface';
import { forkJoin, map, switchMap, of } from 'rxjs';

@Component({
  selector: 'page-roles-details',
  imports: [CommonModule, RouterModule, ComponentRolesUsersList],
  templateUrl: './details.html',
})
export class PageRolesDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private roleService = inject(RoleService);
  private rolePermissionService = inject(RolePermissionService);
  private permissionService = inject(PermissionService);

  roleId: string = '';
  role: RoleResponse | null = null;
  permissions: PermissionResponse[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.roleId = params.get('id') || '';
      if (this.roleId) {
        this.loadRoleData();
      }
    });
  }

  private loadRoleData() {
    this.loading = true;

    // Fetch role details
    this.roleService.findById(this.roleId).subscribe({
      next: (res) => {
        if (res.data) {
          this.role = res.data;
        }
      },
    });

    // Fetch permissions
    this.rolePermissionService
      .findByRoleId(this.roleId)
      .pipe(
        switchMap((res) => {
          if (res.data && res.data.length > 0) {
            const reqs = res.data.map((rp) =>
              this.permissionService.findById(rp.permissionId),
            );
            return forkJoin(reqs);
          }
          return of([]);
        }),
      )
      .subscribe({
        next: (permissions) => {
          // Some backends return data unwrapped or wrapped in ApiResponse for findById
          this.permissions = permissions.map((p) =>
            (p as any).data ? (p as any).data : p,
          );
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }
}
