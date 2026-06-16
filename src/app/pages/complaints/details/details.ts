import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ComplaintService } from '@core/service/complaints/complaint.service';
import { ComplaintResponse } from '@core/interfaces/complaints/complaint.interface';

@Component({
  selector: 'page-complaints-details',
  imports: [CommonModule, RouterLink],
  templateUrl: './details.html',
})
export class PageComplaintsDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly complaintService = inject(ComplaintService);

  complaint: ComplaintResponse | null = null;
  isLoading = true;
  error: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadComplaint(id);
    } else {
      this.error = 'No se proporcionó un ID de reclamo.';
      this.isLoading = false;
    }
  }

  private loadComplaint(id: string): void {
    this.isLoading = true;
    this.complaintService.getById(id).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.data) {
          this.complaint = response.data;
        } else {
          this.error = response.message || 'No se pudo cargar el reclamo.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = 'Ocurrió un error al cargar el reclamo.';
        console.error('Error cargando reclamo', err);
      },
    });
  }
}
