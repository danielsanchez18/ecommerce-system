import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ComponentSharedSearchBox } from '@components/shared/search-box/search-box';
import { ComponentSharedImport } from '@components/shared/import/import';
import { ComponentSharedFilters } from '@components/shared/filters/filters';
import { ComponentSharedEmpty } from '@components/shared/empty/empty';
import { ComponentCategoriesTable } from '../table/table';
import { ComponentSharedPaginator } from '@components/shared/paginator/paginator';
import { CategoryService } from '@core/service/categories/category.service';
import { ProductService } from '@core/service/products/product.service';
import { Router } from '@angular/router';
import { CategoryResponse } from '@core/interfaces/categories/category.interface';
import { catchError, forkJoin, map, of } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-categories-list',
  imports: [
    ComponentSharedSearchBox,
    ComponentSharedImport,
    ComponentSharedFilters,
    ComponentSharedEmpty,
    ComponentCategoriesTable,
    ComponentSharedPaginator,
  ],
  templateUrl: './list.html',
})
export class ComponentCategoriesList {
  // Inyección de dependencias
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);

  @Output() requestConfirm = new EventEmitter<{
    title: string;
    message: string;
    onConfirm: () => void;
  }>();

  @Output() requestSuccess = new EventEmitter<{
    title: string;
    message: string;
  }>();

  @Output() requestError = new EventEmitter<{
    title: string;
    message: string;
  }>();

  @Output() editClick = new EventEmitter<CategoryResponse>();

  // Estado del listado y paginación
  categories: CategoryResponse[] = [];
  searchTerm: string = '';
  page: number = 0;
  size: number = 10;
  totalPages: number = 0;
  totalElements: number = 0;
  isLoading: boolean = false;

  // Mapa para almacenar la cantidad de productos por categoría
  productCounts: { [categoryId: string]: number } = {};

  ngOnInit(): void {
    this.loadCategories();
  }

  /**
   * Carga el listado de categorías aplicando el filtro de búsqueda por nombre y paginación.
   */
  loadCategories(): void {
    this.isLoading = true;
    this.categoryService
      .getAll({
        name: this.searchTerm || undefined,
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success && response.data) {
            this.categories = response.data.content;
            this.totalPages = response.data.totalPages;
            this.totalElements = response.data.totalElements;
            this.loadProductCounts();
          } else {
            this.categories = [];
            this.totalPages = 0;
            this.totalElements = 0;
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error al cargar categorías en la lista:', err);
          this.categories = [];
          this.totalPages = 0;
          this.totalElements = 0;
        },
      });
  }

  /**
   * Responde a los cambios en el input de búsqueda del SearchBox.
   * Resetea el paginador a la primera página y recarga los datos.
   */
  onSearchQueryChange(query: string): void {
    this.searchTerm = query;
    this.page = 0;
    this.loadCategories();
  }

  /**
   * Responde a los eventos del paginador.
   */
  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadCategories();
  }

  /**
   * Redirige al detalle de la categoría especificada.
   */
  onViewCategory(id: string): void {
    this.router.navigate(['/dashboard/categorias', id]);
  }

  /**
   * Al hacer click en el botón de cambiar estado (deshabilitar/ocultar).
   * Emite el modal de confirmación con SweetAlert para realizar la llamada al servicio.
   */
  onStatusChange(category: CategoryResponse): void {
    const title = category.enabled ? 'Ocultar Categoría' : 'Mostrar Categoría';
    const message = category.enabled
      ? `¿Estás seguro de que deseas ocultar la categoría "${category.name}"?`
      : `¿Estás seguro de que deseas mostrar la categoría "${category.name}"?`;

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
        this.categoryService.changeStatus(category.id).subscribe({
          next: (response) => {
            if (response.success) {
              const successMessage = category.enabled
                ? `La categoría "${category.name}" se ha ocultado correctamente.`
                : `La categoría "${category.name}" se ha activado correctamente.`;
              Swal.fire('Estado Actualizado', successMessage, 'success');
              this.loadCategories();
            } else {
              Swal.fire('Error de Operación', response.message || 'No se pudo actualizar el estado de la categoría.', 'error');
            }
          },
          error: (err) => {
            const backendMessage =
              err.error?.message ||
              err.message ||
              'Error al cambiar el estado de la categoría.';
            Swal.fire('Error de Operación', backendMessage, 'error');
          },
        });
      }
    });
  }

  /**
   * Consulta en paralelo el número de productos asociados a cada categoría cargada.
   */
  private loadProductCounts(): void {
    if (this.categories.length === 0) return;

    const requests = this.categories.map((category) =>
      this.productService.getAll({ categoryId: category.id, size: 1 }).pipe(
        map((res) => ({
          categoryId: category.id,
          count: res.success && res.data ? res.data.totalElements : 0,
        })),
        catchError(() => of({ categoryId: category.id, count: 0 })),
      ),
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        const counts: { [categoryId: string]: number } = {};
        results.forEach((res) => {
          counts[res.categoryId] = res.count;
        });
        this.productCounts = counts;
      },
      error: (err) => {
        console.error(
          'Error al cargar conteo de productos por categoría:',
          err,
        );
      },
    });
  }
}
