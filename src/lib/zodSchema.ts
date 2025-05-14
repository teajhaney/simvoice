import { z } from "zod";

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[a-z]/, "Password must include at least one lowercase letter")
  .regex(/[0-9]/, "Password must include at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must include at least one special character"
  );

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: strongPassword,
});

export const signUpSchema = signInSchema
  .extend({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .regex(/^[A-Za-z]+$/, "First name must contain only letters"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .regex(/^[A-Za-z]+$/, "Last name must contain only letters"),
    confirmPassword: strongPassword,
    agreeTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms to continue." }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const forgetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Define the invoice validation schema using Zod

export const invoiceFormSchema = z.object({
  logo: z
    .any()
    .refine((file) => file instanceof File, "Logo must be a valid image file")
    .refine((file) => {
      if (!(file instanceof File)) return false;
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      return validTypes.includes(file.type);
    }, "Logo must be a PNG, JPEG, or JPG file")
    .refine((file) => {
      if (!(file instanceof File)) return false;
      return file.size <= 5 * 1024 * 1024; // 5MB max
    }, "Logo file size must be less than 5MB")
    .optional(),
  businessName: z.string().min(1, "Business name is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  billTo: z.string().min(1, "Bill to is required"),
  billFrom: z.string().min(1, "Bill from is required"),
  date: z.string().min(1, "Date is required"),
  paymentTerm: z.string().optional(),
  dueDate: z.string().optional(),
  poNumber: z.string().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1, "Item description is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        rate: z.number().min(0, "Rate cannot be negative"),
      })
    )
    .min(1, "At least one item is required"),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  subtotal: z.number().min(0, "Subtotal cannot be negative"),
  discount: z.number().min(0, "Discount cannot be negative").optional(),
  tax: z.number().min(0, "Tax cannot be negative").optional(),
  shippingFee: z.number().min(0, "Shipping fee cannot be negative").optional(),
  amountPaid: z.number().min(0, "Amount paid cannot be negative"),
});

export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;
