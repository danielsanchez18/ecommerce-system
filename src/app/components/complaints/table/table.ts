import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ComplaintResponse } from '../../../core/interfaces/complaints/complaint.interface';

@Component({
  selector: 'component-complaints-table',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './table.html',
})
export class ComponentComplaintsTable {
  @Input() complaints: ComplaintResponse[] = [];
}
