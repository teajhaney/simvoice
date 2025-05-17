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
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const invoiceId = params.id as string;

	useEffect(() => {
	  setLoading(true)
    const fetchInvoice = async () => {
      if (!user?.uid) {
        const toast = (await import("react-hot-toast")).default;
        toast.error("Please log in to view invoices");
        return;
      }
      setLoading(true);
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
    cloneContainer.style.width = "1024px";
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
        width: 1024,
        windowWidth: 1024,
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
    <div className="my-10  bg-customBackground " id="invoice-detail">
      <div className="appMarginX bg-background p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6">
          Invoice #{invoice.invoiceNumber}
        </h1>
        <div className="space-y-5">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <h2 className="text-2xl font-semibold">{invoice.businessName}</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-20">
            <div className="basis-7/12 space-y-3 flex flex-col gap-x-5  md:flex-row md:justify-between  w-full ">
              <div className="flex w-full ">
                <strong className=" w-20">Bill To:</strong>
                <p className="w-full ">{invoice.billTo}</p>
              </div>
              <div className="flex w-full ">
                <strong className="min-w-20">Bill From:</strong>
                {invoice.billFrom && (
                  <p className="w-full">{invoice.billFrom}</p>
                )}
              </div>
            </div>
            <div className="basis-5/12 space-y-3 w-full flex flex-col items-end ">
              <div className="flex w-full">
                <strong className="w-full">Date:</strong>
                <p className="w-full">{invoice.date}</p>
              </div>
              <div className="flex w-full">
                <strong className="w-full">Payment Terms:</strong>
                {invoice.paymentTerm && (
                  <p className="w-full">{invoice.paymentTerm} days</p>
                )}
              </div>
              <div className="flex w-full">
                <strong className="w-full">Due Date::</strong>
                {invoice.dueDate && <p className="w-full">{invoice.dueDate}</p>}
              </div>

              <div className="flex w-full">
                <strong className="w-full">PO Number:</strong>
                {invoice.poNumber && (
                  <p className="w-full">{invoice.poNumber}</p>
                )}
              </div>
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
                <p className="basis-2/12 text-end truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  {invoice.currency} {item.rate.toFixed(2).trim()}
                </p>
                <p className="basis-2/12 text-center">
                  {invoice.currency} {(item.quantity * item.rate).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex flex-col md:flex-row gap-10">
            <div className="basis-9/12 space-y-3">
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
            <div className="basis-3/12 space-y-2">
              <div className="flex w-full justify-between truncate overflow-hidden text-ellipsis whitespace-nowrap">
                <strong className="w-full">Sub Total</strong>
                <p className="w-full">
                  {invoice.currency} {invoice.subtotal.toFixed(2)}
                </p>
              </div>
              {invoice.discount && (
                <div className="flex w-full justify-between">
                  <strong className="w-full">Discount (%)</strong>
                  <p className="w-full">{invoice.discount}%</p>
                </div>
              )}
              {invoice.tax && (
                <div className="flex w-full justify-between">
                  <strong className="w-full">Tax (%)</strong>
                  <p className="w-full">{invoice.tax}%</p>
                </div>
              )}
              {invoice.shipping && (
                <div className="flex w-full justify-between truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  <strong className="w-full">
                    Shistrongping ({invoice.currency})
                  </strong>
                  <p className="w-full">
                    {invoice.currency} {invoice.shipping.toFixed(2)}
                  </p>
                </div>
              )}
              <div className="flex w-full justify-between truncate overflow-hidden text-ellipsis whitespace-nowrap">
                <strong className="w-full">Total</strong>
                <p className="w-full">
                  {invoice.currency} {invoice.total.toFixed(2)}
                </p>
              </div>
              {invoice.amountPaid && (
                <div className="flex w-full justify-between truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  <strong className="w-full">Amount Paid</strong>
                  <p className="w-full">
                    {invoice.currency} {invoice.amountPaid.toFixed(2)}
                  </p>
                </div>
              )}
              <div className="flex w-full justify-between truncate overflow-hidden text-ellipsis whitespace-nowrap">
                <strong className="w-full">Balance Due</strong>
                <p className="w-full">
                  {invoice.currency} {invoice.balanceDue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={downloadInvoiceAsPDF}
            className="mt-4 bg-primary text-white px-5 py-2 rounded hover:bg-primary-dark ">
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
