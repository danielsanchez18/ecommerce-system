import { Component, input } from '@angular/core';
import { DashboardKpiResponse } from '@core/interfaces/dashboard/dashboard.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'component-overview-kpis',
  imports: [DecimalPipe],
  templateUrl: './kpis.html',
})
export class ComponentOverviewKpis {
  kpis = input<DashboardKpiResponse | null>(null);
}

