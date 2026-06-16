import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RoleResponse } from '@core/interfaces/roles/role.interface';
import {
  LucideBadgeCheck,
  LucideBadgeMinus,
  LucideBadgeX,
  LucideUsers,
} from '@lucide/angular';

@Component({
  selector: 'component-roles-table',
  imports: [LucideBadgeCheck, LucideBadgeMinus, LucideBadgeX, LucideUsers, RouterLink],
  templateUrl: './table.html',
})
export class ComponentRolesTable {
  roles = input<RoleResponse[]>([]);
}
