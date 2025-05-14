
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { InvoiceFormData } from "./zodSchema";

export const saveInvoiceToFirestore = async (
  uid: string,
  invoiceData: InvoiceFormData
) => {
  try {
    if (!uid) {
      throw new Error("User ID is required");
    } else if (!invoiceData) {
      throw new Error("Invoice data is required");
    } else {
      const userInvoicesRef = collection(db, "users", uid, "invoices");
      await addDoc(userInvoicesRef, {
        ...invoiceData,
        createdAt: new Date(),
      });
    }
  } catch (err) {
    console.error("Failed to save invoice:", err);
    const errorMessage =
      err instanceof Error ? err.message : "An unexpected error occurred";
    throw new Error(errorMessage);
  }
};
