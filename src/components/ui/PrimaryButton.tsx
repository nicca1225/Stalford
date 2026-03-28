import { ButtonHTMLAttributes, ReactNode } from "react";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
}

export default function PrimaryButton({ children, fullWidth, className = "", ...props }: PrimaryButtonProps) {
  return (
    <button
      className={`bg-amber-400 hover:bg-amber-500 active:scale-[0.97] text-zinc-900 font-semibold px-5 py-2 rounded-full transition-apple disabled:opacity-50 disabled:cursor-not-allowed shadow-sm ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
