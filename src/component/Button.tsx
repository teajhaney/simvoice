import clsx from "clsx";
import React from "react";
import { ReactNode } from "react";
interface ButtonProps {
  className: string;
  children: ReactNode;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
const Button = ({ className, children, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} className={clsx(className)}>
      {children}
    </button>
  );
};

export default Button;
