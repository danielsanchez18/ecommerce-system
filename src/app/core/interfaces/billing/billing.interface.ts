export interface InvoiceResponse {
  id: string;
  orderId: string;
  type: string;
  series: string;
  number: number;
  issueDate: string;
  customerDocumentType: string;
  customerDocumentNumber?: string;
  customerName: string;
  customerAddress?: string;
  subtotal: number;
  igvAmount: number;
  totalAmount: number;
  pdfUrl?: string;
  status: string;
}

export interface InvoiceRequest {
  type: string;
  customerDocumentType: string;
  customerName: string;
  customerDocumentNumber?: string;
  customerAddress?: string;
}
