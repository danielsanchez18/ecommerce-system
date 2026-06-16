import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'component-shared-toast',
  imports: [CommonModule, RouterLink],
  templateUrl: './toast.html',
})
export class ComponentSharedToast {
  @Input() btnDelete: boolean = false;
  @Input() btnRestore: boolean = false;

  @Input() btnEdit: boolean = false;
  @Input() btnSave: boolean = false;
  @Input() btnSaveChanges: boolean = false;
  @Input() btnCancel: boolean = false;

  @Input() btnExport: boolean = false;

  @Input() btnDisable: boolean = false;
  @Input() btnEnable: boolean = false;

  @Input() btnReject: boolean = false;
  @Input() btnReceipt: boolean = false;
  @Input() btnInvoice: boolean = false;

  @Output() deleteClick = new EventEmitter<void>();
  @Output() restoreClick = new EventEmitter<void>();
  @Output() editClick = new EventEmitter<void>();
  @Output() saveClick = new EventEmitter<void>();
  @Output() saveChangesClick = new EventEmitter<void>();
  @Output() disableClick = new EventEmitter<void>();
  @Output() enableClick = new EventEmitter<void>();
  @Output() rejectClick = new EventEmitter<void>();
  @Output() receiptClick = new EventEmitter<void>();
  @Output() invoiceClick = new EventEmitter<void>();
}
