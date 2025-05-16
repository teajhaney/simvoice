/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { fetchUserInvoices } from "@/lib/invoiceFunction";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Invoice } from "@/types/invoiceType";

export default function InvoiceDetail() {
  const { user } = useAuthStore((state) => state);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const invoiceId = params.id as string;

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!user?.uid) {
        toast.error("Please log in to view invoice");
        setLoading(false);
        return;
      }

      try {
        const invoices = await fetchUserInvoices(user.uid);
        const foundInvoice = invoices.find((inv) => inv.id === invoiceId);
        if (foundInvoice) {
          setInvoice(foundInvoice as Invoice);
        } else {
          toast.error("Invoice not found");
        }
      } catch (error: any) {
        toast.error(`Failed to load invoice: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [user, invoiceId]);

  const downloadInvoiceAsPDF = async () => {
    const element = document.getElementById("invoice-detail");
    if (!element) {
      toast.error("Invoice element not found");
      return;
    }

    const cloneContainer = document.createElement("div");
    cloneContainer.style.position = "absolute";
    cloneContainer.style.left = "-9999px";
    cloneContainer.style.width = "768px";
    cloneContainer.style.padding = "16px";
    cloneContainer.style.backgroundColor = "#fff";
    document.body.appendChild(cloneContainer);

    const clone = element.cloneNode(true) as HTMLElement;
    clone.classList.remove("grid-cols-1");
    clone.classList.add("xl:grid-cols-12");
    clone
      .querySelectorAll(".max-md\\:hidden")
      .forEach((el) => el.classList.remove("max-md:hidden"));
    clone.querySelectorAll(".max-md\\:flex-col").forEach((el) => {
      el.classList.remove("max-md:flex-col");
      el.classList.add("md:flex-row", "flex-row");
    });
    clone
      .querySelectorAll(".md\\:flex-row")
      .forEach((el) => el.classList.add("flex-row"));
    clone
      .querySelectorAll(".md\\:items-center")
      .forEach((el) => el.classList.add("items-center"));
    clone
      .querySelectorAll(".md\\:justify-between")
      .forEach((el) => el.classList.add("justify-between"));

    cloneContainer.appendChild(clone);

    try {
      const canvas = await html2canvas(clone, {
        scale: 2,
        width: 768,
        windowWidth: 768,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice_${invoice?.invoiceNumber || "untitled"}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF");
    } finally {
      document.body.removeChild(cloneContainer);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading invoice...</div>;
  }

  if (!invoice) {
    return <div className="text-center p-4">Invoice not found.</div>;
  }

  return (
    <div className="my-10 appMarginX">
      <h1 className="text-3xl font-bold mb-6">
        Invoice #{invoice.invoiceNumber}
      </h1>
      <div id="invoice-detail" className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-5">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <h2 className="text-2xl font-semibold">{invoice.businessName}</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="basis-7/12 space-y-3">
              <p>
                <strong>Bill To:</strong> {invoice.billTo}
              </p>
              {invoice.billFrom && (
                <p>
                  <strong>Bill From:</strong> {invoice.billFrom}
                </p>
              )}
            </div>
            <div className="basis-5/12 space-y-3">
              <p>
                <strong>Date:</strong> {invoice.date}
              </p>
              {invoice.dueDate && (
                <p>
                  <strong>Due Date:</strong> {invoice.dueDate}
                </p>
              )}
              {invoice.paymentTerm && (
                <p>
                  <strong>Payment Terms:</strong> {invoice.paymentTerm} days
                </p>
              )}
              {invoice.poNumber && (
                <p>
                  <strong>PO Number:</strong> {invoice.poNumber}
                </p>
              )}
            </div>
          </div>
          <div className="bg-black text-white rounded w-full max-md:hidden flex py-2 px-3 gap-5">
            <p className="basis-6/12">Item</p>
            <p className="basis-2/12 text-end">Quantity</p>
            <p className="basis-2/12 text-end">Rate ({invoice.currency})</p>
            <p className="basis-2/12 text-center">Amount</p>
          </div>
          <div className="flex flex-col gap-2">
            {invoice.items.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-5">
                <p className="basis-6/12">{item.description}</p>
                <p className="basis-2/12 text-end">{item.quantity}</p>
                <p className="basis-2/12 text-end">
                  {invoice.currency} {item.rate.toFixed(2)}
                </p>
                <p className="basis-2/12 text-center">
                  {invoice.currency} {(item.quantity * item.rate).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-5">
            <div className="basis-7/12 space-y-3">
              {invoice.notes && (
                <p>
                  <strong>Notes:</strong> {invoice.notes}
                </p>
              )}
              {invoice.termsAndConditions && (
                <p>
                  <strong>Terms:</strong> {invoice.termsAndConditions}
                </p>
              )}
            </div>
            <div className="basis-5/12 space-y-2">
              <div className="flex justify-between">
                <p>Sub Total</p>
                <p>
                  {invoice.currency} {invoice.subtotal.toFixed(2)}
                </p>
              </div>
              {invoice.discount && (
                <div className="flex justify-between">
                  <p>Discount (%)</p>
                  <p>{invoice.discount}%</p>
                </div>
              )}
              {invoice.tax && (
                <div className="flex justify-between">
                  <p>Tax (%)</p>
                  <p>{invoice.tax}%</p>
                </div>
              )}
              {invoice.shipping && (
                <div className="flex justify-between">
                  <p>Shipping ({invoice.currency})</p>
                  <p>
                    {invoice.currency} {invoice.shipping.toFixed(2)}
                  </p>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <p>Total</p>
                <p>
                  {invoice.currency} {invoice.total.toFixed(2)}
                </p>
              </div>
              {invoice.amountPaid && (
                <div className="flex justify-between">
                  <p>Amount Paid</p>
                  <p>
                    {invoice.currency} {invoice.amountPaid.toFixed(2)}
                  </p>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <p>Balance Due</p>
                <p>
                  {invoice.currency} {invoice.balanceDue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={downloadInvoiceAsPDF}
        className="mt-4 bg-primary text-white px-5 py-2 rounded hover:bg-primary-dark">
        Download PDF
      </button>
    </div>
  );
}
