import clsx from "clsx";
import React from "react";
import { ReactNode } from "react";
interface ButtonProps {
  className: string;
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
const Button = ({ className, children, onClick, type }: ButtonProps) => {
  return (
    <button type={type} onClick={onClick} className={clsx(className)}>
      {children}
    </button>
  );
};

export default Button;
