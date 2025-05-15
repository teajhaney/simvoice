/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { currencies } from "@/contants";
import {
  invoiceInputDiv,
  invoiceInputStyles,
  invoiceLabelStyles,
  textareaInputDiv,
  textareaLabelStyles,
  textareaInputStyles,
} from "@/styles";

import { FieldErrors, UseFormRegister } from "react-hook-form";

//input
interface InputProps {
  id: string;
  label?: string;
  type?: string;
  register: UseFormRegister<any>;
  errors?: FieldErrors;
  className?: string;
  divClassName?: string;
  labelClassName?: string;
  placeholder?: string;
}

export const Input = ({
  id,
  label,
  type = "text",
  register,
  errors,
  placeholder,
  className,
  labelClassName,

  divClassName,
}: InputProps) => {
  return (
    <div className={`${invoiceInputDiv} ${divClassName}`}>
      <label htmlFor={id} className={`${invoiceLabelStyles} ${labelClassName}`}>
        {label}
      </label>
      <input
        id={id}
        placeholder={placeholder}
        type={type}
        {...register(id)}
        className={`${invoiceInputStyles} ${
          errors?.[id] ? "border border-red500" : ""
        } ${className}`}
      />
    </div>
  );
};

export const InputTextArea = ({
  id,
  label,
  register,
  errors,
  placeholder,
  className,
  labelClassName,
  divClassName,
}: InputProps) => {
  return (
    <div className={`${textareaInputDiv} ${divClassName}`}>
      <label
        htmlFor={id}
        className={`${textareaLabelStyles} ${labelClassName}`}>
        {label}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        {...register(id)}
        className={`${textareaInputStyles} ${
          errors?.[id] ? "border border-red500" : ""
        }  ${className} resize-none`}
      />
    </div>
  );
};

export const InputFile = ({ id, register, errors }: InputProps) => {
  return (
    <div className="bg-gray100 w-50 h-20">
      <label
        className={`center text-xs cursor-pointer bg-gray200 rounded px-4 py-2 text-center w-full h-full ${
          errors?.[id] ? "border border-red500" : ""
        }`}>
        Upload Logo
        <input
          type="file"
          {...register("logo")}
          id={id}
          accept="image/*"
          className="hidden"
        />
      </label>
    </div>
  );
};

// Add this to your Inputs.tsx or create a new component
export const CurrencySelect = ({
  id,
  register,
  errors,
  className = "",
}: {
  id: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  className?: string;
}) => {
  return (
    <select
      id={id}
      {...register(id)}
      className={`${invoiceInputDiv}${className} ${
        errors[id] ? "border-red500" : ""
      } p-2 border rounded`}>
      {Object.entries(currencies).map(([code, name]) => (
        <option key={code} value={code}>
          {code} - {name}
        </option>
      ))}
    </select>
  );
};
