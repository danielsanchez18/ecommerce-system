import { Component, inject, OnInit } from '@angular/core';
import { ComponentCategoriesDetailsCard } from '@components/categories/details/card/card';
import { ComponentCategoriesDetailsProducts } from '@components/categories/details/products/products';
import { ComponentSharedToast } from '@components/shared/toast/toast';
import { ComponentCategoriesEdit } from '@components/categories/edit/edit';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '@core/service/categories/category.service';
import { ProductService } from '@core/service/products/product.service';
import { CategoryResponse } from '@core/interfaces/categories/category.interface';
import { ProductResponse } from '@core/interfaces/products/product.interface';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'page-categories-details',
  imports: [
    CommonModule,
    RouterLink,
    ComponentCategoriesDetailsCard,
    ComponentCategoriesDetailsProducts,
    ComponentSharedToast,
    ComponentCategoriesEdit,
  ],
  templateUrl: './details.html',
})
export class PageCategoriesDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  categoryId: string = '';
  category: CategoryResponse | null = null;

  products: ProductResponse[] = [];
  page: number = 0;
  size: number = 4;
  totalPages: number = 0;
  totalProducts: number = 0;

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';
    if (this.categoryId) {
      this.loadCategory();
      this.loadProducts();
    } else {
      this.router.navigate(['/dashboard/categorias']);
    }
  }

  loadCategory(): void {
    this.categoryService.getById(this.categoryId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.category = response.data;
        } else {
          Swal.fire('Error', 'No se pudo cargar la categoría', 'error');
          this.router.navigate(['/dashboard/categorias']);
        }
      },
      error: (err) => {
        console.error('Error cargando categoría', err);
        Swal.fire('Error', 'Ocurrió un error al cargar la categoría', 'error');
        this.router.navigate(['/dashboard/categorias']);
      },
    });
  }

  loadProducts(): void {
    this.productService
      .getAll({ categoryId: this.categoryId, page: this.page, size: this.size })
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.products = response.data.content;
            this.totalPages = response.data.totalPages;
            this.totalProducts = response.data.totalElements;
          }
        },
        error: (err) => {
          console.error('Error cargando productos', err);
        },
      });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadProducts();
  }

  onEditClick(): void {
    const overlay = document.querySelector('#hs-edit-category-modal');
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
    if (!this.category) return;

    const isEnabled = this.category.enabled;
    const title = isEnabled ? 'Ocultar Categoría' : 'Mostrar Categoría';
    const message = isEnabled
      ? `¿Estás seguro de que deseas ocultar la categoría "${this.category.name}"?`
      : `¿Estás seguro de que deseas mostrar la categoría "${this.category.name}"?`;

    Swal.fire({
      title: title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.changeStatus(this.category!.id).subscribe({
          next: (response) => {
            if (response.success) {
              const successMessage = isEnabled
                ? `La categoría se ha ocultado correctamente.`
                : `La categoría se ha activado correctamente.`;
              Swal.fire('Estado Actualizado', successMessage, 'success');
              this.loadCategory(); // recargar datos
            } else {
              Swal.fire(
                'Error de Operación',
                response.message || 'No se pudo actualizar el estado.',
                'error',
              );
            }
          },
          error: (err) => {
            const backendMessage =
              err.error?.message ||
              err.message ||
              'Error al cambiar el estado.';
            Swal.fire('Error de Operación', backendMessage, 'error');
          },
        });
      }
    });
  }

  onDeleteClick(): void {
    if (!this.category) return;

    Swal.fire({
      title: 'Eliminar Categoría',
      text: `¿Estás seguro de que deseas eliminar permanentemente la categoría "${this.category.name}"? Esta acción no se puede deshacer.`,
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.delete(this.category!.id).subscribe({
          next: (response) => {
            if (response.success) {
              Swal.fire(
                'Eliminada',
                'La categoría ha sido eliminada correctamente.',
                'success',
              ).then(() => {
                this.router.navigate(['/dashboard/categorias']);
              });
            } else {
              Swal.fire(
                'Error',
                response.message || 'No se pudo eliminar la categoría.',
                'error',
              );
            }
          },
          error: (err) => {
            const backendMessage =
              err.error?.message ||
              err.message ||
              'Error al eliminar la categoría.';
            Swal.fire('Error', backendMessage, 'error');
          },
        });
      }
    });
  }
}
