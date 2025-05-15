import clsx from "clsx";
import React from "react";
import { ReactNode } from "react";
interface ButtonProps {
  className: string;
  children: ReactNode;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
const Button = ({
  className,
  children,
  onClick,
  type,
  disabled,
}: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={clsx(className)}>
      {children}
    </button>
  );
};

export default Button;
