"use client";

import { cn } from "@/lib/utils";

export const RadioInputGroup = ({
  label,
  name,
  value,
  required = true,
  checked,
  onChange,
  className,
}: {
  label: string;
  name: string;
  value: string;
  required?: boolean;
  checked?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}) => {
  return (
    <div className={cn("w-full flex items-start gap-3 group cursor-pointer", className)}>
      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
        <input
          type="radio"
          checked={checked}
          onChange={(e) => onChange?.(e.target.value)}
          value={value}
          name={name}
          id={`${name}-${value}`}
          required={required}
          className={cn(
            "peer h-4 w-4 cursor-pointer appearance-none rounded-full border",
            "border-white/20 bg-gray-900",
            "transition-all duration-200",
            "checked:border-blue-600",
            "hover:border-white/40",
            "focus:outline-none focus:ring-1 focus:ring-blue-600/40 focus:ring-offset-0",
          )}
        />
        <div className="pointer-events-none absolute h-2 w-2 rounded-full bg-blue-600 opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
      </div>
      <label
        htmlFor={`${name}-${value}`}
        className="text-xs font-medium text-gray-400 cursor-pointer select-none leading-snug group-hover:text-white transition-colors"
      >
        {label}
      </label>
    </div>
  );
};
