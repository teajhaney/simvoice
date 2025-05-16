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
import { IoIosArrowForward } from "react-icons/io";

export const InvoiceList = () => {
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvoices = async () => {
      if (!user?.uid) {
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

  ///
  const invoicePerPage = 10;
  const totalPages = Math.ceil(invoices.length / invoicePerPage);

  const startIndex = currentPage * invoicePerPage;
  const endIndex = startIndex + invoicePerPage;
  const displayedInvoices = invoices.slice(startIndex, endIndex);

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
  if (error) return <div className="text-red%00">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Invoices</h2>
      {displayedInvoices.length === 0 ? (
        <p className="text-red500 text-center">No invoices found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-background shadow-sm rounded-lg">
            <thead>
              <tr className="bg-customBackground rounded-3xl text-left text-sm font-semibold text-textColor">
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
              {displayedInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-t hover:bg-primary/50 transition rounded-lg">
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
                      className="inline-block bg-red500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* pagination */}
      {displayedInvoices.length > 0 && (
        <div className="flex gap-4 px-4">
          {/* generate buttons based on total pages */}
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                currentPage === index
                  ? "bg-primary text-white cursor-not-allowed"
                  : "bg-background hover:bg-accent border border-customBackground"
              }`}>
              {index + 1}
            </button>
          ))}
          {/* next button */}
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded-lg font-semibold border border-customBackground ${
              currentPage >= totalPages - 1
                ? "bg-accent cursor-not-allowed"
                : "bg-background hover:bg-accents"
            }`}
            disabled={currentPage >= totalPages - 1}>
            {" "}
            <IoIosArrowForward />
          </button>
        </div>
      )}
    </div>
  );
};
