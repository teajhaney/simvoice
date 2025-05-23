/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { invoiceFormSchema } from "@/lib/zodSchema";
import { useAuthStore } from "@/stores/authStore";
import { saveInvoiceToFirestore } from "@/lib/invoiceFunction";
import toast from "react-hot-toast";
import { invoiceLabelStyles } from "@/styles";
import { useState, useEffect, useRef } from "react";
import { CurrencySelect, Input, InputTextArea } from "./Inputs";
import Button from "./Button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { LooadingSpinner } from "@/util/utils";

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

export default function InvoiceForm() {
  const { user } = useAuthStore((state) => state);
  const [isSubmitting, setIsSubmitting] = useState(false);

  //react hook form
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      items: [{ description: "", quantity: 1, rate: 0 }],
      currency: "NGN",
    },
  });
  const currency = watch("currency") || "NGN";
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const invoiceRef = useRef<HTMLDivElement>(null);

  //watching for quantity and rate change and calculating sub total
  const subtotal = fields.reduce((total, _, index) => {
    const quantity = watch(`items.${index}.quantity`) || 0;
    const rate = watch(`items.${index}.rate`) || 0;
    return total + quantity * rate;
  }, 0);

  // Watching for discount, tax, shipping, and parsing as numbers, will default to 0 if empty
  const discount = parseFloat(String(watch("discount") || "0"));
  const tax = parseFloat(String(watch("tax") || "0"));
  const shippingFee = parseFloat(String(watch("shipping") || "0"));

  // Calculating total: subtotal + tax + shipping - discount (all based on subtotal)
  const total =
    subtotal +
    (subtotal * tax) / 100 -
    (subtotal * discount) / 100 +
    shippingFee;

  //amount paid
  const amountPaid = parseFloat(String(watch("amountPaid") || "0"));

  // Calculate balance due
  const balanceDue = total - amountPaid;

  //submit/save function
  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);

    try {
      if (!user?.uid) {
        const toast = (await import("react-hot-toast")).default;
        toast.error("Please sign in to save invoice");
        return;
      }

      // Add calculated fields to the data
      const completeData = {
        ...data,
        subtotal,
        total,
        balanceDue,

        currency: "NGN",
      };

      await saveInvoiceToFirestore(user.uid, completeData);
      toast.success(`Invoice ${data.invoiceNumber} saved successfully!`);
    } catch (error: any) {
      console.error("Full error:", error);
      toast.error(`Save failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  //download pdf
  const downloadInvoiceAsPDF = async () => {
    const element = invoiceRef.current;
    if (!element) {
      toast.error("Invoice element not found");
      return;
    }

    // Create a hidden container to clone the invoice
    const cloneContainer = document.createElement("div");
    cloneContainer.style.position = "absolute";
    cloneContainer.style.left = "-9999px"; // Render off-screen
    cloneContainer.style.width = "1024px"; // Simulate md breakpoint (Tailwind's md is 768px)
    cloneContainer.style.padding = "16px"; // Match p-4
    cloneContainer.style.backgroundColor = "#fff"; // Ensure white background
    document.body.appendChild(cloneContainer);

    // Clone the invoice content
    const clone = element.cloneNode(true) as HTMLElement;
    clone.classList.remove(
      "grid-cols-1",
      "max-md:rounded",
      "max-md:border",
      "max-md:border-gray200",
      "max-md:p-2"
    );
    clone.classList.add("xl:grid-cols-12"); // Enforce xl:grid-cols-12 for layout
    clone
      .querySelectorAll(".max-md\\:hidden")
      .forEach((el) => el.classList.remove("max-md:hidden"));
    clone.querySelectorAll(".max-md\\:flex-col").forEach((el) => {
      el.classList.remove("max-md:flex-col");
      el.classList.add("md:flex-row", "flex-row");
    });
    clone
      .querySelectorAll(".max-md\\:self-end")
      .forEach((el) => el.classList.remove("max-md:self-end"));
    clone
      .querySelectorAll(".md\\:flex-row")
      .forEach((el) => el.classList.add("flex-row"));
    clone
      .querySelectorAll(".md\\:items-center")
      .forEach((el) => el.classList.add("items-center"));
    clone
      .querySelectorAll(".md\\:justify-between")
      .forEach((el) => el.classList.add("justify-between"));

    // Ensure table header is visible
    const tableHeader = clone.querySelector(".bg-black.text-accent");
    if (tableHeader) {
      tableHeader.classList.remove("max-md:hidden");
      tableHeader.classList.add("flex");
    }

    cloneContainer.appendChild(clone);

    try {
      const canvas = await html2canvas(clone, {
        scale: 2, // Higher resolution
        width: 1024, // Match md breakpoint width
        windowWidth: 1024, // Force viewport to md size
        backgroundColor: "#ffffff", // Ensure white background
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if content overflows
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`invoice_${watch("invoiceNumber") || "untitled"}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast.error("Failed to generate PDF");
    } finally {
      // Clean up
      document.body.removeChild(cloneContainer);
    }
  };
  useEffect(() => {
    console.log("invoice error:", errors);
  }, [errors]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="my-10  appMarginX  gap-5 grid grid-cols-1  xl:grid-cols-12">
      <div className="xl:col-span-10  bg-background" ref={invoiceRef}>
        <div className="space-y-5 flex flex-col p-4 text w-full">
          {/* flex 1 */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <div className="flex">
              {" "}
              <Input
                id="invoiceNumber"
                label="INVOICE"
                labelClassName="hidden"
                type="number"
                register={register}
                errors={errors}
                placeholder="#"
                className="no-spinner"
              />
            </div>
          </div>
          {/* flex 2 */}
          <div className="flex flex-col md:flex-row  md:items-center  gap-3  ">
            {/* div 1 */}
            <div className="basis-7/12 space-y-3">
              <InputTextArea
                id="businessName"
                type="text"
                placeholder="Business name"
                register={register}
                errors={errors}
                divClassName="w-8/12"
              />
              <div className="flex flex-col gap-x-5 space-y-3 md:flex-row md:justify-between md:items-center w-full">
                <InputTextArea
                  id="billTo"
                  type="text"
                  label="Bill To"
                  placeholder="Who is this to"
                  register={register}
                  errors={errors}
                  divClassName="w-full"
                />
                <InputTextArea
                  id="billFrom"
                  type="text"
                  label="Bill From"
                  placeholder="(optional)"
                  register={register}
                  errors={errors}
                  divClassName="w-full"
                />
              </div>
            </div>
            {/* div 2 */}
            <div className="basis-5/12 space-y-3 max-sm:self-end ">
              <Input
                id="date"
                max={new Date().toISOString().split("T")[0]}
                label="Date"
                type="date"
                register={register}
                errors={errors}
                labelClassName="text-end"
                placeholder="#"
                divClassName="!flex !flex-row"
              />
              <Input
                id="paymentTerm"
                label="Payment Terms"
                type="number"
                register={register}
                errors={errors}
                labelClassName="text-end"
                placeholder="#"
                divClassName="!flex !flex-row"
                className="no-spinner"
              />
              <Input
                id="dueDate"
                label="Due Date"
                type="date"
                register={register}
                errors={errors}
                labelClassName="text-end"
                placeholder="#"
                divClassName="!flex !flex-row"
              />
              <Input
                id="poNumber"
                label="PO Number"
                type="number"
                register={register}
                errors={errors}
                labelClassName="text-end"
                placeholder="#"
                divClassName="!flex !flex-row"
                className="no-spinner"
              />
            </div>
          </div>
          <div className="bg-black text-accent rounded w-full max-md:hidden flex py-2 px-3 gap-5">
            <p className="basis-6/12">Item</p>
            <p className="basis-2/12 text-end">Quantity</p>
            <p className="basis-2/12 text-end">Rate ({watch("currency")})</p>
            <p className="basis-2/12 text-center">Amount</p>
          </div>
          <div className="flex flex-col gap-2 max-md:rounded max-md:border max-md:border-gray200 max-md:p-2">
            {fields.map((field, index) => {
              const quantity = watch(`items.${index}.quantity`) || 0;
              const rate = watch(`items.${index}.rate`) || 0;
              const amount = quantity * rate;

              return (
                <div
                  key={field.id}
                  className="group flex flex-col md:flex-row md:items-center gap-5 ">
                  <Input
                    labelClassName="!hidden"
                    divClassName="!w-full !basis-6/12"
                    id={`items.${index}.description`}
                    type="text"
                    register={register}
                    errors={errors}
                    placeholder="Description of items/service"
                  />
                  <div className="basis-6/12 w-full flex gap-5 items-center relative">
                    <Input
                      labelClassName="!hidden"
                      divClassName="!w-full "
                      id={`items.${index}.quantity`}
                      type="number"
                      register={register}
                      errors={errors}
                      className="no-spinner text-end"
                    />
                    <Input
                      labelClassName="!hidden"
                      divClassName="!w-full "
                      id={`items.${index}.rate`}
                      type="number"
                      register={register}
                      errors={errors}
                      className="no-spinner text-end"
                    />
                    <div className="w-full text-center text-sm">
                      {watch("currency")} {amount.toFixed(2)}
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:flex text-red500 text-lg">
                      x
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              className="w-fit text-customGreenborder border-customGreen rounded p-2"
              onClick={() => append({ description: "", quantity: 1, rate: 0 })}>
              + Add Item
            </button>
          </div>

          {/* flex 3 */}
          <div className="flex flex-col md:flex-row  gap-5">
            {/* 1 */}
            <div className="basis-7/12 space-y-5 w-full">
              <InputTextArea
                id="notes"
                type="text"
                label="Notes"
                placeholder="Notes- any relevant information not already covered"
                register={register}
                errors={errors}
                divClassName="w-full"
              />
              <InputTextArea
                id="termsAndConditions"
                type="text"
                label="Terms And Conditions"
                placeholder="Terms and conditions applied"
                register={register}
                errors={errors}
                divClassName="w-full"
              />
            </div>
            {/* 2 */}
            <div className="basis-5/12 space-y-2">
              <div className="flex  justify-between items-center">
                <h1 className={`${invoiceLabelStyles} text-end`}>Sub Total</h1>
                <p className="block text-sm lg:text-md text-primary text-end  w-full px-2 py-2">
                  {watch("currency")} {subtotal.toFixed(2)}
                </p>
              </div>
              <Input
                id="discount"
                label="Discount (%)"
                type="number"
                register={register}
                errors={errors}
                placeholder="%"
                className="no-spinner"
                divClassName="!flex !flex-row"
                labelClassName="text-end"
              />
              <Input
                id="tax"
                label="Tax (%)"
                type="number"
                register={register}
                errors={errors}
                placeholder="%"
                className="no-spinner"
                divClassName="!flex !flex-row"
                labelClassName="text-end"
              />
              <Input
                id="shippingFee"
                label={`shipping (${watch("currency")})`}
                type="number"
                register={register}
                errors={errors}
                placeholder={currency}
                className="no-spinner"
                divClassName="!flex !flex-row"
                labelClassName="text-end"
              />
              <div className="flex  justify-between items-center">
                <h1 className={`${invoiceLabelStyles} text-end`}>Total</h1>
                <p className="block text-sm lg:text-md text-primary text-end w-full px-2 py-2">
                  {currency} {total.toFixed(2)}
                </p>
              </div>
              <Input
                id="amountPaid"
                label={`Amount paid (${watch("currency")})`}
                type="number"
                register={register}
                errors={errors}
                placeholder={currency}
                className="no-spinner"
                divClassName="!flex !flex-row"
                labelClassName="text-end"
              />
              <div className="flex  justify-between items-center">
                <h1 className={`${invoiceLabelStyles} text-end`}>
                  Balance due
                </h1>
                <p className="block text-sm lg:text-md text-primary text-end w-full px-2 py-2">
                  {watch("currency")} {balanceDue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="xl:col-span-2 flex flex-col  max-xl:items-end gap-2 h-fit">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[200px]  bg-primary rounded px-5 py-2 cursor-pointer hover:border hover:border-primary !text-white">
          {isSubmitting ? (
            <LooadingSpinner className="border-white h-8 w-8 border-dashed border-2" />
          ) : (
            <p className=" md:text-sm  lg:text-xl">Save invoice</p>
          )}
        </Button>

        <Button
          type="button"
          onClick={downloadInvoiceAsPDF}
          className="min-w-[200px]  bg-primary rounded px-5 py-2 cursor-pointer hover:border hover:border-primary !text-white">
          <p className=" md:text-sm  lg:text-xl">Download</p>
        </Button>
        <hr className="border-b border-dotted border-primary" />
        <div className="flex flex-col items-center gap-2">
          <label
            htmlFor="currency"
            className={invoiceLabelStyles + "text-textColor"}>
            Currency:
          </label>
          <CurrencySelect
            id="currency"
            register={register}
            errors={errors}
            className="min-w-[200px] text-textColor"
          />
        </div>
      </div>
    </form>
  );
}
