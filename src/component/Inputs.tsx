/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  invoiceInputDiv,
  invoiceInputStyles,
  invoiceLabelStyles,
  tedtareaInputDiv,
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
    <div className={`${tedtareaInputDiv} ${divClassName}`}>
      <label htmlFor={id} className={`${textareaLabelStyles} ${labelClassName}`}>
        {label}
      </label>
      <textarea
        id={id}
        placeholder={placeholder}
        {...register(id)}
        className={`${textareaInputStyles} ${
          errors?.[id]  ? "border border-red500" : ""
        }  ${className} resize-none`}
      />
    </div>
  );
};
