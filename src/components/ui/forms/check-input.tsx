"use client";

import { cn } from "@/lib/utils";

export const CheckInputGroup = ({
  label,
  name,
  required = true,
  checked,
  onChange,
  className,
}: {
  label: string;
  checked?: boolean;
  name: string;
  required?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}) => {
  return (
    <div className={cn("w-full flex items-start gap-3 group cursor-pointer", className)}>
      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          name={name}
          id={name}
          required={required}
          className={cn(
            "peer h-4 w-4 cursor-pointer appearance-none rounded border",
            "border-white/20 bg-gray-900",
            "transition-all duration-200",
            "checked:border-blue-600 checked:bg-blue-600",
            "hover:border-white/40",
            "focus:outline-none focus:ring-1 focus:ring-blue-600/40 focus:ring-offset-0",
          )}
        />
        <svg
          className="pointer-events-none absolute h-2.5 w-2.5 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <label
        htmlFor={name}
        className="text-xs font-medium text-gray-400 cursor-pointer select-none leading-snug group-hover:text-white transition-colors"
      >
        {label}
      </label>
    </div>
  );
};
