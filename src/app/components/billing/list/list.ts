import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingService } from '@core/service/billing/billing.service';
import { InvoiceResponse } from '@core/interfaces/billing/billing.interface';
import { ComponentSharedSearchBox } from '@components/shared/search-box/search-box';
import { ComponentSharedImport } from '@components/shared/import/import';
import { ComponentSharedFilters } from '@components/shared/filters/filters';
import { ComponentBillingTable } from '@components/billing/table/table';
import { ComponentSharedEmpty } from '@components/shared/empty/empty';
import { ComponentSharedPaginator } from '@components/shared/paginator/paginator';
import { ComponentBillingPdf } from '@components/billing/pdf/pdf';

@Component({
  selector: 'component-billing-list',
  imports: [
    CommonModule,
    ComponentSharedSearchBox,
    ComponentSharedImport,
    ComponentSharedFilters,
    ComponentBillingTable,
    ComponentSharedEmpty,
    ComponentSharedPaginator,
    ComponentBillingPdf
  ],
  templateUrl: './list.html',
})
export class ComponentBillingList implements OnInit {
  invoices: InvoiceResponse[] = [];
  filteredInvoices: InvoiceResponse[] = [];
  
  searchTerm: string = '';
  
  page: number = 0;
  totalPages: number = 1;
  totalElements: number = 0;

  selectedInvoice: InvoiceResponse | null = null;
  isPdfOpen: boolean = false;
  
  constructor(private billingService: BillingService) {}

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.billingService.getAllInvoices().subscribe({
      next: (res) => {
        if (res.data) {
          this.invoices = res.data;
          this.filterInvoices();
        }
      },
      error: (err) => {
        console.error('Error fetching invoices', err);
      }
    });
  }

  onSearchQueryChange(query: string) {
    this.searchTerm = query;
    this.filterInvoices();
  }

  filterInvoices() {
    if (!this.searchTerm) {
      this.filteredInvoices = this.invoices;
    } else {
      const lowerQuery = this.searchTerm.toLowerCase();
      this.filteredInvoices = this.invoices.filter(inv => 
        inv.customerName.toLowerCase().includes(lowerQuery) ||
        inv.series.toLowerCase().includes(lowerQuery) ||
        inv.number.toString().includes(lowerQuery)
      );
    }
    this.totalElements = this.filteredInvoices.length;
    this.totalPages = Math.ceil(this.totalElements / 10) || 1; // dummy pagination for now
  }

  onViewInvoice(invoice: InvoiceResponse) {
    this.selectedInvoice = invoice;
    this.isPdfOpen = true;
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    // real pagination logic would go here
  }
}
