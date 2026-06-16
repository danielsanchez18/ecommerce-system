import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LucideX, LucideUploadCloud } from '@lucide/angular';
import { CategoryService } from '@core/service/categories/category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'component-categories-add',
  imports: [CommonModule, ReactiveFormsModule, LucideX, LucideUploadCloud],
  templateUrl: './add.html',
})
export class ComponentCategoriesAdd {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categoryForm: FormGroup = this.fb.group({
    name: [
      '',
      [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[^0-9]*$/),
      ],
    ],
    description: ['', [Validators.required, Validators.maxLength(250)]],
    enabled: [true],
  });

  isDragging = false;
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  isLoading = false;

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
      Swal.fire(
        'Error',
        'Por favor selecciona un archivo de imagen válido',
        'error',
      );
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire('Error', 'La imagen no debe pesar más de 2MB', 'error');
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
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
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      Swal.fire(
        'Atención',
        'Por favor completa correctamente todos los campos obligatorios.',
        'warning',
      );
      return;
    }

    this.isLoading = true;
    const formValue = this.categoryForm.value;

    const request = {
      name: formValue.name,
      description: formValue.description,
      enabled: formValue.enabled,
    };

    this.categoryService
      .create(request, this.selectedFile || undefined)
      .subscribe({
        next: () => {
          this.isLoading = false;
          Swal.fire('Éxito', 'Categoría creada correctamente', 'success').then(
            () => {
              this.onCancel();
              this.closeModal('#hs-add-category-modal');
            },
          );
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error al crear categoría:', error);
          const msg =
            error.error?.message ||
            'Error al crear la categoría. Verifica los datos o tu conexión.';
          Swal.fire('Error', msg, 'error');
        },
      });
  }

  onCancel(): void {
    this.categoryForm.reset({ enabled: true });
    this.removeImage();
    this.closeModal('#hs-add-category-modal');
  }

  /**
   * Cierra un modal utilizando la API Javascript de Preline UI o classes de fallback.
   */
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
