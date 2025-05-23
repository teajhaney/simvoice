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
import { Button } from "@/component";
import { useRouter } from "next/navigation";

export const InvoiceList = () => {
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [error, setError] = useState("");
  const navigate = useRouter();

  //fetch user invoice on page load
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const loadInvoices = async () => {
      if (user?.uid) {
        const storedInvoices = localStorage.getItem(`invoices-${user.uid}`);
        if (storedInvoices) {
          setInvoices(JSON.parse(storedInvoices) as Invoice[]);
        } else {
          try {
            setLoading(true);
            const userInvoices = await fetchUserInvoices(user.uid);
            setInvoices(userInvoices as Invoice[]);
            localStorage.setItem(
              `invoices-${user.uid}`,
              JSON.stringify(userInvoices)
            );
          } catch (err) {
            setError("Failed to load invoices");
            console.error(err);
          } finally {
            setLoading(false);
          }
        }
        //real time update
        unsubscribe = subscribeToUserInvoices(user.uid, (invoices) => {
          setInvoices(invoices);
          localStorage.setItem(
            `invoices-${user.uid}`,
            JSON.stringify(invoices)
          );
        });
      }
    };

    loadInvoices();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uid]);

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
  {
    if (loading)
      <div className=" flex items-center justify-center">
        <LooadingSpinner className="border-primary h-8 w-8 border-dashed border-2" />
      </div>;
  }
  if (error) return <div className="text-red%00">{error}</div>;

  return (
    <div className="space-y-4">
      {displayedInvoices.length > 0 && (
        <div className="flex justify-between">
          {" "}
          <h2 className="text-sm lg:text-lg font-bold">Your Invoices</h2>
          <Button
            type="button"
            onClick={() => navigate.push("/")}
            className="  bg-primary rounded  p-2 cursor-pointer hover:border hover:border-primary !text-white">
            <p className="text-xs md:text-sm  ">Create new invoice</p>
          </Button>
        </div>
      )}
      {displayedInvoices.length === 0 ? (
        <div className="flex flex-col items-center gap-5">
          <p className="text-red500 text-center">No invoices found</p>
          <Button
            type="button"
            onClick={() => navigate.push("/")}
            className="min-w-[200px]  bg-primary rounded px-5 py-2 cursor-pointer hover:border hover:border-primary !text-white">
            <p className="text-xs md:text-sm  lg:text-lg">Create new invoice</p>
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-background shadow-sm rounded-lg">
            <thead>
              <tr className="bg-customBackground rounded-3xl text-left text-sm font-semibold text-textColor">
                <th className="p-4"></th>
                <th className="p-4 text-xs lg:text-sm">Customer Name</th>
                <th className="p-4 text-xs lg:text-sm">Reference</th>
                <th className="p-4 text-xs lg:text-sm">Date</th>
                <th className="p-4 text-xs lg:text-sm">Due Date</th>
                <th className="p-4 text-xs lg:text-sm">Total</th>
                <th className="p-4 "></th>
              </tr>
            </thead>
            <tbody>
              {displayedInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-t hover:bg-primary/50 transition rounded-lg">
                  <td className="p-4 text-xs lg:text-sm">
                    <Link
                      href={`/history/${invoice.id}`}
                      className="inline-block bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary-dark">
                      View
                    </Link>
                  </td>
                  <td className="p-4 text-xs lg:text-sm">{invoice.billTo}</td>
                  <td className="p-4 text-xs lg:text-sm">
                    #{invoice.invoiceNumber}
                  </td>
                  <td className="p-4 text-xs lg:text-sm">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-xs lg:text-sm">
                    {invoice.dueDate
                      ? new Date(invoice.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-4 text-xs lg:text-sm">
                    {invoice.currency || "NGN"} {invoice.balanceDue?.toFixed(2)}
                  </td>
                  <td className="p-4 text-xs lg:text-sm text-right">
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
