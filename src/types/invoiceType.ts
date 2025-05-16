

export interface Invoice {
  id: string;
  invoiceNumber: string;
  businessName: string;
  billTo: string;
  billFrom?: string;
  date: string;
  paymentTerm?: number;
  dueDate?: string;
  poNumber?: number;
  items: { description: string; quantity: number; rate: number }[];
  notes?: string;
  termsAndConditions?: string;
  discount?: number;
  tax?: number;
  shipping?: number;
  amountPaid?: number;
  subtotal: number;
  total: number;
  balanceDue: number;
  currency: string;
}
