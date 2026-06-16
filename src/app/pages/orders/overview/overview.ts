import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentOrdersList } from '@components/orders/list/list';

@Component({
  selector: 'page-orders-overview',
  imports: [ComponentOrdersList],
  templateUrl: './overview.html',
})
export class PageOrdersOverview {}
