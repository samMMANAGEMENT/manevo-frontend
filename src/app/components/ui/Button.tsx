import React from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline" | "ghost";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string; 
  icon?: React.ReactNode; 
  variant?: ButtonVariant;
  size?: ButtonSize; 
  loading?: boolean;
  fullWidth?: boolean; 
}

export default function Button({
  label,
  icon,
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-[#2A2A2A] text-white hover:bg-[#0D0D0D]",
    secondary:
      "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-300",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-200",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "text-sm px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {loading ? (
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
      ) : (
        icon && <span className="mr-2">{icon}</span>
      )}
      {label}
    </button>
  );
}
