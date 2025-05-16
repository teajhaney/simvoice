import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Invoice } from "@/types/invoiceType";

interface InvoiceCacheState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  setInvoices: (invoices: Invoice[]) => void;
  setCurrentInvoice: (invoice: Invoice) => void;
  clearCache: () => void;
}

export const useInvoiceCache = create<InvoiceCacheState>()(
  persist(
    (set) => ({
      invoices: [],
      currentInvoice: null,
      setInvoices: (invoices) => set({ invoices }),
      setCurrentInvoice: (currentInvoice) => set({ currentInvoice }),
      clearCache: () => set({ invoices: [], currentInvoice: null }),
    }),
    {
      name: "invoice-cache",
    }
  )
);

