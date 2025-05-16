/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  collection,
  addDoc,
  query,
  getDocs,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";
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

//fetch invoice

export const fetchUserInvoices = async (uid: string) => {
  try {
    const invoicesRef = collection(db, "users", uid, "invoices");
    const q = query(invoicesRef);
    const querySnapshot = await getDocs(q);

    const invoices = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return invoices;
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw new Error("Failed to fetch invoices");
  }
};

// fetch live invoice

export const subscribeToUserInvoices = (
  uid: string,
  callback: (invoices: any[]) => void
) => {
  const invoicesRef = collection(db, "users", uid, "invoices");
  const q = query(invoicesRef);

  return onSnapshot(q, (querySnapshot) => {
    const invoices = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(invoices);
  });
};

//delete invoice
export const deleteInvoice = async (userId: string, invoiceId: string) => {
  try {
    const invoiceRef = doc(db, `users/${userId}/invoices`, invoiceId);
    await deleteDoc(invoiceRef);
  } catch (error:any) {
    throw new Error(`Failed to delete invoice: ${error.message}`);
  }
};
