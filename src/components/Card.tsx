import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => (
  <div
    className={`relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-80 ${className}`}
  >
    {children}
  </div>
);

export default Card;
