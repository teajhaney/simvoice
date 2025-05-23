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
//profile schema
export const profileSchema = z.object({
  firstName: z.string().min(1, "Input your first name"),
  lastName: z.string().min(1, "Input your last name"),
});

//change password schema
export const changePasswordSchema = z.object({
  currentPassword: strongPassword,
  newPassword: strongPassword,
});
//change password schema
export const deleteAccountSchema = z.object({
  password: z.string(),
});

//sign in schema
export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: strongPassword,
});

//sign uo schema
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
  businessName: z.string().min(1, "Business name is required"),
  invoiceNumber: z.coerce.number().min(1, "Invoice number is required"),
  billTo: z.string().min(1, "Bill to is required"),
  billFrom: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  paymentTerm: z.string().optional(),
  dueDate: z.string().optional(),
  poNumber: z.coerce.number().optional(),
  items: z
    .array(
      z.object({
        description: z.string().min(1, "Item description is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
        rate: z.coerce.number().min(0, "Rate cannot be negative"),
      })
    )
    .min(1, "At least one item is required"),
  notes: z.string().optional(),

  termsAndConditions: z.string().optional(),

  discount: z.coerce.number().min(0, "Discount cannot be negative").optional(),
  tax: z.coerce.number().min(0, "Tax cannot be negative").optional(),
  shipping: z.coerce.number().optional(),
  amountPaid: z.coerce.number().optional(),
  currency: z.string().min(1, "Currency is required"),
});

export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;
