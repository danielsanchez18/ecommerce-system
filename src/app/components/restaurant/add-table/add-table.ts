import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideX } from '@lucide/angular';
import { TableService } from '@core/service/tables/table.service';
import Swal from 'sweetalert2';

declare const HSOverlay: any;

@Component({
  selector: 'component-restaurant-add-table',
  imports: [CommonModule, ReactiveFormsModule, LucideX],
  templateUrl: './add-table.html',
})
export class ComponentRestaurantAddTable {
  @Output() tableCreated = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly tableService = inject(TableService);

  tableForm: FormGroup = this.fb.group({
    tableNumber: ['', [Validators.required, Validators.min(1)]],
    capacity: ['', [Validators.required, Validators.min(1)]]
  });

  isSubmitting = false;

  onSubmit() {
    if (this.tableForm.invalid) {
      this.tableForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.tableService.create(this.tableForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          Swal.fire({
            title: 'Mesa Creada',
            text: 'La mesa se ha registrado exitosamente',
            icon: 'success',
            confirmButtonColor: '#3085d6'
          });
          this.tableForm.reset();
          this.tableCreated.emit();
          HSOverlay.close('#hs-add-table-modal');
        } else {
          Swal.fire({
            title: 'Error',
            text: response.message || 'No se pudo crear la mesa',
            icon: 'error',
            confirmButtonColor: '#3085d6'
          });
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = err.error?.message || err.message || 'Error al comunicarse con el servidor';
        Swal.fire({
          title: 'Error',
          text: msg,
          icon: 'error',
          confirmButtonColor: '#3085d6'
        });
      }
    });
  }

  closeModal() {
    this.tableForm.reset();
    HSOverlay.close('#hs-add-table-modal');
  }
}
