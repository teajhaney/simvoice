"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { invoiceFormSchema } from "@/lib/zodSchema";
import { useAuthStore } from "@/stores/authStore";
import { generatePDF, saveInvoiceToFirestore } from "@/lib/invoiceFunction";
import toast from "react-hot-toast";
import { Input, InputTextArea } from "@/component";
import { invoiceLabelStyles } from "@/styles";

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

export default function InvoiceForm() {
  const currency = "NGN";
  const { user } = useAuthStore((state) => state); // Your custom auth hook
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
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const subtotal = fields.reduce((total, _, index) => {
    const quantity = watch(`items.${index}.quantity`) || 0;
    const rate = watch(`items.${index}.rate`) || 0;
    return total + quantity * rate;
  }, 0);

  // Watch for discount, tax, shipping, parse as numbers, default to 0 if empty
  const discount = parseFloat(String(watch("discount") || "0"));
  const tax = parseFloat(String(watch("tax") || "0"));
  const shippingFee = parseFloat(String(watch("shippingFee") || "0"));
  // Calculate total: subtotal + tax + shipping - discount (all based on subtotal)
  const total =
    subtotal +
    (subtotal * tax) / 100 -
    (subtotal * discount) / 100 +
    shippingFee;
	//amount paid 
	const amountPaid = parseFloat(String(watch("amountPaid") || "0"));
  // Calculate balance due
  const balanceDue = total - amountPaid;

  const onSubmit = async (data: InvoiceFormData) => {
    if (!user) return;
    console.log("Saving invoice for user:", user?.uid);
    console.log("Invoice data:", data);
    await saveInvoiceToFirestore(user.uid, data);
    toast.success("Invoiced successfully generated");
    generatePDF(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="my-10 appMarginX space-y p-4 bg-background space-y-5">
      {/* flex 1 */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div className="bg-gray100 w-50 h-20">
          <label
            className={`center text-xs cursor-pointer bg-gray200 rounded px-4 py-2 text-center w-full h-full ${
              errors.logo ? "border border-red500" : ""
            }`}>
            Upload Logo
            <input
              {...register("logo")}
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>{" "}
        <div className="flex">
          {" "}
          <Input
            id="invoiceNumber"
            label="INVOICE"
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
        <div className="basis-7/12">
          <InputTextArea
            id="businessName"
            type="text"
            placeholder="Business name"
            register={register}
            errors={errors}
            divClassName="w-8/12"
          />
          <div className="flex flex-col gap-x-5 md:flex-row md:justify-between md:items-center w-full">
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
        <p className="basis-2/12 text-end">Rate ({currency})</p>
        <p className="basis-2/12 text-end">Amount</p>
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
                <div className="w-full text-end text-sm">
                  {currency} {amount.toFixed(2)}
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
              {currency} {subtotal.toFixed(2)}
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
            label={`shipping (${currency})`}
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
            label={`Amount paid (${currency})`}
            type="number"
            register={register}
            errors={errors}
            placeholder={currency}
            className="no-spinner"
            divClassName="!flex !flex-row"
            labelClassName="text-end"
          />
          <div className="flex  justify-between items-center">
            <h1 className={`${invoiceLabelStyles} text-end`}>Balance due</h1>
            <p className="block text-sm lg:text-md text-primary text-end w-full px-2 py-2">
              {currency} {balanceDue.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
