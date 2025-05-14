"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { invoiceFormSchema } from "@/lib/zodSchema";
import { useAuthStore } from "@/stores/authStore";
import { generatePDF, saveInvoiceToFirestore } from "@/lib/invoiceFunction";
import toast from "react-hot-toast";
import { Input, InputTextArea } from "@/component";

type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

export default function InvoiceForm() {
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
      <div className="flex flex-col md:flex-row  md:items-center md:justify-between gap-3  ">
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
        <div className="basis-2/12 space-y-3 max-sm:self-end ">
          <Input
            id="date"
            label="Date"
            type="date"
            register={register}
            errors={errors}
            placeholder="#"
            divClassName="!flex !flex-row"
            labelClassName="!w-25"
          />
          <Input
            id="paymentTerm"
            label="Payment Terms"
            type="number"
            register={register}
            errors={errors}
            placeholder="#"
            divClassName="!flex !flex-row"
            labelClassName="!w-25"
            className="no-spinner"
          />
          <Input
            id="dueDate"
            label="Due Date"
            type="date"
            register={register}
            errors={errors}
            placeholder="#"
            divClassName="!flex !flex-row"
            labelClassName="!w-25"
          />
          <Input
            id="poNumber"
            label="PO Number"
            type="number"
            register={register}
            errors={errors}
            placeholder="#"
            divClassName="!flex !flex-row"
            labelClassName="!w-25"
            className="no-spinner"
          />
        </div>
      </div>
      <div className="bg-black text-accent rounded w-full max-md:hidden flex py-2 px-3 ">
        <p className="w-full basis-6/12">Item</p>
        <p className="w-full basis-2/12">Quantity</p>
        <p className="w-full basis-2/12">Rate</p>
        <p className="w-full basis-2/12 text-center">Amount</p>
      </div>
      <div className="flex flex-col gap-2 max-md:rounded max-md:border max-md:border-gray200 max-md:p-2">
        {fields.map((field, index) => {
          const quantity = watch(`items.${index}.quantity`) || 0;
          const rate = watch(`items.${index}.rate`) || 0;
          const amount = quantity * rate;

          return (
            <div
              key={field.id}
              className="group flex items-center gap-2 relative">
              <Input
                labelClassName="!hidden"
                divClassName="!w-full !basis-6/12"
                id={`items.${index}.description`}
                type="text"
                register={register}
                errors={errors}
                placeholder="Description of items/service"
              />
              <Input
                labelClassName="!hidden"
                divClassName="!w-full !basis-2/12"
                id={`items.${index}.quantity`}
                type="number"
                register={register}
                errors={errors}
                className="no-spinner"
              />
              <Input
                labelClassName="!hidden"
                divClassName="!w-full !basis-2/12"
                id={`items.${index}.rate`}
                type="number"
                register={register}
                errors={errors}
                className="no-spinner"
              />
              <div className="basis-2/12  w-full">
                {" "}
                <p className="basis-2/12 text-sm text-center">
                  NGN {amount.toFixed(2)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute right-0 top-1/2 -translate-y-1/2 hidden group-hover:flex text-customGreen text-lg">
                x
              </button>
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
    </form>
  );
}
