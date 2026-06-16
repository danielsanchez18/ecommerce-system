import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentRolesList } from '@components/roles/list/list';

@Component({
  selector: 'page-roles-overview',
  imports: [ComponentRolesList, RouterLink],
  templateUrl: './overview.html',
})
export class PageRolesOverview {}
