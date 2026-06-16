import { Component } from '@angular/core';
import { ComponentBillingList } from '@components/billing/list/list';

@Component({
  selector: 'page-billing-overview',
  imports: [ComponentBillingList],
  templateUrl: './overview.html',
})
export class PageBillingOverview {}
