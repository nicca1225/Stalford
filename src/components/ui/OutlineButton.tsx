import { ButtonHTMLAttributes, ReactNode } from "react";

interface OutlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
}

export default function OutlineButton({ children, fullWidth, className = "", ...props }: OutlineButtonProps) {
  return (
    <button
      className={`bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-2.5 rounded-lg border border-gray-200 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
