/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import jsPDF from "jspdf";
import { z } from "zod";
import { invoiceFormSchema } from "./zodSchema";

export const saveInvoiceToFirestore = async (uid: string, invoiceData: any) => {
  try {
    const userInvoicesRef = collection(db, "users", uid, "invoices");
    await addDoc(userInvoicesRef, {
      ...invoiceData,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Failed to save invoice:", err);
    throw err;
  }
};

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

export const generatePDF = (data: InvoiceFormData) => {
  const doc = new jsPDF();
  doc.text(`Invoice #${data.invoiceNumber}`, 10, 10);
  doc.text(`Client: ${data.clientName}`, 10, 20);
  doc.text(`Email: ${data.clientEmail}`, 10, 30);
  doc.text(`Date: ${data.date}`, 10, 40);
  doc.text(`Due: ${data.dueDate}`, 10, 50);

  let y = 60;
  data.items.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.description} - Qty: ${item.quantity}, Price: $${
        item.price
      }`,
      10,
      y
    );
    y += 10;
  });

  doc.save(`Invoice_${data.invoiceNumber}.pdf`);
};
