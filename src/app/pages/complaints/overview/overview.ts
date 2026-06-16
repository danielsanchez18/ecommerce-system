import { Component } from '@angular/core';
import { ComponentComplaintsList } from '@components/complaints/list/list';

@Component({
  selector: 'page-complaints-overview',
  imports: [ComponentComplaintsList],
  templateUrl: './overview.html',
})
export class PageComplaintsOverview {}
