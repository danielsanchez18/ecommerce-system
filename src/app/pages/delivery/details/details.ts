import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/service/orders/order.service';
import { OrderResponse } from '../../../core/interfaces/orders/order.interface';
import { LucideMapPin, LucidePackage, LucidePhone, LucideArrowLeft, LucideCheckCircle, LucideXCircle } from '@lucide/angular';
import { ComponentOrdersDetailsProducts } from '../../../components/orders/details/products/products';

@Component({
  selector: 'page-delivery-details',
  imports: [CommonModule, RouterLink, LucideMapPin, LucidePackage, LucidePhone, LucideArrowLeft, LucideCheckCircle, LucideXCircle, ComponentOrdersDetailsProducts],
  templateUrl: './details.html',
})
export class PageDeliveryDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  order: OrderResponse | null = null;
  loading = false;
  processing = false;
  locationError = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadOrder(id);
    }
  }

  loadOrder(id: string) {
    this.loading = true;
    this.orderService.getById(id).subscribe({
      next: (res) => {
        if (res.data) {
          this.order = res.data;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching order:', err);
        this.loading = false;
        this.router.navigate(['/delivery']);
      }
    });
  }

  deliverOrder() {
    if (!this.order) return;
    this.processing = true;
    this.locationError = '';

    if (!navigator.geolocation) {
      this.locationError = 'La geolocalización no está soportada por tu navegador.';
      this.fallbackDeliver();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.orderService.updateStatus(this.order!.id, 'COMPLETED', lat, lng).subscribe({
          next: () => {
            this.processing = false;
            this.router.navigate(['/delivery']);
          },
          error: (err) => {
            console.error('Error delivering order:', err);
            this.locationError = 'Ocurrió un error al entregar el pedido.';
            this.processing = false;
          }
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        this.locationError = 'No se pudo obtener tu ubicación. Por favor, asegúrate de dar permisos.';
        this.fallbackDeliver();
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  fallbackDeliver() {
    // Si no se puede obtener ubicación, lo entrega sin ubicación (o se podría denegar la entrega, dependiendo de reglas de negocio)
    this.orderService.updateStatus(this.order!.id, 'COMPLETED').subscribe({
      next: () => {
        this.processing = false;
        this.router.navigate(['/delivery']);
      },
      error: (err) => {
        console.error('Error delivering order:', err);
        this.locationError = 'Ocurrió un error al entregar el pedido.';
        this.processing = false;
      }
    });
  }

  cancelOrder() {
    if (!this.order) return;
    if (confirm('¿Estás seguro de que deseas cancelar la entrega de este pedido?')) {
      this.processing = true;
      this.orderService.updateStatus(this.order.id, 'CANCELLED').subscribe({
        next: () => {
          this.processing = false;
          this.router.navigate(['/delivery']);
        },
        error: (err) => {
          console.error('Error canceling order:', err);
          this.processing = false;
        }
      });
    }
  }
}
