import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ComponentSharedSearchBox } from '@components/shared/search-box/search-box';
import { ComponentSharedImport } from '@components/shared/import/import';
import { ComponentRolesTable } from '../table/table';
import { ComponentSharedFilters } from '@components/shared/filters/filters';
import { ComponentSharedEmpty } from '@components/shared/empty/empty';
import { RoleService } from '@core/service/roles/role.service';
import { RoleResponse } from '@core/interfaces/roles/role.interface';

@Component({
  selector: 'component-roles-list',
  imports: [
    ComponentSharedSearchBox,
    ComponentSharedImport,
    ComponentSharedFilters,
    ComponentRolesTable,
    ComponentSharedEmpty,
  ],
  templateUrl: './list.html',
})
export class ComponentRolesList implements OnInit {
  private roleService = inject(RoleService);

  roles = signal<RoleResponse[]>([]);
  searchQuery = signal<string>('');

  filteredRoles = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.roles();
    return this.roles().filter((role) =>
      role.name.toLowerCase().includes(query),
    );
  });

  ngOnInit(): void {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.roleService.findAll().subscribe({
      next: (response) => {
        this.roles.set(response.data);
        console.log(this.roles());
      },
      error: (err) => {
        console.error('Error al cargar los roles:', err);
      },
    });
  }

  onSearchQueryChange(query: string): void {
    this.searchQuery.set(query);
  }
}
