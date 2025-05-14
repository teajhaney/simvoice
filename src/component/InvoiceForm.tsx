
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";

import { invoiceFormSchema } from "@/lib/zodSchema";
import { useAuthStore } from "@/stores/authStore";
import { generatePDF, saveInvoiceToFirestore } from "@/lib/invoiceFunction";
import toast from "react-hot-toast";
type InvoiceFormData = z.infer<typeof invoiceFormSchema>;

export default function InvoiceForm() {
  const { user } = useAuthStore((state) => state); // Your custom auth hook
  const { register, control, handleSubmit } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      invoiceNumber: "",
      date: "",
      dueDate: "",
      items: [{ description: "", quantity: 1, price: 0 }],
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
      className="space-y-6 max-w-3xl mx-auto p-4">
      <input
        {...register("clientName")}
        placeholder="Client Name"
        className="input"
      />
      <input
        {...register("clientEmail")}
        placeholder="Client Email"
        className="input"
      />
      <input
        {...register("invoiceNumber")}
        placeholder="Invoice #"
        className="input"
      />
      <input type="date" {...register("date")} className="input" />
      <input type="date" {...register("dueDate")} className="input" />

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <input
              {...register(`items.${index}.description`)}
              placeholder="Description"
              className="input"
            />
            <input
              type="number"
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
              className="input w-20"
            />
            <input
              type="number"
              {...register(`items.${index}.price`, { valueAsNumber: true })}
              className="input w-24"
            />
            <button type="button" onClick={() => remove(index)}>
              ❌
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ description: "", quantity: 1, price: 0 })}>
          ➕ Add Item
        </button>
      </div>

      <button type="submit" className="btn btn-primary cursor-pointer">
        Download Invoice
      </button>
    </form>
  );
}

