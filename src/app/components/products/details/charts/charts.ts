import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Input, inject, OnInit, OnChanges, SimpleChanges, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { LucideChevronDown, LucidePlus, LucideChartColumn, LucideChevronRight } from '@lucide/angular';
import { ProductService } from '@core/service/products/product.service';
import ApexCharts, { ApexOptions } from 'apexcharts';

@Component({
  selector: 'component-products-charts',
  imports: [
    LucideChevronDown,
    LucidePlus,
    LucideChartColumn,
    LucideChevronRight,
    CommonModule
  ],
  templateUrl: './charts.html',
})
export class ComponentProductsCharts implements OnInit, OnChanges, AfterViewInit {
  @Input() productId!: string;
  private productService = inject(ProductService);
  private platformId = inject(PLATFORM_ID);
  
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
      isActive: true
    },
    {
      name: 'Ventas',
      link: '/dashboard/ventas',
      quantity: 0,
      minRange: 0,
      maxRange: 50000,
      isActive: false
    }
  ];

  selectedCategory = this.categories.find(cat => cat.isActive) || this.categories[0];
  quantityDisplay: number = 0;
  progressPercentage: number = 0;

  ngOnInit() {
    this.animateAll();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeChart();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productId'] && this.productId) {
      this.loadChartData();
    }
  }

  private initializeChart() {
    const chartElement = document.querySelector('#hs-product-bar-chart') as HTMLElement;
    if (!chartElement) return;

    const chartOptions: ApexOptions = {
      series: [
        {
          name: 'Pedidos',
          data: this.monthlyOrders
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
            if (this.selectedCategory?.name === 'Ventas') {
              return `S/. ${value.toString()}`;
            }
            return value.toString();
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
    this.productService.getProductCharts(this.productId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.monthlySales = response.data.monthlySales;
          this.monthlyOrders = response.data.monthlyOrders;

          const totalOrders = this.monthlyOrders.reduce((a, b) => a + b, 0);
          const totalSales = this.monthlySales.reduce((a, b) => a + b, 0);

          this.categories[0].quantity = totalOrders;
          if (totalOrders > this.categories[0].maxRange) {
            this.categories[0].maxRange = Math.ceil(totalOrders * 1.2);
          }

          this.categories[1].quantity = totalSales;
          if (totalSales > this.categories[1].maxRange) {
            this.categories[1].maxRange = Math.ceil(totalSales * 1.2);
          }

          this.selectCategory(this.selectedCategory.name);
        }
      },
      error: (err) => console.error('Error fetching product charts', err)
    });
  }

  selectCategory(categoryName: string) {
    this.categories.forEach(cat => cat.isActive = cat.name === categoryName);
    this.selectedCategory = this.categories.find(cat => cat.name === categoryName)!;
    this.animateAll();

    const data = categoryName === 'Pedidos' ? this.monthlyOrders : this.monthlySales;
    
    if (this.chartInstance) {
      this.chartInstance.updateSeries([{
        name: categoryName,
        data: data
      }]);
    }
  }

  private animateAll() {
    this.animateQuantity(this.selectedCategory.quantity);
    const max = this.selectedCategory.maxRange > 0 ? this.selectedCategory.maxRange : 1;
    const percent = (this.selectedCategory.quantity / max) * 100;
    this.animateProgress(percent);
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
