import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, inject, OnInit, OnChanges, SimpleChanges, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { LucideChevronDown } from '@lucide/angular';
import { DiscountService } from '@core/service/discounts/discount.service';
import ApexCharts, { ApexOptions } from 'apexcharts';

@Component({
  selector: 'component-discounts-charts',
  imports: [
    LucideChevronDown,
    CommonModule
  ],
  templateUrl: './charts.html',
})
export class ComponentDiscountsCharts implements OnInit, OnChanges, AfterViewInit {
  @Input() discountId!: string;
  private discountService = inject(DiscountService);
  private platformId = inject(PLATFORM_ID);
  
  private chartInstance: any;

  // Datos obtenidos del servidor
  monthlySales: number[] = new Array(12).fill(0);

  quantityDisplay: number = 0;
  progressPercentage: number = 0;
  minRange: number = 0;
  maxRange: number = 50000;

  ngOnInit() {
    this.animateAll();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeChart();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['discountId'] && this.discountId) {
      this.loadChartData();
    }
  }

  private initializeChart() {
    const chartElement = document.querySelector('#hs-discount-bar-chart') as HTMLElement;
    if (!chartElement) return;

    const chartOptions: ApexOptions = {
      series: [
        {
          name: 'Ventas',
          data: this.monthlySales
        }
      ],
      chart: {
        type: 'bar',
        height: 350,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          borderRadius: 4
        }
      },
      dataLabels: { enabled: false },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        labels: {
          style: { fontFamily: 'Inter, sans-serif' }
        }
      },
      yaxis: {
        labels: {
          style: { fontFamily: 'Inter, sans-serif' },
          formatter: (value: number) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value.toString()
        }
      },
      fill: { opacity: 0.8 },
      tooltip: {
        shared: true,
        intersect: false,
        theme: 'light',
        y: {
          formatter: (value: number) => {
            return `S/. ${value.toString()}`;
          }
        }
      },
      states: {
        hover: {
          filter: { type: 'darken' }
        }
      },
      responsive: [
        {
          breakpoint: 768,
          options: {
            plotOptions: { bar: { columnWidth: '75%' } },
            xaxis: {
              labels: {
                style: { fontFamily: 'Inter, sans-serif', cssClass: 'text-xs' }
              }
            },
            tooltip: { marker: { show: false } }
          }
        }
      ],
      colors: ['#51965c']
    };

    this.chartInstance = new ApexCharts(chartElement, chartOptions);
    this.chartInstance.render();
  }

  loadChartData() {
    this.discountService.getDiscountCharts(this.discountId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.monthlySales = response.data.monthlySales;

          const totalSales = this.monthlySales.reduce((a, b) => a + b, 0);

          if (totalSales > this.maxRange) {
            this.maxRange = Math.ceil(totalSales * 1.2);
          }

          if (this.chartInstance) {
            this.chartInstance.updateSeries([{
              name: 'Ventas',
              data: this.monthlySales
            }]);
          }

          this.animateQuantity(totalSales);
          const max = this.maxRange > 0 ? this.maxRange : 1;
          const percent = (totalSales / max) * 100;
          this.animateProgress(percent);
        }
      },
      error: (err) => console.error('Error fetching discount charts', err)
    });
  }

  private animateAll() {
    this.animateQuantity(0);
    this.animateProgress(0);
  }

  private animateQuantity(target: number, duration: number = 1000) {
    const start = performance.now();
    const initial = 0;

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      this.quantityDisplay = Math.floor(initial + (target - initial) * progress);

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
}
