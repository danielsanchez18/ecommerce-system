import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PromotionProductResponse } from '@core/interfaces/promotions/promotion.interface';

@Component({
  selector: 'component-promotions-details-images',
  imports: [CommonModule],
  templateUrl: './images.html',
})
export class ComponentPromotionsDetailsImages {
  imagenPrincipal: string = '';
  imagenesAdicionales: string[] = [];

  @Input() set products(value: PromotionProductResponse[] | undefined) {
    if (value) {
      this.imagenesAdicionales = value
        .map((p) => p.productImageUrl)
        .filter((url): url is string => !!url && url.trim() !== '');
      this.imagenPrincipal = this.imagenesAdicionales[0] || '';
    }
  }

  cambiarImagenPrincipal(nuevaImagen: string) {
    this.imagenPrincipal = nuevaImagen;
  }
}
