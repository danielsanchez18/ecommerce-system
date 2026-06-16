import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { LucideX, LucideUploadCloud } from '@lucide/angular';
import { ProductService } from '@core/service/products/product.service';
import { CategoryService } from '@core/service/categories/category.service';
import { CategoryResponse } from '@core/interfaces/categories/category.interface';
import { ProductResponse, ProductRequest } from '@core/interfaces/products/product.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-products-edit',
  imports: [CommonModule, ReactiveFormsModule, LucideX, LucideUploadCloud],
  templateUrl: './edit.html',
})
export class ComponentProductsEdit implements OnInit, OnChanges {
  @Input() product: ProductResponse | null = null;
  @Output() editSuccess = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[^0-9]*$/)]],
    shortDescription: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
    description: [''],
    categoryId: ['', [Validators.required]],
    basePrice: ['', [Validators.required, Validators.min(0.01)]],
    preparationTime: ['', [Validators.required, Validators.min(1)]],
    enabled: [true]
  });

  isDragging = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isLoading = false;

  categories: CategoryResponse[] = [];

  get nameControl(): AbstractControl | null {
    return this.productForm.get('name');
  }

  get shortDescriptionControl(): AbstractControl | null {
    return this.productForm.get('shortDescription');
  }

  get categoryIdControl(): AbstractControl | null {
    return this.productForm.get('categoryId');
  }

  get basePriceControl(): AbstractControl | null {
    return this.productForm.get('basePrice');
  }

  get preparationTimeControl(): AbstractControl | null {
    return this.productForm.get('preparationTime');
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.productForm.patchValue({
        name: this.product.name,
        shortDescription: this.product.shortDescription,
        description: this.product.description,
        categoryId: this.product.categoryId,
        basePrice: this.product.basePrice,
        preparationTime: this.product.preparationTime,
        enabled: this.product.enabled
      });
      
      this.imagePreview = this.product.imageUrl || null;
      this.selectedFile = null;
    }
  }

  loadCategories(): void {
    this.categoryService.getAll({ size: 500 }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categories = response.data.content;
        }
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  handleFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      Swal.fire('Error', 'Por favor selecciona un archivo de imagen válido', 'error');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('Error', 'La imagen no debe pesar más de 2MB', 'error');
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = e => {
      if (reader.result) {
        this.imagePreview = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      Swal.fire('Atención', 'Por favor completa correctamente todos los campos obligatorios.', 'warning');
      return;
    }

    if (!this.product) {
      return;
    }

    this.isLoading = true;
    const formValue = this.productForm.value;

    const request: ProductRequest = {
      name: formValue.name,
      shortDescription: formValue.shortDescription,
      description: formValue.description || '',
      categoryId: formValue.categoryId,
      basePrice: Number(formValue.basePrice),
      preparationTime: Number(formValue.preparationTime),
      enabled: formValue.enabled
    };

    this.productService.update(this.product.id, request, this.selectedFile || undefined).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          Swal.fire('Éxito', 'Producto actualizado correctamente', 'success').then(() => {
            this.editSuccess.emit();
            this.closeModal('#hs-edit-product-modal');
          });
        } else {
          Swal.fire('Error', response.message || 'No se pudo actualizar el producto.', 'error');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al actualizar producto:', error);
        const msg = error.error?.message || 'Error al actualizar el producto. Verifica los datos o tu conexión.';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  onCancel(): void {
    if (this.product) {
      this.ngOnChanges({
        product: {
          currentValue: this.product,
          previousValue: null,
          firstChange: false,
          isFirstChange: () => false
        }
      });
    }
    this.closeModal('#hs-edit-product-modal');
  }

  private closeModal(selector: string): void {
    const overlay = document.querySelector(selector);
    if (overlay) {
      const { HSOverlay } = window as any;
      if (HSOverlay) {
        HSOverlay.close(overlay);
      } else {
        overlay.classList.add('hidden');
        overlay.classList.remove('open');
      }
    }
  }
}
