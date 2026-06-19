import { Component, inject, OnInit, signal } from '@angular/core';
import { ComponentOverviewTable } from '@components/overview/table/table';
import { ComponentOverviewKpis } from '@components/overview/kpis/kpis';
import { AuthService } from '@core/service/auth/auth.service';
import { DashboardService } from '@core/service/dashboard/dashboard.service';
import { DashboardKpiResponse } from '@core/interfaces/dashboard/dashboard.interface';
import { ComponentOverviewCharts } from '@components/overview/charts/charts';

@Component({
  selector: 'page-overview',
  imports: [
    ComponentOverviewKpis,
    ComponentOverviewCharts,
    ComponentOverviewTable,
  ],
  templateUrl: './overview.html',
})
export class PageOverview implements OnInit {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);

  greeting = signal<string>('Hola');
  userName = signal<string>('Cargando...');
  kpis = signal<DashboardKpiResponse | null>(null);

  ngOnInit(): void {
    this.calculateGreeting();
    this.fetchUser();
    this.fetchKpis();
  }

  private calculateGreeting(): void {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      this.greeting.set('Buenos días');
    } else if (hour >= 12 && hour < 19) {
      this.greeting.set('Buenas tardes');
    } else {
      this.greeting.set('Buenas noches');
    }
  }

  private fetchUser(): void {
    this.authService.loadCurrentUser().subscribe({
      next: (user) => {
        this.userName.set(user.names);
      },
      error: (err) => {
        console.error('Error fetching user info', err);
        this.userName.set('Usuario');
      },
    });
  }

  private fetchKpis(): void {
    this.dashboardService.getKpis().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.kpis.set(res.data);
        }
      },
      error: (err) => {
        console.error('Error fetching KPIs', err);
      },
    });
  }
}
