import { Component } from '@angular/core';
import { ComponentUsersKpis } from '@components/users/kpis/kpis';
import { ComponentUsersList } from '@components/users/list/list';

@Component({
  selector: 'page-users-overview',
  imports: [ComponentUsersKpis, ComponentUsersList],
  templateUrl: './overview.html',
})
export class PageUsersOverview {}
