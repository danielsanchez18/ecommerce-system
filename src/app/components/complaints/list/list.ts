import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplaintService } from '../../../core/service/complaints/complaint.service';
import { ComplaintResponse } from '../../../core/interfaces/complaints/complaint.interface';
import { Page } from '../../../core/interfaces/shared/page.interface';
import { ComponentSharedSearchBox } from '../../../components/shared/search-box/search-box';
import { ComponentSharedEmpty } from '../../../components/shared/empty/empty';
import { ComponentSharedPaginator } from '../../../components/shared/paginator/paginator';
import { ComponentComplaintsTable } from '../table/table';

@Component({
  selector: 'component-complaints-list',
  imports: [
    CommonModule,
    ComponentSharedSearchBox,
    ComponentSharedEmpty,
    ComponentSharedPaginator,
    ComponentComplaintsTable,
  ],
  templateUrl: './list.html',
})
export class ComponentComplaintsList implements OnInit {
  private complaintService = inject(ComplaintService);

  complaints: ComplaintResponse[] = [];
  page: Page<ComplaintResponse> | null = null;
  loading = false;
  currentPage = 0;
  pageSize = 10;
  searchQuery = '';

  ngOnInit(): void {
    this.loadComplaints(this.currentPage);
  }

  loadComplaints(pageIndex: number) {
    this.loading = true;
    this.currentPage = pageIndex;

    // Note: since the backend doesn't implement getAll, this might fail,
    // but the frontend is wired properly for when it does.
    this.complaintService
      .getAll({ page: this.currentPage, size: this.pageSize })
      .subscribe({
        next: (res) => {
          if (res.data) {
            this.page = res.data;
            this.complaints = res.data.content || [];
          } else {
            this.complaints = [];
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching complaints:', err);
          // Fallback for missing backend endpoint
          this.complaints = [];
          this.loading = false;
        },
      });
  }

  onPageChange(pageIndex: number) {
    this.loadComplaints(pageIndex);
  }

  onSearch(query: string) {
    this.searchQuery = query;
    this.loadComplaints(0);
  }
}
