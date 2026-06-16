import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ComponentSharedToast } from '@components/shared/toast/toast';
import { ComponentProductsDetailsCard } from '@components/products/details/card/card';
import { ComponentProductsDetailsInfo } from '@components/products/details/info/info';
import { ComponentProductsEdit } from '@components/products/edit/edit';
import { ProductService } from '@core/service/products/product.service';
import { CategoryService } from '@core/service/categories/category.service';
import { ProductResponse } from '@core/interfaces/products/product.interface';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'page-products-details',
  imports: [
    CommonModule, 
    RouterLink, 
    ComponentSharedToast,
    ComponentProductsDetailsCard,
    ComponentProductsDetailsInfo,
    ComponentProductsEdit
  ],
  templateUrl: './details.html',
})
export class PageProductsDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  productId: string = '';
  product: ProductResponse | null = null;
  categoryName: string = '';

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (this.productId) {
      this.loadProduct();
    } else {
      this.router.navigate(['/dashboard/productos']);
    }
  }

  loadProduct(): void {
    this.productService.getById(this.productId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.product = response.data;
          if (this.product.categoryId) {
            this.loadCategoryName(this.product.categoryId);
          }
        } else {
          Swal.fire('Error', 'No se pudo cargar el producto', 'error');
          this.router.navigate(['/dashboard/productos']);
        }
      },
      error: (err) => {
        console.error('Error cargando producto', err);
        Swal.fire('Error', 'Ocurrió un error al cargar el producto', 'error');
        this.router.navigate(['/dashboard/productos']);
      }
    });
  }

  loadCategoryName(categoryId: string): void {
    this.categoryService.getById(categoryId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categoryName = response.data.name;
        }
      },
      error: (err) => console.error('Error cargando la categoría del producto', err)
    });
  }

  onEditClick(): void {
    const overlay = document.querySelector('#hs-edit-product-modal');
    if (overlay) {
      const { HSOverlay } = window as any;
      if (HSOverlay) {
        HSOverlay.open(overlay);
      } else {
        overlay.classList.remove('hidden');
        overlay.classList.add('open');
      }
    }
  }

  onStatusClick(): void {
    if (!this.product) return;
    
    const isEnabled = this.product.enabled;
    const title = isEnabled ? 'Ocultar Producto' : 'Mostrar Producto';
    const message = isEnabled
      ? `¿Estás seguro de que deseas ocultar el producto "${this.product.name}"?`
      : `¿Estás seguro de que deseas mostrar el producto "${this.product.name}"?`;

    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.changeStatus(this.product!.id).subscribe({
          next: (response) => {
            if (response.success) {
              const successMessage = isEnabled
                ? `El producto se ha ocultado correctamente.`
                : `El producto se ha activado correctamente.`;
              Swal.fire('Estado Actualizado', successMessage, 'success');
              this.loadProduct(); // recargar datos
            } else {
              Swal.fire('Error de Operación', response.message || 'No se pudo actualizar el estado.', 'error');
            }
          },
          error: (err) => {
            const backendMessage = err.error?.message || err.message || 'Error al cambiar el estado.';
            Swal.fire('Error de Operación', backendMessage, 'error');
          },
        });
      }
    });
  }

  onDeleteClick(): void {
    if (!this.product) return;

    Swal.fire({
      title: 'Eliminar Producto',
      text: `¿Estás seguro de que deseas eliminar permanentemente el producto "${this.product.name}"? Esta acción no se puede deshacer.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.delete(this.product!.id).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire('Eliminado', 'El producto ha sido eliminado correctamente.', 'success').then(() => {
                this.router.navigate(['/dashboard/productos']);
              });
            } else {
              Swal.fire('Error', response.message || 'No se pudo eliminar el producto.', 'error');
            }
          },
          error: (err) => {
            const backendMessage = err.error?.message || err.message || 'Error al eliminar el producto.';
            Swal.fire('Error', backendMessage, 'error');
          }
        });
      }
    });
  }
}
