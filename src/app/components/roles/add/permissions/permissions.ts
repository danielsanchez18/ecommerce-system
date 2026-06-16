import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { LucideUsers, LucideUserCog, LucideShield, LucideBox, LucideSettings } from '@lucide/angular';
import { PermissionService } from '@core/service/permissions/permission.service';
import { PermissionResponse } from '@core/interfaces/permissions/permission.interface';

@Component({
  selector: 'component-roles-add-permissions',
  imports: [CommonModule, LucideUsers, LucideUserCog, LucideShield, LucideBox, LucideSettings],
  templateUrl: './permissions.html',
})
export class ComponentRolesAddPermissions implements OnInit {
  @Input() permissionsControl!: FormControl | any;

  private permissionService = inject(PermissionService);

  permissions = signal<PermissionResponse[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.permissionService.findAll().subscribe({
      next: (data) => {
        this.permissions.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching permissions', err);
        this.isLoading.set(false);
      }
    });
  }

  togglePermission(permissionId: string): void {
    const currentValues: string[] = this.permissionsControl.value || [];
    const index = currentValues.indexOf(permissionId);
    
    if (index === -1) {
      this.permissionsControl.setValue([...currentValues, permissionId]);
    } else {
      const newValues = [...currentValues];
      newValues.splice(index, 1);
      this.permissionsControl.setValue(newValues);
    }
    
    this.permissionsControl.markAsTouched();
  }

  isChecked(permissionId: string): boolean {
    const currentValues: string[] = this.permissionsControl.value || [];
    return currentValues.includes(permissionId);
  }
}
