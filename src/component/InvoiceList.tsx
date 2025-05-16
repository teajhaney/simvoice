"use client";

import { useEffect, useState } from "react";
import {
	deleteInvoice,
  fetchUserInvoices,
  subscribeToUserInvoices,
} from "@/lib/invoiceFunction";
import { useAuthStore } from "@/stores/authStore";
import Link from "next/link";
import { Invoice } from "@/types/invoiceType";
// import toast from "react-hot-toast";
import { LooadingSpinner } from "@/util/utils";

export const InvoiceList = () => {
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvoices = async () => {
      if (!user?.uid) {
        setLoading(false);
        const toast = (await import("react-hot-toast")).default;
        toast.error("Please log in to view invoices");
        return;
      }

      setLoading(true);
      try {
        const userInvoices = await fetchUserInvoices(user.uid);
        setInvoices(userInvoices as Invoice[]);
      } catch (err) {
        setError("Failed to load invoices");
        console.error(err);
      } finally {
        setLoading(false);
      }

      const unsubscribe = subscribeToUserInvoices(user.uid, (invoices) => {
        setInvoices(invoices);
      });

      return () => unsubscribe();
    };

    loadInvoices();
  }, [user?.uid]);

  if (loading) {
    return (
      <div className=" flex items-center justify-center">
        <LooadingSpinner className="border-primary h-8 w-8 border-dashed border-2" />
      </div>
    );
  }

  //delete handler
  const handleDelete = async (invoiceId: string) => {
    if (!user?.uid) {
      const toast = (await import("react-hot-toast")).default;
      toast.error("Please log in to delete invoices");
      return;
    }

    try {
      await deleteInvoice(user.uid, invoiceId);
      const toast = (await import("react-hot-toast")).default;
      toast.success("Invoice deleted successfully");
    } catch (err) {
      console.error(err);
      const toast = (await import("react-hot-toast")).default;
      toast.error("Failed to delete invoice");
    }
  };
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Invoices</h2>
      {invoices.length === 0 ? (
        <p className="text-red500 text-center">No invoices found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="p-4"></th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Reference</th>
                <th className="p-4">Date</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Total</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-t hover:bg-gray-50 transition">
                  <td className="p-4">
                    <Link
                      href={`/history/${invoice.id}`}
                      className="inline-block bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark">
                      View
                    </Link>
                  </td>
                  <td className="p-4">{invoice.billTo}</td>
                  <td className="p-4">#{invoice.invoiceNumber}</td>
                  <td className="p-4">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {invoice.dueDate
                      ? new Date(invoice.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-4">
                    {invoice.currency || "NGN"} {invoice.balanceDue?.toFixed(2)}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="inline-block bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
