import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ComponentSharedImport } from '@components/shared/import/import';
import { ComponentSharedSearchBox } from '@components/shared/search-box/search-box';
import { ComponentSharedFilters } from '@components/shared/filters/filters';
import { ComponentProductsTable } from '../table/table';
import { ComponentSharedEmpty } from '@components/shared/empty/empty';
import { ComponentSharedPaginator } from '@components/shared/paginator/paginator';
import { ProductService } from '@core/service/products/product.service';
import { CategoryService } from '@core/service/categories/category.service';
import { Router } from '@angular/router';
import { ProductResponse } from '@core/interfaces/products/product.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-products-list',
  imports: [
    ComponentSharedImport,
    ComponentSharedSearchBox,
    ComponentSharedFilters,
    ComponentProductsTable,
    ComponentSharedEmpty,
    ComponentSharedPaginator,
  ],
  templateUrl: './list.html',
})
export class ComponentProductsList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);

  @Output() editClick = new EventEmitter<ProductResponse>();

  products: ProductResponse[] = [];
  categoriesMap: Record<string, string> = {};
  
  searchTerm: string = '';
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  isLoading: boolean = false;

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.categoryService.getAll({ size: 500 }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          response.data.content.forEach((cat) => {
            this.categoriesMap[cat.id] = cat.name;
          });
        }
      },
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService
      .getAll({
        name: this.searchTerm || undefined,
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success && response.data) {
            this.products = response.data.content;
            this.totalPages = response.data.totalPages;
            this.totalElements = response.data.totalElements;
          } else {
            this.products = [];
            this.totalPages = 0;
            this.totalElements = 0;
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error al cargar productos en la lista:', err);
          this.products = [];
          this.totalPages = 0;
          this.totalElements = 0;
        },
      });
  }

  onSearchQueryChange(query: string): void {
    this.searchTerm = query;
    this.page = 0;
    this.loadProducts();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadProducts();
  }

  onViewProduct(id: string): void {
    this.router.navigate(['/dashboard/productos', id]);
  }

  onStatusChange(product: ProductResponse): void {
    const title = product.enabled ? 'Ocultar Producto' : 'Mostrar Producto';
    const message = product.enabled
      ? `¿Estás seguro de que deseas ocultar el producto "${product.name}"?`
      : `¿Estás seguro de que deseas mostrar el producto "${product.name}"?`;

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
        this.productService.changeStatus(product.id).subscribe({
          next: (response) => {
            if (response.success) {
              const successMessage = product.enabled
                ? `El producto "${product.name}" se ha ocultado correctamente.`
                : `El producto "${product.name}" se ha activado correctamente.`;
              Swal.fire('Estado Actualizado', successMessage, 'success');
              this.loadProducts();
            } else {
              Swal.fire('Error de Operación', response.message || 'No se pudo actualizar el estado del producto.', 'error');
            }
          },
          error: (err) => {
            const backendMessage = err.error?.message || err.message || 'Error al cambiar el estado del producto.';
            Swal.fire('Error de Operación', backendMessage, 'error');
          },
        });
      }
    });
  }
}
