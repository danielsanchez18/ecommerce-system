import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  LucideChartColumn,
  LucideChevronDown,
  LucideChevronRight,
  LucidePlus,
} from '@lucide/angular';
import { DashboardService } from '@core/service/dashboard/dashboard.service';
import { DashboardChartResponse } from '@core/interfaces/dashboard/dashboard.interface';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'component-overview-charts',
  imports: [
    RouterModule,
    CommonModule,
    LucideChevronDown,
    LucidePlus,
    LucideChartColumn,
    LucideChevronRight,
  ],
  templateUrl: './charts.html',
})
export class ComponentOverviewCharts implements OnInit {
  private dashboardService = inject(DashboardService);
  private chartInstance: any;

  // Datos obtenidos del servidor
  monthlySales: number[] = new Array(12).fill(0);
  monthlyOrders: number[] = new Array(12).fill(0);

  categories = [
    {
      name: 'Pedidos',
      link: '/dashboard/pedidos',
      quantity: 0,
      minRange: 0,
      maxRange: 5000,
      isActive: true,
    },
    {
      name: 'Ventas',
      link: '/dashboard/ventas',
      quantity: 0,
      minRange: 0,
      maxRange: 50000,
      isActive: false,
    },
  ];

  selectedCategory =
    this.categories.find((cat) => cat.isActive) || this.categories[0];

  quantityDisplay: number = 0;
  progressPercentage: number = 0;

  ngOnInit() {
    // Inicializar el gráfico vacío mientras carga
    this.initializeChart([]);

    this.dashboardService.getChartsData().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.monthlySales = response.data.monthlySales;
          this.monthlyOrders = response.data.monthlyOrders;

          // Actualizar totales sumando los meses
          const totalOrders = this.monthlyOrders.reduce((a, b) => a + b, 0);
          const totalSales = this.monthlySales.reduce((a, b) => a + b, 0);

          this.categories[0].quantity = totalOrders;
          // Ajustar maxRange dinámicamente si supera el default
          if (totalOrders > this.categories[0].maxRange) {
            this.categories[0].maxRange = Math.ceil(totalOrders * 1.2);
          }

          this.categories[1].quantity = totalSales;
          if (totalSales > this.categories[1].maxRange) {
            this.categories[1].maxRange = Math.ceil(totalSales * 1.2);
          }

          // Refrescar la vista con los datos nuevos
          this.selectCategory(this.selectedCategory.name);
        }
      },
      error: (err) => {
        console.error('Error fetching chart data', err);
      }
    });
  }

  selectCategory(categoryName: string) {
    this.categories.forEach(
      (cat) => (cat.isActive = cat.name === categoryName),
    );
    this.selectedCategory = this.categories.find(
      (cat) => cat.name === categoryName,
    )!;
    this.animateAll();

    // Actualizar datos del gráfico
    if (this.chartInstance) {
      const data = categoryName === 'Pedidos' ? this.monthlyOrders : this.monthlySales;
      this.chartInstance.updateSeries([
        {
          name: categoryName,
          data: data,
        },
      ]);
    }
  }

  private animateAll() {
    this.animateQuantity(this.selectedCategory.quantity);
    const percent =
      (this.selectedCategory.quantity / this.selectedCategory.maxRange) * 100;
    this.animateProgress(percent);
  }

  private animateQuantity(target: number, duration: number = 1000) {
    const start = performance.now();
    const initial = 0;

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      this.quantityDisplay = Math.floor(
        initial + (target - initial) * progress,
      );

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  private animateProgress(targetPercent: number, duration: number = 1000) {
    const start = performance.now();

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      this.progressPercentage = targetPercent * progress;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  initializeChart(initialData: number[]): void {
    const chartOptions: any = {
      series: [
        {
          name: this.selectedCategory.name,
          data: initialData,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          endingShape: 'rounded',
          borderRadius: 0,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
      },
      xaxis: {
        categories: [
          'Ene',
          'Feb',
          'Mar',
          'Abr',
          'May',
          'Jun',
          'Jul',
          'Ago',
          'Sep',
          'Oct',
          'Nov',
          'Dic',
        ],
        labels: {
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, ui-sans-serif',
            fontWeight: 400,
          },
          rotate: -90,
          formatter: (title: string) => title ? title.slice(0, 3) : '',
        },
      },
      yaxis: {
        labels: {
          align: 'left',
          minWidth: 0,
          maxWidth: 140,
          style: {
            fontSize: '14px',
            fontFamily: 'Inter, ui-sans-serif',
            fontWeight: 400,
          },
          formatter: (value: number) =>
            value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value,
        },
      },
      states: {
        hover: {
          filter: {
            type: 'darken',
            value: 0.9,
          },
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        theme: 'light',
        y: {
          formatter: (value: number) => {
            if (this.selectedCategory?.name === 'Ventas') {
              return `S/. ${value}`;
            }
            return value;
          }
        },
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              bar: {
                columnWidth: '75%',
              },
            },
            xaxis: {
              labels: {
                style: {
                  fontFamily: 'Inter, sans-serif',
                  cssClass: 'text-xs',
                },
              },
            },
            tooltip: {
              marker: {
                show: false,
              },
            },
          },
        },
      ],
      colors: ['#51965c', '#d1d5dc'],
    };

    // Si ya existe la instancia, destruirla antes de re-renderizar
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const chartElement = document.querySelector('#hs-single-bar-chart') as HTMLElement;
    if (chartElement) {
      this.chartInstance = new ApexCharts(chartElement, chartOptions);
      this.chartInstance.render();
    }
  }
}
