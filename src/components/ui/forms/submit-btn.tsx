"use client";

import { ComponentProps, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InputSize } from "./text-input";

const SIZE_BTN: Record<InputSize, string> = {
  sm: "h-8 px-4 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export const SubmitBtn = ({
  label = "Submit",
  icon,
  size = "md",
  loading = false,
  fullWidth = true,
  variant = "primary",
  className,
  ...props
}: {
  label?: string;
  size?: InputSize;
  icon?: ReactNode,
  loading?: boolean;
  fullWidth?: boolean;
  variant?: "primary" | "secondary" | "ghost";
} & Omit<ComponentProps<"button">, "type">) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20",
    secondary: "border border-white/15 text-white hover:border-white/30 hover:text-white bg-transparent",
    ghost: "text-blue-600 hover:text-blue-500 bg-transparent",
  };

  return (
    <button
      type="submit"
      disabled={loading || props.disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold",
        "transition-all duration-200 active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        fullWidth && "w-full",
        SIZE_BTN[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {loading
        ? <Loader2 className="w-4 h-4 animate-spin shrink-0" strokeWidth={2} />
        : icon && <span className="shrink-0">{icon}</span>
      }
      {label}
    </button>
  );
};
