import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { LucideX, LucideUploadCloud } from '@lucide/angular';
import { ProductService } from '@core/service/products/product.service';
import { CategoryService } from '@core/service/categories/category.service';
import { CategoryResponse } from '@core/interfaces/categories/category.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-products-add',
  imports: [CommonModule, ReactiveFormsModule, LucideX, LucideUploadCloud],
  templateUrl: './add.html',
})
export class ComponentProductsAdd implements OnInit {
  @Output() addSuccess = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(/^[^0-9]*$/)]],
    shortDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(150)]],
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

    this.isLoading = true;
    const formValue = this.productForm.value;

    const request = {
      name: formValue.name,
      shortDescription: formValue.shortDescription,
      description: formValue.description || '',
      categoryId: formValue.categoryId,
      basePrice: Number(formValue.basePrice),
      preparationTime: Number(formValue.preparationTime),
      enabled: formValue.enabled
    };

    this.productService.create(request, this.selectedFile || undefined).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          Swal.fire('Éxito', 'Producto creado correctamente', 'success').then(() => {
            this.productForm.reset({ enabled: true, categoryId: '' });
            this.removeImage();
            this.addSuccess.emit();
            this.closeModal('#hs-add-product-modal');
            window.location.reload(); // Reload the list or rely on parent component
          });
        } else {
          Swal.fire('Error', response.message || 'No se pudo crear el producto.', 'error');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error al crear producto:', error);
        const msg = error.error?.message || 'Error al crear el producto. Verifica los datos o tu conexión.';
        Swal.fire('Error', msg, 'error');
      }
    });
  }

  onCancel(): void {
    this.productForm.reset({ enabled: true, categoryId: '' });
    this.removeImage();
    this.closeModal('#hs-add-product-modal');
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
